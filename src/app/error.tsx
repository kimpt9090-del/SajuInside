"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto flex min-h-[50vh] max-w-lg flex-col items-center justify-center px-5 text-center">
      <h1 className="text-xl font-semibold text-foreground">
        문제가 발생했습니다
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">
        페이지를 불러오지 못했어요. 잠시 후 다시 시도해 주세요.
      </p>
      <button type="button" onClick={reset} className="btn-primary mt-6">
        다시 시도
      </button>
    </div>
  );
}
