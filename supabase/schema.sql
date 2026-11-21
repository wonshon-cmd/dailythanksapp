-- daily thanks · daily bible — Supabase schema (Supabase › SQL Editor › Run). Safe to run again: it updates the rules in place.
-- Who can see what is enforced by the database itself (Row Level Security), not by the app:
--   • private posts: only the author (and they are stored sealed — the app encrypts them before upload)
--   • group posts: only members of that group
--   • public posts: everyone signed in
--   • leader notes and meeting notes: the group's owner/leaders (and the church's pastors)

create extension if not exists pgcrypto;

-- ---------- people ----------
create table if not exists profiles (
  id uuid primary key references auth.users on delete cascade,
  name text not null default '',
  lang text not null default 'ko',
  created_at timestamptz not null default now()
);

-- ---------- churches · groups ----------
create table if not exists churches (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  owner uuid not null references profiles on delete cascade,
  created_at timestamptz not null default now()
);
create table if not exists church_roles (          -- pastors and admins who see the church dashboard
  church_id uuid references churches on delete cascade,
  user_id uuid references profiles on delete cascade,
  role text not null check (role in ('admin', 'pastor')),
  primary key (church_id, user_id)
);
create table if not exists groups (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text not null default '',               -- 다락방 · 분류
  church_id uuid references churches on delete set null,
  owner uuid not null references profiles on delete cascade,
  invite_code text unique not null default substr(md5(gen_random_uuid()::text), 1, 10),
  approve boolean not null default false,          -- the leader approves people who join with the link
  members_invite boolean not null default true,
  meeting_live jsonb,                              -- { date, ref } while a meeting is reading together
  created_at timestamptz not null default now()
);
-- "가장 꾸준한 사람" ranking: the admin always sees it; 순장 (leaders) only when the admin turns this on
alter table groups add column if not exists top_to_leaders boolean not null default false;
create table if not exists group_members (
  group_id uuid references groups on delete cascade,
  user_id uuid references profiles on delete cascade,
  role text not null default 'member' check (role in ('owner', 'leader', 'member')),
  status text not null default 'active' check (status in ('active', 'pending')),
  joined_at timestamptz not null default now(),
  primary key (group_id, user_id)
);

create or replace function is_member(gid uuid) returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from group_members where group_id = gid and user_id = auth.uid() and status = 'active')
$$;
create or replace function is_leader(gid uuid) returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from group_members where group_id = gid and user_id = auth.uid() and status = 'active' and role in ('owner', 'leader'))
      or exists (select 1 from groups g where g.id = gid and g.owner = auth.uid())
      or exists (select 1 from groups g join church_roles r on r.church_id = g.church_id where g.id = gid and r.user_id = auth.uid())
$$;

-- joining with an invite link: the only way to see a group you're not in yet
create or replace function join_group(code text) returns table (group_id uuid, name text, status text)
language plpgsql security definer set search_path = public as $$
#variable_conflict use_column
declare g groups;
begin
  if auth.uid() is null then raise exception 'not_signed_in'; end if;
  select * into g from groups where invite_code = code;
  if not found then raise exception 'invalid_code'; end if;
  insert into group_members (group_id, user_id, status)
    values (g.id, auth.uid(), case when g.approve then 'pending' else 'active' end)
    on conflict (group_id, user_id) do nothing;
  return query select g.id, g.name, (select m.status from group_members m where m.group_id = g.id and m.user_id = auth.uid());
end $$;

-- ---------- posts: thanks · prayer requests · reflections ----------
create table if not exists posts (
  id uuid primary key default gen_random_uuid(),
  author uuid not null references profiles on delete cascade default auth.uid(),
  kind text not null check (kind in ('today', 'ahead', 'thanks', 'meditation', 'prayer')),
  scope text not null check (scope in ('private', 'group', 'public')),
  group_id uuid references groups on delete cascade,
  text text,                 -- empty for private posts
  sealed jsonb,              -- private posts: AES-GCM sealed on the device { v, iv, ct }
  ref jsonb,                 -- Bible passage { b, c, v, v2 }
  prayer text,
  date date not null default current_date,
  created_at timestamptz not null default now(),
  check ((scope = 'group') = (group_id is not null))
);
-- added later (safe to run again on an existing database)
alter table posts add column if not exists hidden boolean not null default false;   -- set when 3 people report a post
do $$ begin
  if not exists (select 1 from pg_constraint where conname = 'posts_private_no_text') then
    alter table posts add constraint posts_private_no_text check (scope <> 'private' or text is null) not valid;   -- private posts: sealed copy only
  end if;
end $$;
create index if not exists posts_group on posts (group_id, created_at desc);
create table if not exists reactions (
  post_id uuid references posts on delete cascade,
  user_id uuid references profiles on delete cascade default auth.uid(),
  kind text not null check (kind in ('like', 'pray', 'save')),
  primary key (post_id, user_id, kind)
);

-- ---------- reading plans · challenges ----------
create table if not exists challenges (
  id uuid primary key default gen_random_uuid(),
  owner uuid not null references profiles on delete cascade default auth.uid(),
  group_id uuid references groups on delete cascade,
  name text not null,
  type text not null check (type in ('thanks', 'prayer', 'meditation', 'bible')),
  plan jsonb,                -- { from:[b,c], to:[b,c], total }
  start date not null default current_date,
  length int not null check (length between 1 and 730),
  invite_code text unique default substr(md5(gen_random_uuid()::text), 1, 10),
  created_at timestamptz not null default now()
);
create table if not exists challenge_members (
  challenge_id uuid references challenges on delete cascade,
  user_id uuid references profiles on delete cascade default auth.uid(),
  days int[] not null default '{}',
  last_day date,
  primary key (challenge_id, user_id)
);

-- ---------- leader tools ----------
create table if not exists meetings (
  id uuid primary key default gen_random_uuid(),
  group_id uuid not null references groups on delete cascade,
  leader uuid not null references profiles default auth.uid(),
  date date not null default current_date,
  ref jsonb,
  attend jsonb not null default '{}',       -- { user_id: true/false }
  summary jsonb,                            -- overview, members[{name, sharing, prayer_request}], prayer_topics, next_steps
  notes text,
  created_at timestamptz not null default now()
);
create table if not exists member_notes (
  id uuid primary key default gen_random_uuid(),
  group_id uuid not null references groups on delete cascade,
  member uuid not null references profiles on delete cascade,
  author uuid not null references profiles default auth.uid(),
  text text not null,
  date date not null default current_date
);

-- ---------- Row Level Security ----------
alter table profiles enable row level security;
alter table churches enable row level security;
alter table church_roles enable row level security;
alter table groups enable row level security;
alter table group_members enable row level security;
alter table posts enable row level security;
alter table reactions enable row level security;
alter table challenges enable row level security;
alter table challenge_members enable row level security;
alter table meetings enable row level security;
alter table member_notes enable row level security;

drop policy if exists "me" on profiles;
create policy "me" on profiles for all using (id = auth.uid()) with check (id = auth.uid());
drop policy if exists "people in my groups" on profiles;
create policy "people in my groups" on profiles for select using (exists (
  select 1 from group_members a join group_members b on a.group_id = b.group_id
  where a.user_id = auth.uid() and a.status = 'active' and b.user_id = profiles.id
    and (b.status = 'active' or is_leader(a.group_id))));   -- people waiting for approval: only the group's leaders see their name

drop policy if exists "church owner" on churches;
create policy "church owner" on churches for all using (owner = auth.uid()) with check (owner = auth.uid());
drop policy if exists "church staff read" on churches;
create policy "church staff read" on churches for select using (exists (select 1 from church_roles r where r.church_id = id and r.user_id = auth.uid()));
drop policy if exists "church roles by owner" on church_roles;
create policy "church roles by owner" on church_roles for all using (exists (select 1 from churches c where c.id = church_id and c.owner = auth.uid()));
drop policy if exists "my church role" on church_roles;
create policy "my church role" on church_roles for select using (user_id = auth.uid());

drop policy if exists "members read group" on groups;
create policy "members read group" on groups for select using (owner = auth.uid() or is_member(id) or is_leader(id));
drop policy if exists "create group" on groups;
create policy "create group" on groups for insert with check (owner = auth.uid());
drop policy if exists "leaders edit group" on groups;
create policy "leaders edit group" on groups for update using (is_leader(id));
drop policy if exists "owner deletes group" on groups;
create policy "owner deletes group" on groups for delete using (owner = auth.uid());

drop policy if exists "members see members" on group_members;
create policy "members see members" on group_members for select using (is_member(group_id) or is_leader(group_id) or user_id = auth.uid());
drop policy if exists "leaders manage members" on group_members;
create policy "leaders manage members" on group_members for all using (is_leader(group_id)) with check (is_leader(group_id));
drop policy if exists "owner joins own group" on group_members;
create policy "owner joins own group" on group_members for insert with check (user_id = auth.uid() and exists (select 1 from groups g where g.id = group_id and g.owner = auth.uid()));
drop policy if exists "leave group" on group_members;
create policy "leave group" on group_members for delete using (user_id = auth.uid());

drop policy if exists "read posts" on posts;
create policy "read posts" on posts for select using (author = auth.uid() or (not hidden and (scope = 'public' or (scope = 'group' and is_member(group_id)))));
drop policy if exists "write own posts" on posts;
create policy "write own posts" on posts for insert with check (author = auth.uid() and (scope <> 'group' or is_member(group_id)));
drop policy if exists "edit own posts" on posts;
create policy "edit own posts" on posts for update using (author = auth.uid()) with check (author = auth.uid() and (scope <> 'group' or is_member(group_id)));
drop policy if exists "delete own posts" on posts;
create policy "delete own posts" on posts for delete using (author = auth.uid());

drop policy if exists "read reactions" on reactions;
create policy "read reactions" on reactions for select using (exists (select 1 from posts p where p.id = post_id));   -- posts' own rules decide which
drop policy if exists "my reactions" on reactions;
create policy "my reactions" on reactions for all using (user_id = auth.uid())
  with check (user_id = auth.uid() and exists (select 1 from posts p where p.id = post_id));   -- the posts rule decides which posts you can see

-- (a security-definer helper, so the two tables' rules don't call each other in a loop)
create or replace function in_challenge(cid uuid) returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from challenges c where c.id = cid and (c.owner = auth.uid() or (c.group_id is not null and is_member(c.group_id))))
      or exists (select 1 from challenge_members m where m.challenge_id = cid and m.user_id = auth.uid())
$$;
drop policy if exists "read challenges" on challenges;
create policy "read challenges" on challenges for select using (in_challenge(id));
drop policy if exists "own challenges" on challenges;
create policy "own challenges" on challenges for all using (owner = auth.uid()) with check (owner = auth.uid());
drop policy if exists "read challenge members" on challenge_members;
create policy "read challenge members" on challenge_members for select using (in_challenge(challenge_id));
drop policy if exists "my challenge progress" on challenge_members;
create policy "my challenge progress" on challenge_members for select using (user_id = auth.uid());
drop policy if exists "update my progress" on challenge_members;
create policy "update my progress" on challenge_members for update using (user_id = auth.uid()) with check (user_id = auth.uid());
drop policy if exists "leave challenge" on challenge_members;
create policy "leave challenge" on challenge_members for delete using (user_id = auth.uid());
drop policy if exists "join own or group challenge" on challenge_members;
create policy "join own or group challenge" on challenge_members for insert with check (user_id = auth.uid() and exists (
  select 1 from challenges c where c.id = challenge_id and (c.owner = auth.uid() or (c.group_id is not null and is_member(c.group_id)))));
-- anyone else joins only through join_challenge(code), which checks the invite code

drop policy if exists "leaders: meetings" on meetings;
create policy "leaders: meetings" on meetings for all using (is_leader(group_id)) with check (is_leader(group_id));
drop policy if exists "leaders: member notes" on member_notes;
create policy "leaders: member notes" on member_notes for all using (is_leader(group_id)) with check (is_leader(group_id));

-- joining a reading plan from its link
create or replace function join_challenge(code text) returns uuid language plpgsql security definer set search_path = public as $$
declare c challenges;
begin
  if auth.uid() is null then raise exception 'not_signed_in'; end if;
  select * into c from challenges where invite_code = code;
  if not found then raise exception 'invalid_code'; end if;
  insert into challenge_members (challenge_id, user_id) values (c.id, auth.uid()) on conflict do nothing;
  return c.id;
end $$;

-- ---------- who may use the tables at all ----------
-- Only signed-in people (role "authenticated") can reach the tables, and then only the rows the rules above allow.
-- Visitors who are not signed in (role "anon") get nothing. Works with "Automatically expose new tables" turned off.
grant usage on schema public to authenticated;
grant select, insert, update, delete on all tables in schema public to authenticated;
revoke all on all tables in schema public from anon;
grant execute on function join_group(text), join_challenge(text) to authenticated;
revoke execute on function join_group(text), join_challenge(text) from anon, public;

-- a profile row for every new sign-in
create or replace function on_new_user() returns trigger language plpgsql security definer set search_path = public as $$
begin insert into profiles (id, name) values (new.id, coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1), '')) on conflict do nothing; return new; end $$;
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users for each row execute function on_new_user();

-- ---------- reports (신고) ----------
-- Anyone signed in can report a post; only the project owner reads them (Supabase › Table Editor › reports).
create table if not exists reports (
  id uuid primary key default gen_random_uuid(),
  reporter uuid references profiles on delete set null default auth.uid(),   -- kept (anonymous) if the reporter deletes their account
  post_id uuid references posts on delete set null,
  reported_user uuid references profiles on delete set null,
  reason text not null,
  note text,
  text text,                     -- what the post said when it was reported
  status text not null default 'open' check (status in ('open', 'done')),
  created_at timestamptz not null default now()
);
alter table reports alter column reporter drop not null;
create unique index if not exists reports_once on reports (reporter, post_id);   -- one report per person per post

-- three different people report a post → it is hidden from everyone but its author until the owner reviews it
create or replace function hide_reported_post() returns trigger language plpgsql security definer set search_path = public as $$
begin
  if new.post_id is not null and (select count(distinct reporter) from reports where post_id = new.post_id and status = 'open') >= 3 then
    update posts set hidden = true where id = new.post_id;
  end if;
  return new;
end $$;
drop trigger if exists on_report on reports;
create trigger on_report after insert on reports for each row execute function hide_reported_post();
alter table reports enable row level security;
drop policy if exists "file a report" on reports;
create policy "file a report" on reports for insert with check (reporter = auth.uid());
grant insert on reports to authenticated;

-- ---------- delete my account (Apple / Google require it in the app) ----------
-- Removes the signed-in person's login; their profile, posts, reactions and memberships go with it (on delete cascade).
create or replace function delete_my_account() returns void language plpgsql security definer set search_path = public, auth as $$
begin
  if auth.uid() is null then raise exception 'not_signed_in'; end if;
  delete from auth.users where id = auth.uid();
end $$;
revoke execute on function delete_my_account() from anon, public;
grant execute on function delete_my_account() to authenticated;

-- ---------- reading together (공동체 오늘 완료 · 짝 읽기) ----------
-- Only the fact that someone finished a day's reading — no text. Group mates see each other's; people reading the
-- same plan (짝 읽기, joined with the same plan link) see each other's for that plan.
create table if not exists plan_members (
  key text not null,                                   -- the plan's shared code (it travels in the plan link)
  user_id uuid not null references profiles on delete cascade default auth.uid(),
  joined_at timestamptz not null default now(),
  primary key (key, user_id)
);
create table if not exists reads (
  user_id uuid not null references profiles on delete cascade default auth.uid(),
  day date not null default current_date,
  kind text not null default 'devo' check (kind in ('devo', 'plan')),
  key text not null default '',                        -- '' for today's passage, the plan's code for a plan
  created_at timestamptz not null default now(),
  primary key (user_id, day, kind, key)
);
alter table plan_members enable row level security;
alter table reads enable row level security;

create or replace function in_plan(k text) returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from plan_members where key = k and user_id = auth.uid())
$$;
create or replace function shares_group(other uuid) returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from group_members a join group_members b on a.group_id = b.group_id
    where a.user_id = auth.uid() and b.user_id = other and a.status = 'active' and b.status = 'active')
$$;
create or replace function shares_plan(other uuid) returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from plan_members a join plan_members b on a.key = b.key where a.user_id = auth.uid() and b.user_id = other)
$$;
grant execute on function in_plan(text), shares_group(uuid), shares_plan(uuid) to authenticated;

drop policy if exists "my plans" on plan_members;
create policy "my plans" on plan_members for all using (user_id = auth.uid()) with check (user_id = auth.uid());
drop policy if exists "people in my plans" on plan_members;
create policy "people in my plans" on plan_members for select using (in_plan(key));

drop policy if exists "my reads" on reads;
create policy "my reads" on reads for all using (user_id = auth.uid()) with check (user_id = auth.uid());
drop policy if exists "reads of people I read with" on reads;
create policy "reads of people I read with" on reads for select using (
  (kind = 'devo' and shares_group(user_id)) or (kind = 'plan' and in_plan(key)));

-- the name of someone reading the same plan with me (짝 읽기)
drop policy if exists "people in my plans" on profiles;
create policy "people in my plans" on profiles for select using (shares_plan(id));
grant select, insert, update, delete on plan_members, reads to authenticated;
revoke all on plan_members, reads from anon;

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
