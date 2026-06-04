import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { GUIDES, getGuide } from "@/content/guides";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return GUIDES.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const guide = getGuide(slug);
  if (!guide) return { title: "가이드를 찾을 수 없음" };
  return {
    title: guide.title,
    description: guide.description,
    openGraph: {
      title: guide.title,
      description: guide.description,
      type: "article",
    },
  };
}

export default async function GuideArticlePage({ params }: Props) {
  const { slug } = await params;
  const guide = getGuide(slug);
  if (!guide) notFound();

  return (
    <article className="page-container mx-auto max-w-3xl px-5 py-10">
      <nav className="text-sm">
        <Link href="/guide" className="text-violet-700 hover:underline dark:text-violet-300">
          ← 가이드 목록
        </Link>
      </nav>
      <header className="mt-4">
        <h1 className="text-2xl font-semibold tracking-tight">{guide.title}</h1>
        <p className="mt-2 text-sm text-muted-foreground">{guide.description}</p>
        <p className="mt-1 text-xs text-muted-foreground">약 {guide.readMinutes}분</p>
      </header>
      <div className="prose prose-zinc mt-8 max-w-none dark:prose-invert">
        {guide.sections.map((sec) => (
          <section key={sec.title} className="mb-8">
            <h2 className="text-lg font-semibold">{sec.title}</h2>
            {sec.paragraphs?.map((p) => (
              <p key={p.slice(0, 24)} className="mt-3 text-sm leading-7 text-muted-foreground">
                {p}
              </p>
            ))}
            {sec.bullets ? (
              <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
                {sec.bullets.map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </ul>
            ) : null}
          </section>
        ))}
      </div>
    </article>
  );
}
