import { useCallback, useEffect, useState } from 'react';
import { supabase, type MediaUpload } from '@/lib/supabase';

/** Public, active uploads for the gallery. Silent no-op when Supabase is not configured. */
export function useUploads() {
  const [uploads, setUploads] = useState<MediaUpload[]>([]);

  const refresh = useCallback(async () => {
    if (!supabase) return;
    const { data, error } = await supabase
      .from('media_uploads')
      .select('*')
      .eq('is_active', true)
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: false });
    if (!error && data) setUploads(data as MediaUpload[]);
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return { uploads, refresh };
}
