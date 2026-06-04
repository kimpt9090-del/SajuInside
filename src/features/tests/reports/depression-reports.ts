import type { ReportSection } from "@/lib/report-types";
import { appendDepressionExtras } from "./report-extras";
import { getQuickSummarySection } from "./quick-summary";

type DepId = "minimal" | "mild" | "moderate" | "severe";

const HELP =
  "우울·자살 생각이 있다면 즉시 전문가에게 연락하세요. 정신건강 위기상담 1577-0199, 자살예방 1393, 응급 119.";

const REPORTS: Record<DepId, ReportSection[]> = {
  minimal: [
    {
      id: "overview",
      title: "종합 해석",
      subtitle: "최소~정상 범위",
      highlight: "현재 우울 증상이 거의 없거나, 일시적 스트레스 수준입니다.",
      paragraphs: [
        "기분·수면·에너지·흥미에서 큰 문제가 보이지 않습니다. 누구나 일시적으로 지치거나 슬플 수 있으며, 휴식·수면·운동·대화로 회복되는 편입니다.",
        "다만 최근 스트레스가 컸다면, 예방 차원에서 수면·루틴·사회적 연결을 유지하는 것이 좋습니다.",
      ],
      tags: ["#우울", "#정상"],
    },
    {
      id: "signs",
      title: "현재 상태",
      bullets: [
        "기분: 대체로 안정적",
        "수면·식욕: 큰 변화 없음",
        "에너지·동기: 일상 수행 가능",
        "흥미: 좋아하던 일에서 즐거움 유지",
      ],
      tags: ["#상태"],
    },
    {
      id: "prevention",
      title: "예방·유지",
      bullets: [
        "규칙 수면(7~8시간), 햇빛·산책",
        "주 2~3회 가벼운 운동",
        "신뢰할 사람과 정기 대화",
        "알코올·과로·고립 과다 주의",
        HELP,
      ],
      tags: ["#예방"],
    },
  ],
  mild: [
    {
      id: "overview",
      title: "종합 해석",
      subtitle: "가벼운 우울",
      highlight: "기분 저하·피로·흥미 감소가 있으나, 일상은 대체로 유지되는 수준입니다.",
      paragraphs: [
        "가끔 우울하거나 무기력하고, 예전만큼 즐겁지 않다고 느낄 수 있습니다. 수면·식욕·집중에 작은 변화가 있을 수 있습니다.",
        "대부분 2~4주 내 생활 습관 개선·스트레스 관리·대화로 호전됩니다. 2주 이상 지속되거나 악화되면 전문가 상담을 고려하세요.",
      ],
      tags: ["#우울", "#가벼움"],
    },
    {
      id: "signs",
      title: "흔한 증상",
      bullets: [
        "아침 기상·하루 시작이 무겁다",
        "취미·모임·연락이 귀찮아짐",
        "자책·걱정이 늘지만 기능은 유지",
        "가벼운 불면·과수면·식욕 변화",
      ],
      tags: ["#증상"],
    },
    {
      id: "selfcare",
      title: "자가 관리",
      bullets: [
        "하루 1가지 작은 성취(샤워·10분 산책·한 끼)",
        "카페인·알코올·SNS 과다 줄이기",
        "감정 일기: 기분 1~10점 기록",
        "2주 후에도 나쁘면 상담·검진",
        HELP,
      ],
      tags: ["#케어"],
    },
    {
      id: "relationship",
      title: "관계·직장",
      paragraphs: [
        "가까운 사람에게 '요즘 좀 지친다'고 말해두면, 혼자 끙끙 앓는 것보다 낫습니다. 직장에서는 무리한 야근·완벽주의를 줄이고, 우선순위를 정하세요.",
      ],
      tags: ["#관계"],
    },
  ],
  moderate: [
    {
      id: "overview",
      title: "종합 해석",
      subtitle: "중간 정도 우울",
      highlight: "일상 기능에 영향이 있을 수 있습니다. 전문가 상담·검진을 권장합니다.",
      paragraphs: [
        "기분 저하·무기력·흥미 상실·수면·식욕·집중 문제가 뚜렷합니다. 일·학업·관계에서 '버티기' 상태일 수 있습니다.",
        "혼자만으로 회복하기 어려울 수 있습니다. 정신건강의학과·심리상담·가족의학과에서 상담·검진을 받는 것이 좋습니다. 약물·심리치료 모두 효과적인 경우가 많습니다.",
      ],
      tags: ["#우울", "#중간"],
    },
    {
      id: "signs",
      title: "흔한 증상",
      bullets: [
        "거의 매일 우울·공허·절망감",
        "일·공부·집안일 시작이 매우 어려움",
        "수면·식욕 뚜렷한 변화",
        "자책·죄책감·무가치감",
        "사회적退避·연락 회피",
      ],
      tags: ["#증상"],
    },
    {
      id: "action",
      title: "권장 조치",
      highlight: "우울은 '게을음'이 아니라 '질환'에 가깝습니다. 도움 받는 것이 용기입니다.",
      bullets: [
        "2주 이내 정신건강의학과·상담 예약",
        "가까운 사람 1명에게 상태 공유",
        "알코올·약물 남용·고립 중단",
        "수면·식사·약 복용(처방 시) 규칙화",
        HELP,
      ],
      tags: ["#조치"],
    },
    {
      id: "work",
      title: "직장·학업",
      paragraphs: [
        "가능하면 업무량 조정·휴가·유연 근무를 요청하세요. 완벽을 내세우기보다 '최소 유지' 목표로 전환. 성과 저하는 우울의 증상일 수 있습니다.",
      ],
      tags: ["#직장"],
    },
  ],
  severe: [
    {
      id: "overview",
      title: "종합 해석",
      subtitle: "심한 우울",
      highlight: "즉시 전문가 도움이 필요할 수 있습니다. 혼자 견디지 마세요.",
      paragraphs: [
        "거의 매일 심한 우울·무기력·절망·무가치감이 있고, 일상 기능(일·씻기·식사·대화)이 크게 저하되었을 가능성이 높습니다. 자살·자해 생각이 있을 수 있습니다.",
        "이 검사 결과만으로 진단할 수는 없으나, 이 수준의 점수는 즉시 전문가(정신건강의학과·응급실·상담전화)에게 연락해야 한다는 강한 신호입니다. 우울증은 치료 가능한 질환입니다.",
      ],
      tags: ["#우울", "#심함"],
    },
    {
      id: "signs",
      title: "위험 신호",
      bullets: [
        "자살·자해 생각·계획·준비",
        "며칠~수주 침대·집에만 있음",
        "극심한 죄책감·무가치감·절망",
        "현실감·집중·기억 심각 저하",
        "알코올·약물·폭식 등으로 numbing",
      ],
      tags: ["#위험"],
    },
    {
      id: "emergency",
      title: "지금 당장",
      highlight: HELP,
      bullets: [
        "혼자 두지 마세요 — 믿을 사람·119·1393·1577-0199",
        "오늘·내일 정신건강의학과·응급실 방문",
        "약·술·위험 물건 접근 차단",
        "자살·자해 약속: '24시간만 버티고 도움'",
        "회복은 가능합니다. 지금은 생존·안전이 최우선",
      ],
      tags: ["#응급"],
    },
    {
      id: "treatment",
      title: "치료·회복",
      paragraphs: [
        "약물치료(항우울제 등)·인지행동치료·대인치료·입원(필요 시) 등 다양한 방법이 있습니다. 한 번의 실패로 포기하지 마세요. 가족·친구의 동행이 도움이 됩니다.",
      ],
      tags: ["#치료"],
    },
  ],
};

export function getDepressionReportSections(id: string): ReportSection[] {
  const base = REPORTS[id as DepId] ?? REPORTS.mild;
  const quick = getQuickSummarySection("depression", id);
  return appendDepressionExtras(id, quick ? [quick, ...base] : base);
}
