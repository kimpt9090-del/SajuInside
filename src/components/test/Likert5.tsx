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
              "touch-target flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-xl border px-3 py-3 text-sm shadow-sm transition sm:px-4",
              selected
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-card text-card-foreground hover:bg-muted",
            ].join(" ")}
          >
            <span className="text-center font-semibold sm:hidden">{c.label}</span>
            <span className="hidden text-center sm:inline">{c.label}</span>
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
