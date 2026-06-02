"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

import type { Likert5, TestDefinition } from "@/features/tests/types";
import { testResultPath } from "@/lib/test-paths";
import {
  loadTestProgress,
  saveTestProgress,
  saveCompletedRun,
} from "@/lib/test-storage";
import { ProgressBar } from "@/components/test/ProgressBar";
import { Likert5Choices } from "@/components/test/Likert5";

function clampIndex(i: number, max: number) {
  return Math.min(max, Math.max(0, i));
}

export function TestRunner({ test }: { test: TestDefinition }) {
  const router = useRouter();
  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, Likert5>>({});
  const [resumed, setResumed] = useState(false);
  const [ready, setReady] = useState(false);

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

  const question = test.questions[idx];
  const answeredCount = useMemo(() => Object.keys(answers).length, [answers]);

  const persist = useCallback(
    (nextAnswers: Record<string, Likert5>, nextIdx: number) => {
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

  function setAnswer(qid: string, v: Likert5) {
    setAnswers((prev) => {
      const next = { ...prev, [qid]: v };
      persist(next, idx);
      return next;
    });
  }

  function goNext() {
    const next = clampIndex(idx + 1, test.questions.length - 1);
    setIdx(next);
    persist(answers, next);
  }

  function goPrev() {
    const prev = clampIndex(idx - 1, test.questions.length - 1);
    setIdx(prev);
    persist(answers, prev);
  }

  function finish() {
    saveCompletedRun(test.id, test.version, answers);
    router.push(testResultPath(test.category, test.id));
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
  const canNext = currentValue !== null;

  return (
    <div className="test-runner-shell space-y-5">
      {resumed ? (
        <motion.p
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl border border-violet-300/60 bg-violet-50 px-4 py-2 text-sm text-violet-900 dark:border-violet-800 dark:bg-violet-950/50 dark:text-violet-200"
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
              <Likert5Choices
                name={question.id}
                value={currentValue}
                onChange={(v) => setAnswer(question.id, v)}
              />
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:justify-between">
          <button
            type="button"
            onClick={goPrev}
            disabled={idx === 0}
            className="btn-secondary disabled:opacity-40"
          >
            이전
          </button>
          {!isLast ? (
            <button
              type="button"
              onClick={goNext}
              disabled={!canNext}
              className="btn-primary disabled:opacity-40"
            >
              다음
            </button>
          ) : (
            <button
              type="button"
              onClick={finish}
              disabled={!canNext}
              className="btn-primary disabled:opacity-40"
            >
              결과 보기
            </button>
          )}
        </div>
      </div>

      <p className="text-xs leading-5 text-muted-foreground">
        진행 상황은 브라우저에 자동 저장됩니다. 본 검사는 자기이해 목적이며
        의료·진단을 대체하지 않습니다.
      </p>
    </div>
  );
}
