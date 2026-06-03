"use client";

import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  if (typeof window !== "undefined") {
    console.error(error);
  }

  return (
    <div className="mx-auto flex min-h-[50vh] max-w-lg flex-col items-center justify-center bg-background px-5 py-12 text-center">
      <h1 className="text-xl font-semibold text-foreground">
        문제가 발생했습니다
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">
        새로고침하거나 아래 버튼으로 다시 시도해 주세요.
      </p>
      <div className="mt-6 flex flex-col gap-2 sm:flex-row">
        <button type="button" onClick={reset} className="btn-primary">
          다시 시도
        </button>
        <Link href="/" className="btn-secondary">
          홈으로
        </Link>
      </div>
    </div>
  );
}
