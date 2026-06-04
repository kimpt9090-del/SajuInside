import Link from "next/link";

import { getTestsByCategory } from "@/features/tests/registry";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { testStartPath } from "@/lib/test-paths";

export const metadata = {
  title: "성격·유형 테스트",
  description: "MBTI, 애착, 기질, 에겐·테토, 복합 리포트",
};

export default function TypesHubPage() {
  const tests = getTestsByCategory("types");

  return (
    <div className="flex flex-1 flex-col">
      <SiteHeader
        title="성격·유형 테스트"
        subtitle="MBTI · 애착 · 기질 · 에겐·테토"
        actionHref="/types/mbti/start"
        actionLabel="MBTI 시작"
      />
      <main className="page-container mx-auto w-full max-w-3xl flex-1 px-5 pb-12">
        <ul className="space-y-3">
          {tests.map((t) => (
            <li key={t.id}>
              <Link
                href={testStartPath("types", t.id)}
                className="card-surface block p-4 transition hover:border-violet-300"
              >
                <p className="font-semibold text-foreground">{t.title}</p>
                <p className="mt-1 text-sm text-muted-foreground">{t.description}</p>
              </Link>
            </li>
          ))}
        </ul>
        <div className="mt-6">
          <Link
            href="/types/composite"
            className="card-surface block border-violet-200 p-4 dark:border-violet-800"
          >
            <p className="font-semibold text-violet-800 dark:text-violet-200">
              MBTI × 애착 복합 리포트
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              두 검사를 완료한 뒤 함께 해석합니다.
            </p>
          </Link>
        </div>
      </main>
    </div>
  );
}
