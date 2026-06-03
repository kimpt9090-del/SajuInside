"use client";

import dynamic from "next/dynamic";

export const ThemeToggleSlot = dynamic(
  () =>
    import("@/components/layout/ThemeProvider").then((m) => m.ThemeToggle),
  { ssr: false, loading: () => null },
);
