import type { Metadata } from "next";
import { FortuneResultClient } from "./FortuneResultClient";

export const metadata: Metadata = {
  title: "사주 결과 | 테스트/사주/유형",
  description: "입력한 생년월일시 기반 사주 팔자(천간·지지) 결과",
};

export default function FortuneResultPage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-5 py-10">
      <header>
        <p className="text-sm font-medium text-zinc-500">사주/운세</p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight text-zinc-900">
          사주 결과
        </h1>
      </header>
      <div className="mt-6">
        <FortuneResultClient />
      </div>
    </div>
  );
}
