-- Run this once in Supabase › SQL Editor (it is also the last part of schema.sql).
-- ---------- friends from a shared link (1:1 연결 · 링크 답장) ----------
-- A friend box is a code a person registers; their thanks links carry it (and, in the # part only, a key).
-- Anyone with the link can leave a short reply — sealed in the browser with that key, so only the sender can read it —
-- or, after signing in, connect: a two-person 공동체 (groups.pair_box) is made for the two of them.
create table if not exists friend_boxes (
  code text primary key check (code ~ '^[a-z0-9]{8,24}$'),
  owner uuid not null references profiles on delete cascade default auth.uid(),
  created_at timestamptz not null default now()
);
alter table groups add column if not exists pair_box text;
create table if not exists link_replies (
  id uuid primary key default gen_random_uuid(),
  code text not null references friend_boxes on delete cascade,
  sealed jsonb not null check (length(sealed::text) < 4000),
  created_at timestamptz not null default now()
);
alter table friend_boxes enable row level security;
alter table link_replies enable row level security;

drop policy if exists "my boxes" on friend_boxes;
create policy "my boxes" on friend_boxes for all using (owner = auth.uid()) with check (owner = auth.uid());
drop policy if exists "anyone with the link can reply" on link_replies;
create policy "anyone with the link can reply" on link_replies for insert to anon, authenticated with check (true);
drop policy if exists "replies to my links" on link_replies;
create policy "replies to my links" on link_replies for select using (exists (select 1 from friend_boxes b where b.code = link_replies.code and b.owner = auth.uid()));
drop policy if exists "delete replies to my links" on link_replies;
create policy "delete replies to my links" on link_replies for delete using (exists (select 1 from friend_boxes b where b.code = link_replies.code and b.owner = auth.uid()));
grant select, insert, delete on friend_boxes to authenticated;
grant select, insert, delete on link_replies to authenticated;
grant insert on link_replies to anon;
revoke select, update, delete on link_replies from anon;
revoke all on friend_boxes from anon;

create or replace function connect_friend(box text) returns uuid
language plpgsql security definer set search_path = public as $$
declare o uuid; gid uuid;
begin
  if auth.uid() is null then raise exception 'not_signed_in'; end if;
  select owner into o from friend_boxes where code = box;
  if o is null then raise exception 'invalid_code'; end if;
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
revoke execute on function connect_friend(text) from anon, public;
grant execute on function connect_friend(text) to authenticated;
