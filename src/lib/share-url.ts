/** 결과 공유 URL 인코딩 (sessionStorage 없이 링크로 결과 열기) */

import type { BirthInput, CompatibilityInput } from "@/features/fortune/types";
import type { TestAnswer } from "@/features/tests/types";

export const SHARE_PARAM = "r";

export function encodeSharePayload(obj: unknown): string {
  const json = JSON.stringify(obj);
  if (typeof window !== "undefined") {
    const bytes = new TextEncoder().encode(json);
    let binary = "";
    for (let i = 0; i < bytes.length; i++) {
      binary += String.fromCharCode(bytes[i]!);
    }
    const b64 = btoa(binary);
    return b64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  }
  return Buffer.from(json, "utf-8")
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

export function decodeSharePayload<T>(encoded: string): T | null {
  try {
    const pad =
      encoded.length % 4 === 0 ? "" : "=".repeat(4 - (encoded.length % 4));
    const b64 = encoded.replace(/-/g, "+").replace(/_/g, "/") + pad;
    let json: string;
    if (typeof window !== "undefined") {
      const binary = atob(b64);
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
      }
      json = new TextDecoder().decode(bytes);
    } else {
      json = Buffer.from(b64, "base64").toString("utf-8");
    }
    return JSON.parse(json) as T;
  } catch {
    return null;
  }
}

export function getShareParamFromUrl(): string | null {
  if (typeof window === "undefined") return null;
  return new URLSearchParams(window.location.search).get(SHARE_PARAM);
}

export function buildShareUrl(path: string, payload: unknown): string {
  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const sep = path.includes("?") ? "&" : "?";
  return `${origin}${path}${sep}${SHARE_PARAM}=${encodeSharePayload(payload)}`;
}

export type TestSharePayload = {
  kind: "test";
  id: string;
  v: number;
  a: Record<string, TestAnswer>;
};

export type SajuSharePayload = {
  kind: "saju";
  b: [number, number, number, number, number, 0 | 1, 0 | 1];
};

export type CompatSharePayload = {
  kind: "compat";
  m: SajuSharePayload["b"];
  f: SajuSharePayload["b"];
};

/** 파트너 한쪽만 입력된 궁합 초대 링크 */
export type CompatInviteSharePayload = {
  kind: "compat-invite";
  slot: "m" | "f";
  b: SajuSharePayload["b"];
  n?: string;
};

export type PastLifeSharePayload = {
  kind: "pastlife";
  b: SajuSharePayload["b"];
};

export type SharePayload =
  | TestSharePayload
  | SajuSharePayload
  | CompatSharePayload
  | CompatInviteSharePayload
  | PastLifeSharePayload;

export function birthToCompact(b: BirthInput): SajuSharePayload["b"] {
  return [
    b.year,
    b.month,
    b.day,
    b.hour,
    b.minute,
    b.gender === "male" ? 0 : 1,
    b.calendar === "solar" ? 0 : 1,
  ];
}

export function compactToBirth(c: SajuSharePayload["b"]): BirthInput {
  return {
    year: c[0],
    month: c[1],
    day: c[2],
    hour: c[3],
    minute: c[4],
    gender: c[5] === 0 ? "male" : "female",
    calendar: c[6] === 0 ? "solar" : "lunar",
  };
}

export function buildTestSharePayload(
  testId: string,
  version: number,
  answers: Record<string, TestAnswer>,
): TestSharePayload {
  return { kind: "test", id: testId, v: version, a: answers };
}

export function buildSajuSharePayload(birth: BirthInput): SajuSharePayload {
  return { kind: "saju", b: birthToCompact(birth) };
}

export function buildCompatSharePayload(
  input: CompatibilityInput,
): CompatSharePayload {
  return {
    kind: "compat",
    m: birthToCompact(input.male),
    f: birthToCompact(input.female),
  };
}

export function buildCompatInvitePayload(
  slot: "m" | "f",
  birth: BirthInput,
  nickname?: string,
): CompatInviteSharePayload {
  return {
    kind: "compat-invite",
    slot,
    b: birthToCompact(birth),
    ...(nickname?.trim() ? { n: nickname.trim() } : {}),
  };
}

export function buildCompatInviteUrl(
  slot: "m" | "f",
  birth: BirthInput,
  nickname?: string,
): string {
  return buildShareUrl(
    "/fortune/compatibility",
    buildCompatInvitePayload(slot, birth, nickname),
  );
}

export function buildPastLifeSharePayload(
  birth: BirthInput,
): PastLifeSharePayload {
  return { kind: "pastlife", b: birthToCompact(birth) };
}
