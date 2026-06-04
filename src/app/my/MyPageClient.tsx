"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";

import {
  clearResultHistory,
  deleteResultHistory,
  exportResultHistory,
  getUserProfile,
  importResultHistory,
  isPinned,
  listCompletedTestRuns,
  listResultHistory,
  setUserProfile,
  togglePin,
  type ResultHistoryEntry,
} from "@/lib/result-history";
import { testResultPath } from "@/lib/test-paths";

export function MyPageClient() {
  const [history, setHistory] = useState<ResultHistoryEntry[]>([]);
  const [completed, setCompleted] = useState(
    [] as ReturnType<typeof listCompletedTestRuns>,
  );
  const [nickname, setNickname] = useState("");
  const [importMsg, setImportMsg] = useState<string | null>(null);

  const refresh = useCallback(() => {
    setHistory(listResultHistory());
    setCompleted(listCompletedTestRuns());
    setNickname(getUserProfile().nickname);
  }, []);

  useEffect(() => {
    queueMicrotask(() => refresh());
    window.addEventListener("result-history-change", refresh);
    return () => window.removeEventListener("result-history-change", refresh);
  }, [refresh]);

  function saveNickname() {
    setUserProfile({ nickname: nickname.trim() });
    refresh();
  }

  function handleExport() {
    const blob = new Blob([exportResultHistory()], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `my-results-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function handleImport(file: File) {
    const reader = new FileReader();
    reader.onload = () => {
      const ok = importResultHistory(String(reader.result ?? ""));
      setImportMsg(ok ? "가져오기 완료" : "파일 형식이 올바르지 않습니다");
      refresh();
    };
    reader.readAsText(file);
  }

  return (
    <div className="space-y-8">
      <section className="card-surface p-5">
        <h2 className="text-lg font-semibold">프로필</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          닉네임은 기기·클라우드 동기화 시 함께 저장됩니다.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <input
            type="text"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            placeholder="닉네임 (선택)"
            className="rounded-lg border border-border bg-background px-3 py-2 text-sm"
            maxLength={24}
          />
          <button type="button" onClick={saveNickname} className="btn-primary text-sm">
            저장
          </button>
        </div>
      </section>

      <section className="card-surface p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-lg font-semibold">최근 결과 (7일)</h2>
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={handleExport} className="btn-secondary text-sm">
              JSON 내보내기
            </button>
            <label className="btn-secondary cursor-pointer text-sm">
              JSON 가져오기
              <input
                type="file"
                accept="application/json,.json"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) handleImport(f);
                  e.target.value = "";
                }}
              />
            </label>
            <button
              type="button"
              onClick={() => {
                if (confirm("모든 기록을 삭제할까요?")) {
                  clearResultHistory();
                  refresh();
                }
              }}
              className="btn-secondary text-sm text-rose-600"
            >
              전체 삭제
            </button>
          </div>
        </div>
        {importMsg ? (
          <p className="mt-2 text-sm text-violet-700 dark:text-violet-300">{importMsg}</p>
        ) : null}
        {history.length === 0 ? (
          <p className="mt-4 text-sm text-muted-foreground">저장된 결과가 없습니다.</p>
        ) : (
          <ul className="mt-4 space-y-2">
            {history.map((item) => (
              <li
                key={`${item.kind}-${item.id}-${item.at}`}
                className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-border p-3"
              >
                <div>
                  <p className="font-medium text-foreground">
                    {isPinned(item) ? "📌 " : ""}
                    {item.title}
                  </p>
                  <p className="text-xs text-muted-foreground">{item.subtitle}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Link href={item.href} className="btn-primary text-xs">
                    보기
                  </Link>
                  <button
                    type="button"
                    className="btn-secondary text-xs"
                    onClick={() => {
                      togglePin(item);
                      refresh();
                    }}
                  >
                    {isPinned(item) ? "고정 해제" : "고정"}
                  </button>
                  <button
                    type="button"
                    className="btn-secondary text-xs"
                    onClick={() => {
                      deleteResultHistory(item);
                      refresh();
                    }}
                  >
                    삭제
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="card-surface p-5">
        <h2 className="text-lg font-semibold">이번 세션 완료 테스트</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          브라우저 탭을 닫으면 사라질 수 있습니다. 공유 링크로 저장하거나 JSON
          내보내기를 이용하세요.
        </p>
        {completed.length === 0 ? (
          <p className="mt-4 text-sm text-muted-foreground">완료된 테스트가 없습니다.</p>
        ) : (
          <ul className="mt-4 space-y-2">
            {completed.map((c) => (
              <li key={c.testId}>
                <Link
                  href={testResultPath(c.category as "types" | "psychology", c.testId)}
                  className="text-sm font-medium text-violet-700 hover:underline dark:text-violet-300"
                >
                  {c.title}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="card-surface p-5">
        <h2 className="text-lg font-semibold">복합 리포트</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          MBTI + 애착 유형 결과를 함께 해석합니다. 두 테스트를 모두 완료한 뒤
          열어주세요.
        </p>
        <Link href="/types/composite" className="btn-primary mt-4 inline-block text-sm">
          MBTI × 애착 복합 리포트
        </Link>
      </section>
    </div>
  );
}
