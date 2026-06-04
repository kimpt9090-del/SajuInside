import type { TestQuestion } from "../types";

/** MBTI 간단 24문항 — 축당 6문항 */
export const MBTI_SIMPLE_QUESTIONS: TestQuestion[] = [
  { id: "q1", text: "모임이 끝나면 사람들과 더 이야기하고 싶다." },
  { id: "q2", text: "혼자만의 시간이 있어야 에너지가 회복된다." },
  { id: "q3", text: "새로운 사람을 만나는 것이 즐겁다." },
  { id: "q4", text: "깊은 대화는 소수와 나누는 편이 좋다." },
  { id: "q5", text: "활발한 토론에서 에너지를 얻는다." },
  { id: "q6", text: "조용한 환경에서 집중이 잘 된다." },
  { id: "q7", text: "사실과 경험에 근거한 정보를 신뢰한다." },
  { id: "q8", text: "가능성과 아이디어를 상상하는 것을 좋아한다." },
  { id: "q9", text: "구체적인 단계와 실무 디테일을 중시한다." },
  { id: "q10", text: "패턴과 의미를 연결해 큰 그림을 본다." },
  { id: "q11", text: "검증된 방법을 따르는 것이 안전하다." },
  { id: "q12", text: "새로운 방식을 시도해 보는 것을 즐긴다." },
  { id: "q13", text: "결정할 때 논리와 객관적 기준을 우선한다." },
  { id: "q14", text: "결정할 때 사람의 감정과 조화를 고려한다." },
  { id: "q15", text: "비판은 개선을 위한 정보로 받아들인다." },
  { id: "q16", text: "갈등을 피하기 위해 상대 기분을 먼저 살핀다." },
  { id: "q17", text: "감정보다 사실·데이터를 말하는 편이다." },
  { id: "q18", text: "팀 분위기를 해치지 않으려 노력한다." },
  { id: "q19", text: "일정과 계획을 미리 세우는 편이다." },
  { id: "q20", text: "즉흥적으로 일정을 바꿔도 크게 부담되지 않는다." },
  { id: "q21", text: "마감 전에 미리 끝내 두는 것이 편하다." },
  { id: "q22", text: "열린 선택지를 유지하는 것이 안심된다." },
  { id: "q23", text: "할 일 목록·캘린더 없으면 불안하다." },
  { id: "q24", text: "계획 없이 흘러가는 하루도 즐겁다." },
];

export const MBTI_SIMPLE_AXES = [
  {
    id: "ei",
    poleA: { key: "E", label: "외향(E)" },
    poleB: { key: "I", label: "내향(I)" },
    questions: {
      q1: { pole: "E" }, q2: { pole: "I" }, q3: { pole: "E" }, q4: { pole: "I" },
      q5: { pole: "E" }, q6: { pole: "I" },
    },
  },
  {
    id: "sn",
    poleA: { key: "S", label: "감각(S)" },
    poleB: { key: "N", label: "직관(N)" },
    questions: {
      q7: { pole: "S" }, q8: { pole: "N" }, q9: { pole: "S" }, q10: { pole: "N" },
      q11: { pole: "S" }, q12: { pole: "N" },
    },
  },
  {
    id: "tf",
    poleA: { key: "T", label: "사고(T)" },
    poleB: { key: "F", label: "감정(F)" },
    questions: {
      q13: { pole: "T" }, q14: { pole: "F" }, q15: { pole: "T" }, q16: { pole: "F" },
      q17: { pole: "T" }, q18: { pole: "F" },
    },
  },
  {
    id: "jp",
    poleA: { key: "J", label: "판단(J)" },
    poleB: { key: "P", label: "인식(P)" },
    questions: {
      q19: { pole: "J" }, q20: { pole: "P" }, q21: { pole: "J" }, q22: { pole: "P" },
      q23: { pole: "J" }, q24: { pole: "P" },
    },
  },
] as const;
