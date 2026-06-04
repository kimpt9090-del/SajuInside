"use client";

type Props = {
  optionA: string;
  optionB: string;
  value: "a" | "b" | null;
  onChange: (v: "a" | "b") => void;
};

export function BinaryChoices({ optionA, optionB, value, onChange }: Props) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {(
        [
          { key: "a" as const, label: "A", text: optionA },
          { key: "b" as const, label: "B", text: optionB },
        ] as const
      ).map((opt) => {
        const selected = value === opt.key;
        return (
          <button
            key={opt.key}
            type="button"
            onClick={() => onChange(opt.key)}
            className={`rounded-xl border-2 p-4 text-left transition ${
              selected
                ? "border-violet-500 bg-violet-50 dark:border-violet-400 dark:bg-violet-950/50"
                : "border-border bg-card hover:border-violet-300 dark:hover:border-violet-700"
            }`}
          >
            <span className="text-xs font-bold uppercase tracking-wide text-violet-600 dark:text-violet-300">
              {opt.label}
            </span>
            <p className="mt-2 text-sm font-medium leading-6 text-card-foreground">
              {opt.text}
            </p>
          </button>
        );
      })}
    </div>
  );
}
