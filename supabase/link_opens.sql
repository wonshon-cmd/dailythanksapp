-- Reach: how many different people opened the links someone shared (run once in Supabase › SQL Editor).
-- A share link carries ?s=<share code> — a random code, not a name or account id. Opening it records one row per
-- (sharer, opener) where the opener is a random id kept in that browser/phone, so each person counts once.
-- Nobody can read these tables directly; the app only gets its own total through my_link_opens().
create table if not exists share_codes (
  code       text primary key check (code ~ '^[a-z0-9]{6,16}$'),
  owner      uuid not null unique references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);
alter table share_codes enable row level security;
drop policy if exists "own share code: read" on share_codes;
drop policy if exists "own share code: add"  on share_codes;
create policy "own share code: read" on share_codes for select to authenticated using (owner = auth.uid());
create policy "own share code: add"  on share_codes for insert to authenticated with check (owner = auth.uid());
revoke all on share_codes from anon;
grant select, insert on share_codes to authenticated;

create table if not exists link_opens (
  owner      uuid not null references auth.users(id) on delete cascade,
  opener     text not null check (opener ~ '^[a-f0-9]{16,64}$'),
  kind       text not null default 'link' check (kind in ('verse', 'thanks', 'reflection', 'link')),
  created_at timestamptz not null default now(),
  primary key (owner, opener)
);
alter table link_opens enable row level security;   -- no policies: only the two functions below touch it
revoke all on link_opens from anon, authenticated;

create or replace function record_open(c text, who text, k text default 'link') returns void
language plpgsql security definer set search_path = public as $$
declare o uuid;
begin
  if c !~ '^[a-z0-9]{6,16}$' or who !~ '^[a-f0-9]{16,64}$' then return; end if;
  select owner into o from share_codes where code = c;
  if o is null or o = auth.uid() then return; end if;            -- unknown code, or opening my own link
  insert into link_opens (owner, opener, kind)
  values (o, who, case when k in ('verse', 'thanks', 'reflection') then k else 'link' end)
  on conflict do nothing;
end $$;
revoke execute on function record_open(text, text, text) from public;
grant execute on function record_open(text, text, text) to anon, authenticated;

create or replace function my_link_opens() returns integer
language sql stable security definer set search_path = public as $$
  select count(*)::int from link_opens where owner = auth.uid();
$$;
revoke execute on function my_link_opens() from public, anon;
grant execute on function my_link_opens() to authenticated;
