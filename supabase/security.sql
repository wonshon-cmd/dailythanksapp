-- Security hardening (run once in Supabase › SQL Editor, after schema.sql / friends.sql / link_opens.sql; safe to run again).
-- 1) Guessing codes: after 10 wrong invite / plan / friend codes in 15 minutes, a person has to wait.
-- 2) Link-open counts: at most 300 new people a sharer can gain per hour (stops someone inflating a count with scripts).
-- 3) Every text field has a length limit on the server too (the app limits them as well; this is the real gate).
-- Passwords are never stored by the app: Supabase Auth keeps them hashed (bcrypt). Private records are sealed on the phone.

-- ---------- 1) wrong-code attempts ----------
create table if not exists code_attempts (
  user_id uuid not null references auth.users(id) on delete cascade,
  at timestamptz not null default now()
);
create index if not exists code_attempts_user_at on code_attempts (user_id, at);
alter table code_attempts enable row level security;   -- no policies: only the functions below touch it
revoke all on code_attempts from anon, authenticated;

create or replace function code_tries_left() returns boolean
language sql stable security definer set search_path = public as $$
  select count(*) < 10 from code_attempts where user_id = auth.uid() and at > now() - interval '15 minutes';
$$;
create or replace function code_wrong() returns void
language sql security definer set search_path = public as $$
  delete from code_attempts where user_id = auth.uid() and at < now() - interval '1 day';
  insert into code_attempts (user_id) values (auth.uid());
$$;
revoke execute on function code_tries_left(), code_wrong() from public, anon, authenticated;

-- a wrong code returns nothing (instead of an error) so the attempt is remembered; the app shows "invalid code"
create or replace function join_group(code text) returns table (group_id uuid, name text, status text)
language plpgsql security definer set search_path = public as $$
#variable_conflict use_column
declare g groups;
begin
  if auth.uid() is null then raise exception 'not_signed_in'; end if;
  if not code_tries_left() then raise exception 'too_many_tries'; end if;
  select * into g from groups where invite_code = code;
  if not found then perform code_wrong(); return; end if;
  insert into group_members (group_id, user_id, status)
    values (g.id, auth.uid(), case when g.approve then 'pending' else 'active' end)
    on conflict (group_id, user_id) do nothing;
  return query select g.id, g.name, (select m.status from group_members m where m.group_id = g.id and m.user_id = auth.uid());
end $$;

create or replace function join_challenge(code text) returns uuid language plpgsql security definer set search_path = public as $$
declare c challenges;
begin
  if auth.uid() is null then raise exception 'not_signed_in'; end if;
  if not code_tries_left() then raise exception 'too_many_tries'; end if;
  select * into c from challenges where invite_code = code;
  if not found then perform code_wrong(); return null; end if;
  insert into challenge_members (challenge_id, user_id) values (c.id, auth.uid()) on conflict do nothing;
  return c.id;
end $$;

create or replace function connect_friend(box text) returns uuid
language plpgsql security definer set search_path = public as $$
declare o uuid; gid uuid;
begin
  if auth.uid() is null then raise exception 'not_signed_in'; end if;
  if not code_tries_left() then raise exception 'too_many_tries'; end if;
  select owner into o from friend_boxes where code = box;
  if o is null then perform code_wrong(); return null; end if;
  if o = auth.uid() then raise exception 'self'; end if;
  select g.id into gid from groups g
    join group_members a on a.group_id = g.id and a.user_id = o
    join group_members b on b.group_id = g.id and b.user_id = auth.uid()
    where g.pair_box = box limit 1;
  if gid is not null then return gid; end if;
  insert into groups (name, owner, pair_box, members_invite) values ('1:1', o, box, false) returning id into gid;
  insert into group_members (group_id, user_id, role, status) values (gid, o, 'owner', 'active'), (gid, auth.uid(), 'member', 'active');
  return gid;
end $$;
grant execute on function join_group(text), join_challenge(text), connect_friend(text) to authenticated;
revoke execute on function join_group(text), join_challenge(text), connect_friend(text) from anon, public;

-- ---------- 2) link-open counts: a cap per sharer per hour ----------
create or replace function record_open(c text, who text, k text default 'link') returns void
language plpgsql security definer set search_path = public as $$
declare o uuid;
begin
  if c !~ '^[a-z0-9]{6,16}$' or who !~ '^[a-f0-9]{16,64}$' then return; end if;
  select owner into o from share_codes where code = c;
  if o is null or o = auth.uid() then return; end if;
  if (select count(*) from link_opens where owner = o and created_at > now() - interval '1 hour') >= 300 then return; end if;
  insert into link_opens (owner, opener, kind)
  values (o, who, case when k in ('verse', 'thanks', 'reflection') then k else 'link' end)
  on conflict do nothing;
end $$;
revoke execute on function record_open(text, text, text) from public;
grant execute on function record_open(text, text, text) to anon, authenticated;

-- ---------- 3) length limits on every text people can type ----------
-- (added as NOT VALID: new and changed rows are checked; anything already stored is left alone)
do $$
declare r record;
begin
  for r in select * from (values
      ('profiles', 'name', 60), ('groups', 'name', 80), ('groups', 'invite_code', 24),
      ('posts', 'text', 4000), ('posts', 'prayer', 2000), ('challenges', 'name', 80),
      ('reports', 'reason', 200), ('reports', 'note', 1000), ('reports', 'text', 4000),
      ('friend_boxes', 'code', 24), ('meetings', 'notes', 8000), ('member_notes', 'note', 4000)
    ) as t(tbl, col, n)
  loop
    if exists (select 1 from information_schema.columns where table_schema = 'public' and table_name = r.tbl and column_name = r.col)
       and not exists (select 1 from pg_constraint where conname = r.tbl || '_' || r.col || '_len') then
      execute format('alter table public.%I add constraint %I check (length(%I) <= %s) not valid', r.tbl, r.tbl || '_' || r.col || '_len', r.col, r.n);
    end if;
  end loop;
end $$;
