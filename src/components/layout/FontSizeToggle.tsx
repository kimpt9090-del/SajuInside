"use client";

import { useEffect, useState } from "react";

const KEY = "font-scale";
const SIZES = [
  { id: "100", label: "가" },
  { id: "112", label: "가+" },
  { id: "125", label: "가++" },
] as const;

export function FontSizeToggle() {
  const [scale, setScale] = useState("100");

  useEffect(() => {
    queueMicrotask(() => {
      try {
        const v = localStorage.getItem(KEY) ?? "100";
        setScale(v);
        document.documentElement.style.setProperty("--font-scale", `${Number(v) / 100}`);
      } catch {
        // ignore
      }
    });
  }, []);

  function pick(id: string) {
    setScale(id);
    try {
      localStorage.setItem(KEY, id);
      document.documentElement.style.setProperty("--font-scale", `${Number(id) / 100}`);
    } catch {
      // ignore
    }
  }

  return (
    <div
      className="flex rounded-lg border border-border bg-background p-0.5"
      role="group"
      aria-label="글자 크기"
    >
      {SIZES.map((s) => (
        <button
          key={s.id}
          type="button"
          onClick={() => pick(s.id)}
          className={[
            "min-h-[2.25rem] min-w-[2.25rem] rounded-md px-2 text-xs font-semibold",
            scale === s.id
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:bg-muted",
          ].join(" ")}
        >
          {s.label}
        </button>
      ))}
    </div>
  );
}
