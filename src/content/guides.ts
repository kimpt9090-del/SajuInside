export type GuideArticle = {
  slug: string;
  title: string;
  description: string;
  readMinutes: number;
  sections: Array<{
    title: string;
    paragraphs?: string[];
    bullets?: string[];
  }>;
};

export const GUIDES: GuideArticle[] = [
  {
    slug: "mbti-basics",
    title: "MBTI 4축 기초 가이드",
    description: "E/I·S/N·T/F·J/P 네 가지 축을 쉽게 이해하는 입문 가이드",
    readMinutes: 5,
    sections: [
      {
        title: "MBTI란?",
        paragraphs: [
          "MBTI는 성격 선호를 네 가지 축으로 설명하는 자기이해 도구입니다. 본 사이트의 검사는 공식 MBTI® 인증과 무관한 참고용입니다.",
          "유형은 '틀린/맞는'이 아니라, 에너지·정보·결정·생활 스타일의 선호 차이를 설명합니다.",
        ],
      },
      {
        title: "4가지 축",
        bullets: [
          "E/I — 사람·활동 vs 혼자·조용함에서 에너지 충전",
          "S/N — 사실·경험 vs 가능성·패턴",
          "T/F — 논리·공정 vs 조화·감정",
          "J/P — 계획·마무리 vs 유연·개방",
        ],
      },
      {
        title: "검사 선택 팁",
        paragraphs: [
          "24문항 간단 검사: 빠른 유형 확인",
          "93문항 정밀·공식형: Form M에 가까운 정밀도",
          "결과는 16×16 궁합 매트릭스와 함께 확인해 보세요.",
        ],
      },
    ],
  },
  {
    slug: "attachment-types",
    title: "애착 유형 3가지",
    description: "안정·불안·회피 애착과 연애·결혼에서의 패턴",
    readMinutes: 6,
    sections: [
      {
        title: "애착이란?",
        paragraphs: [
          "애착 이론은 어린 시절부터 형성된 '관계에서의 안전감' 패턴을 설명합니다. 성인 연애·결혼·직장 관계에도 영향을 줍니다.",
        ],
      },
      {
        title: "3가지 유형",
        bullets: [
          "안정형 — 친밀과 독립의 균형, 갈등 회복력",
          "불안형 — 확신·연락·표현 욕구, 버림받을까 걱정",
          "회피형 — 친밀 부담, 거리·독립 중시",
        ],
      },
      {
        title: "MBTI와 함께 보기",
        paragraphs: [
          "MBTI는 '어떻게 생각·행동하는지', 애착은 '관계에서 무엇이 불안한지'를 설명합니다.",
          "복합 리포트(/types/composite)에서 두 결과를 함께 해석할 수 있습니다.",
        ],
      },
    ],
  },
  {
    slug: "saju-intro",
    title: "사주·만세력 입문",
    description: "생년월일시와 사주 팔자, 오행의 기본 개념",
    readMinutes: 7,
    sections: [
      {
        title: "사주란?",
        paragraphs: [
          "사주(四柱)는 태어난 연·월·일·시의 네 기둥(四柱)으로 운명·성향·운의 흐름을 해석하는 동양 전통입니다.",
          "본 서비스는 참고·오락 목적이며, 과학적 예측이 아닙니다.",
        ],
      },
      {
        title: "오행",
        bullets: [
          "木·火·土·金·水 — 서로 생(生)·극(剋) 관계",
          "부족·과다 오행은 성격·건강·직업 해석에 활용",
        ],
      },
      {
        title: "만세력·기간 운세",
        paragraphs: [
          "만세력 페이지에서 천간·지지 한자와 오늘/주/월 운세를 확인할 수 있습니다.",
          "궁합은 남·여 사주를 함께 입력해 관계 점수와 조언을 받을 수 있습니다.",
        ],
      },
    ],
  },
  {
    slug: "mental-health-screening",
    title: "자가진단(우울·불안) 안내",
    description: "PHQ-9·GAD-7 기반 검사의 의미와 한계",
    readMinutes: 4,
    sections: [
      {
        title: "자가진단의 의미",
        paragraphs: [
          "우울·불안 자가진단은 증상 스크리닝 도구입니다. 의사의 진단을 대체하지 않습니다.",
          "점수가 높다고 해서 반드시 질병을 의미하지는 않지만, 전문가 상담을 고려할 신호로 볼 수 있습니다.",
        ],
      },
      {
        title: "도움 받기",
        bullets: [
          "정신건강의학과 · 지역 정신건강복지센터",
          "위기상담 1577-0199 · 자살예방 1393 · 응급 119",
        ],
      },
    ],
  },
  {
    slug: "egen-teto-aesthetic",
    title: "에겐·테토 성향이란?",
    description: "섬세·정돈(에겐) vs 대담·자유(테토) 미학·성향 트렌드",
    readMinutes: 4,
    sections: [
      {
        title: "에겐·테토",
        paragraphs: [
          "에겐은 섬세·정돈·조화·깔끔한 미학을, 테토는 대담·자유·임팩트·개성을 중시하는 성향으로 설명됩니다.",
          "MBTI와 별개의 '스타일·라이프스타일' 축으로 이해하면 좋습니다.",
        ],
      },
      {
        title: "활용",
        bullets: [
          "SNS·패션·인테리어·관계 톤 이해",
          "균형형은 상황에 따라 두 성향을 전환",
        ],
      },
    ],
  },
];

export function getGuide(slug: string): GuideArticle | undefined {
  return GUIDES.find((g) => g.slug === slug);
}
