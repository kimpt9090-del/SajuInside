import Link from "next/link";

const RELATED: Record<string, { label: string; href: string }[]> = {
  mbti: [
    { label: "MBTI 정밀 검사", href: "/types/mbti-full/start" },
    { label: "MBTI A/B 공식형", href: "/types/mbti-official/start" },
    { label: "애착 유형", href: "/types/attachment/start" },
    { label: "복합 리포트", href: "/types/composite" },
    { label: "사주 궁합", href: "/fortune/compatibility" },
  ],
  "mbti-full": [
    { label: "MBTI 간단", href: "/types/mbti/start" },
    { label: "MBTI A/B 공식형", href: "/types/mbti-official/start" },
    { label: "애착 유형", href: "/types/attachment/start" },
    { label: "복합 리포트", href: "/types/composite" },
    { label: "기질 검사", href: "/types/temperament/start" },
  ],
  "mbti-official": [
    { label: "MBTI 간단", href: "/types/mbti/start" },
    { label: "MBTI 정밀", href: "/types/mbti-full/start" },
    { label: "복합 리포트", href: "/types/composite" },
    { label: "애착 유형", href: "/types/attachment/start" },
  ],
  "egen-teto": [
    { label: "MBTI", href: "/types/mbti/start" },
    { label: "기질 검사", href: "/types/temperament/start" },
    { label: "애착 유형", href: "/types/attachment/start" },
  ],
  attachment: [
    { label: "MBTI", href: "/types/mbti/start" },
    { label: "복합 리포트", href: "/types/composite" },
    { label: "기질 검사", href: "/types/temperament/start" },
    { label: "사주 궁합", href: "/fortune/compatibility" },
  ],
  temperament: [
    { label: "MBTI", href: "/types/mbti/start" },
    { label: "에겐·테토", href: "/types/egen-teto/start" },
    { label: "애착 유형", href: "/types/attachment/start" },
  ],
  psychopath: [
    { label: "우울 자가진단", href: "/psychology/depression/start" },
    { label: "불안 자가진단", href: "/psychology/anxiety/start" },
    { label: "애착 유형", href: "/types/attachment/start" },
  ],
  depression: [
    { label: "불안 자가진단", href: "/psychology/anxiety/start" },
    { label: "애착 유형", href: "/types/attachment/start" },
    { label: "사주 보기", href: "/fortune" },
  ],
  anxiety: [
    { label: "우울 자가진단", href: "/psychology/depression/start" },
    { label: "애착 유형", href: "/types/attachment/start" },
    { label: "가이드", href: "/guide/mental-health-screening" },
  ],
};

export function RelatedTests({ testId }: { testId: string }) {
  const links = RELATED[testId];
  if (!links?.length) return null;

  return (
    <section className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-700 dark:bg-zinc-900">
      <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
        함께 보면 좋은 테스트
      </h2>
      <div className="mt-3 flex flex-wrap gap-2">
        {links.map((l) => (
          <Link key={l.href} href={l.href} className="btn-secondary text-sm">
            {l.label}
          </Link>
        ))}
      </div>
    </section>
  );
}
