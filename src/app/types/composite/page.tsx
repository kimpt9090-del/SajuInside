import type { Metadata } from "next";
import { CompositeReportClient } from "./CompositeReportClient";

export const metadata: Metadata = {
  title: "MBTI × 애착 복합 리포트",
  description: "MBTI와 애착 유형 결과를 함께 해석하는 복합 리포트",
};

export default function CompositePage() {
  return (
    <div className="page-container mx-auto max-w-3xl px-5 py-10">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight">복합 리포트</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          MBTI + 애착 유형을 함께 읽는 관계·성장 가이드
        </p>
      </header>
      <div className="mt-8">
        <CompositeReportClient />
      </div>
    </div>
  );
}
