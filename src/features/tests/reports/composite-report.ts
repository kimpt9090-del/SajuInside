import type { ReportSection } from "@/lib/report-types";

type CompositeInput = {
  mbtiCode: string;
  attachmentId: "secure" | "anxious" | "avoidant";
};

const ATTACHMENT_LABEL: Record<string, string> = {
  secure: "안정형",
  anxious: "불안형",
  avoidant: "회피형",
};

/** MBTI × 애착 조합별 핵심 해석 */
const COMBO_HINTS: Partial<Record<string, string>> = {
  "INTJ-anxious": "논리·독립(INTJ)과 관계 불안이 충돌할 수 있습니다. 확인 욕구를 데이터·대화로 전환하고, 상대에게 '불안할 때 이렇게 말할게'라고 미리 합의하세요.",
  "INTJ-avoidant": "거리·효율을 중시하지만, 친밀한 관계에서는 감정 표현 한 문장이 신뢰를 크게 높입니다.",
  "INTJ-secure": "독립·전략과 안정적 애착이 잘 맞습니다. 목표·성장을 함께 설계하는 파트너와 시너지가 큽니다.",
  "ENFP-anxious": "열정·표현(ENFP)과 불안형이 겹치면 연락·확인 욕구가 강해질 수 있습니다. 10분 멈춤·일기·신뢰할 친구와 대화를 습관화하세요.",
  "ENFP-avoidant": "자유·열정과 회피가 공존하면, 가까워질수록 갑자기 거리를 두는 패턴이 생길 수 있습니다. 필요한 거리를 미리 말로 합의하세요.",
  "ISTJ-anxious": "책임·규칙(ISTJ)과 불안이 만나면 '완벽한 관계' 기대가 부담이 됩니다. 작은 불확실성도 허용하는 연습이 도움이 됩니다.",
  "ISTJ-avoidant": "안정·루틴을 좋아하지만 감정 표현은 서툴 수 있습니다. 일정·역할 분담은 강점, 감정 대화는 짧게라도 정기적으로.",
};

function defaultHint(mbti: string, att: string): string {
  return `${mbti}의 대외적 성향과 ${ATTACHMENT_LABEL[att]} 애착 패턴이 함께 작용합니다. MBTI는 에너지·정보·결정·생활 스타일을, 애착은 관계에서의 안전·불안·회피를 설명합니다. 두 결과를 나란히 보면 '왜 특정 상황에서만 다르게 반응하는지' 이해하는 데 도움이 됩니다.`;
}

export function buildCompositeSections(input: CompositeInput): ReportSection[] {
  const key = `${input.mbtiCode}-${input.attachmentId}`;
  const hint = COMBO_HINTS[key] ?? defaultHint(input.mbtiCode, input.attachmentId);

  return [
    {
      id: "overview",
      title: "복합 프로필",
      highlight: `${input.mbtiCode} × ${ATTACHMENT_LABEL[input.attachmentId]}`,
      paragraphs: [
        `MBTI ${input.mbtiCode}는 대인·일·결정 스타일을, 애착 ${ATTACHMENT_LABEL[input.attachmentId]}은 친밀·거리·갈등 패턴을 설명합니다.`,
        hint,
      ],
    },
    {
      id: "love",
      title: "연애·결혼",
      bullets: [
        "MBTI: 갈등·대화·에너지 충전 방식 참고",
        "애착: 연락·확인·거리·회복 패턴 참고",
        "둘 다 다를 때, '성격'이 아니라 '애착 상처·습관'일 수 있음",
      ],
    },
    {
      id: "growth",
      title: "성장 포인트",
      bullets: [
        "MBTI 약점 섹션 + 애착 FAQ를 함께 읽기",
        "트리거(연락 지연·친밀 요구·비판)를 메모하고 대응 규칙 합의",
        "2주 후 두 테스트를 다시 비교해 변화 관찰",
      ],
    },
    {
      id: "links",
      title: "개별 리포트",
      paragraphs: [
        "각 테스트 결과 페이지에서 상세 섹션·궁합·30초 요약을 확인하세요.",
      ],
    },
  ];
}
