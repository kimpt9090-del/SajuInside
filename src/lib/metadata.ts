import type { Metadata } from "next";
import type { TestDefinition } from "@/features/tests/types";
import { publicEnv } from "@/lib/env";

const SITE_NAME = "테스트/사주/유형";
const SITE_URL = publicEnv.siteUrl;

export function buildTestMetadata(test: TestDefinition): Metadata {
  const title = `${test.title} | ${SITE_NAME}`;
  const description = test.description;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      siteName: SITE_NAME,
      locale: "ko_KR",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export function absoluteUrl(path: string) {
  return `${SITE_URL.replace(/\/$/, "")}${path.startsWith("/") ? path : `/${path}`}`;
}

export { SITE_NAME, SITE_URL };
