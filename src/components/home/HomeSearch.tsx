"use client";

import { useMemo, useState } from "react";
import { HOME_SERVICES } from "@/lib/home-services";
import { ServiceCard } from "@/components/home/ServiceCard";

export function HomeSearch() {
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return HOME_SERVICES;
    return HOME_SERVICES.filter(
      (svc) =>
        svc.title.toLowerCase().includes(s) ||
        svc.description.toLowerCase().includes(s) ||
        svc.id.includes(s),
    );
  }, [q]);

  return (
    <div className="mb-6">
      <label className="sr-only" htmlFor="home-search">
        테스트·운세 검색
      </label>
      <input
        id="home-search"
        type="search"
        placeholder="MBTI, 에겐·테토, 사주, 궁합, 우울, 불안… 검색"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        className="input-field w-full"
      />
      {q && filtered.length === 0 ? (
        <p className="mt-2 text-sm text-muted-foreground">
          검색 결과가 없습니다.
        </p>
      ) : null}
      <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((service) => (
          <ServiceCard key={service.id} service={service} />
        ))}
      </div>
    </div>
  );
}
