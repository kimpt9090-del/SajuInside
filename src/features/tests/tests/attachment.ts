import type { TestDefinition } from "../types";

export const attachmentTest: TestDefinition = {
  id: "attachment",
  category: "psychology",
  title: "애착 유형 테스트",
  description: "관계에서의 안정감/불안/회피 경향을 간단히 확인합니다.",
  version: 1,
  questions: [
    { id: "q1", text: "상대가 나를 정말 좋아하는지 자주 확인하고 싶다." },
    { id: "q2", text: "연락이 늦어지면 불안해지고 최악을 상상하게 된다." },
    { id: "q3", text: "친밀해질수록 부담을 느끼고 거리를 두고 싶어진다." },
    { id: "q4", text: "갈등이 생기면 대화로 풀기보다 피하고 싶다." },
    { id: "q5", text: "상대에게 의지하는 것이 자연스럽고 편안하다." },
    { id: "q6", text: "관계에서 내가 버려질까 걱정되는 편이다." },
    { id: "q7", text: "감정 표현이 많은 편이며, 상대도 그에 맞춰주길 바란다." },
    { id: "q8", text: "누군가 가까워지려 하면 나는 오히려 마음이 닫힌다." },
    { id: "q9", text: "상대의 요구가 많으면 숨 막히고 자유가 필요하다고 느낀다." },
    { id: "q10", text: "기본적으로 관계는 안전하다고 느끼며 신뢰가 생기면 안정적이다." },
  ],
  results: {
    secure: {
      id: "secure",
      title: "안정형(secure)",
      summary: "친밀감과 독립의 균형이 비교적 잘 잡혀 있어요.",
      details: [
        "필요할 때 도움을 요청하고, 상대의 도움도 수용합니다.",
        "갈등을 ‘관계의 끝’으로 보지 않고 조율 가능한 문제로 봅니다.",
        "상대의 반응에 과도하게 흔들리기보다, 현실적으로 해석하는 편입니다.",
      ],
      color: "emerald",
    },
    anxious: {
      id: "anxious",
      title: "불안형(anxious)",
      summary: "관계에서 확신과 안정 신호를 자주 필요로 하는 편이에요.",
      details: [
        "연락/표현이 줄면 불안이 커지고 확인 행동이 늘 수 있습니다.",
        "상대의 작은 변화에도 의미를 크게 해석하는 경향이 있을 수 있어요.",
        "안정적인 커뮤니케이션 규칙(연락/약속)을 만들면 도움이 됩니다.",
      ],
      color: "rose",
    },
    avoidant: {
      id: "avoidant",
      title: "회피형(avoidant)",
      summary: "친밀감이 깊어질수록 부담을 느껴 거리를 두는 경향이 있어요.",
      details: [
        "독립성과 공간이 중요하며, 과도한 요구를 압박으로 느낄 수 있습니다.",
        "감정 표현보다는 문제 해결/거리 두기로 안정감을 찾을 때가 있어요.",
        "필요한 선(경계)을 말로 합의하면 관계의 마찰이 줄어듭니다.",
      ],
      color: "sky",
    },
  },
  scoring: {
    strategy: "pattern",
    dimensions: {
      secure: {
        label: "안정",
        questionIds: ["q5", "q10"],
        resultId: "secure",
      },
      anxious: {
        label: "불안",
        questionIds: ["q1", "q2", "q6", "q7"],
        resultId: "anxious",
      },
      avoidant: {
        label: "회피",
        questionIds: ["q3", "q4", "q8", "q9"],
        resultId: "avoidant",
      },
    },
  },
};

