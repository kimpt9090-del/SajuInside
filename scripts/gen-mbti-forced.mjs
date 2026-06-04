import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const src = path.join(__dirname, "../src/features/tests/tests/mbti-full-questions.ts");
const out = path.join(__dirname, "../src/features/tests/tests/mbti-forced-questions.ts");
const raw = fs.readFileSync(src, "utf8");

const texts = {};
for (const m of raw.matchAll(/\{ id: "(q\d+)", text: "([^"]+)" \}/g)) {
  texts[m[1]] = m[2];
}

const POLE_LABEL = {
  E: "외향(E)",
  I: "내향(I)",
  S: "감각(S)",
  N: "직관(N)",
  T: "사고(T)",
  F: "감정(F)",
  J: "판단(J)",
  P: "인식(P)",
};

const AXES = [
  { id: "ei", poleA: "E", poleB: "I" },
  { id: "sn", poleA: "S", poleB: "N" },
  { id: "tf", poleA: "T", poleB: "F" },
  { id: "jp", poleA: "J", poleB: "P" },
];

const axisBlocks = raw.split("export const MBTI_FULL_AXES")[1];
const poleByQ = {};
for (const m of axisBlocks.matchAll(/(q\d+): \{ pole: "([EINSTFJP])" \}/g)) {
  poleByQ[m[1]] = m[2];
}

const pairs = [];
for (const axis of AXES) {
  const aList = [];
  const bList = [];
  for (const [qid, pole] of Object.entries(poleByQ)) {
    if (pole === axis.poleA) aList.push(qid);
    if (pole === axis.poleB) bList.push(qid);
  }
  const n = Math.max(aList.length, bList.length);
  for (let i = 0; i < n; i++) {
    const aId = aList[i % aList.length];
    const bId = bList[i % bList.length];
    pairs.push({
      axis: axis.id,
      poleA: axis.poleA,
      poleB: axis.poleB,
      optionA: texts[aId],
      optionB: texts[bId],
    });
  }
}

while (pairs.length < 93) {
  const i = pairs.length;
  const axis = AXES[i % AXES.length];
  const aList = [];
  const bList = [];
  for (const [qid, pole] of Object.entries(poleByQ)) {
    if (pole === axis.poleA) aList.push(qid);
    if (pole === axis.poleB) bList.push(qid);
  }
  const aId = aList[i % Math.max(1, aList.length)] ?? `q${(i % 93) + 1}`;
  const bId = bList[i % Math.max(1, bList.length)] ?? `q${((i + 1) % 93) + 1}`;
  pairs.push({
    axis: axis.id,
    poleA: axis.poleA,
    poleB: axis.poleB,
    optionA: texts[aId] ?? "계획을 세우고 일정대로 진행하는 편이다.",
    optionB: texts[bId] ?? "상황에 맞게 유연하게 움직이는 편이다.",
  });
}

const forced = pairs.slice(0, 93).map((p, idx) => {
  const id = `fq${idx + 1}`;
  return {
    id,
    text: "두 문장 중 더 나와 가까운 쪽을 선택하세요.",
    binary: {
      optionA: p.optionA,
      optionB: p.optionB,
      poleA: p.poleA,
      poleB: p.poleB,
    },
  };
});

const axisConfig = AXES.map((axis) => {
  const questions = {};
  forced.forEach((q) => {
    if (q.binary.poleA === axis.poleA || q.binary.poleB === axis.poleB) {
      if (q.binary.poleA === axis.poleA && q.binary.poleB === axis.poleB) {
        questions[q.id] = { poleA: axis.poleA, poleB: axis.poleB };
      }
    }
  });
  forced.forEach((q) => {
    const b = q.binary;
    if (b.poleA === axis.poleA && b.poleB === axis.poleB) {
      questions[q.id] = { poleA: axis.poleA, poleB: axis.poleB };
    }
  });
  return { ...axis, questions };
});

const lines = forced.map((q) => {
  const esc = (s) => s.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
  return `  { id: "${q.id}", text: "${esc(q.text)}", binary: { optionA: "${esc(q.binary.optionA)}", optionB: "${esc(q.binary.optionB)}", poleA: "${q.binary.poleA}", poleB: "${q.binary.poleB}" } },`;
});

const axisLines = axisConfig.map((ax) => {
  const qEntries = Object.entries(ax.questions)
    .map(([k]) => `      ${k}: { poleA: "${ax.poleA}", poleB: "${ax.poleB}" },`)
    .join("\n");
  return `  {
    id: "${ax.id}",
    poleA: { key: "${ax.poleA}", label: "${POLE_LABEL[ax.poleA]}" },
    poleB: { key: "${ax.poleB}", label: "${POLE_LABEL[ax.poleB]}" },
    questions: {
${qEntries}
    },
  },`;
});

const file = `import type { TestQuestion } from "../types";

/** MBTI 강제선택 93문항 — Form M A/B 스타일 (자동 생성) */
export const MBTI_FORCED_QUESTIONS: TestQuestion[] = [
${lines.join("\n")}
];

export const MBTI_FORCED_AXES = [
${axisLines.join("\n")}
] as const;
`;

fs.writeFileSync(out, file, "utf8");
console.log(`Wrote ${forced.length} forced-choice questions to ${out}`);
