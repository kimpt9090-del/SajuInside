"use client";

import dynamic from "next/dynamic";

export const ContinueTestsSlot = dynamic(
  () =>
    import("@/components/home/ContinueTests").then((m) => m.ContinueTests),
  { ssr: false, loading: () => null },
);
