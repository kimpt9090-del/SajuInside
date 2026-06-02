import type { TestDefinition } from "../types";

export const temperamentTest: TestDefinition = {
  id: "temperament",
  category: "types",
  title: "4가지 기질 검사",
  description: "다혈질·담즙질·우울질·점액질 기질 경향을 확인합니다.",
  version: 1,
  questions: [
    { id: "q1", text: "새로운 사람을 만나면 금방 친해지는 편이다." },
    { id: "q2", text: "목표를 세우면 빠르게 실행에 옮긴다." },
    { id: "q3", text: "혼자 깊이 생각하는 시간이 많다." },
    { id: "q4", text: "갈등 상황을 피하고 조용히 넘기려 한다." },
    { id: "q5", text: "분위기를 밝게 만드는 역할을 자주 한다." },
    { id: "q6", text: "경쟁이나 도전이 있으면 동기가 올라간다." },
    { id: "q7", text: "작은 디테일까지 신경 쓰는 편이다." },
    { id: "q8", text: "급하게 서두르기보다 천천히 가는 편이다." },
    { id: "q9", text: "즉흥적으로 계획을 바꿔도 즐겁다." },
    { id: "q10", text: "남의 말을 끊고 내 의견을 분명히 말한다." },
    { id: "q11", text: "예술·음악·문학에 감동을 쉽게 받는다." },
    { id: "q12", text: "안정적인 루틴이 마음이 편하다." },
  ],
  results: {
    sanguine: {
      id: "sanguine",
      title: "다혈질(Sanguine)",
      summary: "사교적이고 낙천적이며 에너지가 넘치는 기질입니다.",
      details: [
        "사람들과 어울리며 분위기를 살립니다.",
        "새로운 자극과 재미를 추구합니다.",
        "집중이 길게 이어지지 않을 때가 있어요.",
      ],
      color: "amber",
    },
    choleric: {
      id: "choleric",
      title: "담즙질(Choleric)",
      summary: "목표 지향적이고 추진력이 강한 기질입니다.",
      details: [
        "리더십과 결단력이 두드러집니다.",
        "효율과 성과를 중시합니다.",
        "타인의 감정에 둔감해 보일 수 있어요.",
      ],
      color: "rose",
    },
    melancholic: {
      id: "melancholic",
      title: "우울질(Melancholic)",
      summary: "섬세하고 분석적이며 완벽을 추구하는 기질입니다.",
      details: [
        "깊이 생각하고 계획합니다.",
        "예술·철학적 감수성이 있습니다.",
        "비판에 민감할 수 있어요.",
      ],
      color: "sky",
    },
    phlegmatic: {
      id: "phlegmatic",
      title: "점액질(Phlegmatic)",
      summary: "차분하고 안정적이며 조화를 중시하는 기질입니다.",
      details: [
        "갈등을 피하고 중재 역할을 합니다.",
        "꾸준하고 신뢰감이 있습니다.",
        "변화에 느리게 반응할 수 있어요.",
      ],
      color: "emerald",
    },
  },
  scoring: {
    strategy: "pattern",
    dimensions: {
      sanguine: {
        label: "다혈질",
        questionIds: ["q1", "q5", "q9"],
        resultId: "sanguine",
      },
      choleric: {
        label: "담즙질",
        questionIds: ["q2", "q6", "q10"],
        resultId: "choleric",
      },
      melancholic: {
        label: "우울질",
        questionIds: ["q3", "q7", "q11"],
        resultId: "melancholic",
      },
      phlegmatic: {
        label: "점액질",
        questionIds: ["q4", "q8", "q12"],
        resultId: "phlegmatic",
      },
    },
  },
};
