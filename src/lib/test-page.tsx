import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  getTest,
  getTestsByCategory,
  TESTS,
} from "@/features/tests/registry";
import type { TestCategory } from "@/features/tests/types";
import { buildTestMetadata } from "@/lib/metadata";
import {
  getCategoryBasePath,
  testRunPath,
} from "@/lib/test-paths";
import { TestRunner } from "@/components/test/TestRunner";
import { ResultClient } from "@/components/test/ResultClient";

type Params = { testId: string };

/** SSG: 등록된 모든 테스트 id를 빌드 시 정적 생성 */
export function generateAllTestStaticParams() {
  return Object.keys(TESTS).map((testId) => ({ testId }));
}

export function generateCategoryTestStaticParams(category: TestCategory) {
  return getTestsByCategory(category).map((t) => ({ testId: t.id }));
}

export async function generateTestMetadata(
  testId: string,
): Promise<Metadata> {
  const test = getTest(testId);
  if (!test) return { title: "테스트를 찾을 수 없음" };
  return buildTestMetadata(test);
}

export function TestStartPage({ params }: { params: Params }) {
  const test = getTest(params.testId);
  if (!test) return notFound();

  return (
    <div className="mx-auto w-full max-w-3xl px-5 py-10">
      <header>
        <p className="text-sm font-medium text-zinc-500">{test.title}</p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight text-zinc-900">
          시작하기
        </h1>
        <p className="mt-2 text-sm leading-6 text-zinc-600">{test.description}</p>
      </header>

      <section className="card-surface mt-6">
        <ul className="space-y-1 text-sm text-muted-foreground">
          <li>• 문항 수: {test.questions.length}개</li>
          <li>• 5점 척도 (매우 그렇다 ~ 매우 아니다)</li>
          <li>• 결과 그래프 · 공유 · 이미지 저장</li>
        </ul>
        <div className="mt-5 flex flex-col gap-2 sm:flex-row">
          <Link
            href={testRunPath(test.category, test.id)}
            className="btn-primary"
          >
            시작하기
          </Link>
          <Link
            href={getCategoryBasePath(test.category)}
            className="btn-secondary"
          >
            목록으로
          </Link>
        </div>
      </section>
    </div>
  );
}

export function TestRunPage({ params }: { params: Params }) {
  const test = getTest(params.testId);
  if (!test) return notFound();

  return (
    <div className="mx-auto w-full max-w-3xl px-5 py-10">
      <header>
        <p className="text-sm font-medium text-zinc-500">{test.title}</p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight text-zinc-900">
          문항에 답해주세요
        </h1>
      </header>
      <div className="mt-6">
        <TestRunner test={test} />
      </div>
    </div>
  );
}

export function TestResultPage({ params }: { params: Params }) {
  const test = getTest(params.testId);
  if (!test) return notFound();

  return (
    <div className="mx-auto w-full max-w-3xl px-5 py-10">
      <header>
        <p className="text-sm font-medium text-zinc-500">{test.title}</p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight text-zinc-900">
          결과
        </h1>
      </header>
      <div className="mt-6">
        <ResultClient test={test} />
      </div>
    </div>
  );
}
