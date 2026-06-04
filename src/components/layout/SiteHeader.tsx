import Link from "next/link";
import { AuthNav } from "@/components/layout/AuthNav";
import { ThemeToggleSlot } from "@/components/layout/ThemeToggleSlot";
import { FontSizeToggle } from "@/components/layout/FontSizeToggle";

export function SiteHeader({
  title,
  subtitle,
  actionHref,
  actionLabel,
}: {
  title: string;
  subtitle?: string;
  actionHref?: string;
  actionLabel?: string;
}) {
  return (
    <header className="page-container mx-auto flex w-full max-w-5xl flex-wrap items-start justify-between gap-4 pt-10 pb-6">
      <div>
        {subtitle ? (
          <p className="text-sm font-medium text-muted-foreground">{subtitle}</p>
        ) : null}
        <h1 className="mt-1 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          {title}
        </h1>
      </div>
      <div className="flex items-center gap-2">
        <AuthNav />
        <Link href="/my" className="btn-secondary hidden text-sm sm:inline-flex">
          마이
        </Link>
        <Link href="/guide" className="btn-secondary hidden text-sm sm:inline-flex">
          가이드
        </Link>
        <FontSizeToggle />
        <ThemeToggleSlot />
        {actionHref && actionLabel ? (
          <Link href={actionHref} className="btn-primary hidden sm:inline-flex">
            {actionLabel}
          </Link>
        ) : null}
      </div>
    </header>
  );
}
