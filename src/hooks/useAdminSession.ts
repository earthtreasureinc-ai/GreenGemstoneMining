import { useCallback, useEffect, useState } from 'react';
import type { SupabaseClient } from '@supabase/supabase-js';
import { getSupabase, supabaseConfigured } from '@/lib/supabase';

/**
 * Supabase Auth session + whether that user is listed in `admin_users`.
 * Only starts once `enabled` is true (the owner opens the login), keeping auth off the first load.
 */
export function useAdminSession(enabled: boolean) {
  const [client, setClient] = useState<SupabaseClient | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [checking, setChecking] = useState(supabaseConfigured);

  const check = useCallback(async (sb: SupabaseClient) => {
    const { data } = await sb.auth.getSession();
    const user = data.session?.user ?? null;
    setEmail(user?.email ?? null);
    if (!user) {
      setIsAdmin(false);
    } else {
      const { data: ok } = await sb.rpc('is_admin');
      setIsAdmin(ok === true);
    }
    setChecking(false);
  }, []);

  useEffect(() => {
    if (!enabled) return undefined;
    let unsubscribe: (() => void) | undefined;
    let cancelled = false;
    void getSupabase().then((sb) => {
      if (cancelled || !sb) {
        setChecking(false);
        return;
      }
      setClient(sb);
      void check(sb);
      unsubscribe = sb.auth.onAuthStateChange(() => void check(sb)).data.subscription.unsubscribe;
    });
    return () => {
      cancelled = true;
      unsubscribe?.();
    };
  }, [enabled, check]);

  const signIn = useCallback(async (e: string, password: string) => {
    if (!client) return 'Media management is not configured.';
    const { error } = await client.auth.signInWithPassword({ email: e, password });
    return error ? 'Sign-in failed. Check your email and password.' : null;
  }, [client]);

  const signOut = useCallback(async () => {
    await client?.auth.signOut();
  }, [client]);

  return { client, email, isAdmin, checking, signIn, signOut };
}
