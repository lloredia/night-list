import { useState, useEffect } from "react";
import type { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import type { Profile, UserRole } from "@/lib/database.types";

interface AuthState {
  user: User | null;
  profile: Profile | null;
  session: Session | null;
  role: UserRole | null;
  loading: boolean;
  isOwner: boolean;
  isGuest: boolean;
  isPromoter: boolean;
  isAdmin: boolean;
}

export function useAuth(): AuthState & {
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signUp: (email: string, password: string, fullName: string, role?: UserRole) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
} {
  const [state, setState] = useState<AuthState>({
    user: null,
    profile: null,
    session: null,
    role: null,
    loading: true,
    isOwner: false,
    isGuest: false,
    isPromoter: false,
    isAdmin: false,
  });

  useEffect(() => {
    // Initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        fetchProfile(session.user, session);
      } else {
        setState((s) => ({ ...s, loading: false }));
      }
    });

    // Auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (session?.user) {
          fetchProfile(session.user, session);
        } else {
          setState({
            user: null, profile: null, session: null, role: null,
            loading: false, isOwner: false, isGuest: false, isPromoter: false, isAdmin: false,
          });
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  async function fetchProfile(user: User, session: Session) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    const role = profile?.role ?? "guest";
    setState({
      user,
      profile: profile ?? null,
      session,
      role,
      loading: false,
      isOwner: role === "owner" || role === "admin",
      isGuest: role === "guest",
      isPromoter: role === "promoter",
      isAdmin: role === "admin",
    });
  }

  async function signIn(email: string, password: string) {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error: error?.message ?? null };
  }

  async function signUp(
    email: string,
    password: string,
    fullName: string,
    role: UserRole = "guest"
  ) {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName, role } },
    });
    return { error: error?.message ?? null };
  }

  async function signOut() {
    await supabase.auth.signOut();
  }

  return { ...state, signIn, signUp, signOut };
}
