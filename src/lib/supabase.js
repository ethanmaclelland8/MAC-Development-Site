import { createClient } from "@supabase/supabase-js";
import { BACKEND, backendReady } from "../config";

// Remember whether this page load came from an email link (password
// reset or sign-up confirmation) before Supabase reads and clears it.
const hash = typeof window !== "undefined" ? window.location.hash : "";
export const arrivedFromEmail = /access_token=|error_description=/.test(hash);
export const arrivedForRecovery = /type=recovery/.test(hash);

export const supabase = backendReady
  ? createClient(BACKEND.supabaseUrl, BACKEND.supabaseAnonKey, {
      auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
    })
  : null;
