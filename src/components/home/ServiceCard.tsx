"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { HomeService } from "@/lib/home-services";

const ACCENTS: Record<
  HomeService["accent"],
  { border: string; bg: string; badge: string; title: string }
> = {
  rose: {
    border: "border-rose-200 dark:border-rose-900/50",
    bg: "from-rose-50/80 to-card dark:from-rose-950/30",
    badge: "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-200",
    title: "text-rose-900 dark:text-rose-100",
  },
  amber: {
    border: "border-amber-200 dark:border-amber-900/50",
    bg: "from-amber-50/80 to-card dark:from-amber-950/30",
    badge: "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-200",
    title: "text-amber-900 dark:text-amber-100",
  },
  sky: {
    border: "border-sky-200 dark:border-sky-900/50",
    bg: "from-sky-50/80 to-card dark:from-sky-950/30",
    badge: "bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-200",
    title: "text-sky-900 dark:text-sky-100",
  },
  violet: {
    border: "border-violet-200 dark:border-violet-900/50",
    bg: "from-violet-50/80 to-card dark:from-violet-950/30",
    badge: "bg-violet-100 text-violet-800 dark:bg-violet-950 dark:text-violet-200",
    title: "text-violet-900 dark:text-violet-100",
  },
  emerald: {
    border: "border-emerald-200 dark:border-emerald-900/50",
    bg: "from-emerald-50/80 to-card dark:from-emerald-950/30",
    badge: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200",
    title: "text-emerald-900 dark:text-emerald-100",
  },
  zinc: {
    border: "border-border",
    bg: "from-muted/50 to-card",
    badge: "bg-muted text-muted-foreground",
    title: "text-card-foreground",
  },
};

export function ServiceCard({ service }: { service: HomeService }) {
  const a = ACCENTS[service.accent];
  return (
    <motion.div whileHover={{ y: -2 }} transition={{ duration: 0.15 }}>
      <Link
        href={service.href}
        className={[
          "group block h-full rounded-2xl border bg-gradient-to-b p-5 shadow-sm transition hover:shadow-md",
          a.border,
          a.bg,
        ].join(" ")}
      >
        <div className="flex items-start justify-between gap-2">
          <p className={["text-base font-semibold", a.title].join(" ")}>
            {service.title}
          </p>
          {service.badge ? (
            <span
              className={[
                "shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide",
                a.badge,
              ].join(" ")}
            >
              {service.badge}
            </span>
          ) : null}
        </div>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          {service.description}
        </p>
        <p className="mt-4 text-sm font-semibold text-card-foreground group-hover:underline">
          시작하기 →
        </p>
      </Link>
    </motion.div>
  );
}
