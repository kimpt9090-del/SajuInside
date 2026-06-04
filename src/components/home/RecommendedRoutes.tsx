import Link from "next/link";

export const RECOMMENDED_ROUTES = [
  {
    id: "quick-3",
    title: "3분 코스",
    time: "약 3분",
    description: "MBTI 간단 검사만 빠르게",
    href: "/types/mbti/start",
    steps: ["MBTI 간단 24문항"],
  },
  {
    id: "deep-10",
    title: "10분 코스",
    time: "약 10분",
    description: "성격 + 관계 패턴까지",
    href: "/types/mbti/start",
    steps: ["MBTI 간단", "→ 애착 유형", "→ 기질 검사"],
    links: [
      { label: "MBTI", href: "/types/mbti/start" },
      { label: "애착", href: "/types/attachment/start" },
      { label: "기질", href: "/types/temperament/start" },
      { label: "복합 리포트", href: "/types/composite" },
    ],
  },
  {
    id: "mind-15",
    title: "마음 건강 코스",
    time: "약 15분",
    description: "우울·불안 자가 점검 + 애착",
    href: "/psychology/depression/start",
    links: [
      { label: "우울", href: "/psychology/depression/start" },
      { label: "불안", href: "/psychology/anxiety/start" },
      { label: "애착", href: "/types/attachment/start" },
    ],
  },
  {
    id: "fortune",
    title: "운세 코스",
    time: "약 15분",
    description: "사주 → 궁합 → 전생",
    href: "/fortune",
    links: [
      { label: "사주", href: "/fortune" },
      { label: "궁합", href: "/fortune/compatibility" },
      { label: "전생", href: "/fortune/past-life" },
    ],
  },
] as const;

export function RecommendedRoutes() {
  return (
    <section className="mb-8">
      <h2 className="text-lg font-semibold text-foreground">추천 코스</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        시간이 없을 때 · 처음 방문할 때 추천 순서입니다.
      </p>
      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {RECOMMENDED_ROUTES.map((route) => (
          <div
            key={route.id}
            className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-700 dark:bg-zinc-900"
          >
            <p className="text-xs font-semibold text-violet-600">{route.time}</p>
            <h3 className="mt-1 font-semibold text-foreground">{route.title}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{route.description}</p>
            {"links" in route && route.links ? (
              <div className="mt-3 flex flex-wrap gap-2">
                {route.links.map((l, i) => (
                  <span key={l.href} className="inline-flex items-center gap-1 text-sm">
                    {i > 0 ? <span className="text-zinc-400">→</span> : null}
                    <Link href={l.href} className="font-medium text-sky-600 hover:underline">
                      {l.label}
                    </Link>
                  </span>
                ))}
              </div>
            ) : (
              <Link href={route.href} className="btn-secondary mt-3 inline-flex text-sm">
                시작
              </Link>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
