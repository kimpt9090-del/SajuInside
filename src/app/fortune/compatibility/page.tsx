import type { Metadata } from "next";
import Link from "next/link";
import { CompatibilityPageClient } from "./CompatibilityPageClient";

export const metadata: Metadata = {
  title: "사주 궁합 | 테스트/사주/유형",
  description: "남자·여자 사주를 입력하면 궁합 점수와 연애·결혼·가정 조언을 확인할 수 있습니다.",
};

export default function CompatibilityPage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-5 py-10">
      <header>
        <p className="text-sm font-medium text-zinc-500">사주/운세</p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight text-zinc-900">
          남녀 사주 궁합
        </h1>
        <p className="mt-2 text-sm leading-6 text-zinc-600">
          남자·여자 생년월일시를 각각 입력하면 일주·오행·지지 관계를 바탕으로
          궁합 점수와 연애·결혼·가정 조언을 확인할 수 있습니다. 한쪽만 입력한 뒤
          파트너 초대 링크를 보낼 수도 있습니다.
        </p>
      </header>

      <nav className="mt-4 flex flex-wrap gap-2">
        <Link href="/fortune" className="btn-secondary text-xs">
          사주 보기
        </Link>
        <Link href="/fortune/compatibility" className="btn-primary text-xs">
          궁합 보기
        </Link>
      </nav>

      <div className="mt-6">
        <CompatibilityPageClient />
      </div>

      <p className="mt-6 text-center">
        <Link href="/" className="text-sm font-semibold text-zinc-600 hover:text-zinc-900">
          ← 홈으로
        </Link>
      </p>
    </div>
  );
}
