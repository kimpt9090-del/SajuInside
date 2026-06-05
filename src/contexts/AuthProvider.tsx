"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { Session, User } from "@supabase/supabase-js";

import {
  isCloudSyncAvailable,
  registerCloudSyncAuth,
  syncCloudOnLogin,
} from "@/lib/cloud-sync";
import {
  applyCloudSnapshot,
  getLocalCloudSnapshot,
  setCloudUserId,
} from "@/lib/result-history";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

type AuthContextValue = {
  user: User | null;
  session: Session | null;
  loading: boolean;
  cloudEnabled: boolean;
  syncMessage: string | null;
  signInWithEmail: (email: string) => Promise<{ ok: boolean; message: string }>;
  signOut: () => Promise<void>;
  syncNow: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const supabase = useMemo(() => createSupabaseBrowserClient(), []);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [syncMessage, setSyncMessage] = useState<string | null>(null);

  const runCloudSync = useCallback(async (userId: string) => {
    const result = await syncCloudOnLogin(
      userId,
      getLocalCloudSnapshot,
      applyCloudSnapshot,
    );
    setSyncMessage(result.message);
  }, []);

  useEffect(() => {
    if (!supabase) {
      queueMicrotask(() => setLoading(false));
      return;
    }

    registerCloudSyncAuth(async () => {
      const { data } = await supabase.auth.getSession();
      return data.session?.access_token ?? null;
    });

    void supabase.auth
      .getSession()
      .then(({ data }) => {
        setSession(data.session);
        setCloudUserId(data.session?.user?.id ?? null);
        if (data.session?.user) {
          void runCloudSync(data.session.user.id);
        }
      })
      .catch(() => {
        setSyncMessage("인증 서비스 연결에 실패했습니다. 잠시 후 다시 시도해 주세요.");
      })
      .finally(() => {
        setLoading(false);
      });

    let subscription: { unsubscribe: () => void } | null = null;
    try {
      const result = supabase.auth.onAuthStateChange((_event, nextSession) => {
        setSession(nextSession);
        setCloudUserId(nextSession?.user?.id ?? null);
        if (nextSession?.user) {
          void runCloudSync(nextSession.user.id);
        }
      });
      subscription = result.data.subscription;
    } catch {
      queueMicrotask(() => setLoading(false));
    }

    return () => subscription?.unsubscribe();
  }, [supabase, runCloudSync]);

  const signInWithEmail = useCallback(
    async (email: string) => {
      if (!supabase) {
        return {
          ok: false,
          message:
            "클라우드 로그인을 위해 NEXT_PUBLIC_SUPABASE_URL·ANON_KEY를 설정하세요.",
        };
      }

      const trimmed = email.trim();
      if (!trimmed.includes("@")) {
        return { ok: false, message: "올바른 이메일을 입력해 주세요." };
      }

      const redirectTo = `${window.location.origin}/auth/callback?next=/my`;
      const { error } = await supabase.auth.signInWithOtp({
        email: trimmed,
        options: { emailRedirectTo: redirectTo },
      });

      if (error) return { ok: false, message: error.message };
      return {
        ok: true,
        message: "로그인 링크를 이메일로 보냈습니다. 메일함을 확인해 주세요.",
      };
    },
    [supabase],
  );

  const signOut = useCallback(async () => {
    if (supabase) await supabase.auth.signOut();
    setCloudUserId(null);
    setSession(null);
    setSyncMessage(null);
  }, [supabase]);

  const syncNow = useCallback(async () => {
    if (!session?.user) {
      setSyncMessage("로그인 후 동기화할 수 있습니다.");
      return;
    }
    await runCloudSync(session.user.id);
  }, [runCloudSync, session]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user: session?.user ?? null,
      session,
      loading,
      cloudEnabled: isCloudSyncAvailable(),
      syncMessage,
      signInWithEmail,
      signOut,
      syncNow,
    }),
    [
      session,
      loading,
      syncMessage,
      signInWithEmail,
      signOut,
      syncNow,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
