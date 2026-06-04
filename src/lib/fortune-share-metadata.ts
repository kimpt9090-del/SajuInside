import type { Metadata } from "next";

import { calculateCompatibility } from "@/features/fortune/compatibility";
import { calculateSajuWithReport } from "@/features/fortune/calculator";
import { interpretPastLife } from "@/features/fortune/past-life";
import {
  compactToBirth,
  decodeSharePayload,
  type CompatSharePayload,
  type PastLifeSharePayload,
  type SajuSharePayload,
} from "@/lib/share-url";
import { buildOgImageUrl } from "@/lib/result-share-metadata";
import { SITE_NAME } from "@/lib/metadata";

export async function buildSajuResultMetadata(
  encoded: string | undefined,
): Promise<Metadata> {
  const base: Metadata = {
    title: `사주 결과 | ${SITE_NAME}`,
    description: "생년월일시 기반 사주 팔자·오행·운세 해석",
  };
  if (!encoded) return base;

  const payload = decodeSharePayload<SajuSharePayload>(encoded);
  if (payload?.kind !== "saju") return base;

  try {
    const result = calculateSajuWithReport(compactToBirth(payload.b));
    const title = result.report?.headline ?? "사주 팔자 결과";
    const subtitle =
      result.report?.subheadline ?? `${result.pillars.day.stem}${result.pillars.day.branch} 일주`;
    const ogImage = buildOgImageUrl({
      title,
      subtitle,
      badge: "사주",
    });

    return {
      title: `${title} | ${SITE_NAME}`,
      description: subtitle,
      openGraph: {
        title,
        description: subtitle,
        images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
      },
      twitter: {
        card: "summary_large_image",
        title,
        description: subtitle,
        images: [ogImage],
      },
    };
  } catch {
    return base;
  }
}

export async function buildCompatResultMetadata(
  encoded: string | undefined,
): Promise<Metadata> {
  const base: Metadata = {
    title: `궁합 결과 | ${SITE_NAME}`,
    description: "남녀 사주 궁합 점수·연애·결혼 조언",
  };
  if (!encoded) return base;

  const payload = decodeSharePayload<CompatSharePayload>(encoded);
  if (payload?.kind !== "compat") return base;

  try {
    const report = calculateCompatibility({
      male: compactToBirth(payload.m),
      female: compactToBirth(payload.f),
    });
    const title = `궁합 ${report.score}점`;
    const subtitle = report.summary;
    const ogImage = buildOgImageUrl({ title, subtitle, badge: "궁합" });

    return {
      title: `${title} | ${SITE_NAME}`,
      description: subtitle,
      openGraph: {
        title,
        description: subtitle,
        images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
      },
      twitter: {
        card: "summary_large_image",
        title,
        description: subtitle,
        images: [ogImage],
      },
    };
  } catch {
    return base;
  }
}

export async function buildPastLifeResultMetadata(
  encoded: string | undefined,
): Promise<Metadata> {
  const base: Metadata = {
    title: `전생 결과 | ${SITE_NAME}`,
    description: "생년월일 기반 전생 직업·성격·카르마 메시지",
  };
  if (!encoded) return base;

  const payload = decodeSharePayload<PastLifeSharePayload>(encoded);
  if (payload?.kind !== "pastlife") return base;

  try {
    const birth = compactToBirth(payload.b);
    const report = interpretPastLife(birth);
    const title = report.report.headline;
    const subtitle = report.report.subheadline ?? report.summary;
    const ogImage = buildOgImageUrl({ title, subtitle, badge: "전생" });

    return {
      title: `${title} | ${SITE_NAME}`,
      description: subtitle,
      openGraph: {
        title,
        description: subtitle,
        images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
      },
      twitter: {
        card: "summary_large_image",
        title,
        description: subtitle,
        images: [ogImage],
      },
    };
  } catch {
    return base;
  }
}
