"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { calculateCompatibility } from "@/features/fortune/compatibility";
import type { CompatibilityInput, CompatibilityResult } from "@/features/fortune/types";
import { buildCompatQuickSummary } from "@/features/fortune/content/fortune-quick-summary";
import { SajuPillars } from "@/components/fortune/SajuPillars";
import { DetailedReportSections } from "@/components/report/DetailedReportSections";
import { ShareButtons } from "@/components/test/ShareButtons";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { QuickSummaryBox } from "@/components/ui/QuickSummaryBox";
import {
  notifyHistoryChange,
  saveResultHistory,
} from "@/lib/result-history";
import {
  buildCompatSharePayload,
  buildShareUrl,
  compactToBirth,
  decodeSharePayload,
  encodeSharePayload,
  getShareParamFromUrl,
  type CompatSharePayload,
} from "@/lib/share-url";

const MIN_LOADING_MS = 750;

export function CompatibilityResultClient() {
  const [phase, setPhase] = useState<"loading" | "empty" | "ready">("loading");
  const [result, setResult] = useState<CompatibilityResult | null>(null);
  const captureId = "compat-result-card";

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setPhase("loading");
      const started = Date.now();

      let computed: CompatibilityResult | null = null;
      try {
        let input: CompatibilityInput | null = null;
        const shareRaw = getShareParamFromUrl();
        if (shareRaw) {
          const payload = decodeSharePayload<CompatSharePayload>(shareRaw);
          if (payload?.kind === "compat") {
            input = {
              male: compactToBirth(payload.m),
              female: compactToBirth(payload.f),
            };
          }
        }
        if (!input) {
          const raw = sessionStorage.getItem("fortune:compatibility");
          if (raw) input = JSON.parse(raw) as CompatibilityInput;
        }
        if (input) computed = calculateCompatibility(input);
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

      const payload = buildCompatSharePayload({
        male: computed.male.input,
        female: computed.female.input,
      });
      const href = buildShareUrl("/fortune/compatibility/result", payload);
      saveResultHistory({
        id: "compat",
        kind: "compat",
        title: "사주 궁합",
        subtitle: `${computed.score}점 · ${computed.grade}`,
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
      "/fortune/compatibility/result",
      buildCompatSharePayload({
        male: result.male.input,
        female: result.female.input,
      }),
    );
  }, [result]);

  const quickSummary = useMemo(
    () => (result ? buildCompatQuickSummary(result) : null),
    [result],
  );

  if (phase === "loading") {
    return (
      <LoadingSpinner
        message="궁합을 분석하고 있어요"
        subMessage="남녀 사주·오행·지지 관계를 확인하는 중입니다"
      />
    );
  }

  if (phase === "empty" || !result) {
    return (
      <div className="card-surface">
        <p className="font-semibold">궁합 정보를 불러올 수 없어요.</p>
        <Link href="/fortune/compatibility" className="btn-primary mt-4 inline-flex">
          입력하러 가기
        </Link>
      </div>
    );
  }

  const { male, female, score, grade, report } = result;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        {quickSummary ? <QuickSummaryBox summary={quickSummary} /> : null}

        <section
          id={captureId}
          className="rounded-2xl border border-rose-200 bg-gradient-to-b from-rose-50 to-white p-5 shadow-sm dark:border-rose-800 dark:from-rose-950/40 dark:to-zinc-900"
        >
          <p className="text-sm font-semibold text-rose-900 dark:text-rose-200">사주 궁합</p>
          <h1 className="mt-2 text-2xl font-bold">
            {score}점 · {grade}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">{result.summary}</p>

          <div className="mt-6 space-y-6">
            <div>
              <p className="mb-2 text-sm font-semibold">남자 사주</p>
              <SajuPillars result={male} />
            </div>
            <div>
              <p className="mb-2 text-sm font-semibold">여자 사주</p>
              <SajuPillars result={female} />
            </div>
          </div>
        </section>

        {report.sections.length ? (
          <section className="card-surface">
            <h2 className="text-lg font-semibold">상세 궁합 풀이</h2>
            <div className="mt-5">
              <DetailedReportSections sections={report.sections} defaultOpenCount={2} />
            </div>
          </section>
        ) : null}

        <section className="card-surface">
          <ShareButtons
            title="사주 궁합 결과"
            text={`궁합 ${score}점 (${grade}) — ${result.summary}`}
            captureTargetId={captureId}
            shareUrl={shareUrl}
          />
        </section>

        <div className="flex flex-wrap gap-2">
          <Link href="/fortune/compatibility" className="btn-primary inline-flex">
            다시 입력
          </Link>
          <Link href="/fortune" className="btn-secondary inline-flex">
            사주 보기
          </Link>
          <Link href="/types/mbti/start" className="btn-secondary inline-flex">
            MBTI 궁합
          </Link>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
