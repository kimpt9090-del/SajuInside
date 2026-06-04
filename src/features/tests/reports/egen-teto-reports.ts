import type { ReportSection } from "@/lib/report-types";
import { appendEgenTetoExtras } from "./report-extras";
import { getQuickSummarySection } from "./quick-summary";

const SECTIONS: Record<string, ReportSection[]> = {
  egen: [
    {
      id: "style",
      title: "스타일·미학",
      paragraphs: [
        "파스텔·내추럴 톤, 깔끔한 실루엣, 소품의 통일감을 선호합니다. SNS·사진도 톤앤매너를 맞추는 편이에요.",
      ],
    },
    {
      id: "relationship",
      title: "연애·관계",
      paragraphs: [
        "배려·예의·세심한 표현이 강점입니다. 상대의 작은 변화를 잘 알아채지만, 기대가 맞지 않으면 서운함이 쌓일 수 있어요.",
      ],
    },
    {
      id: "work",
      title: "직장·학업",
      paragraphs: [
        "계획·정리·디테일 업무에 강합니다. 마감 전 완성도를 높이려다 시간이 부족해질 수 있으니 80% 완성도도 허용해 보세요.",
      ],
    },
    {
      id: "stress",
      title: "스트레스·성장",
      paragraphs: [
        "지저분함·무질서·무례함에 스트레스를 받기 쉽습니다. '완벽하지 않아도 괜찮다'는 자기 대화가 도움이 됩니다.",
      ],
    },
  ],
  teto: [
    {
      id: "style",
      title: "스타일·미학",
      paragraphs: [
        "강렬한 색·패턴, 개성 있는 스타일, 솔직한 표현을 선호합니다. 트렌드보다 '나다움'을 우선하는 편이에요.",
      ],
    },
    {
      id: "relationship",
      title: "연애·관계",
      paragraphs: [
        "직설·솔직·에너지가 매력 포인트입니다. 상대가 섬세한 배려를 원할 때는 한 템포 늦추고 들어주면 관계가 깊어집니다.",
      ],
    },
    {
      id: "work",
      title: "직장·학업",
      paragraphs: [
        "아이디어·추진·현장 대응에 강합니다. 세부·문서·일정 관리는 캘린더·체크리스트로 보완하면 성과가 안정됩니다.",
      ],
    },
    {
      id: "stress",
      title: "스트레스·성장",
      paragraphs: [
        "답답한 규칙·과도한 형식·억압에 스트레스를 받기 쉽습니다. 중요한 약속만 지키고 나머지는 유연하게 조율해 보세요.",
      ],
    },
  ],
  balanced: [
    {
      id: "style",
      title: "스타일·미학",
      paragraphs: [
        "상황에 따라 섬세함과 대담함을 오갑니다. 데일리는 에겐, 특별한 날은 테토처럼 스타일을 바꿔도 자연스러워요.",
      ],
    },
    {
      id: "relationship",
      title: "연애·관계",
      paragraphs: [
        "배려와 솔직함을 모두 쓸 수 있습니다. 상대 성향에 맞춰 톤을 조절하면 관계 만족도가 높아집니다.",
      ],
    },
    {
      id: "work",
      title: "직장·학업",
      paragraphs: [
        "기획·실행·디테일·아이디어를 골고루 소화합니다. 역할에 따라 강점을 선택적으로 드러내면 팀에서 인정받기 쉽습니다.",
      ],
    },
    {
      id: "growth",
      title: "성장 팁",
      paragraphs: [
        "한쪽 성향으로 치우칠 때(번아웃·충동) 반대 성향의 루틴 하나만 추가해 보세요. 균형형은 조율 능력이 가장 큰 자산입니다.",
      ],
    },
  ],
};

export function getEgenTetoReportSections(
  resultId: "egen" | "teto" | "balanced",
): ReportSection[] {
  const base = SECTIONS[resultId] ?? [];
  const quick = getQuickSummarySection("egen-teto", resultId);
  return appendEgenTetoExtras(resultId, quick ? [quick, ...base] : base);
}
