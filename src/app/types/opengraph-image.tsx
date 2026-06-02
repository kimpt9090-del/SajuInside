import { createOgImage } from "@/components/og/createOgImage";

export const alt = "성격 유형 검사";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return createOgImage("성격 유형 검사", "MBTI · 4가지 기질");
}
