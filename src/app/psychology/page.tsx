import Link from "next/link";
import { getTestsByCategory } from "@/features/tests/registry";
import { testStartPath } from "@/lib/test-paths";

export default function PsychologyIndexPage() {
  const tests = getTestsByCategory("psychology");

  return (
    <div className="mx-auto w-full max-w-5xl px-5 py-10">
      <header>
        <p className="text-sm font-medium text-zinc-500">심리 테스트</p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight text-zinc-900">
          테스트를 선택하세요
        </h1>
        <p className="mt-2 text-sm leading-6 text-zinc-600">
          5점 척도 문항으로 진행되며, 결과 그래프/공유/캡처를 지원합니다.
        </p>
      </header>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {tests.map((t) => (
          <Link
            key={t.id}
            href={testStartPath(t.category, t.id)}
            className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <p className="text-sm font-semibold text-zinc-900">{t.title}</p>
            <p className="mt-2 text-sm text-zinc-600">{t.description}</p>
            <p className="mt-4 text-sm font-semibold text-zinc-900">시작하기 →</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
