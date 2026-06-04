import type { MetadataRoute } from "next";
import { GUIDES } from "@/content/guides";
import { TESTS } from "@/features/tests/registry";

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://saju-inside.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages = [
    "",
    "/my",
    "/guide",
    "/privacy",
    "/types",
    "/psychology",
    "/types/composite",
    "/fortune",
    "/fortune/result",
    "/fortune/compatibility",
    "/fortune/compatibility/result",
    "/fortune/manseryeok",
    "/fortune/past-life",
    "/fortune/past-life/result",
  ];

  const guidePages = GUIDES.map((g) => `/guide/${g.slug}`);

  const testPages = Object.values(TESTS).flatMap((t) => {
    const base = t.category === "types" ? "/types" : "/psychology";
    return [
      `${base}/${t.id}/start`,
      `${base}/${t.id}/run`,
      `${base}/${t.id}/result`,
    ];
  });

  const now = new Date();

  return [...staticPages, ...guidePages, ...testPages].map((path) => ({
    url: `${BASE}${path}`,
    lastModified: now,
    changeFrequency: path === "" ? "daily" : "weekly",
    priority: path === "" ? 1 : path.includes("/start") ? 0.9 : 0.7,
  }));
}
