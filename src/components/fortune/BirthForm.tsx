"use client";

import { useMemo, useState } from "react";
import type { BirthInput, CalendarType, Gender } from "@/features/fortune/types";

function daysInMonth(year: number, month: number) {
  return new Date(year, month, 0).getDate();
}

function rangeInclusive(min: number, max: number) {
  const out: number[] = [];
  for (let i = min; i <= max; i++) out.push(i);
  return out;
}

export function BirthForm({
  onSubmit,
  fixedGender,
  heading,
}: {
  onSubmit: (input: BirthInput) => void;
  fixedGender?: Gender;
  heading?: string;
}) {
  const now = new Date();
  const currentYear = now.getFullYear();

  const [year, setYear] = useState(currentYear - 25);
  const [month, setMonth] = useState(1);
  const [day, setDay] = useState(1);
  const [hour, setHour] = useState(12);
  const [minute, setMinute] = useState(0);
  const [gender, setGender] = useState<Gender>(fixedGender ?? "male");
  const [calendar, setCalendar] = useState<CalendarType>("solar");

  const years = useMemo(() => {
    const out: number[] = [];
    for (let y = currentYear; y >= 1900; y--) out.push(y);
    return out;
  }, [currentYear]);
  const months = useMemo(() => rangeInclusive(1, 12), []);
  const maxDay = useMemo(() => daysInMonth(year, month), [year, month]);
  const days = useMemo(() => rangeInclusive(1, maxDay), [maxDay]);
  const hours = useMemo(() => rangeInclusive(0, 23), []);
  const minutes = useMemo(() => rangeInclusive(0, 59), []);
  const safeDay = Math.min(day, maxDay);

  function handleYearChange(nextYear: number) {
    setYear(nextYear);
    const max = daysInMonth(nextYear, month);
    if (day > max) setDay(max);
  }

  function handleMonthChange(nextMonth: number) {
    setMonth(nextMonth);
    const max = daysInMonth(year, nextMonth);
    if (day > max) setDay(max);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSubmit({
      year,
      month,
      day: safeDay,
      hour,
      minute,
      gender: fixedGender ?? gender,
      calendar,
    });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5 rounded-2xl border border-border bg-card p-5 shadow-sm"
    >
      {heading ? (
        <p className="text-sm font-semibold text-card-foreground">{heading}</p>
      ) : null}
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="연도">
          <select
            value={year}
            onChange={(e) => handleYearChange(Number(e.target.value))}
            className="select-field"
            required
          >
            {years.map((y) => (
              <option key={y} value={y}>
                {y}년
              </option>
            ))}
          </select>
        </Field>
        <Field label="월">
          <select
            value={month}
            onChange={(e) => handleMonthChange(Number(e.target.value))}
            className="select-field"
            required
          >
            {months.map((m) => (
              <option key={m} value={m}>
                {m}월
              </option>
            ))}
          </select>
        </Field>
        <Field label="일">
          <select
            value={safeDay}
            onChange={(e) => setDay(Number(e.target.value))}
            className="select-field"
            required
          >
            {days.map((d) => (
              <option key={d} value={d}>
                {d}일
              </option>
            ))}
          </select>
        </Field>
        <Field label="시">
          <select
            value={hour}
            onChange={(e) => setHour(Number(e.target.value))}
            className="select-field"
            required
          >
            {hours.map((h) => (
              <option key={h} value={h}>
                {h}시
              </option>
            ))}
          </select>
        </Field>
        <Field label="분">
          <select
            value={minute}
            onChange={(e) => setMinute(Number(e.target.value))}
            className="select-field"
          >
            {minutes.map((m) => (
              <option key={m} value={m}>
                {m}분
              </option>
            ))}
          </select>
        </Field>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="성별">
          {fixedGender ? (
            <p className="select-field flex items-center bg-muted/50">
              {fixedGender === "male" ? "남성" : "여성"}
            </p>
          ) : (
            <div className="flex gap-2">
              <Toggle
                active={gender === "male"}
                onClick={() => setGender("male")}
                label="남"
              />
              <Toggle
                active={gender === "female"}
                onClick={() => setGender("female")}
                label="여"
              />
            </div>
          )}
        </Field>
        <Field label="달력">
          <div className="flex gap-2">
            <Toggle
              active={calendar === "solar"}
              onClick={() => setCalendar("solar")}
              label="양력"
            />
            <Toggle
              active={calendar === "lunar"}
              onClick={() => setCalendar("lunar")}
              label="음력"
            />
          </div>
        </Field>
      </div>

      {calendar === "lunar" ? (
        <p
          role="alert"
          className="rounded-lg border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-sm text-amber-900 dark:text-amber-200"
        >
          음력 날짜는 아직 양력으로 변환되지 않습니다. 입력한 숫자를 양력처럼
          계산하므로, 음력 생일이라면 양력으로 바꾼 뒤 다시 조회해 주세요.
        </p>
      ) : null}

      <button type="submit" className="btn-primary w-full">
        사주 보기
      </button>
    </form>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
      <div className="mt-1">{children}</div>
    </label>
  );
}

function Toggle({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "pill-toggle",
        active ? "pill-toggle--active" : "",
      ].join(" ")}
    >
      {label}
    </button>
  );
}
