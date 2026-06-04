import type { ReportSection } from "@/lib/report-types";
import {
  getCompatibilitySection,
  getDailySection,
  getStandardFaqSection,
  getStressSection,
} from "../content/test-intros";

/** 리포트 끝에 붙이는 공통·추가 섹션 */
export function appendAttachmentExtras(
  id: string,
  base: ReportSection[],
): ReportSection[] {
  const tips: Record<string, string[]> = {
    secure: [
      "불안형 파트너: 연락·표현을 꾸준히, '버려지지 않았다'는 신호 제공",
      "회피형 파트너: 공간을 존중하되, 대화 시간은 일정으로 확보",
      "다른 안정형: 편안하지만 변화·성장 요구도 함께 논의",
    ],
    anxious: [
      "안정형: 확인 욕구를 말로 표현, 상대의 '조용함'을 무시로 해석하지 않기",
      "회피형: 거리 두기 = 사랑 없음이 아닐 수 있음, 규칙 합의 필수",
      "불안형끼리: 감정 폭주 시 '타임아웃 30분' 규칙",
    ],
    avoidant: [
      "안정형: 압박 없이 기다려주는 상대가 회복에 유리",
      "불안형: 상대의 확인 요구를 '통제'가 아닌 '사랑'으로 이해하기",
      "회피형끼리: 감정·갈등 회피로 관계 정체 — 대화 루틴 필수",
    ],
  };

  const parenting: Record<string, string[]> = {
    secure: ["일관된 돌봄·애정 표현", "갈등 후 '관계 수리' 모델링", "자녀 감정 이름 붙여주기"],
    anxious: ["자녀 불안을 '과잉'으로만 보지 않기", "본인 불안 관리 후 반응", "안정적 루틴·예측 가능한 일과"],
    avoidant: ["스킨십·말로 애정 표현 연습", "자녀의 감정 요구를 '부담'으로만 보지 않기", "혼자 시간 + 가족 시간 분리"],
  };

  return [
    ...base,
    getCompatibilitySection(tips[id] ?? tips.secure!),
    {
      id: "parenting",
      title: "육아·자녀 애착에 미치는 영향",
      bullets: parenting[id] ?? parenting.secure!,
      tags: ["#육아"],
    },
    getDailySection([
      "하루 1회: 감정 한 단어로 이름 붙이기",
      "주 1회: 파트너·친구와 '관계 체크인' 15분",
      "갈등 후 24시간 안에 수리 대화 시도",
    ]),
    getStandardFaqSection("애착"),
  ];
}

export function appendTemperamentExtras(
  id: string,
  base: ReportSection[],
): ReportSection[] {
  const compat: Record<string, string[]> = {
    sanguine: ["우울질: 속도·깊이 조절", "담즙질: 리더십 충돌 주의", "점액질: 지루함·즉흥 균형"],
    choleric: ["다혈질: 속도 맞추기", "우울질: 비판·완벽주의 완화", "점액질: 결정·실행 분담"],
    melancholic: ["다혈질: 깊이 vs 가벼움", "담즙질: 예민함·직설 충돌", "점액질: 변화 속도"],
    phlegmatic: ["다혈질: 에너지·일정", "담즙질: 갈등 회피 vs 추진", "우울질: 무기력·비관"],
  };

  return [
    ...base,
    getCompatibilitySection(compat[id] ?? []),
    getStressSection([
      "기질 '약점'이 스트레스에서 극대화됩니다 — 평소 강점을 의식하세요.",
      "번아웃 신호: 수면·식욕·짜증·회피 — 1주 이상 지속 시 휴식·상담",
      "상대 기질을 '틀림'이 아닌 '다름'으로 받아들이기",
    ]),
    getDailySection([
      "아침 5분: 오늘의 우선순위 1가지",
      "저녁 5분: 감사·성취 1가지 기록",
      "주 1회: 기질과 반대 성향 연습 (다혈→고요, 우울→가벼운 산책)",
    ]),
    getStandardFaqSection("기질"),
  ];
}

export function appendPsychopathExtras(
  id: string,
  base: ReportSection[],
): ReportSection[] {
  return [
    ...base,
    {
      id: "legal",
      title: "법·윤리·사회",
      bullets: [
        "타인 기만·사기·폭력은 어떤 성향 점수와 무관하게 잘못입니다.",
        "직장·연애에서 '이득'만 추구하면 법적·평판 리스크가 큽니다.",
        "점수가 높다면 전문가 상담으로 충동·공감 훈련을 권장합니다.",
      ],
      tags: ["#윤리"],
    },
    getCompatibilitySection([
      "공감형 파트너: 솔직한 피드백·경계 설정",
      "유사 성향: 자극·리스크·거짓을 함께 키울 수 있음 — 주의",
      "모든 관계: 약속·신뢰·법 준수가 최우선",
    ]),
    getStandardFaqSection("사이코패스"),
  ];
}

export function appendDepressionExtras(
  id: string,
  base: ReportSection[],
): ReportSection[] {
  const work: Record<string, string[]> = {
    minimal: ["예방적 휴식·운동·수면 유지", "과로·고립 주의"],
    mild: ["업무 우선순위 축소", "상사·동료에게 상태 간단히 공유", "점심·산책 10분"],
    moderate: ["휴가·유연 근무·업무 조정 요청", "성과 저하는 증상일 수 있음", "전문가 상담 병행"],
    severe: ["즉시 휴직·치료 우선", "혼자 결정·업무 버티기 금지", "가족·HR·의료 연계"],
  };

  return [
    ...base,
    {
      id: "work",
      title: "직장·학업",
      bullets: work[id] ?? work.mild!,
      tags: ["#직장"],
    },
    {
      id: "relationship",
      title: "가족·연애·대인관계",
      paragraphs: [
        "우울할 때 관계를 끊거나, 반대로 과도하게 의존할 수 있습니다. '지금 힘들다' 한 마디가 관계를 지킵니다.",
        "가족·연인에게 전문가 도움을 요청하는 것은 약함이 아니라 책임입니다.",
      ],
      tags: ["#관계"],
    },
    getDailySection([
      "아침: 햇빛 10분 · 물 한 잔",
      "하루 1가지: 씻기·한 끼·10분 산책 중 하나",
      "밤: 화면·술·카페인 줄이고 같은 시간 취침",
    ]),
    getStandardFaqSection("우울"),
  ];
}

export function appendAnxietyExtras(
  id: string,
  base: ReportSection[],
): ReportSection[] {
  const work: Record<string, string[]> = {
    minimal: ["예방적 호흡·수면·운동 유지", "카페인·야근 과다 주의"],
    mild: ["업무를 작은 단위로 나누기", "걱정 시간 15분 제한", "가벼운 유산소 주 2회"],
    moderate: ["유연 근무·업무량 조정 요청", "상담·검진 병행", "회피 행동 줄이기"],
    severe: ["즉시 휴직·치료 우선", "공황 시 안전한 곳·호흡", "혼자 참지 말고 도움 요청"],
  };

  return [
    ...base,
    {
      id: "work",
      title: "직장·학업",
      bullets: work[id] ?? work.mild!,
      tags: ["#직장"],
    },
    getStressSection([
      "불안은 '위험 신호'이기도 합니다 — 무시보다 인식이 먼저",
      "완벽주의·통제 욕구가 불안을 키울 수 있음",
      "수면·카페인·알코올이 불안 민감도에 영향",
    ]),
    getDailySection([
      "아침: 복식호흡 5분",
      "낮: 10분 산책 또는 스트레칭",
      "밤: 화면·뉴스·카페인 줄이기",
    ]),
    getStandardFaqSection("불안"),
  ];
}

export function appendEgenTetoExtras(
  id: string,
  base: ReportSection[],
): ReportSection[] {
  const sns: Record<string, string[]> = {
    egen: ["톤·구도·캡션 통일", "과한 보정·필터보다 자연스러움", "비교 피드에 스트레스 — 팔로우 정리"],
    teto: ["솔직한 톤·에너지", "즉흥 라이브·스토리", "논쟁·비난 댓글에 과몰입 주의"],
    balanced: ["상황별 톤 전환", "브랜드 일관성 + 개성", "SNS 휴식일 정하기"],
  };

  const compat: Record<string, string[]> = {
    egen: ["테토형: 속도·직설 차이 이해", "에겐형끼리: 완벽·서운함 조율", "안정형 애착과 궁합 좋음"],
    teto: ["에겐형: 디테일·예의 기대 차이", "테토형끼리: 충돌·자극 주의", "자유·경계 말로 합의"],
    balanced: ["상대 성향에 맞춰 톤 조절", "에겐·테토 모두 이해 가능", "MBTI와 함께 보면 더 입체적"],
  };

  return [
    ...base,
    {
      id: "sns",
      title: "SNS·일상 스타일",
      bullets: sns[id] ?? sns.balanced!,
      tags: ["#SNS"],
    },
    getCompatibilitySection(compat[id] ?? compat.balanced!),
    getDailySection([
      "옷장·책상 10분 정리",
      "오늘 한 가지: 나답게 표현하기",
      "비교 피드 30분만 보기",
    ]),
    getStandardFaqSection("에겐·테토"),
  ];
}

const MBTI_STRESS: Record<string, string[]> = {
  I: ["과도한 대외 일정 → 혼자 충전 시간 확보", "소음·인파 → 조용한 공간"],
  E: ["고립·재택만 → 주 2회 대면·통화", "에너지 고갈 → 가벼운 모임"],
  S: ["추상·불확실 → 구체적 체크리스트", "디테일 과부하 → 우선순위 3개"],
  N: ["반복·루틴 → 의미·비전 연결", "아이디어만 → 최소 실행 하나 완료"],
  T: ["감정 무시 → 상대 감정 1문장 확인", "냉정함 → 칭찬·공감 먼저"],
  F: ["갈등 회피 → '지금 기분' 말하기", "타인 우선 → 자기 돌봄 30분"],
  J: ["계획 붕괴 → 대안 계획", "완벽 → 80% 완료"],
  P: ["마감 스트레스 → 중간 체크포인트", "우유부단 → 48시간 결정"],
};

export function appendMbtiExtras(
  code: string,
  base: ReportSection[],
): ReportSection[] {
  const letters = code.split("");
  const stressTips = letters.flatMap((l) => MBTI_STRESS[l] ?? []).slice(0, 6);

  return [
    ...base,
    getStressSection(stressTips.length ? stressTips : ["수면·운동·대화·휴식 균형"]),
    {
      id: "type-match",
      title: "유형 궁합·협업 팁",
      paragraphs: [
        "MBTI 궁합은 '좋다/나쁘다'가 아니라 '다름을 이해'하는 도구입니다. 결과 페이지 하단 16×16 매트릭스에서 유형별 점수를 확인하세요.",
      ],
      bullets: [
        "E ↔ I: 대화량·회복 방식 합의",
        "S ↔ N: 사실 vs 가능성 — 둘 다 필요",
        "T ↔ F: 논리 vs 감정 — 순서만 바꿔도 다름",
        "J ↔ P: 일정 vs 유연 — 중간 지점·역할 분담",
        `당신(${code})과 다른 유형: 차이를 '수정'하지 말고 '번역'하세요.`,
      ],
      tags: ["#궁합"],
    },
    getStandardFaqSection("MBTI"),
  ];
}
