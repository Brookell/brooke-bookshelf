create table if not exists public.user_books (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  source text not null default 'manual',
  source_id text not null,
  title text not null,
  author text,
  cover_url text,
  category text,
  status text not null default 'want_to_read'
    check (status in ('want_to_read', 'reading', 'finished')),
  deep_link text,
  read_update_time timestamptz,
  raw jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, source, source_id)
);

alter table public.user_books enable row level security;

create policy "Users can read their books"
on public.user_books
for select
to authenticated
using ((select auth.uid()) = user_id);

create policy "Users can insert their books"
on public.user_books
for insert
to authenticated
with check ((select auth.uid()) = user_id);

create policy "Users can update their books"
on public.user_books
for update
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

create policy "Users can delete their books"
on public.user_books
for delete
to authenticated
using ((select auth.uid()) = user_id);
