"use client";

import { useMemo, useState } from "react";

import { lookupDatePillars } from "@/features/fortune/pillar-calc";
import type { Pillar } from "@/features/fortune/types";

function daysInMonth(year: number, month: number) {
  return new Date(year, month, 0).getDate();
}

function rangeInclusive(min: number, max: number) {
  const out: number[] = [];
  for (let i = min; i <= max; i++) out.push(i);
  return out;
}

function PillarMini({ title, pillar }: { title: string; pillar: Pillar }) {
  return (
    <div className="rounded-xl border border-amber-200 bg-amber-50/80 p-3 text-center dark:border-amber-900 dark:bg-amber-950/30">
      <p className="text-xs font-semibold text-amber-800 dark:text-amber-200">
        {title}
      </p>
      <p className="mt-2 text-xl font-bold text-foreground">
        {pillar.stemHanja}
        {pillar.branchHanja}
      </p>
      <p className="text-sm text-muted-foreground">
        {pillar.stem} · {pillar.branch}
      </p>
    </div>
  );
}

export function ManseryeokDateSearch() {
  const now = new Date();
  const currentYear = now.getFullYear();

  const [year, setYear] = useState(currentYear);
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [day, setDay] = useState(now.getDate());
  const [hour, setHour] = useState(12);
  const [searched, setSearched] = useState<{
    y: number;
    m: number;
    d: number;
    h: number;
  } | null>(null);

  const years = useMemo(() => rangeInclusive(1900, currentYear + 1), [currentYear]);
  const months = useMemo(() => rangeInclusive(1, 12), []);
  const maxDay = useMemo(() => daysInMonth(year, month), [year, month]);
  const days = useMemo(() => rangeInclusive(1, maxDay), [maxDay]);
  const hours = useMemo(() => rangeInclusive(0, 23), []);
  const safeDay = Math.min(day, maxDay);

  const pillars = useMemo(() => {
    if (!searched) return null;
    return lookupDatePillars(searched.y, searched.m, searched.d, searched.h);
  }, [searched]);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setSearched({ y: year, m: month, d: safeDay, h: hour });
  }

  return (
    <section
      className="card-surface p-5"
      data-testid="manseryeok-date-search"
    >
      <h2 className="text-lg font-semibold">날짜로 만세력 검색</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        특정 양력 날짜·시간의 년·월·일·시주를 바로 확인합니다. (참고용
        근사 계산)
      </p>

      <form onSubmit={handleSearch} className="mt-4 space-y-3">
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          <label className="block text-xs font-medium text-muted-foreground">
            년
            <select
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
              className="mt-1 w-full rounded-lg border border-border bg-background px-2 py-2 text-sm"
              data-testid="date-search-year"
            >
              {years.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </label>
          <label className="block text-xs font-medium text-muted-foreground">
            월
            <select
              value={month}
              onChange={(e) => setMonth(Number(e.target.value))}
              className="mt-1 w-full rounded-lg border border-border bg-background px-2 py-2 text-sm"
              data-testid="date-search-month"
            >
              {months.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </label>
          <label className="block text-xs font-medium text-muted-foreground">
            일
            <select
              value={safeDay}
              onChange={(e) => setDay(Number(e.target.value))}
              className="mt-1 w-full rounded-lg border border-border bg-background px-2 py-2 text-sm"
              data-testid="date-search-day"
            >
              {days.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </label>
          <label className="block text-xs font-medium text-muted-foreground">
            시 (0–23)
            <select
              value={hour}
              onChange={(e) => setHour(Number(e.target.value))}
              className="mt-1 w-full rounded-lg border border-border bg-background px-2 py-2 text-sm"
              data-testid="date-search-hour"
            >
              {hours.map((h) => (
                <option key={h} value={h}>
                  {h}시
                </option>
              ))}
            </select>
          </label>
        </div>
        <button type="submit" className="btn-primary text-sm" data-testid="date-search-submit">
          만세력 조회
        </button>
      </form>

      {pillars && searched ? (
        <div className="mt-5 space-y-3" data-testid="date-search-result">
          <p className="text-sm font-medium text-foreground">
            {searched.y}년 {searched.m}월 {searched.d}일 {searched.h}시
          </p>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            <PillarMini title="년주" pillar={pillars.year} />
            <PillarMini title="월주" pillar={pillars.month} />
            <PillarMini title="일주" pillar={pillars.day} />
            <PillarMini title="시주" pillar={pillars.hour} />
          </div>
        </div>
      ) : null}
    </section>
  );
}
