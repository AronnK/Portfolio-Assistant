"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { createClient } from "@/lib/supabase/client";
import type { User, SupabaseClient } from "@supabase/supabase-js";

interface AuthContextType {
  supabase: SupabaseClient;
  user: User | null;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const supabase = createClient();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Check for initial session
    const checkInitialSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        setLoading(false);
      }
    };
    checkInitialSession();

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase.auth]);

  const signInWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  const value = {
    supabase,
    user,
    signInWithGoogle,
    signOut,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
