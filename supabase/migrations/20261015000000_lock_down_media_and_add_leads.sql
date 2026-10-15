/*
# Security hardening + investor leads

Replaces the original "anyone can write" policies.

1. `admin_users` lists the Supabase Auth users allowed to manage media.
   After applying, add yourself (create the user under Authentication -> Users first):
     insert into public.admin_users (user_id) select id from auth.users where email = 'you@example.com';
2. `media_uploads` and the `media` bucket: public read, admin-only write.
3. Bucket limits: 10 MB per file, no SVG (SVG can carry scripts).
4. `leads`: anonymous visitors may INSERT only; only admins can read.
*/

create table if not exists public.admin_users (
  user_id uuid primary key references auth.users (id) on delete cascade
);
alter table public.admin_users enable row level security;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from public.admin_users where user_id = auth.uid());
$$;
revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to anon, authenticated;

drop policy if exists "admins_read_self" on public.admin_users;
create policy "admins_read_self" on public.admin_users for select to authenticated using (user_id = auth.uid());

-- media_uploads -------------------------------------------------------------
alter table public.media_uploads drop constraint if exists media_uploads_category_check;
alter table public.media_uploads add constraint media_uploads_category_check
  check (category in ('hero','company','deposits','projects','gallery','contact','general'));

drop policy if exists "anon_select_media" on public.media_uploads;
drop policy if exists "anon_insert_media" on public.media_uploads;
drop policy if exists "anon_update_media" on public.media_uploads;
drop policy if exists "anon_delete_media" on public.media_uploads;

create policy "public_read_active_media" on public.media_uploads for select to anon, authenticated
  using (is_active = true or public.is_admin());
create policy "admin_insert_media" on public.media_uploads for insert to authenticated with check (public.is_admin());
create policy "admin_update_media" on public.media_uploads for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "admin_delete_media" on public.media_uploads for delete to authenticated using (public.is_admin());

-- storage -------------------------------------------------------------------
update storage.buckets
set file_size_limit = 10485760,
    allowed_mime_types = array['image/jpeg','image/png','image/webp','image/gif','video/mp4','video/webm','video/quicktime','text/plain']
where id = 'media';

drop policy if exists "anon_insert_media_bucket" on storage.objects;
drop policy if exists "anon_update_media_bucket" on storage.objects;
drop policy if exists "anon_delete_media_bucket" on storage.objects;
drop policy if exists "admin_insert_media_bucket" on storage.objects;
drop policy if exists "admin_update_media_bucket" on storage.objects;
drop policy if exists "admin_delete_media_bucket" on storage.objects;

create policy "admin_insert_media_bucket" on storage.objects for insert to authenticated
  with check (bucket_id = 'media' and public.is_admin());
create policy "admin_update_media_bucket" on storage.objects for update to authenticated
  using (bucket_id = 'media' and public.is_admin()) with check (bucket_id = 'media' and public.is_admin());
create policy "admin_delete_media_bucket" on storage.objects for delete to authenticated
  using (bucket_id = 'media' and public.is_admin());

-- leads ---------------------------------------------------------------------
create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 2 and 120),
  email text not null check (char_length(email) between 5 and 254),
  company text check (company is null or char_length(company) <= 160),
  interest text not null,
  message text not null check (char_length(message) between 10 and 2000),
  created_at timestamptz not null default now()
);
alter table public.leads enable row level security;

drop policy if exists "anyone_can_submit_lead" on public.leads;
create policy "anyone_can_submit_lead" on public.leads for insert to anon, authenticated with check (true);
drop policy if exists "admins_read_leads" on public.leads;
create policy "admins_read_leads" on public.leads for select to authenticated using (public.is_admin());
revoke select, update, delete on public.leads from anon;
