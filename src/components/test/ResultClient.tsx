"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import type { Likert5, TestDefinition } from "@/features/tests/types";
import { computeScore, type ScoreReport, type TestRun } from "@/features/tests/engine";
import { ResultChart } from "@/components/test/ResultChart";
import { ShareButtons } from "@/components/test/ShareButtons";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { ResultFeedback } from "@/components/feedback/ResultFeedback";
import { hasChartData } from "@/lib/chart-data";
import {
  getCategoryBasePath,
  testRunPath,
  testStartPath,
} from "@/lib/test-paths";

type StoredRun = TestRun & { completedAt?: number };

const MIN_LOADING_MS = 750;

function colorToClass(color: string) {
  switch (color) {
    case "emerald":
      return "border-emerald-200 bg-emerald-50";
    case "rose":
      return "border-rose-200 bg-rose-50";
    case "sky":
      return "border-sky-200 bg-sky-50";
    case "amber":
      return "border-amber-200 bg-amber-50";
    default:
      return "border-zinc-200 bg-zinc-50";
  }
}

export function ResultClient({ test }: { test: TestDefinition }) {
  const [phase, setPhase] = useState<"loading" | "empty" | "ready">("loading");
  const [answers, setAnswers] = useState<Record<string, Likert5> | null>(null);
  const [report, setReport] = useState<ScoreReport | null>(null);
  const captureId = `result-card-${test.id}`;

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setPhase("loading");
      const started = Date.now();

      let loaded: Record<string, Likert5> | null = null;
      try {
        const raw = sessionStorage.getItem(`testrun:${test.id}`);
        if (raw) {
          const parsed = JSON.parse(raw) as StoredRun;
          if (
            parsed?.testId === test.id &&
            parsed?.version === test.version
          ) {
            loaded = parsed.answers ?? {};
          }
        }
      } catch {
        // ignore
      }

      const elapsed = Date.now() - started;
      if (elapsed < MIN_LOADING_MS) {
        await new Promise((r) =>
          setTimeout(r, MIN_LOADING_MS - elapsed),
        );
      }

      if (cancelled) return;

      if (!loaded || Object.keys(loaded).length === 0) {
        setPhase("empty");
        return;
      }

      const computed = computeScore(test, {
        testId: test.id,
        version: test.version,
        answers: loaded,
      });

      setAnswers(loaded);
      setReport(computed);
      setPhase("ready");
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [test]);

  if (phase === "loading") {
    return (
      <LoadingSpinner
        message="당신의 결과를 분석하고 있어요"
        subMessage={`${test.title} · 잠시만 기다려 주세요`}
      />
    );
  }

  if (phase === "empty" || !answers || !report) {
    return (
      <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
        <p className="text-sm font-semibold text-zinc-900">
          결과를 불러올 수 없어요.
        </p>
        <p className="mt-2 text-sm text-zinc-600">
          테스트를 먼저 완료한 뒤 결과 페이지로 이동해주세요.
        </p>
        <div className="mt-4">
          <Link
            href={testStartPath(test.category, test.id)}
            className="inline-flex items-center justify-center rounded-xl bg-zinc-900 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-zinc-800"
          >
            다시 시작
          </Link>
        </div>
      </div>
    );
  }

  const result = test.results[report.resultId];
  const displayTitle =
    report.mbtiCode && result?.title
      ? result.title
      : (result?.title ?? report.resultId);

  const showChart = hasChartData(report);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key="result"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="space-y-6"
      >
        <section
          id={captureId}
          className={[
            "rounded-2xl border p-5 shadow-sm",
            colorToClass(result?.color ?? "zinc"),
          ].join(" ")}
        >
          <p className="text-sm font-semibold text-zinc-900">당신의 결과</p>
          {report.mbtiCode ? (
            <p className="mt-1 text-3xl font-bold tracking-tight text-zinc-900">
              {report.mbtiCode}
            </p>
          ) : null}
          <h2 className="mt-1 text-2xl font-semibold tracking-tight text-zinc-900">
            {displayTitle}
          </h2>
          <p className="mt-2 text-sm leading-6 text-zinc-700">
            {result?.summary ?? ""}
          </p>
          {result?.details?.length ? (
            <ul className="mt-4 space-y-1 text-sm text-zinc-700">
              {result.details.map((d, i) => (
                <li key={i}>• {d}</li>
              ))}
            </ul>
          ) : null}
        </section>

        {showChart ? (
          <section className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-semibold text-zinc-900">차원별 점수</p>
            <p className="mt-2 text-sm text-zinc-600">
              레이더·막대 차트로 시각화됩니다. 항목을 눌러 수치를 확인하세요.
            </p>
            <div className="mt-4">
              <ResultChart report={report} />
            </div>
          </section>
        ) : null}

        <section className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-semibold text-zinc-900">공유</p>
          <div className="mt-4">
            <ShareButtons
              title={test.title}
              text={`내 결과: ${displayTitle}`}
              captureTargetId={captureId}
            />
          </div>
        </section>

        <ResultFeedback
          contentType="test"
          contentId={test.id}
          resultId={report.resultId}
        />

        <div className="flex flex-col gap-2 sm:flex-row">
          <Link
            href={testRunPath(test.category, test.id)}
            className="inline-flex items-center justify-center rounded-xl bg-zinc-900 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-zinc-800"
          >
            다시 해보기
          </Link>
          <Link
            href={getCategoryBasePath(test.category)}
            className="inline-flex items-center justify-center rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm font-semibold text-zinc-900 shadow-sm transition hover:bg-zinc-50"
          >
            목록으로
          </Link>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
