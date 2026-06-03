"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="ko">
      <body className="flex min-h-screen items-center justify-center bg-zinc-50 p-6 font-sans text-zinc-900">
        <div className="max-w-md text-center">
          <h1 className="text-xl font-semibold">서비스 오류</h1>
          <p className="mt-2 text-sm text-zinc-600">
            {error.message || "알 수 없는 오류가 발생했습니다."}
          </p>
          <button
            type="button"
            onClick={reset}
            className="mt-6 rounded-xl bg-zinc-900 px-4 py-3 text-sm font-semibold text-white"
          >
            다시 시도
          </button>
        </div>
      </body>
    </html>
  );
}
