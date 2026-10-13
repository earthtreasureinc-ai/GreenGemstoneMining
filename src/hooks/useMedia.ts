import { useCallback, useEffect, useState } from 'react';
import { supabase, MediaUpload, MediaCategory } from '@/lib/supabase';

export function useMedia(category: MediaCategory) {
  const [media, setMedia] = useState<MediaUpload[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMedia = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('media_uploads')
      .select('*')
      .eq('category', category)
      .eq('is_active', true)
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: false });

    if (!error && data) {
      setMedia(data as MediaUpload[]);
    }
    setLoading(false);
  }, [category]);

  useEffect(() => {
    fetchMedia();
  }, [fetchMedia]);

  return { media, loading, refetch: fetchMedia };
}
