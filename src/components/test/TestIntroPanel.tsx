"use client";

import Link from "next/link";
import { TEST_INTROS } from "@/features/tests/content/test-intros";
import type { TestDefinition } from "@/features/tests/types";
import { testRunPath } from "@/lib/test-paths";

export function TestIntroPanel({ test }: { test: TestDefinition }) {
  const meta = TEST_INTROS[test.id];
  const runHref = testRunPath(test.category, test.id);
  const binary = test.questionFormat === "binary";
  const formatLabel = binary ? "A/B 강제선택" : "5점 척도";

  if (!meta) {
    return (
      <section className="card-surface mt-6">
        <ul className="mt-3 space-y-1 text-sm text-muted-foreground">
          <li>• 문항 수: {test.questions.length}개</li>
          <li>• {formatLabel} · 자동 진행 · 중간 저장</li>
        </ul>
        <div className="mt-5 flex flex-col gap-2 sm:flex-row">
          <Link href={runHref} className="btn-primary">
            시작하기
          </Link>
          <Link href="/" className="btn-secondary">
            홈으로
          </Link>
        </div>
      </section>
    );
  }

  return (
    <div className="mt-6 space-y-4">
      <section className="card-surface">
        <div className="flex flex-wrap gap-2">
          <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
            {test.questions.length}문항
          </span>
          <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
            약 {meta.estimatedMinutes}분
          </span>
          <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
            {formatLabel}
          </span>
          <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
            리포트 {meta.reportSectionCount}+섹션
          </span>
        </div>
        <ul className="mt-4 space-y-2">
          {meta.highlights.map((h) => (
            <li key={h} className="flex gap-2 text-sm text-card-foreground">
              <span className="text-primary">✓</span>
              {h}
            </li>
          ))}
        </ul>
      </section>

      <section className="card-surface">
        <h2 className="text-sm font-semibold text-card-foreground">진행 방법</h2>
        <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-6 text-muted-foreground">
          {meta.steps.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ol>
      </section>

      <section className="card-surface">
        <h2 className="text-sm font-semibold text-card-foreground">결과에 포함되는 내용</h2>
        <ul className="mt-3 space-y-1.5">
          {meta.includes.map((i) => (
            <li key={i} className="text-sm text-muted-foreground">
              • {i}
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-2xl border border-border bg-muted/40 px-4 py-3">
        <p className="text-xs leading-5 text-muted-foreground">{meta.disclaimer}</p>
      </section>

      <div className="flex flex-col gap-2 sm:flex-row">
        <Link href={runHref} className="btn-primary">
          테스트 시작하기
        </Link>
        <Link href="/" className="btn-secondary">
          홈으로
        </Link>
      </div>
    </div>
  );
}
