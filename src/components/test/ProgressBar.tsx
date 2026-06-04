"use client";

import { motion } from "framer-motion";

export function ProgressBar({
  value,
  max,
}: {
  value: number;
  max: number;
}) {
  const pct = max > 0 ? Math.min(100, Math.max(0, (value / max) * 100)) : 0;
  return (
    <div className="w-full">
      <div className="flex items-center justify-between text-xs text-zinc-500">
        <span>진행률</span>
        <span>{Math.round(pct)}%</span>
      </div>
      <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-zinc-100">
        <motion.div
          className="h-full rounded-full bg-primary"
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ type: "spring", stiffness: 220, damping: 26 }}
        />
      </div>
    </div>
  );
}

