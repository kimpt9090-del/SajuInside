import type { Metadata } from "next";
import Link from "next/link";
import { FortuneClient } from "./FortuneClient";

export const metadata: Metadata = {
  title: "사주/만세력 | 테스트/사주/유형",
  description:
    "생년월일시로 사주 팔자를 계산하고, 성격·오행·직업·재물·연애·건강·2026년 운세까지 상세 풀이를 제공합니다.",
};

export default function FortunePage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-5 py-10">
      <header>
        <p className="text-sm font-medium text-zinc-500">사주/운세</p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight text-zinc-900">
          사주 팔자 보기
        </h1>
        <p className="mt-2 text-sm leading-6 text-zinc-600">
          생년월일시를 입력하면 사주 팔자(년·월·일·시주)와 함께, 일간 기반
          상세 풀이(성격·오행·직업·재물·연애·건강·2026년 운)를 확인할 수
          있습니다.
        </p>
      </header>

      <div className="mt-6">
        <FortuneClient />
      </div>

      <p className="mt-6 text-center">
        <Link href="/" className="text-sm font-semibold text-zinc-600 hover:text-zinc-900">
          ← 홈으로
        </Link>
      </p>
    </div>
  );
}
