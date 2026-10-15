import type { SupabaseClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

/** True when both public Supabase settings are present at build time. */
export const supabaseConfigured = Boolean(url && anonKey);

let clientPromise: Promise<SupabaseClient | null> | null = null;

/**
 * Browser client using the public anon key only, loaded on demand so the Supabase
 * SDK stays off the critical path. Resolves to `null` when env vars are missing, so
 * the static site still renders (uploads and the enquiry form degrade gracefully).
 */
export function getSupabase(): Promise<SupabaseClient | null> {
  if (!supabaseConfigured) return Promise.resolve(null);
  clientPromise ??= import('@supabase/supabase-js').then(({ createClient }) => createClient(url as string, anonKey as string));
  return clientPromise;
}

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
