import type { ReportSection } from "@/lib/report-types";

export type TestIntroMeta = {
  estimatedMinutes: number;
  reportSectionCount: number;
  highlights: string[];
  steps: string[];
  includes: string[];
  disclaimer: string;
};

export const TEST_INTROS: Record<string, TestIntroMeta> = {
  mbti: {
    estimatedMinutes: 5,
    reportSectionCount: 11,
    highlights: [
      "24문항 · 4축(E/I·S/N·T/F·J/P) 빠른 분석",
      "30초 요약 + 16유형별 10개 섹션 상세 리포트",
      "16×16 궁합 매트릭스 · 직업·연애·결혼 팁",
    ],
    steps: [
      "각 문항을 읽고 본인에게 더 가까운 쪽을 5점 척도로 선택",
      "선택하면 자동으로 다음 문항으로 이동 (약 5분)",
      "완료 후 16유형 결과 + 차원별 % + 궁합 매트릭스 확인",
    ],
    includes: [
      "유형 코드·별명·한 줄 요약",
      "강점·약점·커리어·연애·결혼·성장·스트레스",
      "4축 레이더 차트 · 16×16 궁합 · 공유 · 캡처",
    ],
    disclaimer:
      "본 검사는 자기 이해·오락 목적이며, 공식 MBTI® 인증 검사를 대체하지 않습니다.",
  },
  "mbti-full": {
    estimatedMinutes: 18,
    reportSectionCount: 10,
    highlights: [
      "93문항 · Form M 수준 4축 정밀 분석",
      "16유형별 10개 섹션 상세 리포트",
      "16×16 궁합 매트릭스 · 직업·연애·결혼·스트레스",
    ],
    steps: [
      "각 문항을 솔직하게 5점 척도로 응답 (약 18분)",
      "중간 저장 · 이어하기 지원",
      "완료 후 정밀 유형 + 차원별 % + 궁합 매트릭스",
    ],
    includes: [
      "유형 코드·별명·상세 분석",
      "강점·약점·커리어·연애·결혼·성장·스트레스",
      "4축 레이더 · 16×16 궁합 매트릭스 · 공유",
    ],
    disclaimer:
      "본 검사는 자기 이해·오락 목적이며, 공식 MBTI® Step I/II 인증 검사를 대체하지 않습니다.",
  },
  "mbti-official": {
    estimatedMinutes: 15,
    reportSectionCount: 10,
    highlights: [
      "93문항 · A/B 강제선택(Form M 스타일)",
      "16유형별 10개 섹션 · 16×16 궁합",
    ],
    steps: [
      "두 문장 중 더 나와 가까운 A 또는 B 선택",
      "중간 저장 · 이어하기 지원 (약 15분)",
      "완료 후 유형 + 차원별 % + 궁합 매트릭스",
    ],
    includes: [
      "유형 코드·별명·상세 분석",
      "4축 레이더 · 16×16 궁합 · 공유",
    ],
    disclaimer:
      "공식 MBTI® Form M 인증 검사는 아닙니다. 자기 이해·참고 목적입니다.",
  },
  "egen-teto": {
    estimatedMinutes: 5,
    reportSectionCount: 5,
    highlights: [
      "24문항 · 에겐(섬세) vs 테토(대담) 성향",
      "30초 요약 + 스타일·연애·SNS·직장",
    ],
    steps: [
      "평소 스타일·습관 기준으로 5점 척도 응답",
      "자동 진행 · 중간 저장 지원",
      "에겐·테토·균형형 결과 확인",
    ],
    includes: ["30초 요약", "스타일·관계·직장·성장"],
    disclaimer: "유행·오락 성향 테스트이며, MBTI와 별개의 참고용입니다.",
  },
  attachment: {
    estimatedMinutes: 6,
    reportSectionCount: 10,
    highlights: [
      "28문항 · 안정·불안·회피 3유형 정밀 분석",
      "30초 요약 + 연애·결혼·직장·육아·궁합 가이드",
    ],
    steps: [
      "연애·관계 경험을 떠올리며 솔직하게 응답",
      "정답은 없으며, 가장 자주 나타나는 패턴을 봅니다",
      "결과에서 섹션별로 펼쳐 읽기",
    ],
    includes: ["30초 요약", "유형별 상세 해석", "연인·배우자 궁합·육아·FAQ"],
    disclaimer: "애착 유형은 고정된 라벨이 아니라, 성장·상담·관계 경험으로 변화할 수 있습니다.",
  },
  temperament: {
    estimatedMinutes: 6,
    reportSectionCount: 10,
    highlights: [
      "28문항 · 4기질(다혈·담즙·우울·점액) 정밀 분석",
      "30초 요약 + 성격·직업·연애·스트레스·궁합",
    ],
    steps: ["평소 성격·습관 기준으로 응답", "자동 진행 · 중간 저장 지원", "기질별 맞춤 리포트 확인"],
    includes: ["30초 요약", "4기질 차트", "직업·관계·스트레스·성장 가이드"],
    disclaimer: "고대·현대 기질 이론을 바탕으로 한 참고용 콘텐츠입니다.",
  },
  psychopath: {
    estimatedMinutes: 6,
    reportSectionCount: 10,
    highlights: [
      "30문항 · 공감·충동·조작·냉담함 다각 분석",
      "30초 요약 + 4단계 성향 · 연애·직장·법 가이드",
    ],
    steps: ["솔직하게 · 남에게 보이고 싶은 답보다 실제 경향", "자동 진행", "단계별 상세 리포트"],
    includes: ["30초 요약", "성향 등급·관계·직장", "주의·성장·FAQ·상담 안내"],
    disclaimer: "의학·법의학적 사이코패스 진단이 아닙니다. 자기 점검·오락 목적입니다.",
  },
  depression: {
    estimatedMinutes: 5,
    reportSectionCount: 9,
    highlights: [
      "18문항 · PHQ-9 핵심 9문항(0~27) 합산 + 추가 항목",
      "30초 요약 + 4단계(정상~심함) · 자가 관리·상담·응급 안내",
    ],
    steps: ["최근 2주간 상태 기준", "솔직한 응답이 정확도를 높입니다", "단계별 맞춤 가이드 확인"],
    includes: ["30초 요약", "증상·원인·대처·관계·직장", "위기 전화·FAQ"],
    disclaimer: "자가 선별 도구이며, 정신건강의학과 진단을 대체하지 않습니다.",
  },
  anxiety: {
    estimatedMinutes: 4,
    reportSectionCount: 4,
    highlights: [
      "14문항 · GAD-7 기반 불안 스크리닝",
      "30초 요약 + 이완·상담·응급 안내",
    ],
    steps: [
      "최근 2주간 상태 기준으로 응답",
      "솔직한 응답이 정확도를 높입니다",
      "단계별 맞춤 가이드 확인",
    ],
    includes: ["30초 요약", "이완·직장·도움 받기", "위기 연락처"],
    disclaimer: "자가 선별 도구이며, 정신건강의학과 진단을 대체하지 않습니다.",
  },
};

export function getStandardFaqSection(testLabel: string): ReportSection {
  return {
    id: "faq",
    title: "자주 묻는 질문",
    bullets: [
      "결과가 마음에 안 들어요 → 유형·성향은 상황·기분·성장에 따라 달라질 수 있습니다. 3~6개월 후 다시 해보세요.",
      "친구와 결과가 달라요 → 같은 유형이라도 표현은 다릅니다. '경향'으로 참고하세요.",
      `${testLabel} 결과를 SNS에 올려도 되나요? → 공유·캡처 기능을 사용하면 됩니다. 개인정보(이름·생년)는 올리지 마세요.`,
      "더 정확히 알고 싶어요 → 전문 상담·코칭·공식 검사와 병행하면 좋습니다.",
    ],
    tags: ["#FAQ"],
  };
}

export function getStressSection(bullets: string[]): ReportSection {
  return {
    id: "stress",
    title: "스트레스·번아웃 대처",
    subtitle: "힘들 때 참고할 수 있는 실천 팁",
    bullets,
    tags: ["#스트레스"],
  };
}

export function getCompatibilitySection(bullets: string[]): ReportSection {
  return {
    id: "compatibility",
    title: "연애·관계 궁합 팁",
    subtitle: "다른 유형·성향과 만날 때",
    bullets,
    tags: ["#궁합", "#연애"],
  };
}

export function getDailySection(bullets: string[]): ReportSection {
  return {
    id: "daily",
    title: "일상 실천 가이드",
    subtitle: "오늘부터 적용할 수 있는 작은 습관",
    bullets,
    tags: ["#실천"],
  };
}
