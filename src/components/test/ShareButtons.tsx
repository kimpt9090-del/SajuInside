"use client";

import { useCallback, useState, useSyncExternalStore } from "react";
import { toPng } from "html-to-image";

import { isKakaoShareAvailable, shareViaKakao } from "@/lib/kakao-share";

export function ShareButtons({
  title,
  text,
  captureTargetId,
  shareUrl,
}: {
  title: string;
  text: string;
  captureTargetId?: string;
  /** 공유·복사에 사용할 URL (결과 인코딩 링크). 없으면 현재 페이지 */
  shareUrl?: string;
}) {
  const pageUrl = useSyncExternalStore(
    () => () => {},
    () => (typeof window !== "undefined" ? window.location.href : ""),
    () => "",
  );
  const url = shareUrl || pageUrl;
  const [copied, setCopied] = useState(false);
  const [capturing, setCapturing] = useState(false);
  const [kakaoBusy, setKakaoBusy] = useState(false);
  const kakaoEnabled = isKakaoShareAvailable();

  const shareText = `${text}\n${url}`;

  const onCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      // ignore
    }
  }, [shareText]);

  async function onShare() {
    try {
      if (navigator.share) {
        await navigator.share({ title, text, url });
        return;
      }
    } catch {
      // cancelled
    }
    await onCopy();
  }

  async function onKakaoShare() {
    setKakaoBusy(true);
    try {
      const result = await shareViaKakao({
        title,
        description: text,
        url,
      });
      if (!result.ok && result.message) {
        alert(result.message);
      }
    } finally {
      setKakaoBusy(false);
    }
  }

  async function onCapture() {
    if (!captureTargetId) return;
    const el = document.getElementById(captureTargetId);
    if (!el) return;

    setCapturing(true);
    try {
      const dataUrl = await toPng(el, {
        cacheBust: true,
        pixelRatio: 2,
        backgroundColor: "#ffffff",
      });
      const link = document.createElement("a");
      link.download = `${title.replace(/\s+/g, "_")}_결과.png`;
      link.href = dataUrl;
      link.click();
    } catch {
      alert("이미지 저장에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setCapturing(false);
    }
  }

  return (
    <div className="space-y-2">
      {shareUrl && shareUrl !== pageUrl ? (
        <p className="text-xs text-muted-foreground">
          링크를 열면 같은 결과를 다시 볼 수 있습니다. (답변은 URL에만
          포함되며 서버에 저장되지 않습니다.)
        </p>
      ) : null}
      <div className="flex flex-wrap gap-2">
        <button type="button" onClick={onShare} className="btn-primary">
          공유하기
        </button>
        <button type="button" onClick={onCopy} className="btn-secondary">
          {copied ? "복사됨" : "링크 복사"}
        </button>
        {kakaoEnabled ? (
          <button
            type="button"
            onClick={() => void onKakaoShare()}
            disabled={kakaoBusy}
            className="btn-secondary disabled:opacity-50"
            data-testid="kakao-share"
          >
            {kakaoBusy ? "카카오…" : "카카오톡"}
          </button>
        ) : null}
        {captureTargetId ? (
          <button
            type="button"
            onClick={onCapture}
            disabled={capturing}
            className="btn-secondary disabled:opacity-50"
          >
            {capturing ? "저장 중…" : "결과 캡처하기"}
          </button>
        ) : null}
      </div>
    </div>
  );
}
