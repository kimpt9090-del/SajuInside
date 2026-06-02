"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { calculateSaju } from "@/features/fortune/calculator";
import type { BirthInput, SajuResult } from "@/features/fortune/types";
import { SajuPillars } from "@/components/fortune/SajuPillars";
import { ShareButtons } from "@/components/test/ShareButtons";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { ResultFeedback } from "@/components/feedback/ResultFeedback";

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
        const raw = sessionStorage.getItem("fortune:birth");
        if (raw) {
          const input = JSON.parse(raw) as BirthInput;
          computed = calculateSaju(input);
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

      if (!computed) {
        setPhase("empty");
        return;
      }

      setResult(computed);
      setPhase("ready");
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  if (phase === "loading") {
    return (
      <LoadingSpinner
        message="사주를 풀고 있어요"
        subMessage="천간·지지를 계산하는 중입니다"
      />
    );
  }

  if (phase === "empty" || !result) {
    return (
      <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
        <p className="text-sm font-semibold text-zinc-900">
          사주 정보를 불러올 수 없어요.
        </p>
        <p className="mt-2 text-sm text-zinc-600">
          생년월일시를 먼저 입력해주세요.
        </p>
        <Link
          href="/fortune"
          className="mt-4 inline-flex rounded-xl bg-zinc-900 px-4 py-3 text-sm font-semibold text-white"
        >
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

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key="fortune-result"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <section
          id={captureId}
          className="rounded-2xl border border-amber-200 bg-gradient-to-b from-amber-50 to-white p-5 shadow-sm"
        >
          <p className="text-sm font-semibold text-amber-900">사주 팔자</p>
          <p className="mt-1 text-sm text-zinc-600">{result.summary}</p>
          <p className="mt-4 text-center text-3xl font-bold tracking-widest text-zinc-900 sm:text-4xl">
            {eight.match(/.{1,2}/g)?.join(" ")}
          </p>
          <div className="mt-6">
            <SajuPillars result={result} />
          </div>
          <p className="mt-4 text-xs leading-5 text-zinc-500">{result.note}</p>
        </section>

        <section className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-semibold text-zinc-900">공유</p>
          <div className="mt-4">
            <ShareButtons
              title="사주/만세력 결과"
              text={`내 사주: ${eight}`}
              captureTargetId={captureId}
            />
          </div>
        </section>

        <ResultFeedback
          contentType="fortune"
          contentId="saju"
          resultId={eight}
        />

        <div className="flex gap-2">
          <Link
            href="/fortune"
            className="inline-flex rounded-xl bg-zinc-900 px-4 py-3 text-sm font-semibold text-white"
          >
            다시 입력
          </Link>
          <Link
            href="/"
            className="inline-flex rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm font-semibold text-zinc-900"
          >
            홈으로
          </Link>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
