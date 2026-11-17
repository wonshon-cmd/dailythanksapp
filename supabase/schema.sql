-- daily thanks · daily bible — Supabase schema (run once in Supabase › SQL Editor)
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
      or exists (select 1 from groups g join church_roles r on r.church_id = g.church_id where g.id = gid and r.user_id = auth.uid())
$$;

-- joining with an invite link: the only way to see a group you're not in yet
create or replace function join_group(code text) returns table (group_id uuid, name text, status text)
language plpgsql security definer set search_path = public as $$
declare g groups;
begin
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

create policy "me" on profiles for all using (id = auth.uid()) with check (id = auth.uid());
create policy "people in my groups" on profiles for select using (exists (
  select 1 from group_members a join group_members b on a.group_id = b.group_id where a.user_id = auth.uid() and b.user_id = profiles.id and a.status = 'active'));

create policy "church owner" on churches for all using (owner = auth.uid()) with check (owner = auth.uid());
create policy "church staff read" on churches for select using (exists (select 1 from church_roles r where r.church_id = id and r.user_id = auth.uid()));
create policy "church roles by owner" on church_roles for all using (exists (select 1 from churches c where c.id = church_id and c.owner = auth.uid()));
create policy "my church role" on church_roles for select using (user_id = auth.uid());

create policy "members read group" on groups for select using (is_member(id) or is_leader(id));
create policy "create group" on groups for insert with check (owner = auth.uid());
create policy "leaders edit group" on groups for update using (is_leader(id));
create policy "owner deletes group" on groups for delete using (owner = auth.uid());

create policy "members see members" on group_members for select using (is_member(group_id) or is_leader(group_id) or user_id = auth.uid());
create policy "leaders manage members" on group_members for all using (is_leader(group_id)) with check (is_leader(group_id));
create policy "owner joins own group" on group_members for insert with check (user_id = auth.uid() and exists (select 1 from groups g where g.id = group_id and g.owner = auth.uid()));
create policy "leave group" on group_members for delete using (user_id = auth.uid());

create policy "read posts" on posts for select using (author = auth.uid() or scope = 'public' or (scope = 'group' and is_member(group_id)));
create policy "write own posts" on posts for insert with check (author = auth.uid() and (scope <> 'group' or is_member(group_id)));
create policy "edit own posts" on posts for update using (author = auth.uid());
create policy "delete own posts" on posts for delete using (author = auth.uid());

create policy "read reactions" on reactions for select using (exists (select 1 from posts p where p.id = post_id));   -- posts' own rules decide which
create policy "my reactions" on reactions for all using (user_id = auth.uid()) with check (user_id = auth.uid());

-- (a security-definer helper, so the two tables' rules don't call each other in a loop)
create or replace function in_challenge(cid uuid) returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from challenges c where c.id = cid and (c.owner = auth.uid() or (c.group_id is not null and is_member(c.group_id))))
      or exists (select 1 from challenge_members m where m.challenge_id = cid and m.user_id = auth.uid())
$$;
create policy "read challenges" on challenges for select using (in_challenge(id));
create policy "own challenges" on challenges for all using (owner = auth.uid()) with check (owner = auth.uid());
create policy "read challenge members" on challenge_members for select using (in_challenge(challenge_id));
create policy "my challenge progress" on challenge_members for all using (user_id = auth.uid()) with check (user_id = auth.uid());

create policy "leaders: meetings" on meetings for all using (is_leader(group_id)) with check (is_leader(group_id));
create policy "leaders: member notes" on member_notes for all using (is_leader(group_id)) with check (is_leader(group_id));

-- joining a reading plan from its link
create or replace function join_challenge(code text) returns uuid language plpgsql security definer set search_path = public as $$
declare c challenges;
begin
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
