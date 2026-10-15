import { useCallback, useEffect, useState } from 'react';
import { getSupabase, type MediaUpload } from '@/lib/supabase';

/** Public, active uploads for the gallery. Loaded when the browser is idle; no-op without Supabase. */
export function useUploads() {
  const [uploads, setUploads] = useState<MediaUpload[]>([]);

  const refresh = useCallback(async () => {
    const supabase = await getSupabase();
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
    const idle = (window as Window & { requestIdleCallback?: (cb: () => void) => number }).requestIdleCallback;
    if (idle) {
      idle(() => void refresh());
      return undefined;
    }
    const t = window.setTimeout(() => void refresh(), 1500);
    return () => window.clearTimeout(t);
  }, [refresh]);

  return { uploads, refresh };
}
