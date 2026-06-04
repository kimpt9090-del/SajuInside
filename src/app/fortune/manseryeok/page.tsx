import type { Metadata } from "next";
import Link from "next/link";
import { ManseryeokDateSearch } from "@/components/fortune/ManseryeokDateSearch";
import { FortuneClient } from "../FortuneClient";

export const metadata: Metadata = {
  title: "만세력 | 테스트/사주/유형",
  description:
    "천간·지지 한자 해석, 만세력 표, 오늘·주간·월간 운세까지 한 번에 확인",
};

export default function ManseryeokPage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-5 py-10">
      <header>
        <p className="text-sm font-medium text-zinc-500">만세력 · 萬歲曆</p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight text-zinc-900">
          만세력 보기
        </h1>
        <p className="mt-2 text-sm leading-6 text-zinc-600">
          생년월일시를 입력하면 사주 팔자·만세력 표·한자 해석·오늘/이번 주/이번
          달 운세(조심·이성·진로·금전)까지 상세히 확인할 수 있습니다.
        </p>
      </header>

      <nav className="mt-4">
        <Link href="/" className="text-sm font-semibold text-zinc-600 hover:text-zinc-900">
          ← 홈으로
        </Link>
      </nav>

      <div className="mt-6 space-y-6">
        <ManseryeokDateSearch />
        <div>
          <h2 className="mb-3 text-lg font-semibold text-zinc-900">
            내 사주 · 만세력 전체 보기
          </h2>
          <FortuneClient />
        </div>
      </div>
    </div>
  );
}
