import type { ReportSection } from "@/lib/report-types";
import { appendAnxietyExtras } from "./report-extras";
import { getQuickSummarySection } from "./quick-summary";

const SECTIONS: Record<string, ReportSection[]> = {
  minimal: [
    {
      id: "overview",
      title: "현재 상태",
      paragraphs: [
        "불안 증상이 경미하거나 일시적입니다. 스트레스 관리·수면·운동 습관을 유지하면 예방에 도움이 됩니다.",
      ],
    },
    {
      id: "tips",
      title: "자기 관리",
      paragraphs: [
        "규칙적인 수면, 가벼운 유산소, 카페인 조절, 짧은 호흡 연습(4-7-8)을 추천합니다.",
      ],
    },
  ],
  mild: [
    {
      id: "overview",
      title: "현재 상태",
      paragraphs: [
        "가벼운 불안·걱정이 관찰됩니다. 일상은 유지되나, 스트레스 요인이 늘면 증상이 커질 수 있습니다.",
      ],
    },
    {
      id: "relax",
      title: "이완·호흡",
      paragraphs: [
        "복식호흡, 점진적 근육 이완, 10분 산책, 걱정 시간(15분)을 정해 두는 방법이 도움이 됩니다.",
      ],
    },
    {
      id: "work",
      title: "직장·학업",
      paragraphs: [
        "할 일을 작은 단위로 나누고, 완벽주의 대신 '충분히 좋음' 기준을 세워 보세요.",
      ],
    },
  ],
  moderate: [
    {
      id: "overview",
      title: "현재 상태",
      paragraphs: [
        "중간 수준의 불안이 일상 기능에 영향을 줄 수 있습니다. 전문가 상담·검진을 권장합니다.",
      ],
    },
    {
      id: "help",
      title: "도움 받기",
      paragraphs: [
        "정신건강의학과, 지역 정신건강복지센터, 대학 상담센터 등을 이용할 수 있습니다. 혼자 참지 마세요.",
      ],
    },
    {
      id: "crisis",
      title: "응급 연락",
      paragraphs: [
        "극심한 불안·공황: 위기상담 1577-0199 · 응급 119. 즉시 도움이 필요하면 주변에 알리세요.",
      ],
    },
  ],
  severe: [
    {
      id: "overview",
      title: "현재 상태",
      paragraphs: [
        "심한 불안 증상이 보고되었습니다. 가능한 한 빨리 전문가의 도움을 받으시길 권장합니다.",
      ],
    },
    {
      id: "urgent",
      title: "즉시 조치",
      paragraphs: [
        "가까운 정신건강의학과·응급실·상담센터를 방문하거나, 신뢰하는 사람에게 동행을 요청하세요.",
      ],
    },
    {
      id: "crisis",
      title: "위기 연락처",
      bullets: ["위기상담 1577-0199", "자살예방 1393", "응급 119"],
    },
  ],
};

export function getAnxietyReportSections(
  resultId: "minimal" | "mild" | "moderate" | "severe",
): ReportSection[] {
  const base = SECTIONS[resultId] ?? [];
  const quick = getQuickSummarySection("anxiety", resultId);
  return appendAnxietyExtras(resultId, quick ? [quick, ...base] : base);
}
