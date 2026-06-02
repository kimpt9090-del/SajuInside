import { createOgImage } from "@/components/og/createOgImage";

export const alt = "테스트/사주/유형 통합 플랫폼";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return createOgImage(
    "나를 더 잘 아는 테스트",
    "심리 테스트 · 사주/운세 · MBTI/성격 유형",
  );
}
