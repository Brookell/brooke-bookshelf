-- Tables used by the search-books Edge Function.
-- RLS is on with no policies: browsers cannot read or write them; only the
-- function (service role) can.

create table if not exists public.book_search_cache (
  query_key text primary key,
  results jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.book_search_log (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  query text not null,
  source text not null,
  created_at timestamptz not null default now()
);

create index if not exists book_search_log_user_time
  on public.book_search_log (user_id, created_at desc);

alter table public.book_search_cache enable row level security;
alter table public.book_search_log enable row level security;
revoke all on table public.book_search_cache from anon, authenticated;
revoke all on table public.book_search_log from anon, authenticated;
