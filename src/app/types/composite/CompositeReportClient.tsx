"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

import { DetailedReportSections } from "@/components/report/DetailedReportSections";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { computeScore, type TestRun } from "@/features/tests/engine";
import { buildCompositeSections } from "@/features/tests/reports/composite-report";
import { getTest, isMbtiTestId, MBTI_TEST_IDS } from "@/features/tests/registry";
import { testStartPath } from "@/lib/test-paths";

type StoredRun = TestRun & { completedAt?: number };

function loadRun(testId: string): StoredRun | null {
  try {
    const raw = sessionStorage.getItem(`testrun:${testId}`);
    if (!raw) return null;
    return JSON.parse(raw) as StoredRun;
  } catch {
    return null;
  }
}

export function CompositeReportClient() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    queueMicrotask(() => setReady(true));
  }, []);

  const data = useMemo(() => {
    if (!ready) return null;

    let mbtiRun: StoredRun | null = null;
    let mbtiTestId: string | null = null;
    for (const id of MBTI_TEST_IDS) {
      const run = loadRun(id);
      if (run) {
        mbtiRun = run;
        mbtiTestId = id;
        break;
      }
    }

    const attRun = loadRun("attachment");
    if (!mbtiRun || !mbtiTestId || !attRun) return { missing: true as const };

    const mbtiTest = getTest(mbtiTestId);
    const attTest = getTest("attachment");
    if (!mbtiTest || !attTest) return { missing: true as const };

    const mbtiReport = computeScore(mbtiTest, mbtiRun);
    const attReport = computeScore(attTest, attRun);
    const attResult = attTest.results[attReport.resultId];

    if (!mbtiReport.mbtiCode || !attResult) return { missing: true as const };

    const attachmentId = attReport.resultId as "secure" | "anxious" | "avoidant";
    const sections = buildCompositeSections({
      mbtiCode: mbtiReport.mbtiCode,
      attachmentId,
    });

    return {
      missing: false as const,
      mbtiCode: mbtiReport.mbtiCode,
      mbtiTestId,
      attachmentTitle: attResult.title,
      sections,
    };
  }, [ready]);

  if (!ready) {
    return (
      <div className="flex justify-center py-16">
        <LoadingSpinner />
      </div>
    );
  }

  if (!data || data.missing) {
    return (
      <div className="card-surface space-y-4 p-6">
        <p className="font-semibold">아직 복합 리포트를 만들 수 없습니다</p>
        <p className="text-sm text-muted-foreground">
          MBTI(간단·정밀·공식형 중 하나)와 애착 유형 테스트를 모두 완료한 뒤
          다시 방문해 주세요. 결과는 같은 브라우저·탭의 sessionStorage에
          있어야 합니다.
        </p>
        <div className="flex flex-wrap gap-2">
          <Link href={testStartPath("types", "mbti")} className="btn-primary text-sm">
            MBTI 시작
          </Link>
          <Link href={testStartPath("types", "attachment")} className="btn-secondary text-sm">
            애착 테스트 시작
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="card-surface p-5">
        <p className="text-sm text-muted-foreground">복합 결과</p>
        <h2 className="mt-1 text-2xl font-bold">
          {data.mbtiCode} × {data.attachmentTitle}
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          MBTI 출처: {isMbtiTestId(data.mbtiTestId) ? getTest(data.mbtiTestId)?.title : data.mbtiTestId}
        </p>
      </div>
      <DetailedReportSections sections={data.sections} />
      <div className="flex flex-wrap gap-2">
        <Link
          href={`/types/${data.mbtiTestId}/result`}
          className="btn-secondary text-sm"
        >
          MBTI 결과 보기
        </Link>
        <Link href="/types/attachment/result" className="btn-secondary text-sm">
          애착 결과 보기
        </Link>
      </div>
    </div>
  );
}
