-- Daily Journey — store review demo (Supabase › SQL Editor › Run).
-- Before running: Authentication › Users › Add user › Create new user
--   email review@dailyjourney.org, a password you choose, "Auto Confirm User" checked.
-- What this does (safe to run again; run it again before every submission so the posts are recent):
--   • two demo people (Grace Kim, Daniel Park) — they can't sign in, they only have posts
--   • the community "Daily Journey Demo": the review account is its owner, the demo people are members
--   • posts from the demo people (prayer request, thanks, reflection, one public thanks) and reactions
do $$
declare
  rv uuid; g uuid; p1 uuid; p2 uuid;
  grace uuid := '00000000-0000-4000-a000-00000000d001';
  daniel uuid := '00000000-0000-4000-a000-00000000d002';
begin
  select id into rv from auth.users where email = 'review@dailyjourney.org';
  if rv is null then raise exception 'Create review@dailyjourney.org first (Authentication › Users › Add user)'; end if;

  -- demo people: never sign in (no password)
  insert into auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
      raw_app_meta_data, raw_user_meta_data, created_at, updated_at,
      confirmation_token, recovery_token, email_change_token_new, email_change)
  values
    ('00000000-0000-0000-0000-000000000000', grace, 'authenticated', 'authenticated', 'demo.grace@dailyjourney.org', '', now(),
     '{"provider":"email","providers":["email"]}', '{"name":"Grace Kim"}', now(), now(), '', '', '', ''),
    ('00000000-0000-0000-0000-000000000000', daniel, 'authenticated', 'authenticated', 'demo.daniel@dailyjourney.org', '', now(),
     '{"provider":"email","providers":["email"]}', '{"name":"Daniel Park"}', now(), now(), '', '', '', '')
  on conflict (id) do nothing;
  insert into profiles (id, name, lang) values (grace, 'Grace Kim', 'en'), (daniel, 'Daniel Park', 'en'), (rv, 'App Reviewer', 'en')
    on conflict (id) do update set name = excluded.name;

  -- start over: the old demo community (and its posts) goes
  delete from groups where owner = rv and name = 'Daily Journey Demo';
  delete from posts where author in (grace, daniel);

  insert into groups (name, owner) values ('Daily Journey Demo', rv) returning id into g;
  insert into group_members (group_id, user_id, role, status) values
    (g, rv, 'owner', 'active'), (g, grace, 'member', 'active'), (g, daniel, 'member', 'active');

  insert into posts (author, kind, scope, group_id, text, date, created_at) values
    (grace, 'prayer', 'group', g, 'Please pray for my mom''s surgery on Friday, that the doctors have wisdom and she has peace.', current_date, now() - interval '2 hours')
    returning id into p1;
  insert into posts (author, kind, scope, group_id, text, ref, date, created_at) values
    (daniel, 'meditation', 'group', g, 'His mercies are new every morning. Even after a hard week, I can start again today.',
     '{"b":25,"c":3,"v":22,"v2":23}', current_date, now() - interval '5 hours');
  insert into posts (author, kind, scope, group_id, text, date, created_at) values
    (daniel, 'thanks', 'group', g, 'Thankful for this group — your messages this week really encouraged me.', current_date - 1, now() - interval '1 day')
    returning id into p2;
  insert into posts (author, kind, scope, text, date, created_at) values
    (grace, 'thanks', 'public', 'Thankful for a quiet morning walk and time to read before work.', current_date - 1, now() - interval '1 day 3 hours');

  insert into reactions (post_id, user_id, kind) values (p1, daniel, 'pray'), (p2, grace, 'like') on conflict do nothing;
  raise notice 'Demo ready: community % with 4 posts', g;
end $$;
