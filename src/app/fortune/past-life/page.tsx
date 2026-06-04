import type { Metadata } from "next";
import Link from "next/link";
import { PastLifeClient } from "./PastLifeClient";

export const metadata: Metadata = {
  title: "전생 테스트 | 테스트/사주/유형",
  description: "생년월일로 보는 전생 직업·성격·카르마·2026년 메시지",
};

export default function PastLifePage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-5 py-10">
      <header>
        <p className="text-sm font-medium text-zinc-500">운세 · 전생</p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight text-zinc-900">
          전생 테스트
        </h1>
        <p className="mt-2 text-sm leading-6 text-zinc-600">
          생년월일시를 입력하면 일주(日柱)를 바탕으로 전생의 역할·성격·카르마·
          2026년 메시지를 상세히 풀어드립니다.
        </p>
      </header>

      <nav className="mt-4">
        <Link href="/" className="text-sm font-semibold text-zinc-600 hover:text-zinc-900">
          ← 홈으로
        </Link>
      </nav>

      <div className="mt-6">
        <PastLifeClient />
      </div>
    </div>
  );
}
