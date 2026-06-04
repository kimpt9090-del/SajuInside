export type HomeService = {
  id: string;
  title: string;
  description: string;
  href: string;
  badge?: string;
  accent: "rose" | "amber" | "sky" | "violet" | "emerald" | "zinc";
};

export const HOME_SERVICES: HomeService[] = [
  {
    id: "mbti",
    title: "MBTI 간단 검사",
    description: "24문항 · 약 5분 · 16유형 · 16×16 궁합 매트릭스",
    href: "/types/mbti/start",
    badge: "인기",
    accent: "sky",
  },
  {
    id: "mbti-full",
    title: "MBTI 정밀 검사",
    description: "93문항 · 공식급(Form M) · 16×16 궁합 매트릭스",
    href: "/types/mbti-full/start",
    badge: "정밀",
    accent: "sky",
  },
  {
    id: "mbti-official",
    title: "MBTI 공식형 (A/B)",
    description: "93문항 · 강제선택 Form M · 16×16 궁합",
    href: "/types/mbti-official/start",
    badge: "A/B",
    accent: "sky",
  },
  {
    id: "egen-teto",
    title: "에겐·테토 성향",
    description: "24문항 · 섬세 vs 대담 · 스타일·연애·SNS",
    href: "/types/egen-teto/start",
    badge: "NEW",
    accent: "violet",
  },
  {
    id: "attachment",
    title: "애착 유형 테스트",
    description: "28문항 · 30초 요약 · 연애·결혼·직장·육아·궁합 10+섹션",
    href: "/types/attachment/start",
    accent: "violet",
  },
  {
    id: "temperament",
    title: "4가지 기질 검사",
    description: "28문항 · 30초 요약 · 4기질 · 직업·연애·스트레스·궁합",
    href: "/types/temperament/start",
    accent: "emerald",
  },
  {
    id: "psychopath",
    title: "사이코패스 성향 테스트",
    description: "30문항 · 30초 요약 · 4단계 · 연애·직장·법·FAQ",
    href: "/psychology/psychopath/start",
    accent: "rose",
  },
  {
    id: "depression",
    title: "우울증 자가 진단",
    description: "18문항 · PHQ-9 핵심 합산(0~27) · 30초 요약 · 직장·관계·응급 안내",
    href: "/psychology/depression/start",
    accent: "rose",
  },
  {
    id: "anxiety",
    title: "불안 자가 진단 (GAD-7)",
    description: "14문항 · GAD-7 기반 · 이완·상담·응급 안내",
    href: "/psychology/anxiety/start",
    accent: "rose",
  },
  {
    id: "composite",
    title: "MBTI × 애착 복합",
    description: "두 검사 완료 후 관계·성장 통합 리포트",
    href: "/types/composite",
    accent: "violet",
  },
  {
    id: "guide",
    title: "가이드·입문",
    description: "MBTI·애착·사주·자가진단 이해하기",
    href: "/guide",
    accent: "zinc",
  },
  {
    id: "saju",
    title: "사주 팔자 보기",
    description: "생년월일시 → 팔자·오행·성격·재물·연애·2026년 운세",
    href: "/fortune",
    badge: "운세",
    accent: "amber",
  },
  {
    id: "compatibility",
    title: "남녀 사주 궁합",
    description: "남자·여자 사주 입력 → 궁합 점수·연애·결혼·가정 조언",
    href: "/fortune/compatibility",
    accent: "amber",
  },
  {
    id: "manseryeok",
    title: "만세력 (萬歲曆)",
    description: "천간·지지 한자 해석 · 오늘/주간/월간 운세 · 만세력 표",
    href: "/fortune/manseryeok",
    accent: "amber",
  },
  {
    id: "past-life",
    title: "전생 테스트",
    description: "생년월일로 보는 전생 직업·성격·카르마·2026년 메시지",
    href: "/fortune/past-life",
    badge: "NEW",
    accent: "violet",
  },
];
