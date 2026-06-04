import { publicEnv } from "@/lib/env";
import { SITE_NAME } from "@/lib/metadata";

const siteUrl = publicEnv.siteUrl;

export function JsonLd() {
  const website = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: siteUrl,
    description:
      "MBTI, 애착, 심리 자가진단, 사주·궁합·전생을 한곳에서 제공하는 한국어 자기이해 플랫폼",
    inLanguage: "ko-KR",
    potentialAction: {
      "@type": "SearchAction",
      target: `${siteUrl}/?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };

  const org = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: siteUrl,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(website) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(org) }}
      />
    </>
  );
}
