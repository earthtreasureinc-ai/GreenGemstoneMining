/*
# Create public storage bucket for media uploads

1. Storage
- Creates a `media` bucket (public) for storing user-uploaded photos and videos.
- Sets up storage policies allowing anon + authenticated to upload, read, update, and delete files.

2. Security
- Public read access (bucket is public).
- Anon + authenticated can insert/update/delete objects.
- This is a single-tenant app where the owner manages their own media.
*/

INSERT INTO storage.buckets (id, name, public)
VALUES ('media', 'media', true)
ON CONFLICT (id) DO NOTHING;

-- Allow public read
DROP POLICY IF EXISTS "anon_read_media_bucket" ON storage.objects;
CREATE POLICY "anon_read_media_bucket" ON storage.objects
  FOR SELECT TO anon, authenticated
  USING (bucket_id = 'media');

-- Allow anon + authenticated to upload
DROP POLICY IF EXISTS "anon_insert_media_bucket" ON storage.objects;
CREATE POLICY "anon_insert_media_bucket" ON storage.objects
  FOR INSERT TO anon, authenticated
  WITH CHECK (bucket_id = 'media');

-- Allow anon + authenticated to update
DROP POLICY IF EXISTS "anon_update_media_bucket" ON storage.objects;
CREATE POLICY "anon_update_media_bucket" ON storage.objects
  FOR UPDATE TO anon, authenticated
  USING (bucket_id = 'media') WITH CHECK (bucket_id = 'media');

-- Allow anon + authenticated to delete
DROP POLICY IF EXISTS "anon_delete_media_bucket" ON storage.objects;
CREATE POLICY "anon_delete_media_bucket" ON storage.objects
  FOR DELETE TO anon, authenticated
  USING (bucket_id = 'media');
