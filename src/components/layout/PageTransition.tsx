"use client";

import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

/** 첫 페인트는 즉시 표시(initial=false). 라우트 변경 시만 짧게 페이드인. */
export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <motion.div
      key={pathname}
      initial={false}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.15, ease: "easeOut" }}
      className="flex flex-1 flex-col"
    >
      {children}
    </motion.div>
  );
}
