import { createOgImage } from "@/components/og/createOgImage";

export const runtime = "edge";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const title = searchParams.get("title") ?? "테스트/사주/유형";
  const subtitle = searchParams.get("subtitle") ?? "심리 테스트 · 사주 · MBTI";
  const badge = searchParams.get("badge") ?? undefined;

  return createOgImage(title, subtitle, badge ?? undefined);
}
