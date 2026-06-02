"use client";

import { useState } from "react";
import type { BirthInput, CalendarType, Gender } from "@/features/fortune/types";

export function BirthForm({
  onSubmit,
}: {
  onSubmit: (input: BirthInput) => void;
}) {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear() - 25);
  const [month, setMonth] = useState(1);
  const [day, setDay] = useState(1);
  const [hour, setHour] = useState(12);
  const [minute, setMinute] = useState(0);
  const [gender, setGender] = useState<Gender>("male");
  const [calendar, setCalendar] = useState<CalendarType>("solar");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSubmit({ year, month, day, hour, minute, gender, calendar });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5 rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="연도">
          <input
            type="number"
            min={1900}
            max={2100}
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
            className={inputClass}
            required
          />
        </Field>
        <Field label="월">
          <input
            type="number"
            min={1}
            max={12}
            value={month}
            onChange={(e) => setMonth(Number(e.target.value))}
            className={inputClass}
            required
          />
        </Field>
        <Field label="일">
          <input
            type="number"
            min={1}
            max={31}
            value={day}
            onChange={(e) => setDay(Number(e.target.value))}
            className={inputClass}
            required
          />
        </Field>
        <Field label="시 (0~23)">
          <input
            type="number"
            min={0}
            max={23}
            value={hour}
            onChange={(e) => setHour(Number(e.target.value))}
            className={inputClass}
            required
          />
        </Field>
        <Field label="분">
          <input
            type="number"
            min={0}
            max={59}
            value={minute}
            onChange={(e) => setMinute(Number(e.target.value))}
            className={inputClass}
          />
        </Field>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="성별">
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
      <span className="text-xs font-medium text-zinc-500">{label}</span>
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
        "flex-1 rounded-xl border px-4 py-3 text-sm font-semibold transition",
        active
          ? "border-zinc-900 bg-zinc-900 text-white"
          : "border-zinc-200 bg-white text-zinc-900 hover:bg-zinc-50",
      ].join(" ")}
    >
      {label}
    </button>
  );
}

const inputClass = "input-field";
