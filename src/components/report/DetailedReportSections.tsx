"use client";

import { useState } from "react";
import type { ReportSection } from "@/lib/report-types";

export function DetailedReportSections({
  sections,
  defaultOpenCount = 3,
}: {
  sections: ReportSection[];
  defaultOpenCount?: number;
}) {
  const [openIds, setOpenIds] = useState<Set<string>>(() => {
    const initial = new Set<string>();
    sections.slice(0, defaultOpenCount).forEach((s) => initial.add(s.id));
    return initial;
  });

  function toggle(id: string) {
    setOpenIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function expandAll() {
    setOpenIds(new Set(sections.map((s) => s.id)));
  }

  function collapseAll() {
    setOpenIds(new Set());
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={expandAll}
          className="rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-medium text-muted-foreground hover:bg-muted"
        >
          전체 펼치기
        </button>
        <button
          type="button"
          onClick={collapseAll}
          className="rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-medium text-muted-foreground hover:bg-muted"
        >
          전체 접기
        </button>
      </div>

      <nav className="rounded-xl border border-border bg-muted/40 p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          목차
        </p>
        <ol className="mt-2 space-y-1">
          {sections.map((s, i) => (
            <li key={s.id}>
              <button
                type="button"
                onClick={() => {
                  setOpenIds((prev) => new Set(prev).add(s.id));
                  document
                    .getElementById(`report-section-${s.id}`)
                    ?.scrollIntoView({ behavior: "smooth", block: "start" });
                }}
                className="text-left text-sm text-foreground/80 hover:text-foreground hover:underline"
              >
                {i + 1}. {s.title}
              </button>
            </li>
          ))}
        </ol>
      </nav>

      {sections.map((section) => {
        const open = openIds.has(section.id);
        return (
          <article
            key={section.id}
            id={`report-section-${section.id}`}
            className="scroll-mt-4 overflow-hidden rounded-2xl border border-border bg-card shadow-sm"
          >
            <button
              type="button"
              onClick={() => toggle(section.id)}
              className="flex w-full items-start justify-between gap-3 p-5 text-left hover:bg-muted/30"
              aria-expanded={open}
            >
              <div>
                <h3 className="text-base font-semibold text-card-foreground">
                  {section.title}
                </h3>
                {section.subtitle ? (
                  <p className="mt-1 text-sm text-muted-foreground">
                    {section.subtitle}
                  </p>
                ) : null}
              </div>
              <span
                className="mt-0.5 shrink-0 text-lg text-muted-foreground"
                aria-hidden
              >
                {open ? "−" : "+"}
              </span>
            </button>

            {open ? (
              <div className="border-t border-border px-5 pb-5 pt-4">
                {section.highlight ? (
                  <p className="mb-4 rounded-xl bg-muted/80 px-4 py-3 text-sm font-medium leading-6 text-card-foreground">
                    {section.highlight}
                  </p>
                ) : null}

                {section.paragraphs?.map((p, i) => (
                  <p
                    key={i}
                    className="mb-3 text-sm leading-7 text-card-foreground/90 last:mb-0"
                  >
                    {p}
                  </p>
                ))}

                {section.bullets?.length ? (
                  <ul className="mt-3 space-y-2">
                    {section.bullets.map((b, i) => (
                      <li
                        key={i}
                        className="flex gap-2 text-sm leading-6 text-card-foreground/90"
                      >
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-muted-foreground/70" />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                ) : null}

                {section.tags?.length ? (
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {section.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full bg-muted px-2.5 py-0.5 text-xs text-muted-foreground"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                ) : null}
              </div>
            ) : null}
          </article>
        );
      })}
    </div>
  );
}
