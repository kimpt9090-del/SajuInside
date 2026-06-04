"use client";

import dynamic from "next/dynamic";

export const RecentResultsSlot = dynamic(
  () =>
    import("@/components/home/RecentResults").then((m) => m.RecentResults),
  { ssr: false, loading: () => null },
);
