"use client";

import { useMemo, useState } from "react";
import {
  MBTI_TYPES,
  getCompatibilityRanking,
  getMbtiCompatibility,
  tierBgClass,
  tierColorClass,
  type CompatibilityResult,
  type MbtiType,
} from "@/features/tests/reports/mbti-compatibility";

type Props = {
  myType: string;
};

function Cell({
  result,
  isMine,
  isSelected,
  onSelect,
}: {
  result: CompatibilityResult;
  isMine: boolean;
  isSelected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      title={`${result.score}점 · ${result.label}`}
      className={[
        "flex h-7 w-7 items-center justify-center rounded text-[10px] font-semibold transition sm:h-8 sm:w-8 sm:text-xs",
        tierColorClass(result.tier),
        isMine ? "ring-2 ring-zinc-900 ring-offset-1" : "",
        isSelected ? "ring-2 ring-violet-600 ring-offset-1" : "",
        "text-white hover:opacity-90",
      ].join(" ")}
    >
      {result.score}
    </button>
  );
}

export function MbtiCompatibilityMatrix({ myType }: Props) {
  const [selected, setSelected] = useState<MbtiType | null>(null);
  const ranking = useMemo(() => getCompatibilityRanking(myType), [myType]);
  const top3 = ranking.filter((r) => r.type !== myType).slice(0, 3);
  const selectedResult =
    selected && selected !== myType
      ? getMbtiCompatibility(myType, selected)
      : null;

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold text-zinc-900">
          {myType} 궁합 BEST 3
        </p>
        <ul className="mt-3 space-y-2">
          {top3.map((r, i) => (
            <li
              key={r.type}
              className={[
                "flex items-center justify-between rounded-xl border px-3 py-2 text-sm",
                tierBgClass(r.tier),
              ].join(" ")}
            >
              <span>
                <span className="font-semibold">{i + 1}. {r.type}</span>
                <span className="ml-2 text-xs opacity-80">{r.label}</span>
              </span>
              <span className="font-bold">{r.score}점</span>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <p className="text-sm font-semibold text-zinc-900">16×16 궁합 매트릭스</p>
        <p className="mt-1 text-xs text-zinc-600">
          가로·세로 유형 조합의 점수(35–98). 내 유형({myType}) 행·열이 강조됩니다.
          셀을 눌러 상세를 확인하세요.
        </p>
        <div className="mt-3 overflow-x-auto">
          <div className="inline-block min-w-max">
            <div className="flex gap-0.5">
              <div className="h-7 w-7 shrink-0 sm:h-8 sm:w-8" />
              {MBTI_TYPES.map((col) => (
                <div
                  key={col}
                  className={[
                    "flex h-7 w-7 shrink-0 items-center justify-center text-[9px] font-semibold sm:h-8 sm:w-8 sm:text-[10px]",
                    col === myType ? "text-sky-700" : "text-zinc-500",
                  ].join(" ")}
                >
                  {col.slice(0, 2)}
                </div>
              ))}
            </div>
            {MBTI_TYPES.map((row) => (
              <div key={row} className="mt-0.5 flex gap-0.5">
                <div
                  className={[
                    "flex h-7 w-7 shrink-0 items-center justify-center text-[9px] font-semibold sm:h-8 sm:w-8 sm:text-[10px]",
                    row === myType ? "text-sky-700" : "text-zinc-500",
                  ].join(" ")}
                >
                  {row.slice(0, 2)}
                </div>
                {MBTI_TYPES.map((col) => {
                  const result = getMbtiCompatibility(row, col);
                  const isMine = row === myType || col === myType;
                  const isSelected = selected === col && row === myType;
                  return (
                    <Cell
                      key={col}
                      result={result}
                      isMine={isMine}
                      isSelected={isSelected}
                      onSelect={() => {
                        if (row === myType) setSelected(col);
                      }}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </div>
        <div className="mt-3 flex flex-wrap gap-2 text-xs text-zinc-600">
          <span className="inline-flex items-center gap-1">
            <span className="h-3 w-3 rounded bg-emerald-500" /> 88+ 천생연분
          </span>
          <span className="inline-flex items-center gap-1">
            <span className="h-3 w-3 rounded bg-sky-400" /> 75+ 좋음
          </span>
          <span className="inline-flex items-center gap-1">
            <span className="h-3 w-3 rounded bg-amber-400" /> 60+ 노력형
          </span>
          <span className="inline-flex items-center gap-1">
            <span className="h-3 w-3 rounded bg-rose-400" /> 60 미만 주의
          </span>
        </div>
      </div>

      {selected && selectedResult ? (
        <div
          className={[
            "rounded-xl border p-4",
            tierBgClass(selectedResult.tier),
          ].join(" ")}
        >
          <p className="text-sm font-semibold">
            {myType} × {selected} — {selectedResult.score}점 ({selectedResult.label})
          </p>
          <p className="mt-2 text-sm leading-6 opacity-90">{selectedResult.tip}</p>
        </div>
      ) : (
        <p className="text-xs text-zinc-500">
          매트릭스에서 {myType} 행의 셀을 눌러 다른 유형과의 궁합을 확인하세요.
        </p>
      )}
    </div>
  );
}
