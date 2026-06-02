import Link from "next/link";
import { getTestsByCategory } from "@/features/tests/registry";
import { testStartPath } from "@/lib/test-paths";

export default function TypesPage() {
  const tests = getTestsByCategory("types");

  return (
    <div className="mx-auto w-full max-w-5xl px-5 py-10">
      <header>
        <p className="text-sm font-medium text-zinc-500">성격 유형</p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight text-zinc-900">
          유형 검사를 선택하세요
        </h1>
        <p className="mt-2 text-sm leading-6 text-zinc-600">
          MBTI 4축(E/I·S/N·T/F·J/P) 가중 채점과 기질 검사를 지원합니다.
        </p>
      </header>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {tests.map((t) => (
          <Link
            key={t.id}
            href={testStartPath(t.category, t.id)}
            className="group rounded-2xl border border-sky-200 bg-gradient-to-b from-sky-50 to-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <p className="text-sm font-semibold text-sky-800">{t.title}</p>
            <p className="mt-2 text-sm leading-6 text-zinc-600">{t.description}</p>
            <p className="mt-4 text-sm font-semibold text-zinc-900">
              시작하기{" "}
              <span className="inline-block transition group-hover:translate-x-0.5">
                →
              </span>
            </p>
          </Link>
        ))}
      </div>

      <div className="mt-8">
        <Link
          href="/"
          className="text-sm font-semibold text-zinc-600 hover:text-zinc-900"
        >
          ← 홈으로
        </Link>
      </div>
    </div>
  );
}
