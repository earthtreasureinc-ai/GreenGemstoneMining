import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const categories = ['hero', 'company', 'deposits', 'projects', 'gallery', 'contact', 'general'];

const supabaseUrl = process.env.SUPABASE_URL ?? process.env.VITE_SUPABASE_URL;
const supabaseServiceRole = process.env.SUPABASE_SERVICE_ROLE ?? process.env.VITE_SUPABASE_SERVICE_ROLE;

if (!supabaseUrl || !supabaseServiceRole) {
  console.error('Missing Supabase configuration. Set either SUPABASE_URL/SUPABASE_SERVICE_ROLE or VITE_SUPABASE_URL/VITE_SUPABASE_SERVICE_ROLE before running this script.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceRole, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});

const isVideo = (name) => {
  const ext = (name.split('.').pop() || '').toLowerCase();
  return ['mp4', 'mov', 'webm', 'avi', 'm4v', 'ogg', 'ogv'].includes(ext);
};

const importForCategory = async (category) => {
  const { data, error } = await supabase.storage.from('media').list(category, {
    limit: 1000,
    offset: 0,
    sortBy: { column: 'name', order: 'asc' },
  });

  if (error) {
    console.error(`Failed to list ${category}:`, error.message);
    return;
  }

  for (const item of data || []) {
    if (!item.name || item.name.startsWith('.') || item.name === 'undefined') continue;

    const storagePath = `${category}/${item.name}`;
    const { data: existingRows, error: existingError } = await supabase
      .from('media_uploads')
      .select('id')
      .eq('storage_path', storagePath)
      .limit(1);

    if (existingError) {
      console.error(`Existing lookup failed for ${storagePath}:`, existingError.message);
      continue;
    }

    if (existingRows && existingRows.length > 0) continue;

    const publicUrl = supabase.storage.from('media').getPublicUrl(storagePath).data.publicUrl;

    const insertPayload = {
      title: item.name.replace(/\.[^/.]+$/, ''),
      description: null,
      media_type: isVideo(item.name) ? 'video' : 'image',
      storage_path: storagePath,
      public_url: publicUrl,
      category,
      sort_order: 0,
      is_active: true,
    };

    const { error: insertError } = await supabase.from('media_uploads').insert(insertPayload);

    if (insertError) {
      console.error(`Insert failed for ${storagePath}:`, insertError.message);
    } else {
      console.log(`Inserted ${storagePath}`);
    }
  }
};

(async () => {
  for (const category of categories) {
    console.log(`Scanning category: ${category}`);
    await importForCategory(category);
  }
  console.log('Finished import.');
  process.exit(0);
})();
