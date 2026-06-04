import type { TestDefinition } from "../types";
import { getTemperamentReportSections } from "../reports/temperament-reports";
import { getQuickSummary } from "../reports/quick-summary";

function resultWithSections(
  id: "sanguine" | "choleric" | "melancholic" | "phlegmatic",
  title: string,
  summary: string,
  details: string[],
  color: "amber" | "rose" | "sky" | "emerald",
) {
  return {
    id,
    title,
    summary,
    details,
    sections: getTemperamentReportSections(id),
    quickSummary: getQuickSummary("temperament", id),
    color,
  };
}

export const temperamentTest: TestDefinition = {
  id: "temperament",
  category: "types",
  title: "4가지 기질 검사",
  description:
    "28문항 · 4기질(다혈·담즙·우울·점액) 분석. 30초 요약 + 성격·직업·연애·스트레스·궁합 10+섹션.",
  version: 3,
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
    { id: "q13", text: "유머와 재치로 분위기를 밝게 만든다." },
    { id: "q14", text: "목표 달성을 위해 남을 이끌거나 설득한다." },
    { id: "q15", text: "완벽하지 않으면 불안하거나 미루는 편이다." },
    { id: "q16", text: "갈등을 피하고 조용히 넘기려 한다." },
    { id: "q17", text: "파티·모임·사람 많은 곳이 에너지를 준다." },
    { id: "q18", text: "경쟁·도전 상황에서 오히려 힘이 난다." },
    { id: "q19", text: "혼자만의 시간에 깊이 생각하는 편이다." },
    { id: "q20", text: "변화보다 익숙한 방식·환경을 선호한다." },
    { id: "q21", text: "말이 많고 표현력이 풍부한 편이다." },
    { id: "q22", text: "결정을 빨리 내리고 밀어붙이는 편이다." },
    { id: "q23", text: "비판·실수에 오래 마음 쓰는 편이다." },
    { id: "q24", text: "다른 사람의 감정 변화를 잘 알아채고 배려한다." },
    { id: "q25", text: "새로운 경험·장소·사람을 만나면 설렌다." },
    { id: "q26", text: "효율과 성과가 가장 중요하다고 느낀다." },
    { id: "q27", text: "의미·가치·진정성 없는 일은 하기 싫다." },
    { id: "q28", text: "급한 일이 없으면 천천히·꾸준히 하는 편이다." },
  ],
  results: {
    sanguine: resultWithSections(
      "sanguine",
      "다혈질",
      "사교적이고 낙천적이며 에너지가 넘치는 기질입니다. 사람과 분위기를 살리는 타입이에요.",
      [
        "사람들과 어울리며 분위기를 살립니다.",
        "새로운 자극과 재미를 추구합니다.",
        "집중이 길게 이어지지 않을 때가 있어요.",
        "약속·마감·세부 관리를 의식하면 더 성장합니다.",
      ],
      "amber",
    ),
    choleric: resultWithSections(
      "choleric",
      "담즙질",
      "목표 지향적이고 추진력이 강한 기질입니다. 리더십과 결단력이 두드러집니다.",
      [
        "리더십과 결단력이 두드러집니다.",
        "효율과 성과를 중시합니다.",
        "타인의 감정에 둔감해 보일 수 있어요.",
        "말하기 전 잠깐 멈추면 관계가 훨씬 좋아집니다.",
      ],
      "rose",
    ),
    melancholic: resultWithSections(
      "melancholic",
      "우울질",
      "섬세하고 분석적이며 완벽을 추구하는 기질입니다. 깊이와 의미를 중시합니다.",
      [
        "깊이 생각하고 계획합니다.",
        "예술·철학적 감수성이 있습니다.",
        "비판에 민감할 수 있어요.",
        "완성도 80%면 먼저 보내는 연습이 도움이 됩니다.",
      ],
      "sky",
    ),
    phlegmatic: resultWithSections(
      "phlegmatic",
      "점액질",
      "차분하고 안정적이며 조화를 중시하는 기질입니다. 팀의 접착제 역할을 합니다.",
      [
        "갈등을 피하고 중재 역할을 합니다.",
        "꾸준하고 신뢰감이 있습니다.",
        "변화에 느리게 반응할 수 있어요.",
        "중요한 결정에 기한을 정하면 실행력이 올라갑니다.",
      ],
      "emerald",
    ),
  },
  scoring: {
    strategy: "pattern",
    dimensions: {
      sanguine: {
        label: "다혈질",
        questionIds: ["q1", "q5", "q9", "q13", "q17", "q21", "q25"],
        resultId: "sanguine",
      },
      choleric: {
        label: "담즙질",
        questionIds: ["q2", "q6", "q10", "q14", "q18", "q22", "q26"],
        resultId: "choleric",
      },
      melancholic: {
        label: "우울질",
        questionIds: ["q3", "q7", "q11", "q15", "q19", "q23", "q27"],
        resultId: "melancholic",
      },
      phlegmatic: {
        label: "점액질",
        questionIds: ["q4", "q8", "q12", "q16", "q20", "q24", "q28"],
        resultId: "phlegmatic",
      },
    },
  },
};
