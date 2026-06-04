import type { QuickSummary } from "@/features/tests/reports/quick-summary";
import type { CompatibilityResult, SajuResult } from "@/features/fortune/types";
import type { interpretPastLife } from "@/features/fortune/past-life";

type PastLifeData = ReturnType<typeof interpretPastLife>;

export function buildSajuQuickSummary(result: SajuResult): QuickSummary {
  const headline = result.report?.headline ?? result.summary;
  const keywords = result.report?.keywords?.slice(0, 3).join(" · ") ?? "";
  const highlight =
    result.report?.sections?.find((s) => s.highlight)?.highlight ??
    result.summary;

  return {
    oneLiner: headline,
    bullets: [
      keywords || "년·월·일·시 네 기둥으로 성격·운의 흐름을 봅니다.",
      highlight,
      "아래 만세력 표에서 한자 뜻을 한글로 확인하세요.",
      "2026년 운세·오행·연애·재물은 상세 풀이에서 펼쳐 읽을 수 있습니다.",
    ].slice(0, 4),
    actionTip:
      "오늘 일진과 맞는 색·방향을 참고해, 중요한 결정은 서두르지 말고 하루 밤 숙성해 보세요.",
  };
}

export function buildCompatQuickSummary(
  result: CompatibilityResult,
): QuickSummary {
  const tips =
    result.report.sections
      .find((s) => s.id === "advice" || s.id === "relationship")
      ?.bullets?.slice(0, 2) ?? [];

  return {
    oneLiner: `궁합 ${result.score}점 · ${result.grade}`,
    bullets: [
      result.summary,
      ...tips,
      "남녀 사주 오행·지지 조합으로 연애·결혼·가정 조언을 드립니다.",
    ].slice(0, 4),
    actionTip:
      "갈등이 생기면 '누가 맞다'보다 '우리 사주에서 어디가 부딪히는지'부터 이야기해 보세요.",
  };
}

export function buildPastLifeQuickSummary(data: PastLifeData): QuickSummary {
  const karma =
    data.report.sections
      .find((s) => s.id === "karma" || s.title.includes("카르마"))
      ?.bullets?.[0] ?? "전생의 업과 현생의 과제를 함께 봅니다.";

  return {
    oneLiner: data.report.headline,
    bullets: [
      data.summary,
      data.report.subheadline ?? "",
      karma,
      "2026년 메시지는 상세 풀이 마지막 섹션을 확인하세요.",
    ].filter(Boolean).slice(0, 4),
    actionTip:
      "전생은 '운명 고정'이 아니라 참고용입니다. 현생에서 고치고 싶은 습관 하나를 오늘부터 바꿔 보세요.",
  };
}
