"use client";

import { useCallback, useEffect, useState, useSyncExternalStore } from "react";
import { toPng } from "html-to-image";
import { publicEnv } from "@/lib/env";

declare global {
  interface Window {
    Kakao?: {
      init: (key: string) => void;
      isInitialized: () => boolean;
      Share: {
        sendDefault: (opts: {
          objectType: string;
          content: {
            title: string;
            description: string;
            imageUrl?: string;
            link: { mobileWebUrl: string; webUrl: string };
          };
          buttons?: Array<{
            title: string;
            link: { mobileWebUrl: string; webUrl: string };
          }>;
        }) => void;
      };
    };
  }
}

export function ShareButtons({
  title,
  text,
  captureTargetId,
}: {
  title: string;
  text: string;
  captureTargetId?: string;
}) {
  const url = useSyncExternalStore(
    () => () => {},
    () => (typeof window !== "undefined" ? window.location.href : ""),
    () => "",
  );
  const [copied, setCopied] = useState(false);
  const [capturing, setCapturing] = useState(false);
  const [kakaoReady, setKakaoReady] = useState(false);

  const initKakao = useCallback(() => {
    if (!publicEnv.kakaoJsKey || !window.Kakao) return;
    if (!window.Kakao.isInitialized()) {
      window.Kakao.init(publicEnv.kakaoJsKey);
    }
    setKakaoReady(true);
  }, []);

  useEffect(() => {
    if (!publicEnv.kakaoJsKey) return;

    const onReady = () => initKakao();

    if (window.Kakao) {
      queueMicrotask(onReady);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://t1.kakaocdn.net/kakao_js_sdk/2.7.2/kakao.min.js";
    script.async = true;
    script.onload = onReady;
    document.head.appendChild(script);

    return () => {
      script.remove();
    };
  }, [initKakao]);

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

  function onKakaoShare() {
    if (!publicEnv.kakaoJsKey) {
      alert(
        "카카오 공유를 사용하려면 .env.local에 NEXT_PUBLIC_KAKAO_JS_KEY를 설정하세요.",
      );
      return;
    }
    if (!kakaoReady || !window.Kakao) {
      alert("카카오 SDK를 불러오는 중입니다. 잠시 후 다시 시도해주세요.");
      return;
    }

    window.Kakao.Share.sendDefault({
      objectType: "feed",
      content: {
        title,
        description: text,
        link: { mobileWebUrl: url, webUrl: url },
      },
      buttons: [
        { title: "결과 보러가기", link: { mobileWebUrl: url, webUrl: url } },
      ],
    });
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
    <div className="flex flex-wrap gap-2">
      <button
        type="button"
        onClick={onKakaoShare}
        className="touch-target inline-flex min-h-11 items-center justify-center rounded-xl bg-[#FEE500] px-4 py-3 text-sm font-semibold text-[#191919] shadow-sm transition hover:brightness-95"
      >
        카카오톡 공유
      </button>
      <button type="button" onClick={onShare} className="btn-primary">
        공유하기
      </button>
      <button type="button" onClick={onCopy} className="btn-secondary">
        {copied ? "복사됨" : "클립보드 복사"}
      </button>
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
  );
}
