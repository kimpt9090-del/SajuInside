"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { calculateSajuWithReport } from "@/features/fortune/calculator";
import type { BirthInput, SajuResult } from "@/features/fortune/types";
import { buildSajuQuickSummary } from "@/features/fortune/content/fortune-quick-summary";
import { SajuPillars, ManseryeokTable } from "@/components/fortune/SajuPillars";
import { DetailedReportSections } from "@/components/report/DetailedReportSections";
import { ShareButtons } from "@/components/test/ShareButtons";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { ResultFeedback } from "@/components/feedback/ResultFeedback";
import { QuickSummaryBox } from "@/components/ui/QuickSummaryBox";
import {
  notifyHistoryChange,
  saveResultHistory,
} from "@/lib/result-history";
import {
  buildSajuSharePayload,
  buildShareUrl,
  compactToBirth,
  decodeSharePayload,
  encodeSharePayload,
  getShareParamFromUrl,
  type SajuSharePayload,
} from "@/lib/share-url";

const MIN_LOADING_MS = 750;

export function FortuneResultClient() {
  const [phase, setPhase] = useState<"loading" | "empty" | "ready">("loading");
  const [result, setResult] = useState<SajuResult | null>(null);
  const captureId = "fortune-result-card";

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setPhase("loading");
      const started = Date.now();

      let computed: SajuResult | null = null;
      try {
        let input: BirthInput | null = null;
        const shareRaw = getShareParamFromUrl();
        if (shareRaw) {
          const payload = decodeSharePayload<SajuSharePayload>(shareRaw);
          if (payload?.kind === "saju") {
            input = compactToBirth(payload.b);
          }
        }
        if (!input) {
          const raw = sessionStorage.getItem("fortune:birth");
          if (raw) input = JSON.parse(raw) as BirthInput;
        }
        if (input) computed = calculateSajuWithReport(input);
      } catch {
        // ignore
      }

      const elapsed = Date.now() - started;
      if (elapsed < MIN_LOADING_MS) {
        await new Promise((r) => setTimeout(r, MIN_LOADING_MS - elapsed));
      }

      if (cancelled) return;

      if (!computed) {
        setPhase("empty");
        return;
      }

      const payload = buildSajuSharePayload(computed.input);
      const href = buildShareUrl("/fortune/result", payload);
      saveResultHistory({
        id: "saju",
        kind: "saju",
        title: "사주 팔자",
        subtitle: computed.report?.headline ?? computed.summary,
        href,
        sharePayload: encodeSharePayload(payload),
      });
      notifyHistoryChange();

      setResult(computed);
      setPhase("ready");
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const shareUrl = useMemo(() => {
    if (!result) return undefined;
    return buildShareUrl(
      "/fortune/result",
      buildSajuSharePayload(result.input),
    );
  }, [result]);

  const quickSummary = useMemo(
    () => (result ? buildSajuQuickSummary(result) : null),
    [result],
  );

  if (phase === "loading") {
    return (
      <LoadingSpinner
        message="사주를 풀고 있어요"
        subMessage="천간·지지와 운세를 분석하는 중입니다"
      />
    );
  }

  if (phase === "empty" || !result) {
    return (
      <div className="card-surface">
        <p className="font-semibold">사주 정보를 불러올 수 없어요.</p>
        <p className="mt-2 text-sm text-muted-foreground">
          생년월일을 입력하거나 공유 링크를 확인해 주세요.
        </p>
        <Link href="/fortune" className="btn-primary mt-4 inline-flex">
          입력하러 가기
        </Link>
      </div>
    );
  }

  const eight =
    `${result.pillars.year.stemHanja}${result.pillars.year.branchHanja}` +
    `${result.pillars.month.stemHanja}${result.pillars.month.branchHanja}` +
    `${result.pillars.day.stemHanja}${result.pillars.day.branchHanja}` +
    `${result.pillars.hour.stemHanja}${result.pillars.hour.branchHanja}`;

  const report = result.report;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key="fortune-result"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        {quickSummary ? <QuickSummaryBox summary={quickSummary} /> : null}

        <section
          id={captureId}
          className="rounded-2xl border border-amber-200 bg-gradient-to-b from-amber-50 to-white p-5 shadow-sm dark:border-amber-800 dark:from-amber-950/40 dark:to-zinc-900"
        >
          <p className="text-sm font-semibold text-amber-900 dark:text-amber-200">
            사주 팔자
          </p>
          <p className="mt-1 text-sm text-muted-foreground">{result.summary}</p>
          {report ? (
            <>
              <h1 className="mt-4 text-xl font-bold sm:text-2xl">{report.headline}</h1>
              {report.subheadline ? (
                <p className="mt-1 text-sm text-muted-foreground">{report.subheadline}</p>
              ) : null}
            </>
          ) : null}
          <p className="mt-4 text-center text-3xl font-bold tracking-widest sm:text-4xl">
            {eight.match(/.{1,2}/g)?.join(" ")}
          </p>
          <div className="mt-6">
            <SajuPillars result={result} />
          </div>
        </section>

        <section className="card-surface">
          <h2 className="text-lg font-semibold">만세력 표</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            천간·지지 한자와 뜻을 한글로 확인하세요.
          </p>
          <div className="mt-4">
            <ManseryeokTable result={result} />
          </div>
        </section>

        {report?.sections?.length ? (
          <section className="card-surface">
            <h2 className="text-lg font-semibold">상세 사주 풀이</h2>
            <div className="mt-5">
              <DetailedReportSections sections={report.sections} defaultOpenCount={2} />
            </div>
          </section>
        ) : (
          <p className="text-xs text-muted-foreground">{result.note}</p>
        )}

        <section className="card-surface">
          <ShareButtons
            title="사주/만세력 결과"
            text={`내 사주: ${eight}${report ? ` · ${report.headline}` : ""}`}
            captureTargetId={captureId}
            shareUrl={shareUrl}
          />
        </section>

        <ResultFeedback contentType="fortune" contentId="saju" resultId={eight} />

        <div className="flex flex-wrap gap-2">
          <Link href="/fortune" className="btn-primary inline-flex">
            다시 입력
          </Link>
          <Link href="/fortune/compatibility" className="btn-secondary inline-flex">
            궁합 보기
          </Link>
          <Link href="/fortune/past-life" className="btn-secondary inline-flex">
            전생 테스트
          </Link>
          <Link href="/" className="btn-secondary inline-flex">
            홈으로
          </Link>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
