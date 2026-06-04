"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { interpretPastLife } from "@/features/fortune/past-life";
import type { BirthInput } from "@/features/fortune/types";
import { buildPastLifeQuickSummary } from "@/features/fortune/content/fortune-quick-summary";
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
  buildPastLifeSharePayload,
  buildShareUrl,
  compactToBirth,
  decodeSharePayload,
  encodeSharePayload,
  getShareParamFromUrl,
  type PastLifeSharePayload,
} from "@/lib/share-url";

export function PastLifeResultClient() {
  const [phase, setPhase] = useState<"loading" | "empty" | "ready">("loading");
  const [data, setData] = useState<ReturnType<typeof interpretPastLife> | null>(
    null,
  );
  const [birth, setBirth] = useState<BirthInput | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      await new Promise((r) => setTimeout(r, 600));
      try {
        let input: BirthInput | null = null;
        const shareRaw = getShareParamFromUrl();
        if (shareRaw) {
          const payload = decodeSharePayload<PastLifeSharePayload>(shareRaw);
          if (payload?.kind === "pastlife") {
            input = compactToBirth(payload.b);
          }
        }
        if (!input) {
          const raw = sessionStorage.getItem("fortune:past-life");
          if (raw) input = JSON.parse(raw) as BirthInput;
        }
        if (input) {
          const result = interpretPastLife(input);
          if (!cancelled) {
            setBirth(input);
            setData(result);
            const payload = buildPastLifeSharePayload(input);
            const href = buildShareUrl("/fortune/past-life/result", payload);
            saveResultHistory({
              id: "pastlife",
              kind: "pastlife",
              title: "전생 테스트",
              subtitle: result.report.headline,
              href,
              sharePayload: encodeSharePayload(payload),
            });
            notifyHistoryChange();
            setPhase("ready");
            return;
          }
        }
      } catch {
        // ignore
      }
      if (!cancelled) setPhase("empty");
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const shareUrl = useMemo(() => {
    if (!birth) return undefined;
    return buildShareUrl(
      "/fortune/past-life/result",
      buildPastLifeSharePayload(birth),
    );
  }, [birth]);

  const quickSummary = useMemo(
    () => (data ? buildPastLifeQuickSummary(data) : null),
    [data],
  );

  if (phase === "loading") {
    return (
      <LoadingSpinner
        message="전생을 읽고 있어요"
        subMessage="일주·카르마·2026 메시지를 풀어보는 중"
      />
    );
  }

  if (phase === "empty" || !data) {
    return (
      <div className="card-surface">
        <p className="font-semibold">전생 정보를 불러올 수 없어요.</p>
        <Link href="/fortune/past-life" className="btn-primary mt-4 inline-flex">
          입력하러 가기
        </Link>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {quickSummary ? <QuickSummaryBox summary={quickSummary} /> : null}

      <section
        id="pastlife-result-card"
        className="rounded-2xl border border-violet-200 bg-gradient-to-b from-violet-50 to-white p-5 shadow-sm dark:border-violet-800 dark:from-violet-950/40 dark:to-zinc-900"
      >
        <p className="text-sm font-semibold text-violet-900 dark:text-violet-200">
          전생 테스트 결과
        </p>
        <h1 className="mt-2 text-2xl font-bold">{data.report.headline}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{data.report.subheadline}</p>
        <p className="mt-4 text-center text-lg font-semibold text-violet-800 dark:text-violet-200">
          {data.summary}
        </p>
        <div className="mt-6">
          <p className="mb-2 text-sm font-semibold">현생 사주 (일주 기준)</p>
          <SajuPillars result={data.saju} />
        </div>
      </section>

      <section className="card-surface">
        <h2 className="text-lg font-semibold">상세 전생 풀이</h2>
        <div className="mt-5">
          <DetailedReportSections
            sections={data.report.sections}
            defaultOpenCount={3}
          />
        </div>
      </section>

      <section className="card-surface">
        <ShareButtons
          title="전생 테스트 결과"
          text={`${data.report.headline} · ${data.summary}`}
          captureTargetId="pastlife-result-card"
          shareUrl={shareUrl}
        />
      </section>

      <div className="flex flex-wrap gap-2">
        <Link href="/fortune/past-life" className="btn-primary inline-flex">
          다시 하기
        </Link>
        <Link href="/fortune" className="btn-secondary inline-flex">
          사주 보기
        </Link>
        <Link href="/" className="btn-secondary inline-flex">
          홈으로
        </Link>
      </div>
    </motion.div>
  );
}
