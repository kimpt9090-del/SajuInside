import type { DetailedReport, ReportSection } from "@/lib/report-types";
import type { BirthInput, SajuResult } from "./types";
import { countElements, describeElementBalance } from "./content/elements";
import { getStemProfile } from "./content/stem-profiles";
import { buildPeriodFortuneSections } from "./content/period-fortune";
import { formatBranchLabel, formatStemLabel } from "./content/stems-branches";
import { todayDayPillar } from "./pillar-calc";

const BRANCH_TRAITS: Record<string, string> = {
  자: "지혜·유연·밤의 기운. 내면 깊고 적응력 있음.",
  축: "인내·축적·토(土). 꾸준히 모으는 성향.",
  인: "시작·용기·목(木). 새 출발·추진력.",
  묘: "온화·예술·목(木). 섬세함·성장.",
  진: "변화·토(土). 전환·재정비의 시기.",
  사: "열정·표현·화(火). 명예·활동.",
  오: "활동·명예·화(火). 대외·인지도.",
  미: "돌봄·토(土). 실무·가정·양육.",
  신: "결단·금(金). 실행·정리.",
  유: "정밀·금(金). 완성·품격.",
  술: "저장·토(土). 충성·마무리.",
  해: "직관·수(水). 마무리·휴식·통찰.",
};

const YEAR_2026 = {
  stem: "병",
  branch: "오",
  label: "병오(丙午)년 — 붉은 말의 해",
  theme: "2026년은 병화(丙火)와 오화(午火)가 겹치는 강한 화(火)의 해입니다. 열정·변화·대외 활동·명예·이동운이 강하게 작용합니다.",
};

function buildHanjaGuideSection(result: SajuResult): ReportSection {
  const { pillars } = result;
  const all = [pillars.hour, pillars.day, pillars.month, pillars.year];
  const bullets = all.flatMap((p) => [
    `[${p.label}] 천간 ${formatStemLabel(p.stem, p.stemHanja)}`,
    `[${p.label}] 지지 ${formatBranchLabel(p.branch, p.branchHanja)}`,
  ]);

  return {
    id: "hanja-guide",
    title: "한자·천간지지 해석 가이드",
    subtitle: "한자만 봐도 뜻을 알 수 있도록 풀어씁니다",
    highlight: "천간(天干)은 하늘 기운·성격, 지지(地支)는 땅 기운·환경·관계를 나타냅니다.",
    bullets,
    tags: ["#한자", "#만세력"],
  };
}

function buildManseryeokSection(result: SajuResult): ReportSection {
  const today = todayDayPillar();
  const { pillars, input } = result;
  const eight =
    `${pillars.year.stemHanja}${pillars.year.branchHanja}` +
    `${pillars.month.stemHanja}${pillars.month.branchHanja}` +
    `${pillars.day.stemHanja}${pillars.day.branchHanja}` +
    `${pillars.hour.stemHanja}${pillars.hour.branchHanja}`;

  const now = new Date();
  const dateStr = `${now.getFullYear()}년 ${now.getMonth() + 1}월 ${now.getDate()}일`;

  return {
    id: "manseryeok",
    title: "만세력 (萬歲曆)",
    subtitle: `${dateStr} 기준`,
    highlight: `오늘 일진: ${today.stemHanja}${today.branchHanja} (${today.stem}${today.branch})`,
    paragraphs: [
      `귀하의 사주 팔자: ${eight.match(/.{1,2}/g)?.join(" ")}`,
      `${input.year}년 ${input.month}월 ${input.day}일 ${input.hour}시생 — 시주·일주·월주·년주 순으로 읽습니다.`,
      "만세력은 천간·지지·절기를 바탕으로 운명의 흐름을 읽는 전통 역학 도구입니다. 본 서비스는 교육·참고용 근사 계산이며, 정밀 절입·음력 변환은 전문 만세력을 권장합니다.",
    ],
    bullets: [
      `년주 ${pillars.year.stemHanja}${pillars.year.branchHanja}: 선천·가문·0~15세`,
      `월주 ${pillars.month.stemHanja}${pillars.month.branchHanja}: 성장·사회·16~30세`,
      `일주 ${pillars.day.stemHanja}${pillars.day.branchHanja}: 본인·배우자·30~45세`,
      `시주 ${pillars.hour.stemHanja}${pillars.hour.branchHanja}: 말년·자녀·45세 이후`,
    ],
    tags: ["#만세력", "#팔자"],
  };
}
function pillarSection(
  id: string,
  title: string,
  pillar: { stem: string; branch: string; stemHanja: string; branchHanja: string },
  role: string,
): ReportSection {
  const branchNote = BRANCH_TRAITS[pillar.branch] ?? "";
  return {
    id,
    title,
    subtitle: `${pillar.stemHanja}${pillar.branchHanja} (${pillar.stem}${pillar.branch})`,
    paragraphs: [
      `${role} ${pillar.stem}(${pillar.stemHanja})·${pillar.branch}(${pillar.branchHanja}) 기운이 자리합니다. ${branchNote}`,
      "사주는 네 기둥이 서로 영향을 주고받습니다. 아래 일간·오행 분석과 함께 읽으면 전체 그림이 선명해집니다.",
    ],
    tags: [`#${id}`],
  };
}

function buildYear2026Section(dayElement: string, gender: BirthInput["gender"]): ReportSection {
  const fireYear = "화(火) 기운이 강한 한 해";
  const elementAdvice: Record<string, string> = {
    목: "목(木) 일간 — 화년에 목이 태워져 표현·명예·대외 활동 기회가 큽니다. 다만 과로·번아웃·갈등에 주의하고, 수분·휴식으로 균형을 맞추세요.",
    화: "화(火) 일간 — 화년에 기운이 더해져 에너지·인지도·사업 확장에 유리합니다. 과열·충동·건강(심장·혈압) 관리가 핵심입니다.",
    토: "토(土) 일간 — 화년이 토를 생(生)하여 재물·안정·부동산·승진 기회가 열립니다. 다만 변화 속에서 중심을 잡는 것이 중요합니다.",
    금: "금(金) 일간 — 화년이 금을 단련(鍊)하는 형국으로, 압박·경쟁·정리·결단의 해입니다. 위기를 기회로 바꾸면 실력·성과가 인정받습니다.",
    수: "수(水) 일간 — 화년과 상극(相剋) 관계로 변화·스트레스·갈등이 있을 수 있습니다. 무리한 확장보다 내실·학습·관계 정리에 집중하세요.",
  };

  const genderNote =
    gender === "male"
      ? "남성 — 2026년 대외·사업·리더십·이동운이 강합니다. 상반기 기획, 하반기 실행·성과 수확 흐름."
      : "여성 — 2026년 관계·가정·재물·자기계발운이 두드러집니다. 협력·네트워크·건강 관리에 유리.";

  return {
    id: "year2026",
    title: "2026년(병오년) 운세",
    subtitle: YEAR_2026.label,
    highlight: fireYear,
    paragraphs: [
      YEAR_2026.theme,
      elementAdvice[dayElement] ?? elementAdvice["토"]!,
      genderNote,
      "월별 흐름: 1~3월 준비·학습, 4~6월 기회·시작, 7~9월 확장·주의(과로), 10~12월 정리·수확·내년 설계.",
    ],
    bullets: [
      "상반기: 새 프로젝트·이직·사업 검토",
      "하반기: 성과 정리·재물·관계 수확",
      "주의: 과열·충동·건강·법적·계약 서류",
      "길한 방향: 남·남동 (화 기운)",
    ],
    tags: ["#2026", "#올해운"],
  };
}

function buildLifeAdviceSection(stem: string): ReportSection {
  const advice: Record<string, string[]> = {
    갑: [
      "큰 그림은 이미 잘 그립니다. 이제 '사람'과 '세부'에 귀 기울이세요.",
      "분기마다 건강·관계·재무를 점검하는 루틴을 만드세요.",
      "멘토·후배·가족과의 대화 시간을 일정에 넣으세요.",
    ],
    을: [
      "타인 맞추기만 하지 말고, 한 가지는 '내가 원하는 대로' 정하세요.",
      "작은 성공을 기록하고, 자신에게 인정하는 습관을 만드세요.",
      "갈등을 미루지 말고, 부드럽지만 분명히 말하는 연습을 하세요.",
    ],
    병: [
      "열정을 3개 프로젝트 이상에 동시에 쓰지 마세요. 하나에 집중할 때 성과가 큽니다.",
      "재무·건강 체크를 월 1회 의무화하세요.",
      "장기 관계·가족에게 '꾸준한 작은 표현'을 아끼지 마세요.",
    ],
    정: [
      "완벽보다 '완료'를 목표로 하세요. 80%면 충분합니다.",
      "번아웃 신호(불면·예민)가 오면 즉시 휴식을 취하세요.",
      "전문성을 키우는 투자(교육·장비)는 재물로 돌아옵니다.",
    ],
    무: [
      "변화를 두려워하지 마세요. 작은 실험부터 시작하세요.",
      "가족·배우자에게 말로 애정을 표현하세요.",
      "자산은 모으는 것만큼 '배분·세금·상속' 설계가 중요합니다.",
    ],
    기: [
      "남을 돌보기 전에, 먼저 자신의 식사·수면·저축을 챙기세요.",
      "승진·이직을 원하면 성과를 문서로 남기고 표현하세요.",
      "우유부단할 때는 '48시간 안에 결정' 규칙을 쓰세요.",
    ],
    경: [
      "말하기 전에 한 번 숨 고르기. 상대의 감정을 먼저 확인하세요.",
      "투자·사업에는 손절·분산 규칙을 미리 정하세요.",
      "경쟁에서 이기는 것만큼, 협력 파트너를 만드는 것도 실력입니다.",
    ],
    신: [
      "비판은 성장용, 비난은 관계용 — 구분하세요.",
      "체면·과시 소비 대신, 자산·스킬에 투자하세요.",
      "완벽한 하루보다, 꾸준한 작은 습관이 품격을 만듭니다.",
    ],
    임: [
      "기회가 많을수록 '핵심 2가지'만 고르세요.",
      "감정을 가끔은 말로 표현해 거리감을 줄이세요.",
      "트렌드 따라가되, 본업·전문성은 지키세요.",
    ],
    계: [
      "혼자 끙끙 앓지 말고, 신뢰할 사람·전문가와 대화하세요.",
      "창작·연구·저작물은 꾸준히 쌓으면 50대 이후 큰 자산이 됩니다.",
      "햇빛·산책·규칙 수면은 정신 건강의 기본입니다.",
    ],
  };

  return {
    id: "advice",
    title: "맞춤 조언·실천 가이드",
    subtitle: "일상에 바로 적용할 수 있는 제안",
    bullets: advice[stem] ?? advice["무"]!,
    highlight: "사주는 '가능성'을 보여줍니다. 선택과 실천은 언제나 본인의 몫입니다.",
    tags: ["#조언"],
  };
}

/** 사주 팔자 → 상세 해석 리포트 */
export function interpretFortune(result: SajuResult): DetailedReport {
  const { pillars, input } = result;
  const dayStem = pillars.day.stem;
  const profile = getStemProfile(dayStem);

  const stems = [
    pillars.year.stem,
    pillars.month.stem,
    pillars.day.stem,
    pillars.hour.stem,
  ];
  const branches = [
    pillars.year.branch,
    pillars.month.branch,
    pillars.day.branch,
    pillars.hour.branch,
  ];
  const counts = countElements(stems, branches);
  const dayElement = profile?.element ?? "토";

  const sections: ReportSection[] = [];

  sections.push({
    id: "overview",
    title: "사주 종합 개관",
    subtitle: result.summary,
    highlight: profile
      ? `${profile.nickname} ${profile.hanja} 일간 — ${profile.overview[0]}`
      : "일간을 중심으로 전체 운세를 해석합니다.",
    paragraphs: profile?.overview ?? [
      "일간(日干)은 사주에서 '나 자신'을 나타내는 핵심 기둥입니다.",
    ],
    tags: ["#종합"],
  });

  sections.push({
    id: "elements",
    title: "오행(五行) 분석",
    subtitle: "목·화·토·금·수 균형",
    paragraphs: describeElementBalance(counts),
    bullets: [
      `목 ${counts.목} · 화 ${counts.화} · 토 ${counts.토} · 금 ${counts.금} · 수 ${counts.수}`,
      "오행 균형은 성격·건강·운의 흐름을 읽는 기본 틀입니다.",
      "부족한 기운은 생활·색·방향·직업으로 보완할 수 있습니다.",
    ],
    tags: ["#오행"],
  });

  sections.push(
    pillarSection("year", "년주(年柱) — 선천·가문·어린 시절", pillars.year, "조상·부모·0~15세"),
    pillarSection("month", "월주(月柱) — 성장·사회·청년기", pillars.month, "형제·동료·16~30세"),
    pillarSection("day", "일주(日柱) — 본인·배우자", pillars.day, "나 자신·배우자·30~45세"),
    pillarSection("hour", "시주(時柱) — 말년·자녀·잠재력", pillars.hour, "자녀·45세 이후·내면"),
  );

  if (profile) {
    sections.push(...profile.sections);
  }

  sections.push(buildManseryeokSection(result));
  sections.push(buildHanjaGuideSection(result));
  sections.push(...buildPeriodFortuneSections(result));

  sections.push(buildYear2026Section(dayElement, input.gender));
  sections.push(buildLifeAdviceSection(dayStem));

  sections.push({
    id: "disclaimer",
    title: "안내",
    paragraphs: [
      result.note,
      "본 해석은 교육·오락·자기 이해 목적의 콘텐츠이며, 전문 역술가의 정밀 만세력·대운·세운 분석을 대체하지 않습니다. 중요한 의사결정은 전문가와 상담하세요.",
    ],
    tags: ["#안내"],
  });

  const genderLabel = input.gender === "male" ? "남성" : "여성";
  const calLabel = input.calendar === "lunar" ? "음력" : "양력";

  return {
    headline: profile
      ? `${profile.nickname}(${profile.hanja}) 일간 사주 풀이`
      : "사주 상세 풀이",
    subheadline: `${input.year}년 ${input.month}월 ${input.day}일 ${input.hour}시 · ${calLabel} · ${genderLabel}`,
    keywords: [`${dayStem}일간`, `${dayElement}오행`, "사주", "만세력", "오늘운"],
    sections,
  };
}
