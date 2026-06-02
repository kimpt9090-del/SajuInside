import type { TestDefinition } from "../types";
import { buildMbtiResults } from "./mbti-helpers";

export const mbtiTest: TestDefinition = {
  id: "mbti",
  category: "types",
  title: "MBTI 성격 유형 검사",
  description:
    "E/I, S/N, T/F, J/P 4가지 축의 응답 패턴으로 16가지 유형을 추정합니다.",
  version: 1,
  questions: [
    { id: "q1", text: "모임이 끝나면 사람들과 더 이야기하고 싶다." },
    { id: "q2", text: "혼자만의 시간이 있어야 에너지가 회복된다." },
    { id: "q3", text: "새로운 사람을 만나는 것이 즐겁다." },
    { id: "q4", text: "깊은 대화는 소수와 나누는 편이 좋다." },
    { id: "q5", text: "사실과 경험에 근거한 정보를 신뢰한다." },
    { id: "q6", text: "가능성과 아이디어를 상상하는 것을 좋아한다." },
    { id: "q7", text: "구체적인 단계와 실무 디테일을 중시한다." },
    { id: "q8", text: "패턴과 의미를 연결해 큰 그림을 본다." },
    { id: "q9", text: "결정할 때 논리와 객관적 기준을 우선한다." },
    { id: "q10", text: "결정할 때 사람의 감정과 조화를 고려한다." },
    { id: "q11", text: "비판은 개선을 위한 정보로 받아들인다." },
    { id: "q12", text: "갈등을 피하기 위해 상대 기분을 먼저 살핀다." },
    { id: "q13", text: "일정과 계획을 미리 세우는 편이다." },
    { id: "q14", text: "즉흥적으로 일정을 바꿔도 크게 부담되지 않는다." },
    { id: "q15", text: "마감 전에 미리 끝내 두는 것이 편하다." },
    { id: "q16", text: "열린 선택지를 유지하는 것이 안심된다." },
    { id: "q17", text: "활발한 토론에서 에너지를 얻는다." },
    { id: "q18", text: "조용한 환경에서 집중이 잘 된다." },
    { id: "q19", text: "검증된 방법을 따르는 것이 안전하다." },
    { id: "q20", text: "새로운 방식을 시도해 보는 것을 즐긴다." },
  ],
  results: buildMbtiResults(),
  scoring: {
    strategy: "mbti",
    axes: [
      {
        id: "ei",
        poleA: { key: "E", label: "외향(E)" },
        poleB: { key: "I", label: "내향(I)" },
        questions: {
          q1: { pole: "E" },
          q2: { pole: "I" },
          q3: { pole: "E" },
          q4: { pole: "I" },
          q17: { pole: "E" },
          q18: { pole: "I" },
        },
      },
      {
        id: "sn",
        poleA: { key: "S", label: "감각(S)" },
        poleB: { key: "N", label: "직관(N)" },
        questions: {
          q5: { pole: "S" },
          q6: { pole: "N" },
          q7: { pole: "S" },
          q8: { pole: "N" },
          q19: { pole: "S" },
          q20: { pole: "N" },
        },
      },
      {
        id: "tf",
        poleA: { key: "T", label: "사고(T)" },
        poleB: { key: "F", label: "감정(F)" },
        questions: {
          q9: { pole: "T" },
          q10: { pole: "F" },
          q11: { pole: "T" },
          q12: { pole: "F" },
        },
      },
      {
        id: "jp",
        poleA: { key: "J", label: "판단(J)" },
        poleB: { key: "P", label: "인식(P)" },
        questions: {
          q13: { pole: "J" },
          q14: { pole: "P" },
          q15: { pole: "J" },
          q16: { pole: "P" },
        },
      },
    ],
  },
};
