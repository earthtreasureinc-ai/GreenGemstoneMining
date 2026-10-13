/*
# Create media_uploads table for user-uploaded photos and videos

1. New Tables
- `media_uploads`
  - `id` (uuid, primary key)
  - `title` (text, name/label for the media)
  - `description` (text, optional caption or note)
  - `media_type` (text, 'image' or 'video')
  - `storage_path` (text, path in Supabase Storage bucket)
  - `public_url` (text, public URL to the file)
  - `category` (text, which section of the site this belongs to: hero, collection, craftsmanship, gallery, testimonial, or 'general')
  - `sort_order` (int, ordering within a category, default 0)
  - `is_active` (boolean, whether to display on the site, default true)
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

2. Security
- Enable RLS on `media_uploads`.
- Allow anon + authenticated full CRUD because this is a single-tenant no-auth app
  where the owner manages their own media through the built-in upload panel.
- All data is intentionally public/shared.

3. Storage
- Uses the `media` bucket in Supabase Storage (public bucket).
- Files are uploaded directly from the browser to Supabase Storage.
*/

CREATE TABLE IF NOT EXISTS media_uploads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL DEFAULT 'Untitled',
  description text,
  media_type text NOT NULL DEFAULT 'image' CHECK (media_type IN ('image', 'video')),
  storage_path text NOT NULL,
  public_url text NOT NULL,
  category text NOT NULL DEFAULT 'general' CHECK (category IN ('hero', 'collection', 'craftsmanship', 'gallery', 'testimonial', 'general')),
  sort_order int NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE media_uploads ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_media" ON media_uploads;
CREATE POLICY "anon_select_media" ON media_uploads FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_media" ON media_uploads;
CREATE POLICY "anon_insert_media" ON media_uploads FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_media" ON media_uploads;
CREATE POLICY "anon_update_media" ON media_uploads FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_media" ON media_uploads;
CREATE POLICY "anon_delete_media" ON media_uploads FOR DELETE
  TO anon, authenticated USING (true);

-- Create index for category-based queries
CREATE INDEX IF NOT EXISTS idx_media_uploads_category ON media_uploads(category);
CREATE INDEX IF NOT EXISTS idx_media_uploads_active ON media_uploads(is_active);
