import { createOgImage } from "@/components/og/createOgImage";

export const alt = "사주 결과";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return createOgImage("사주 결과", "년·월·일·시주 천간지지");
}
