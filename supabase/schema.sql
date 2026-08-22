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

create table if not exists public.user_settings (
  user_id uuid primary key references auth.users(id) on delete cascade,
  room_name text not null default 'Your Reading Room',
  show_my_room_first boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_user_books_updated_at on public.user_books;
create trigger set_user_books_updated_at
before update on public.user_books
for each row
execute function public.set_updated_at();

drop trigger if exists set_user_settings_updated_at on public.user_settings;
create trigger set_user_settings_updated_at
before update on public.user_settings
for each row
execute function public.set_updated_at();

alter table public.user_books enable row level security;
alter table public.user_settings enable row level security;

revoke all on table public.user_books from anon, authenticated;
revoke all on table public.user_settings from anon, authenticated;
grant select, insert, update, delete on table public.user_books to authenticated;
grant select, insert, update on table public.user_settings to authenticated;

drop policy if exists "Users can read their books" on public.user_books;
create policy "Users can read their books"
on public.user_books
for select
to authenticated
using ((select auth.uid()) = user_id);

drop policy if exists "Users can insert their books" on public.user_books;
create policy "Users can insert their books"
on public.user_books
for insert
to authenticated
with check ((select auth.uid()) = user_id);

drop policy if exists "Users can update their books" on public.user_books;
create policy "Users can update their books"
on public.user_books
for update
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

drop policy if exists "Users can delete their books" on public.user_books;
create policy "Users can delete their books"
on public.user_books
for delete
to authenticated
using ((select auth.uid()) = user_id);

drop policy if exists "Users can read their settings" on public.user_settings;
create policy "Users can read their settings"
on public.user_settings
for select
to authenticated
using ((select auth.uid()) = user_id);

drop policy if exists "Users can insert their settings" on public.user_settings;
create policy "Users can insert their settings"
on public.user_settings
for insert
to authenticated
with check ((select auth.uid()) = user_id);

drop policy if exists "Users can update their settings" on public.user_settings;
create policy "Users can update their settings"
on public.user_settings
for update
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);
