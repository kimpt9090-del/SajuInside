import Link from "next/link";

import { GUIDES } from "@/content/guides";

export default function GuideIndexPage() {
  return (
    <div className="page-container mx-auto max-w-3xl px-5 py-10">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight">가이드 · SEO</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          MBTI·애착·사주·자가진단을 이해하는 입문 글 모음
        </p>
      </header>
      <ul className="mt-8 space-y-4">
        {GUIDES.map((g) => (
          <li key={g.slug}>
            <Link
              href={`/guide/${g.slug}`}
              className="card-surface block p-5 transition hover:border-violet-300"
            >
              <h2 className="font-semibold text-foreground">{g.title}</h2>
              <p className="mt-1 text-sm text-muted-foreground">{g.description}</p>
              <p className="mt-2 text-xs text-muted-foreground">약 {g.readMinutes}분</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
