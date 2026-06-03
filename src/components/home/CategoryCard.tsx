"use client";

import Link from "next/link";
import { motion } from "framer-motion";

const ACCENTS: Record<
  string,
  { border: string; bg: string; dot: string; title: string }
> = {
  rose: {
    border: "border-rose-200",
    bg: "from-rose-50 to-white",
    dot: "bg-rose-500",
    title: "text-rose-700",
  },
  amber: {
    border: "border-amber-200",
    bg: "from-amber-50 to-white",
    dot: "bg-amber-500",
    title: "text-amber-700",
  },
  sky: {
    border: "border-sky-200",
    bg: "from-sky-50 to-white",
    dot: "bg-sky-500",
    title: "text-sky-700",
  },
};

export function CategoryCard({
  title,
  description,
  href,
  accent,
}: {
  title: string;
  description: string;
  href: string;
  accent: keyof typeof ACCENTS;
}) {
  const a = ACCENTS[accent];
  return (
    <motion.div
      initial={false}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
    >
      <Link
        href={href}
        className={[
          "group block rounded-2xl border bg-gradient-to-b p-5 shadow-sm transition",
          "hover:-translate-y-0.5 hover:shadow-md active:translate-y-0",
          a.border,
          a.bg,
        ].join(" ")}
      >
        <div className="flex items-center gap-2">
          <span className={["h-2 w-2 rounded-full", a.dot].join(" ")} />
          <p className={["text-sm font-semibold", a.title].join(" ")}>{title}</p>
        </div>
        <p className="mt-2 text-sm leading-6 text-zinc-600">{description}</p>
        <p className="mt-4 text-sm font-semibold text-zinc-900">
          열기 <span className="transition group-hover:translate-x-0.5 inline-block">→</span>
        </p>
      </Link>
    </motion.div>
  );
}

