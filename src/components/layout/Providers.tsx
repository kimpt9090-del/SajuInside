"use client";

import { ThemeProvider } from "@/components/layout/ThemeProvider";
import { AuthProvider } from "@/contexts/AuthProvider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <AuthProvider>{children}</AuthProvider>
    </ThemeProvider>
  );
}
