"use client";

import { useState } from "react";

import { useAuth } from "@/contexts/AuthProvider";

export function AuthPanel({ authError = false }: { authError?: boolean }) {
  const {
    user,
    loading,
    cloudEnabled,
    syncMessage,
    signInWithEmail,
    signOut,
    syncNow,
  } = useAuth();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function handleSignIn(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setMessage(null);
    const result = await signInWithEmail(email);
    setMessage(result.message);
    setBusy(false);
  }

  if (loading) {
    return (
      <p className="text-sm text-muted-foreground" data-testid="auth-loading">
        계정 정보 불러오는 중…
      </p>
    );
  }

  if (user) {
    return (
      <div className="space-y-3" data-testid="auth-signed-in">
        <p className="text-sm text-foreground">
          로그인: <span className="font-medium">{user.email}</span>
        </p>
        <p className="text-sm text-muted-foreground">
          결과 기록·고정·닉네임이 Supabase 클라우드와 동기화됩니다.
        </p>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            className="btn-secondary text-sm"
            onClick={() => void syncNow()}
          >
            지금 동기화
          </button>
          <button
            type="button"
            className="btn-secondary text-sm"
            onClick={() => void signOut()}
          >
            로그아웃
          </button>
        </div>
        {syncMessage ? (
          <p className="text-sm text-violet-700 dark:text-violet-300">{syncMessage}</p>
        ) : null}
      </div>
    );
  }

  return (
    <div className="space-y-3" data-testid="auth-sign-in">
      {authError ? (
        <p
          role="alert"
          className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-900 dark:border-red-900 dark:bg-red-950/40 dark:text-red-100"
          data-testid="auth-error"
        >
          로그인에 실패했습니다. Supabase 설정·리다이렉트 URL을 확인한 뒤 다시
          시도해 주세요.
        </p>
      ) : null}
      {!cloudEnabled ? (
        <p className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-100">
          클라우드 동기화는 Supabase 설정이 필요합니다. Vercel(또는{" "}
          <code className="text-xs">.env.local</code>)에{" "}
          <code className="text-xs">NEXT_PUBLIC_SUPABASE_URL</code>·
          <code className="text-xs">ANON_KEY</code>를 넣고{" "}
          <strong>Redeploy</strong>한 뒤, Supabase에서{" "}
          <code className="text-xs">schema.sql</code>을 실행하세요.
        </p>
      ) : (
        <p className="text-sm text-muted-foreground">
          이메일 매직 링크로 로그인하면 다른 기기에서도 결과 기록을 불러올 수
          있습니다.
        </p>
      )}
      <form onSubmit={handleSignIn} className="flex flex-wrap gap-2">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className="min-w-[220px] flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm"
          data-testid="auth-email"
          disabled={!cloudEnabled || busy}
        />
        <button
          type="submit"
          className="btn-primary text-sm"
          disabled={!cloudEnabled || busy}
          data-testid="auth-submit"
        >
          매직 링크 받기
        </button>
      </form>
      {message ? (
        <p className="text-sm text-violet-700 dark:text-violet-300">{message}</p>
      ) : null}
    </div>
  );
}
