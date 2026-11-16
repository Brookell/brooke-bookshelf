-- Wrong passcodes for the admin-passcode Edge Function. Used to lock out
-- guessing: 5 wrong tries per IP per hour, 30 wrong tries in total per hour.
-- RLS on with no policies: only the function (service role) touches it.

create table if not exists public.admin_passcode_failures (
  id bigint generated always as identity primary key,
  ip text not null default '',
  created_at timestamptz not null default now()
);

create index if not exists admin_passcode_failures_created_at
  on public.admin_passcode_failures (created_at desc);

alter table public.admin_passcode_failures enable row level security;
revoke all on table public.admin_passcode_failures from anon, authenticated;
