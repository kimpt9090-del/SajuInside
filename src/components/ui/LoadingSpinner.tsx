"use client";

import { motion } from "framer-motion";

export function LoadingSpinner({
  message = "결과를 분석하고 있어요…",
  subMessage = "잠시만 기다려 주세요",
}: {
  message?: string;
  subMessage?: string;
}) {
  return (
    <div
      className="flex min-h-[280px] flex-col items-center justify-center rounded-2xl border border-zinc-200 bg-gradient-to-b from-zinc-50 to-white p-8 shadow-sm"
      role="status"
      aria-live="polite"
    >
      <div className="relative flex h-16 w-16 items-center justify-center">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="absolute h-3 w-3 rounded-full bg-zinc-900"
            animate={{
              scale: [0.6, 1.2, 0.6],
              opacity: [0.35, 1, 0.35],
            }}
            transition={{
              duration: 1.2,
              repeat: Infinity,
              delay: i * 0.2,
              ease: "easeInOut",
            }}
            style={{
              transform: `rotate(${i * 120}deg) translateY(-22px)`,
            }}
          />
        ))}
        <motion.div
          className="h-8 w-8 rounded-full border-2 border-zinc-200 border-t-zinc-900"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
      </div>
      <p className="mt-6 text-base font-semibold text-zinc-900">{message}</p>
      <p className="mt-1 text-sm text-zinc-500">{subMessage}</p>
      <motion.div
        className="mt-4 flex gap-1"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="h-1.5 w-1.5 rounded-full bg-zinc-400"
            animate={{ y: [0, -6, 0] }}
            transition={{
              duration: 0.6,
              repeat: Infinity,
              delay: i * 0.15,
            }}
          />
        ))}
      </motion.div>
    </div>
  );
}
