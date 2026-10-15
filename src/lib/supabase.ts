import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

/** True when both public Supabase settings are present at build time. */
export const supabaseConfigured = Boolean(url && anonKey);

/**
 * Browser client using the public anon key only.
 * `null` when the env vars are missing, so the static site still renders
 * (gallery uploads and the contact form degrade gracefully instead of crashing).
 */
export const supabase: SupabaseClient | null =
  url && anonKey ? createClient(url, anonKey) : null;

export const MEDIA_BUCKET = 'media';

export const MEDIA_CATEGORIES = [
  'hero',
  'company',
  'deposits',
  'projects',
  'gallery',
  'contact',
  'general',
] as const;

export type MediaCategory = (typeof MEDIA_CATEGORIES)[number];
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
