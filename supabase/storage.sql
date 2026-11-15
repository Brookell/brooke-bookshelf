-- Public "covers" bucket for covers that users upload for their own books.
-- Anyone can view a cover by its public URL; only the signed-in owner can
-- add, replace or delete files, and only inside their own folder:
--   covers/<auth.uid()>/<file>.jpg

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('covers', 'covers', true, 2097152, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do update
  set public = excluded.public,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Users upload their own covers" on storage.objects;
create policy "Users upload their own covers"
on storage.objects for insert to authenticated
with check (bucket_id = 'covers' and (storage.foldername(name))[1] = (select auth.uid())::text);

drop policy if exists "Users update their own covers" on storage.objects;
create policy "Users update their own covers"
on storage.objects for update to authenticated
using (bucket_id = 'covers' and (storage.foldername(name))[1] = (select auth.uid())::text);

drop policy if exists "Users delete their own covers" on storage.objects;
create policy "Users delete their own covers"
on storage.objects for delete to authenticated
using (bucket_id = 'covers' and (storage.foldername(name))[1] = (select auth.uid())::text);
