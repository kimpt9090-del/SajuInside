export function CrisisBanner({
  variant,
}: {
  variant: "depression" | "psychopath" | "anxiety";
}) {
  const lines =
    variant === "depression"
      ? {
          title: "도움이 필요할 수 있습니다",
          body: "자살·자해 생각이 있다면 혼자 참지 마세요. 전문가·위기 상담에 연락할 수 있습니다.",
        }
      : variant === "anxiety"
        ? {
            title: "불안이 일상에 영향을 줄 수 있습니다",
            body: "지속적인 불안·공황·회피가 있다면 전문가 상담·검진을 권장합니다.",
          }
        : {
            title: "관계·법·윤리에 주의가 필요합니다",
            body: "높은 점수는 진단이 아닙니다. 반복적 문제가 있다면 정신건강·상담 전문가 도움을 권장합니다.",
          };

  return (
    <section className="sticky top-2 z-10 rounded-2xl border-2 border-rose-300 bg-rose-50 p-4 shadow-md dark:border-rose-800 dark:bg-rose-950/60">
      <p className="text-sm font-bold text-rose-900 dark:text-rose-100">
        {lines.title}
      </p>
      <p className="mt-1 text-sm text-rose-800 dark:text-rose-200">{lines.body}</p>
      <ul className="mt-3 space-y-1 text-sm font-medium text-rose-900 dark:text-rose-100">
        <li>• 자살예방 상담: 1393</li>
        <li>• 정신건강 위기상담: 1577-0199</li>
        <li>• 응급: 119</li>
      </ul>
    </section>
  );
}
