"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useSyncExternalStore,
} from "react";

type Theme = "light" | "dark" | "system";

const STORAGE_KEY = "theme-preference";

const ThemeCtx = createContext<{
  theme: Theme;
  setTheme: (t: Theme) => void;
} | null>(null);

function getSystemTheme(): "light" | "dark" {
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function getStoredTheme(): Theme {
  try {
    const v = localStorage.getItem(STORAGE_KEY);
    if (v === "light" || v === "dark" || v === "system") return v;
  } catch {
    // ignore
  }
  return "system";
}

function resolveTheme(theme: Theme): "light" | "dark" {
  return theme === "system" ? getSystemTheme() : theme;
}

function applyTheme(theme: Theme) {
  const root = document.documentElement;
  const resolved = resolveTheme(theme);
  root.classList.remove("light", "dark");
  root.classList.add(resolved);
}

function subscribeTheme(onStoreChange: () => void) {
  const mq = window.matchMedia("(prefers-color-scheme: dark)");
  const handler = () => {
    applyTheme(getStoredTheme());
    onStoreChange();
  };
  mq.addEventListener("change", handler);
  window.addEventListener("storage", handler);
  return () => {
    mq.removeEventListener("change", handler);
    window.removeEventListener("storage", handler);
  };
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);

  const storedTheme = useSyncExternalStore(
    subscribeTheme,
    getStoredTheme,
    (): Theme => "system",
  );

  // hydration: 서버·첫 클라이언트 페인트는 동일하게 "system"
  const theme = ready ? storedTheme : "system";

  useEffect(() => {
    applyTheme(getStoredTheme());
    queueMicrotask(() => setReady(true));
  }, []);

  function setTheme(next: Theme) {
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // ignore
    }
    applyTheme(next);
    window.dispatchEvent(new Event("storage"));
  }

  return (
    <ThemeCtx.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeCtx.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeCtx);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const cycle = () => {
    const order: Theme[] = ["light", "dark", "system"];
    const i = order.indexOf(theme);
    setTheme(order[(i + 1) % order.length]);
  };

  const label =
    theme === "system" ? "시스템" : theme === "dark" ? "다크" : "라이트";

  return (
    <button
      type="button"
      onClick={cycle}
      className="btn-secondary px-3 text-xs"
      aria-label={`테마 변경: 현재 ${label}`}
    >
      {label}
    </button>
  );
}
