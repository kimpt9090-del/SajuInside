"use client";

import { useState } from "react";

import { CompatibilityClient } from "./CompatibilityClient";
import { FemaleFirstInvite } from "./FemaleFirstInvite";

export function CompatibilityPageClient() {
  const [mode, setMode] = useState<"default" | "female-invite">("default");

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          className={mode === "default" ? "btn-primary text-xs" : "btn-secondary text-xs"}
          onClick={() => setMode("default")}
          data-testid="compat-mode-default"
        >
          남→여 순서 입력
        </button>
        <button
          type="button"
          className={
            mode === "female-invite" ? "btn-primary text-xs" : "btn-secondary text-xs"
          }
          onClick={() => setMode("female-invite")}
          data-testid="compat-mode-female-invite"
        >
          여자 사주 초대 링크
        </button>
      </div>
      {mode === "default" ? <CompatibilityClient /> : <FemaleFirstInvite />}
    </div>
  );
}
