"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

import type { BinaryChoice, Likert5, TestAnswer, TestDefinition } from "@/features/tests/types";
import { testResultPath } from "@/lib/test-paths";
import {
  clearTestProgress,
  loadTestProgress,
  saveTestProgress,
  saveCompletedRun,
} from "@/lib/test-storage";
import { ProgressBar } from "@/components/test/ProgressBar";
import { Likert5Choices } from "@/components/test/Likert5";
import { BinaryChoices } from "@/components/test/BinaryChoices";

const AUTO_ADVANCE_MS = 280;

function clampIndex(i: number, max: number) {
  return Math.min(max, Math.max(0, i));
}

function isBinaryTest(test: TestDefinition): boolean {
  return test.questionFormat === "binary" || test.questions.some((q) => q.binary);
}

export function TestRunner({ test }: { test: TestDefinition }) {
  const router = useRouter();
  const binary = isBinaryTest(test);
  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, TestAnswer>>({});
  const [resumed, setResumed] = useState(false);
  const [ready, setReady] = useState(false);
  const advanceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const saved = loadTestProgress(test.id);
    queueMicrotask(() => {
      if (saved) {
        setAnswers(saved.answers);
        setIdx(clampIndex(saved.currentIndex, test.questions.length - 1));
        setResumed(true);
      }
      setReady(true);
    });
  }, [test.id, test.questions.length]);

  useEffect(() => {
    return () => {
      if (advanceTimer.current) clearTimeout(advanceTimer.current);
    };
  }, []);

  const question = test.questions[idx];
  const answeredCount = useMemo(() => Object.keys(answers).length, [answers]);

  const persist = useCallback(
    (nextAnswers: Record<string, TestAnswer>, nextIdx: number) => {
      const answered = Object.keys(nextAnswers).length;
      if (answered === 0 || answered >= test.questions.length) return;
      saveTestProgress({
        testId: test.id,
        version: test.version,
        category: test.category,
        answers: nextAnswers,
        currentIndex: nextIdx,
        totalQuestions: test.questions.length,
      });
    },
    [test],
  );

  const finish = useCallback(
    (finalAnswers: Record<string, TestAnswer>) => {
      saveCompletedRun(test.id, test.version, finalAnswers);
      clearTestProgress(test.id);
      router.push(testResultPath(test.category, test.id));
    },
    [router, test.category, test.id, test.version],
  );

  const selectLikert = useCallback(
    (qid: string, v: Likert5) => {
      if (advanceTimer.current) clearTimeout(advanceTimer.current);

      const nextAnswers = { ...answers, [qid]: v };
      setAnswers(nextAnswers);

      const isLast = idx === test.questions.length - 1;

      advanceTimer.current = setTimeout(() => {
        if (isLast) {
          finish(nextAnswers);
          return;
        }
        const nextIdx = idx + 1;
        setIdx(nextIdx);
        persist(nextAnswers, nextIdx);
      }, AUTO_ADVANCE_MS);
    },
    [answers, finish, idx, persist, test.questions.length],
  );

  const selectBinary = useCallback(
    (qid: string, v: BinaryChoice) => {
      if (advanceTimer.current) clearTimeout(advanceTimer.current);

      const nextAnswers = { ...answers, [qid]: v };
      setAnswers(nextAnswers);

      const isLast = idx === test.questions.length - 1;

      advanceTimer.current = setTimeout(() => {
        if (isLast) {
          finish(nextAnswers);
          return;
        }
        const nextIdx = idx + 1;
        setIdx(nextIdx);
        persist(nextAnswers, nextIdx);
      }, AUTO_ADVANCE_MS);
    },
    [answers, finish, idx, persist, test.questions.length],
  );

  function goPrev() {
    if (advanceTimer.current) clearTimeout(advanceTimer.current);
    const prev = clampIndex(idx - 1, test.questions.length - 1);
    setIdx(prev);
    persist(answers, prev);
  }

  if (!ready) {
    return (
      <div className="test-runner-shell animate-pulse space-y-4">
        <div className="h-2 rounded-full bg-muted" />
        <div className="card-surface h-48" />
      </div>
    );
  }

  const currentValue = answers[question.id] ?? null;
  const isLast = idx === test.questions.length - 1;
  const minsLeft = Math.max(
    1,
    Math.ceil(((test.questions.length - idx) * (binary ? 12 : 8)) / 60),
  );

  return (
    <div className="test-runner-shell space-y-5">
      {resumed ? (
        <motion.p
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-full border border-violet-300/60 bg-violet-50 px-4 py-2 text-sm text-violet-900 dark:border-violet-800 dark:bg-violet-950/50 dark:text-violet-200"
        >
          저장된 진행 상태를 불러왔어요. 이어서 풀어주세요.
        </motion.p>
      ) : null}

      <ProgressBar value={answeredCount} max={test.questions.length} />

      <div className="test-runner-card card-surface">
        <div className="flex items-baseline justify-between gap-4">
          <p className="text-sm font-semibold text-card-foreground">
            문항 {idx + 1} / {test.questions.length}
          </p>
          <p className="text-xs text-muted-foreground">
            {isLast ? "선택하면 결과로 이동" : "선택하면 다음 문항"} ·{" "}
            {binary ? "A/B 강제선택" : "5점 척도"}
            {!isLast ? (
              <span className="ml-2">· 약 {minsLeft}분 남음</span>
            ) : null}
          </p>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={question.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18 }}
            className="mt-3"
          >
            <p className="text-base font-semibold leading-7 text-card-foreground">
              {question.text}
            </p>
            <div className="mt-4">
              {binary && question.binary ? (
                <BinaryChoices
                  optionA={question.binary.optionA}
                  optionB={question.binary.optionB}
                  value={
                    currentValue === "a" || currentValue === "b"
                      ? currentValue
                      : null
                  }
                  onChange={(v) => selectBinary(question.id, v)}
                />
              ) : (
                <Likert5Choices
                  name={question.id}
                  value={typeof currentValue === "number" ? currentValue : null}
                  onChange={(v) => selectLikert(question.id, v)}
                />
              )}
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="mt-5 flex justify-start">
          <button
            type="button"
            onClick={goPrev}
            disabled={idx === 0}
            className="btn-secondary disabled:opacity-40"
          >
            ← 이전
          </button>
        </div>
      </div>

      <p className="text-xs leading-5 text-muted-foreground">
        진행 상황은 브라우저에 자동 저장됩니다. 본 검사는 자기이해 목적이며
        의료·진단을 대체하지 않습니다.
      </p>
    </div>
  );
}
