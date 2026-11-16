-- Site analytics for the admin dashboard.
--
-- 1. public.site_visits: one row per browser session that opens the site.
--    Visitors are identified by a random id kept in their browser (no IP,
--    no fingerprinting). Rows are written only through log_visit(); nobody
--    can read them from the browser.
-- 2. public.admin_overview(): replaces the version in admin.sql and adds
--    visits, unique visitors, sign-ups over time, conversion and usage.

create table if not exists public.site_visits (
  id bigint generated always as identity primary key,
  visitor_id text not null check (char_length(visitor_id) between 8 and 64),
  user_id uuid references auth.users(id) on delete set null,
  path text not null default '/' check (char_length(path) <= 200),
  referrer text check (char_length(referrer) <= 300),
  created_at timestamptz not null default now()
);

create index if not exists site_visits_created_at on public.site_visits (created_at desc);
create index if not exists site_visits_visitor on public.site_visits (visitor_id, created_at desc);

alter table public.site_visits enable row level security;
revoke all on table public.site_visits from anon, authenticated;

-- Called once per browser session by the site. Ignores a repeat from the
-- same visitor within 30 minutes so reloads don't inflate the numbers.
create or replace function public.log_visit(visitor text, page text default '/', ref text default null)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  if visitor is null or char_length(visitor) not between 8 and 64 then
    return;
  end if;
  if exists (
    select 1 from public.site_visits
    where visitor_id = visitor and created_at > now() - interval '30 minutes'
  ) then
    return;
  end if;
  insert into public.site_visits (visitor_id, user_id, path, referrer)
  values (visitor, auth.uid(), left(coalesce(page, '/'), 200), left(ref, 300));
end;
$$;

revoke all on function public.log_visit(text, text, text) from public;
grant execute on function public.log_visit(text, text, text) to anon, authenticated;

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
      'new_30d', (select count(*) from auth.users where created_at > now() - interval '30 days'),
      'users_with_books', (select count(distinct user_id) from public.user_books),
      'books', (select count(*) from public.user_books),
      'weread_connected', (select count(*) from public.user_weread_keys),
      'searches_7d', (select count(*) from public.book_search_log where created_at > now() - interval '7 days' and source not like 'me:%'),
      'visits_today', (select count(*) from public.site_visits where created_at >= date_trunc('day', now())),
      'visitors_today', (select count(distinct visitor_id) from public.site_visits where created_at >= date_trunc('day', now())),
      'visits_7d', (select count(*) from public.site_visits where created_at > now() - interval '7 days'),
      'visitors_7d', (select count(distinct visitor_id) from public.site_visits where created_at > now() - interval '7 days'),
      'visits_30d', (select count(*) from public.site_visits where created_at > now() - interval '30 days'),
      'visitors_30d', (select count(distinct visitor_id) from public.site_visits where created_at > now() - interval '30 days'),
      'visitors_all', (select count(distinct visitor_id) from public.site_visits),
      'first_visit', (select min(created_at) from public.site_visits)
    ),

    'daily', coalesce((
      select jsonb_agg(jsonb_build_object(
        'day', d.day,
        'visits', d.visits,
        'visitors', d.visitors,
        'signups', d.signups
      ) order by d.day)
      from (
        select
          g.day::date as day,
          (select count(*) from public.site_visits v where v.created_at::date = g.day::date) as visits,
          (select count(distinct visitor_id) from public.site_visits v where v.created_at::date = g.day::date) as visitors,
          (select count(*) from auth.users au where au.created_at::date = g.day::date) as signups
        from generate_series(current_date - 29, current_date, interval '1 day') as g(day)
      ) d
    ), '[]'::jsonb),

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
          count(b.id) filter (where b.source = 'weread') as from_weread,
          exists (select 1 from public.user_weread_keys k where k.user_id = au.id) as weread_connected,
          max(b.updated_at) as last_shelf_update
        from auth.users au
        left join public.user_settings s on s.user_id = au.id
        left join public.user_books b on b.user_id = au.id
        group by au.id, au.email, au.created_at, au.last_sign_in_at, au.email_confirmed_at, s.room_name
      ) u
    ), '[]'::jsonb),

    'top_books', coalesce((
      select jsonb_agg(row_to_json(t))
      from (
        select b.title, max(b.author) as author, max(b.cover_url) as cover, count(distinct b.user_id) as savers
        from public.user_books b
        group by b.title
        order by count(distinct b.user_id) desc, max(b.updated_at) desc
        limit 8
      ) t
    ), '[]'::jsonb),

    'top_searches', coalesce((
      select jsonb_agg(row_to_json(q))
      from (
        select query, count(*) as times
        from public.book_search_log
        where created_at > now() - interval '30 days'
          and source not like 'me:%'
          and query not like 'info:%'
        group by query
        order by count(*) desc, max(created_at) desc
        limit 8
      ) q
    ), '[]'::jsonb),

    'sources', coalesce((
      select jsonb_agg(jsonb_build_object('source', s.source, 'books', s.books) order by s.books desc)
      from (select source, count(*) as books from public.user_books group by source) s
    ), '[]'::jsonb),

    'referrers', coalesce((
      select jsonb_agg(row_to_json(r))
      from (
        select coalesce(nullif(split_part(split_part(referrer, '://', 2), '/', 1), ''), '直接访问') as source,
               count(*) as visits
        from public.site_visits
        where created_at > now() - interval '30 days'
        group by 1
        order by 2 desc
        limit 6
      ) r
    ), '[]'::jsonb)
  ) into result;

  return result;
end;
$$;

revoke all on function public.admin_overview() from public, anon;
grant execute on function public.admin_overview() to authenticated;
