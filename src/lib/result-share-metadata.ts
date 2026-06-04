import type { Metadata } from "next";

import { computeScore } from "@/features/tests/engine";
import { getTest } from "@/features/tests/registry";
import { absoluteUrl, buildTestMetadata } from "@/lib/metadata";
import {
  decodeSharePayload,
  type TestSharePayload,
} from "@/lib/share-url";

export function buildOgImageUrl(params: {
  title: string;
  subtitle: string;
  badge?: string;
}): string {
  const q = new URLSearchParams({
    title: params.title,
    subtitle: params.subtitle,
  });
  if (params.badge) q.set("badge", params.badge);
  return absoluteUrl(`/api/og?${q.toString()}`);
}

export async function buildResultShareMetadata(
  testId: string,
  encoded: string | undefined,
): Promise<Metadata> {
  const test = getTest(testId);
  if (!test) return { title: "테스트를 찾을 수 없음" };
  const base = buildTestMetadata(test);
  if (!encoded) return base;

  const payload = decodeSharePayload<TestSharePayload>(encoded);
  if (!payload || payload.kind !== "test" || payload.id !== testId) {
    return base;
  }

  if (payload.v !== test.version) return base;

  const report = computeScore(test, {
    testId,
    version: test.version,
    answers: payload.a,
  });
  const result = test.results[report.resultId];
  const title = result?.title ?? report.resultId;
  const subtitle = result?.summary ?? test.description;
  const badge = report.mbtiCode;

  const ogImage = buildOgImageUrl({ title, subtitle, badge });

  return {
    ...base,
    title: `${title} | ${test.title}`,
    description: subtitle,
    openGraph: {
      ...base.openGraph,
      title: `${title} | ${test.title}`,
      description: subtitle,
      images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      ...base.twitter,
      card: "summary_large_image",
      title: `${title} | ${test.title}`,
      description: subtitle,
      images: [ogImage],
    },
  };
}
