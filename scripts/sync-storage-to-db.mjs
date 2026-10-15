// Backfills `media_uploads` rows for files already in the `media` storage bucket.
// Needs a service-role key, so run it locally ONLY. Never expose that key to the browser:
//   SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... npm run sync:media
import { createClient } from '@supabase/supabase-js';

const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) {
  console.error('Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in your shell (not in a committed file).');
  process.exit(1);
}

const sb = createClient(url, key, { auth: { persistSession: false } });
const BUCKET = 'media';
const VIDEO = /\.(mp4|mov|webm|m4v|ogg|ogv)$/i;
const IMAGE = /\.(jpe?g|png|webp|gif)$/i;

async function listAll(prefix = '') {
  const files = [];
  const { data, error } = await sb.storage.from(BUCKET).list(prefix, { limit: 1000 });
  if (error) throw error;
  for (const entry of data ?? []) {
    const path = prefix ? `${prefix}/${entry.name}` : entry.name;
    if (entry.id === null) files.push(...(await listAll(path)));
    else files.push(path);
  }
  return files;
}

const known = new Set(((await sb.from('media_uploads').select('storage_path')).data ?? []).map((r) => r.storage_path));
let added = 0;
for (const path of await listAll()) {
  if (known.has(path) || path.endsWith('.keep') || !(VIDEO.test(path) || IMAGE.test(path))) continue;
  const category = ['hero', 'company', 'deposits', 'projects', 'gallery', 'contact'].includes(path.split('/')[0]) ? path.split('/')[0] : 'general';
  const { error } = await sb.from('media_uploads').insert({
    title: path.split('/').pop().replace(/\.[^.]+$/, ''),
    media_type: VIDEO.test(path) ? 'video' : 'image',
    storage_path: path,
    public_url: sb.storage.from(BUCKET).getPublicUrl(path).data.publicUrl,
    category,
  });
  if (error) console.error(`skip ${path}: ${error.message}`);
  else added += 1;
}
console.log(`Added ${added} row(s).`);
