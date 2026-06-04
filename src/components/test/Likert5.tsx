"use client";

import type { Likert5 } from "@/features/tests/types";
import { LIKERT_5_CHOICES } from "@/features/tests/likert";

export function Likert5Choices({
  value,
  onChange,
  name,
}: {
  value: Likert5 | null;
  onChange: (v: Likert5) => void;
  name: string;
}) {
  return (
    <div className="likert-grid-landscape grid grid-cols-1 gap-2 sm:grid-cols-5">
      {LIKERT_5_CHOICES.map((c) => {
        const selected = value === c.value;
        return (
          <label
            key={c.value}
            className={[
              "likert-choice touch-target",
              selected ? "likert-choice--selected" : "",
            ].join(" ")}
          >
            <span className="text-center">{c.label}</span>
            <input
              className="sr-only"
              type="radio"
              name={name}
              value={c.value}
              checked={selected}
              onChange={() => onChange(c.value)}
            />
          </label>
        );
      })}
    </div>
  );
}
