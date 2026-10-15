import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

/** Tracks the Supabase Auth session and whether that user is listed in `admin_users`. */
export function useAdminSession() {
  const [email, setEmail] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [checking, setChecking] = useState(Boolean(supabase));

  const check = useCallback(async () => {
    if (!supabase) return;
    const { data } = await supabase.auth.getSession();
    const user = data.session?.user ?? null;
    setEmail(user?.email ?? null);
    if (!user) {
      setIsAdmin(false);
      setChecking(false);
      return;
    }
    const { data: ok } = await supabase.rpc('is_admin');
    setIsAdmin(ok === true);
    setChecking(false);
  }, []);

  useEffect(() => {
    if (!supabase) return undefined;
    void check();
    const { data } = supabase.auth.onAuthStateChange(() => void check());
    return () => data.subscription.unsubscribe();
  }, [check]);

  const signIn = useCallback(async (e: string, password: string) => {
    if (!supabase) return 'Media management is not configured.';
    const { error } = await supabase.auth.signInWithPassword({ email: e, password });
    return error ? 'Sign-in failed. Check your email and password.' : null;
  }, []);

  const signOut = useCallback(async () => {
    if (supabase) await supabase.auth.signOut();
  }, []);

  return { email, isAdmin, checking, signIn, signOut };
}
