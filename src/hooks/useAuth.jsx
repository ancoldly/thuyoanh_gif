import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }

    const init = async () => {
      const { data } = await supabase.auth.getSession();
      setUser(data.session?.user ?? null);
      setLoading(false);
    };
    init();

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    // Proactive token refresh to reduce "JWT expired" on long-lived tabs.
    const refreshTicker = setInterval(async () => {
      const { data } = await supabase.auth.getSession();
      const exp = data.session?.expires_at;
      if (!exp) return;
      const secondsLeft = exp - Math.floor(Date.now() / 1000);
      if (secondsLeft < 600) {
        await supabase.auth.refreshSession();
      }
    }, 60 * 1000);

    return () => {
      clearInterval(refreshTicker);
      sub.subscription.unsubscribe();
    };
  }, []);

  const value = useMemo(() => ({ user, loading }), [user, loading]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
