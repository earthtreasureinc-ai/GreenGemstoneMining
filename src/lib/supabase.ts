import { createClient } from '@supabase/supabase-js';

const { VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY } = import.meta.env;

if (!VITE_SUPABASE_URL || !VITE_SUPABASE_ANON_KEY) {
  console.warn('Supabase env vars are missing. Media uploads and gallery sync will fail until VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set.');
}

export const supabase = createClient(VITE_SUPABASE_URL || '', VITE_SUPABASE_ANON_KEY || '');

export type MediaCategory =
  | 'hero'
  | 'company'
  | 'deposits'
  | 'projects'
  | 'gallery'
  | 'contact'
  | 'general';

export type MediaType = 'image' | 'video';

export interface MediaUpload {
  id: string;
  title: string;
  description: string | null;
  media_type: MediaType;
  storage_path: string;
  public_url: string;
  category: MediaCategory;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}
