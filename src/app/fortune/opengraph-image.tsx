import { createOgImage } from "@/components/og/createOgImage";

export const alt = "사주/만세력";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return createOgImage("사주/만세력", "생년월일시로 보는 사주 팔자 8글자");
}
