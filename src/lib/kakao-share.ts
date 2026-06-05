import { publicEnv } from "@/lib/env";

type KakaoShareApi = {
  isInitialized: () => boolean;
  init: (key: string) => void;
  Share: {
    sendDefault: (args: {
      objectType: "feed";
      content: {
        title: string;
        description: string;
        imageUrl: string;
        link: { mobileWebUrl: string; webUrl: string };
      };
    }) => void;
  };
};

declare global {
  interface Window {
    Kakao?: KakaoShareApi;
  }
}

let loadPromise: Promise<boolean> | null = null;

export function isKakaoShareAvailable(): boolean {
  return Boolean(publicEnv.kakaoJsKey);
}

export function loadKakaoSdk(): Promise<boolean> {
  if (!publicEnv.kakaoJsKey) return Promise.resolve(false);
  if (typeof window === "undefined") return Promise.resolve(false);
  if (window.Kakao?.isInitialized()) return Promise.resolve(true);

  if (loadPromise) return loadPromise;

  loadPromise = new Promise((resolve) => {
    const existing = document.querySelector<HTMLScriptElement>(
      'script[data-kakao-sdk="true"]',
    );
    if (existing) {
      existing.addEventListener("load", () => resolve(initKakao()), { once: true });
      if (window.Kakao) resolve(initKakao());
      return;
    }

    const script = document.createElement("script");
    script.src = "https://t1.kakaocdn.net/kakao_js_sdk/2/kakao.min.js";
    script.async = true;
    script.dataset.kakaoSdk = "true";
    script.onload = () => resolve(initKakao());
    script.onerror = () => resolve(false);
    document.head.appendChild(script);
  });

  return loadPromise;
}

function initKakao(): boolean {
  const key = publicEnv.kakaoJsKey;
  if (!key || !window.Kakao) return false;
  if (!window.Kakao.isInitialized()) {
    window.Kakao.init(key);
  }
  return window.Kakao.isInitialized();
}

export async function shareViaKakao(options: {
  title: string;
  description: string;
  url: string;
}): Promise<{ ok: boolean; message?: string }> {
  const ready = await loadKakaoSdk();
  if (!ready || !window.Kakao) {
    return {
      ok: false,
      message: "카카오 공유 키가 설정되지 않았거나 SDK 로드에 실패했습니다.",
    };
  }

  try {
    const imageUrl = `${publicEnv.siteUrl}/opengraph-image`;
    window.Kakao.Share.sendDefault({
      objectType: "feed",
      content: {
        title: options.title,
        description: options.description,
        imageUrl,
        link: {
          mobileWebUrl: options.url,
          webUrl: options.url,
        },
      },
    });
    return { ok: true };
  } catch {
    return { ok: false, message: "카카오 공유에 실패했습니다." };
  }
}
