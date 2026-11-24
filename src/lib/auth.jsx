import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { supabase, arrivedFromEmail, arrivedForRecovery } from "./supabase";

const AuthContext = createContext({ session: null, profile: null, loading: false, refresh: async () => {} });

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(Boolean(supabase));

  const loadProfile = useCallback(async (s) => {
    if (!s) { setProfile(null); return; }
    const { data } = await supabase.from("profiles").select("*, units(*)").eq("id", s.user.id).maybeSingle();
    setProfile(data ?? null);
  }, []);

  useEffect(() => {
    if (!supabase) return;
    let alive = true;

    supabase.auth.getSession().then(async ({ data }) => {
      if (!alive) return;
      setSession(data.session);
      await loadProfile(data.session);
      setLoading(false);
      // Came from an email link: send them somewhere useful.
      if (arrivedForRecovery) window.location.hash = "#reset";
      else if (arrivedFromEmail && data.session) window.location.hash = "#account";
    });

    const { data: sub } = supabase.auth.onAuthStateChange((event, s) => {
      setSession(s);
      if (event === "PASSWORD_RECOVERY") window.location.hash = "#reset";
      // Supabase advises not to await its own calls inside this callback.
      setTimeout(() => loadProfile(s), 0);
    });

    return () => { alive = false; sub.subscription.unsubscribe(); };
  }, [loadProfile]);

  const refresh = useCallback(() => loadProfile(session), [loadProfile, session]);

  return <AuthContext.Provider value={{ session, profile, loading, refresh }}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
