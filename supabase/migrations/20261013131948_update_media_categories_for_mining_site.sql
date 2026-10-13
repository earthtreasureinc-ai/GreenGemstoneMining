/*
# Update media_uploads categories for mining company site

1. Changes
- Replaces the category CHECK constraint on `media_uploads` to use
  section names that match the Green Gemstone Mining website:
  hero, company, deposits, projects, gallery, contact, general.
- Old jewelry-oriented categories (collection, craftsmanship, testimonial)
  are removed from the allowed list. Any existing rows with those old
  categories are migrated to 'general' so no data is lost.

2. Security
- No policy changes. RLS remains enabled with existing anon/authenticated CRUD.
*/

-- First, migrate any rows that have old category values to 'general'
UPDATE media_uploads
SET category = 'general', updated_at = now()
WHERE category IN ('collection', 'craftsmanship', 'testimonial');

-- Drop the old constraint
ALTER TABLE media_uploads DROP CONSTRAINT IF EXISTS media_uploads_category_check;

-- Add the new constraint with mining-site categories
ALTER TABLE media_uploads
ADD CONSTRAINT media_uploads_category_check
CHECK (category IN ('hero', 'company', 'deposits', 'projects', 'gallery', 'contact', 'general'));
