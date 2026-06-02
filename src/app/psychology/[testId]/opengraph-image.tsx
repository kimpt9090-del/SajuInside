import { getTest } from "@/features/tests/registry";
import { createOgImage } from "@/components/og/createOgImage";

export const alt = "심리 테스트";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

type Props = { params: Promise<{ testId: string }> };

export default async function Image({ params }: Props) {
  const { testId } = await params;
  const test = getTest(testId);
  const title = test?.title ?? "심리 테스트";
  const subtitle = test?.description ?? "5점 척도 · 결과 그래프";
  return createOgImage(title, subtitle);
}
