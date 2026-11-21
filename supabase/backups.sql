-- Locked backup of each person's own records (run once in Supabase › SQL Editor).
-- The app seals everything on the phone (AES-GCM) before upload; `sealed` is ciphertext only and the key never
-- reaches the server. key_id is a one-way fingerprint so a phone with a different key never overwrites the backup.
create table if not exists backups (
  user_id    uuid primary key references auth.users(id) on delete cascade,
  sealed     text not null check (length(sealed) < 8000000),
  key_id     text not null,
  updated_at timestamptz not null default now()
);
alter table backups enable row level security;
drop policy if exists "own backup: read"   on backups;
drop policy if exists "own backup: add"    on backups;
drop policy if exists "own backup: change" on backups;
drop policy if exists "own backup: remove" on backups;
create policy "own backup: read"   on backups for select to authenticated using (user_id = auth.uid());
create policy "own backup: add"    on backups for insert to authenticated with check (user_id = auth.uid());
create policy "own backup: change" on backups for update to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "own backup: remove" on backups for delete to authenticated using (user_id = auth.uid());
revoke all on backups from anon;
grant select, insert, update, delete on backups to authenticated;
