import type { Metadata } from "next";
import { AuthPanel } from "@/components/auth/AuthPanel";
import { MyPageClient } from "./MyPageClient";

export const metadata: Metadata = {
  title: "마이페이지",
  description: "로그인·클라우드 동기화, 최근 테스트·운세 결과 기록, 고정, JSON 내보내기/가져오기",
};

export default function MyPage() {
  return (
    <div className="page-container mx-auto max-w-3xl px-5 py-10">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight">마이페이지</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          로그인 시 결과 기록이 클라우드(Supabase)와 동기화됩니다. 로그인 없이도
          이 브라우저에 저장해 사용할 수 있습니다.
        </p>
      </header>
      <div className="mt-8 space-y-8">
        <section id="account" className="card-surface scroll-mt-24 p-5">
          <h2 className="text-lg font-semibold">계정 · 클라우드 동기화</h2>
          <div className="mt-4">
            <AuthPanel />
          </div>
        </section>
        <MyPageClient />
      </div>
    </div>
  );
}
