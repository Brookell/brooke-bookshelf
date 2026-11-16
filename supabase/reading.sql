-- Saved WeRead API keys for the reading panel (weread-me Edge Function).
--
-- A user can choose to save their own WeRead key so their reading stats,
-- progress and highlights update automatically. The key is encrypted with
-- AES-GCM by the function (secret WEREAD_KEY_SECRET) before it is stored,
-- and this table has RLS on with no policies: browsers can't read or write
-- it, only the function (service role). Deleting the user deletes the key.

create table if not exists public.user_weread_keys (
  user_id uuid primary key references auth.users(id) on delete cascade,
  ciphertext text not null,
  iv text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.user_weread_keys enable row level security;
revoke all on table public.user_weread_keys from anon, authenticated;
