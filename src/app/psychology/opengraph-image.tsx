import { createOgImage } from "@/components/og/createOgImage";

export const alt = "심리 테스트";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return createOgImage("심리 테스트", "5점 척도 · 결과 분석");
}
