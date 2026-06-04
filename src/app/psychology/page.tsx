import Link from "next/link";

import { getTestsByCategory } from "@/features/tests/registry";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { testStartPath } from "@/lib/test-paths";

export const metadata = {
  title: "심리 테스트",
  description: "우울·불안 자가진단, 사이코패스 성향 참고 검사",
};

export default function PsychologyHubPage() {
  const tests = getTestsByCategory("psychology");

  return (
    <div className="flex flex-1 flex-col">
      <SiteHeader
        title="심리 테스트"
        subtitle="자가 선별 · 진단 대체 불가 · 위기 연락처 안내"
        actionHref="/psychology/depression/start"
        actionLabel="우울 자가진단"
      />
      <main className="page-container mx-auto w-full max-w-3xl flex-1 px-5 pb-12">
        <p className="mb-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-100">
          본 검사는 의료 진단이 아닙니다. 증상이 지속되면 전문가 상담을 권장합니다. 위기 시
          1577-0199 · 1393 · 119
        </p>
        <ul className="space-y-3">
          {tests.map((t) => (
            <li key={t.id}>
              <Link
                href={testStartPath("psychology", t.id)}
                className="card-surface block p-4 transition hover:border-rose-300"
              >
                <p className="font-semibold text-foreground">{t.title}</p>
                <p className="mt-1 text-sm text-muted-foreground">{t.description}</p>
              </Link>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}
