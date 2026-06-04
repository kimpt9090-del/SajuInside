"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import type { TestAnswer, TestDefinition } from "@/features/tests/types";
import { computeScore, type ScoreReport, type TestRun } from "@/features/tests/engine";
import { ResultChartSlot } from "@/components/test/ResultChartSlot";
import { ShareButtons } from "@/components/test/ShareButtons";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { ResultFeedback } from "@/components/feedback/ResultFeedback";
import { DetailedReportSections } from "@/components/report/DetailedReportSections";
import { AxisSummary } from "@/components/test/AxisSummary";
import { MbtiCompatibilityMatrix } from "@/components/test/MbtiCompatibilityMatrix";
import { MbtiSimilarTypes } from "@/components/test/MbtiSimilarTypes";
import { DimensionSummary } from "@/components/test/DimensionSummary";
import { PsychopathSubscales } from "@/components/test/PsychopathSubscales";
import { CrisisBanner } from "@/components/test/CrisisBanner";
import { RelatedTests } from "@/components/test/RelatedTests";
import { QuickSummaryBox } from "@/components/ui/QuickSummaryBox";
import { hasChartData } from "@/lib/chart-data";
import {
  buildShareUrl,
  buildTestSharePayload,
  decodeSharePayload,
  encodeSharePayload,
  getShareParamFromUrl,
  type TestSharePayload,
} from "@/lib/share-url";
import {
  notifyHistoryChange,
  saveResultHistory,
} from "@/lib/result-history";
import { testResultPath, testRunPath, testStartPath } from "@/lib/test-paths";

type StoredRun = TestRun & { completedAt?: number };

const MIN_LOADING_MS = 750;

const CRISIS_TESTS: Record<string, { ids: string[]; variant: "depression" | "psychopath" | "anxiety" }> = {
  depression: { ids: ["moderate", "severe"], variant: "depression" },
  psychopath: { ids: ["elevated", "high"], variant: "psychopath" },
  anxiety: { ids: ["moderate", "severe"], variant: "anxiety" },
};

function colorToClass(color: string) {
  switch (color) {
    case "emerald":
      return "border-emerald-200 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-950/40";
    case "rose":
      return "border-rose-200 bg-rose-50 dark:border-rose-800 dark:bg-rose-950/40";
    case "sky":
      return "border-sky-200 bg-sky-50 dark:border-sky-800 dark:bg-sky-950/40";
    case "amber":
      return "border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/40";
    default:
      return "border-zinc-200 bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900";
  }
}

export function ResultClient({ test }: { test: TestDefinition }) {
  const [phase, setPhase] = useState<"loading" | "empty" | "ready">("loading");
  const [answers, setAnswers] = useState<Record<string, TestAnswer> | null>(null);
  const [report, setReport] = useState<ScoreReport | null>(null);
  const captureId = `result-card-${test.id}`;

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setPhase("loading");
      const started = Date.now();

      let loaded: Record<string, TestAnswer> | null = null;

      try {
        const shareRaw = getShareParamFromUrl();
        if (shareRaw) {
          const payload = decodeSharePayload<TestSharePayload>(shareRaw);
          if (
            payload?.kind === "test" &&
            payload.id === test.id &&
            payload.v === test.version
          ) {
            loaded = payload.a;
          }
        }

        if (!loaded) {
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
        }
      } catch {
        // ignore
      }

      const elapsed = Date.now() - started;
      if (elapsed < MIN_LOADING_MS) {
        await new Promise((r) => setTimeout(r, MIN_LOADING_MS - elapsed));
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

      const resultBucket = test.results[computed.resultId];
      const payload = buildTestSharePayload(test.id, test.version, loaded);
      const href = buildShareUrl(
        testResultPath(test.category, test.id),
        payload,
      );
      saveResultHistory({
        id: test.id,
        kind: "test",
        title: test.title,
        subtitle: resultBucket?.title ?? computed.resultId,
        href,
        sharePayload: encodeSharePayload(payload),
      });
      notifyHistoryChange();

      setAnswers(loaded);
      setReport(computed);
      setPhase("ready");
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [test]);

  const shareUrl = useMemo(() => {
    if (!answers) return undefined;
    return buildShareUrl(
      testResultPath(test.category, test.id),
      buildTestSharePayload(test.id, test.version, answers),
    );
  }, [answers, test]);

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
      <div className="card-surface">
        <p className="text-sm font-semibold">결과를 불러올 수 없어요.</p>
        <p className="mt-2 text-sm text-muted-foreground">
          테스트를 완료하거나, 공유받은 링크가 올바른지 확인해 주세요.
        </p>
        <div className="mt-4">
          <Link href={testStartPath(test.category, test.id)} className="btn-primary inline-flex">
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
  const crisis = CRISIS_TESTS[test.id];
  const showCrisis = crisis?.ids.includes(report.resultId);

  const clinicalScore =
    test.scoring.strategy === "sum" &&
    (test.scoring.sumMode === "phq" || test.scoring.sumMode === "gad")
      ? {
          label: test.scoring.sumMode === "phq" ? "PHQ-9 합산" : "GAD-7 합산",
          score: report.rawSum,
          max: report.maxSum,
        }
      : null;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key="result"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="space-y-6"
      >
        {showCrisis && crisis ? (
          <CrisisBanner variant={crisis.variant} />
        ) : null}

        <section
          id={captureId}
          className={[
            "rounded-2xl border p-5 shadow-sm",
            colorToClass(result?.color ?? "zinc"),
          ].join(" ")}
        >
          <p className="text-sm font-semibold">당신의 결과</p>
          {clinicalScore ? (
            <p className="mt-2 text-sm font-medium opacity-90">
              {clinicalScore.label}: {clinicalScore.score} / {clinicalScore.max}점
            </p>
          ) : null}
          {report.mbtiCode ? (
            <p className="mt-1 text-3xl font-bold tracking-tight">{report.mbtiCode}</p>
          ) : null}
          {report.mbtiCode && report.byAxis?.length ? (
            <AxisSummary axes={report.byAxis} />
          ) : null}
          {report.byDimension?.length ? (
            <DimensionSummary
              dimensions={report.byDimension}
              primaryId={report.resultId}
            />
          ) : null}
          <h2 className="mt-3 text-2xl font-semibold tracking-tight">{displayTitle}</h2>
          <p className="mt-2 text-sm leading-6 opacity-90">{result?.summary ?? ""}</p>
          {result?.details?.length ? (
            <ul className="mt-4 space-y-1 text-sm opacity-90">
              {result.details.map((d, i) => (
                <li key={i}>• {d}</li>
              ))}
            </ul>
          ) : null}
        </section>

        {result?.quickSummary ? (
          <QuickSummaryBox summary={result.quickSummary} />
        ) : null}

        {test.id === "psychopath" ? (
          <PsychopathSubscales questions={test.questions} answers={answers} />
        ) : null}

        {report.mbtiCode ? (
          <MbtiSimilarTypes code={report.mbtiCode} axes={report.byAxis} />
        ) : null}

        {result?.sections?.length ? (
          <section className="card-surface">
            <h2 className="text-lg font-semibold">상세 분석 리포트</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {result.sections.length}개 섹션 · 성격·직업·연애·스트레스·FAQ
            </p>
            <div className="mt-5">
              <DetailedReportSections sections={result.sections} />
            </div>
          </section>
        ) : null}

        {showChart ? (
          <section className="card-surface">
            <p className="text-sm font-semibold">차원별 점수</p>
            <div className="mt-4">
              <ResultChartSlot report={report} />
            </div>
          </section>
        ) : null}

        {report.mbtiCode ? (
          <section className="card-surface">
            <h2 className="text-lg font-semibold">MBTI 16×16 궁합 매트릭스</h2>
            <div className="mt-5">
              <MbtiCompatibilityMatrix myType={report.mbtiCode} />
            </div>
          </section>
        ) : null}

        <RelatedTests testId={test.id} />

        <section className="card-surface">
          <p className="text-sm font-semibold">공유</p>
          <div className="mt-4">
            <ShareButtons
              title={test.title}
              text={`내 결과: ${displayTitle}`}
              captureTargetId={captureId}
              shareUrl={shareUrl}
            />
          </div>
        </section>

        <ResultFeedback
          contentType="test"
          contentId={test.id}
          resultId={report.resultId}
        />

        <div className="flex flex-col gap-2 sm:flex-row">
          <Link href={testRunPath(test.category, test.id)} className="btn-primary inline-flex justify-center">
            다시 해보기
          </Link>
          <Link href="/" className="btn-secondary inline-flex justify-center">
            홈으로
          </Link>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
