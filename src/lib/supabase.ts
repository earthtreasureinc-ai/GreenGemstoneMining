import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

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
