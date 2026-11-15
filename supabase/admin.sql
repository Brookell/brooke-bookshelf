-- Admin dashboard support.
--
-- Adds an `admins` allow-list and a single read-only RPC, `admin_overview()`,
-- that returns user and shelf statistics for admin.html.
--
-- Security model:
-- - `public.admins` has RLS enabled and no policies, so browsers cannot read
--   or write it. Add admins only from the Supabase SQL editor.
-- - `admin_overview()` is SECURITY DEFINER so it can read auth.users, but it
--   raises an error unless the caller's auth.uid() is in public.admins.
-- - Execute is revoked from anon/public and granted only to authenticated.
--
-- Make yourself an admin (run once in the SQL editor, after signing in once):
--   insert into public.admins (user_id)
--   select id from auth.users where email = 'YOUR_EMAIL'
--   on conflict do nothing;

create table if not exists public.admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table public.admins enable row level security;
revoke all on table public.admins from anon, authenticated;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.admins where user_id = auth.uid()
  );
$$;

revoke all on function public.is_admin() from public, anon;
grant execute on function public.is_admin() to authenticated;

create or replace function public.admin_overview()
returns jsonb
language plpgsql
stable
security definer
set search_path = ''
as $$
declare
  result jsonb;
begin
  if not public.is_admin() then
    raise exception 'not authorized' using errcode = '42501';
  end if;

  select jsonb_build_object(
    'generated_at', now(),

    'totals', jsonb_build_object(
      'users', (select count(*) from auth.users),
      'confirmed_users', (select count(*) from auth.users where email_confirmed_at is not null),
      'active_7d', (select count(*) from auth.users where last_sign_in_at > now() - interval '7 days'),
      'active_30d', (select count(*) from auth.users where last_sign_in_at > now() - interval '30 days'),
      'new_7d', (select count(*) from auth.users where created_at > now() - interval '7 days'),
      'users_with_books', (select count(distinct user_id) from public.user_books),
      'books', (select count(*) from public.user_books),
      'want_to_read', (select count(*) from public.user_books where status = 'want_to_read'),
      'reading', (select count(*) from public.user_books where status = 'reading'),
      'finished', (select count(*) from public.user_books where status = 'finished')
    ),

    'users', coalesce((
      select jsonb_agg(row_to_json(u) order by u.created_at desc)
      from (
        select
          au.id,
          au.email,
          au.created_at,
          au.last_sign_in_at,
          au.email_confirmed_at is not null as confirmed,
          s.room_name,
          count(b.id) as books,
          count(b.id) filter (where b.status = 'want_to_read') as want_to_read,
          count(b.id) filter (where b.status = 'reading') as reading,
          count(b.id) filter (where b.status = 'finished') as finished,
          count(b.id) filter (where b.source = 'weread') as from_weread,
          max(b.updated_at) as last_shelf_update
        from auth.users au
        left join public.user_settings s on s.user_id = au.id
        left join public.user_books b on b.user_id = au.id
        group by au.id, au.email, au.created_at, au.last_sign_in_at, au.email_confirmed_at, s.room_name
      ) u
    ), '[]'::jsonb),

    'signups_daily', coalesce((
      select jsonb_agg(jsonb_build_object('day', d.day, 'signups', d.signups) order by d.day)
      from (
        select
          g.day::date as day,
          (select count(*) from auth.users au where au.created_at::date = g.day::date) as signups
        from generate_series(current_date - 89, current_date, interval '1 day') as g(day)
      ) d
    ), '[]'::jsonb),

    'top_books', coalesce((
      select jsonb_agg(row_to_json(t))
      from (
        select
          b.title,
          max(b.author) as author,
          count(distinct b.user_id) as savers,
          count(*) filter (where b.status = 'finished') as finished
        from public.user_books b
        group by b.title
        order by count(distinct b.user_id) desc, b.title
        limit 20
      ) t
    ), '[]'::jsonb),

    'sources', coalesce((
      select jsonb_agg(jsonb_build_object('source', s.source, 'books', s.books) order by s.books desc)
      from (
        select source, count(*) as books from public.user_books group by source
      ) s
    ), '[]'::jsonb)
  ) into result;

  return result;
end;
$$;

revoke all on function public.admin_overview() from public, anon;
grant execute on function public.admin_overview() to authenticated;
