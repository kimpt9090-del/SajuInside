import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const basePath = path.join(
  __dirname,
  "../src/features/tests/tests/mbti-questions.ts",
);
const base = fs.readFileSync(basePath, "utf8");
const qs = [...base.matchAll(/\{ id: "(q\d+)", text: "([^"]+)" \}/g)].map(
  (m) => ({ id: m[1], text: m[2] }),
);

const extraEI = [
  { text: "처음 보는 모임에서도 자연스럽게 대화를 시작한다.", pole: "E" },
  { text: "주말에도 사람들과 만나는 약속이 있으면 기분이 좋다.", pole: "E" },
  { text: "생각을 말로 꺼내면서 정리하는 편이다.", pole: "E" },
  { text: "혼자보다 팀·그룹 활동이 더 편하다.", pole: "E" },
  { text: "낯선 환경에서도 금방 적응한다.", pole: "E" },
  { text: "연락이 끊기면 먼저 안부를 묻는다.", pole: "E" },
  { text: "에너지가 떨어지면 사람들과 어울리며 회복한다.", pole: "E" },
  { text: "발표·발언 자리를 피하지 않는다.", pole: "E" },
  { text: "카페·공간에서도 옆 사람과 대화가 이어지면 좋다.", pole: "E" },
  { text: "조용히 혼자 있는 시간이 길면 지루하다.", pole: "E" },
  { text: "아이디어는 혼자보다 함께 토론할 때 잘 떠오른다.", pole: "E" },
  { text: "행사·파티 초대를 받으면 대체로 참석한다.", pole: "E" },
  { text: "큰 소리로 생각을 정리하기보다 혼자 조용히 정리한다.", pole: "I" },
  { text: "주말에 혼자만의 시간이 없으면 지친다.", pole: "I" },
  { text: "많은 사람 앞보다 친한 한두 명과 깊게 나누는 편이다.", pole: "I" },
  { text: "연속된 약속·모임이 많으면 회복 시간이 필요하다.", pole: "I" },
  { text: "새로운 장소에서도 먼저 관찰하며 분위기를 파악한다.", pole: "I" },
  { text: "전화·영상 통화보다 메시지로 짧게 정리하는 편이다.", pole: "I" },
  { text: "혼자 산책·독서·취미로 충전하는 시간이 필요하다.", pole: "I" },
  { text: "낯선 사람과의 잡담보다 익숙한 사람과의 대화가 편하다.", pole: "I" },
  { text: "회의·모임에서 먼저 말하기보다 듣는 편이다.", pole: "I" },
  { text: "혼자 있는 시간에 가장 창의적·집중력이 높아진다.", pole: "I" },
  { text: "사교 모임 후에는 집에서 혼자 쉬어야 한다.", pole: "I" },
];

const extraSN = [
  { text: "지금 눈앞의 사실·숫자·증거를 먼저 본다.", pole: "S" },
  { text: "설명서·매뉴얼을 꼼꼼히 읽는 편이다.", pole: "S" },
  { text: "과거 경험이 비슷한 상황의 기준이 된다.", pole: "S" },
  { text: "현실적으로 실행 가능한지부터 따진다.", pole: "S" },
  { text: "세부 사항 하나하나가 중요하다.", pole: "S" },
  { text: "이론보다 실제 사례·예시가 이해에 도움 된다.", pole: "S" },
  { text: "미래 가능성보다 현재 상황을 먼저 처리한다.", pole: "S" },
  { text: "구체적인 예시 없으면 개념이 잘 와닿지 않는다.", pole: "S" },
  { text: "눈에 보이는 결과·성과를 중시한다.", pole: "S" },
  { text: "단계별로 차근차근 진행하는 것을 선호한다.", pole: "S" },
  { text: "데이터·통계·측정 가능한 기준을 신뢰한다.", pole: "S" },
  { text: "오감으로 확인한 정보를 더 믿는다.", pole: "S" },
  { text: "장기 비전·가능성을 먼저 그려본다.", pole: "N" },
  { text: "사실 나열이 아니라 의미·연결을 찾는 편이다.", pole: "N" },
  { text: "새로운 아이디어·가설을 즐겨 탐색한다.", pole: "N" },
  { text: "반복 업무보다 새 프로젝트·변화에 흥미를 느낀다.", pole: "N" },
  { text: "상징·은유·비유로 설명하는 것을 좋아한다.", pole: "N" },
  { text: "지금보다 '앞으로 어떻게 될까'를 더 자주 생각한다.", pole: "N" },
  { text: "디테일보다 전체 그림·방향이 먼저 보인다.", pole: "N" },
  { text: "규칙보다 원칙·가능성을 우선할 때가 있다.", pole: "N" },
  { text: "여러 시나리오를 머릿속으로 시뮬레이션한다.", pole: "N" },
  { text: "패턴·트렌드를 읽는 데 재능이 있다고 느낀다.", pole: "N" },
  { text: "익숙한 방식보다 새로운 접근을 시도하고 싶다.", pole: "N" },
];

const extraTF = [
  { text: "원칙·규칙이 감정보다 우선일 때가 있다.", pole: "T" },
  { text: "문제 해결 시 객관적 기준이 공정하다고 느낀다.", pole: "T" },
  { text: "솔직한 피드백이 관계를 더 건강하게 만든다.", pole: "T" },
  { text: "결정 근거를 논리적으로 설명하는 편이다.", pole: "T" },
  { text: "감정적 호소보다 사실 확인이 먼저다.", pole: "T" },
  { text: "경쟁·성과 비교가 동기부여가 될 때가 있다.", pole: "T" },
  { text: "상대가 틀렸다면 부드럽게라도 지적한다.", pole: "T" },
  { text: "공정함·일관성을 관계의 기준으로 삼는다.", pole: "T" },
  { text: "감정이 앞서면 스스로 냉정해지려 한다.", pole: "T" },
  { text: "효율·합리성이 최우선 가치에 가깝다.", pole: "T" },
  { text: "논쟁에서 사실·논리가 감정보다 설득력 있다.", pole: "T" },
  { text: "결정을 미루기보다 명확한 기준으로 빨리 내린다.", pole: "T" },
  { text: "타인의 감정을 먼저 읽으려 노력한다.", pole: "F" },
  { text: "분위기·조화가 결과만큼 중요하다.", pole: "F" },
  { text: "비판보다 공감·격려가 먼저 나온다.", pole: "F" },
  { text: "갈등 시 상대가 상처받지 않게 말을 고른다.", pole: "F" },
  { text: "원칙보다 사람·관계를 우선할 때가 있다.", pole: "F" },
  { text: "누군가 힘들어하면 해결책보다 위로가 먼저다.", pole: "F" },
  { text: "팀에서 '기분'·'분위기'를 자주 살핀다.", pole: "F" },
  { text: "타인의 칭찬·인정이 큰 동기가 된다.", pole: "F" },
  { text: "논리적으로 맞아도 말투가 상처라면 조절한다.", pole: "F" },
  { text: "가치·신념·정의감이 결정에 큰 영향을 준다.", pole: "F" },
  { text: "감정 표현이 솔직할수록 관계가 편해진다.", pole: "F" },
];

const extraJP = [
  { text: "여행·일정은 미리 계획해 두는 편이다.", pole: "J" },
  { text: "마무리·정리가 안 되면 찜찜하다.", pole: "J" },
  { text: "데드라인을 지키는 것이 자존감과 연결된다.", pole: "J" },
  { text: "결정을 내리고 다음 단계로 넘어가야 편하다.", pole: "J" },
  { text: "집·책상·파일이 정돈되어 있으면 집중이 잘 된다.", pole: "J" },
  { text: "약속 시간·규칙을 지키는 것이 중요하다.", pole: "J" },
  { text: "프로젝트는 초반에 방향을 확정하는 편이다.", pole: "J" },
  { text: "미완료 과제가 많으면 스트레스를 받는다.", pole: "J" },
  { text: "선택지를 오래 열어 두면 불안하다.", pole: "J" },
  { text: "계획표·체크리스트를 자주 쓴다.", pole: "J" },
  { text: "갑작스러운 변경보다 예고된 변화가 낫다.", pole: "J" },
  { text: "일을 시작하기 전에 전체 구조를 잡는다.", pole: "J" },
  { text: "마감 직전에야 집중이 극대화되는 편이다.", pole: "P" },
  { text: "규칙·틀보다 상황에 맞게 유연하게 움직인다.", pole: "P" },
  { text: "계획이 바뀌어도 새 흐름을 즐기는 편이다.", pole: "P" },
  { text: "결정을 미루고 정보를 더 모으는 편이다.", pole: "P" },
  { text: "정해진 루틴보다 즉흥·탐색이 에너지를 준다.", pole: "P" },
  { text: "마감 압박이 있어야 일이 잘 진행된다.", pole: "P" },
  { text: "여러 선택지를 동시에 열어 두는 것이 편하다.", pole: "P" },
  { text: "세부 정리보다 큰 방향만 잡고 시작한다.", pole: "P" },
  { text: "새로운 정보가 나오면 계획을 바꿔도 괜찮다.", pole: "P" },
  { text: "틀에 박힌 방식보다 자유로운 환경이 잘 맞는다.", pole: "P" },
  { text: "완벽한 준비보다 일단 시작하는 편이다.", pole: "P" },
  { text: "일정·계획 없이 흘러가도 스트레스가 적다.", pole: "P" },
];

// 40 base + 53 extra = 93 (Form M 수준)
const NEED = { ei: 12, sn: 12, tf: 14, jp: 15 };
let n = 41;
const extras = [
  ...extraEI.slice(0, NEED.ei),
  ...extraSN.slice(0, NEED.sn),
  ...extraTF.slice(0, NEED.tf),
  ...extraJP.slice(0, NEED.jp),
].map((e) => ({
  id: `q${n++}`,
  text: e.text,
  pole: e.pole,
}));

const allQuestions = [...qs, ...extras.map(({ id, text }) => ({ id, text }))];

// Parse all pole mappings from base MBTI_AXES block
const poleMap = {};
const entries = [...base.matchAll(/(q\d+): \{ pole: "([EISTNFJP])" \}/g)];
for (const [, qid, pole] of entries) {
  poleMap[qid] = pole;
}
for (const e of extras) {
  poleMap[e.id] = e.pole;
}

const ei = {},
  sn = {},
  tf = {},
  jp = {};
for (const [qid, pole] of Object.entries(poleMap)) {
  const entry = `{ pole: "${pole}" }`;
  if (pole === "E" || pole === "I") ei[qid] = entry;
  else if (pole === "S" || pole === "N") sn[qid] = entry;
  else if (pole === "T" || pole === "F") tf[qid] = entry;
  else jp[qid] = entry;
}

function fmtMap(obj) {
  return Object.entries(obj)
    .sort((a, b) => parseInt(a[0].slice(1)) - parseInt(b[0].slice(1)))
    .map(([k, v]) => `      ${k}: ${v}`)
    .join(",\n");
}

const out = `import type { TestQuestion } from "../types";

/** MBTI 정밀 93문항 — Form M 수준 (축당 약 23문항) */
export const MBTI_FULL_QUESTIONS: TestQuestion[] = [
${allQuestions.map((q) => `  { id: "${q.id}", text: "${q.text}" }`).join(",\n")},
];

export const MBTI_FULL_AXES = [
  {
    id: "ei",
    poleA: { key: "E", label: "외향(E)" },
    poleB: { key: "I", label: "내향(I)" },
    questions: {
${fmtMap(ei)},
    },
  },
  {
    id: "sn",
    poleA: { key: "S", label: "감각(S)" },
    poleB: { key: "N", label: "직관(N)" },
    questions: {
${fmtMap(sn)},
    },
  },
  {
    id: "tf",
    poleA: { key: "T", label: "사고(T)" },
    poleB: { key: "F", label: "감정(F)" },
    questions: {
${fmtMap(tf)},
    },
  },
  {
    id: "jp",
    poleA: { key: "J", label: "판단(J)" },
    poleB: { key: "P", label: "인식(P)" },
    questions: {
${fmtMap(jp)},
    },
  },
] as const;
`;

const outPath = path.join(
  __dirname,
  "../src/features/tests/tests/mbti-full-questions.ts",
);
fs.writeFileSync(outPath, out, "utf8");
console.log("Wrote", allQuestions.length, "questions to", outPath);
console.log("Counts:", {
  ei: Object.keys(ei).length,
  sn: Object.keys(sn).length,
  tf: Object.keys(tf).length,
  jp: Object.keys(jp).length,
});
