"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { BirthForm } from "@/components/fortune/BirthForm";
import type { BirthInput } from "@/features/fortune/types";
import { getUserProfile } from "@/lib/result-history";
import {
  buildCompatInviteUrl,
} from "@/lib/share-url";

export function FemaleFirstInvite() {
  const router = useRouter();
  const [inviteUrl, setInviteUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  function onFemaleSubmit(female: BirthInput) {
    const url = buildCompatInviteUrl(
      "f",
      female,
      getUserProfile().nickname || undefined,
    );
    setInviteUrl(url);
  }

  async function copyInvite() {
    if (!inviteUrl) return;
    try {
      await navigator.clipboard.writeText(inviteUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  }

  if (inviteUrl) {
    return (
      <div className="rounded-xl border border-violet-200 bg-violet-50/50 p-4 dark:border-violet-900 dark:bg-violet-950/20">
        <p className="text-sm font-semibold">여자 사주 초대 링크</p>
        <p className="mt-1 text-xs text-muted-foreground">
          상대방이 링크를 열면 여자 사주가 채워진 상태로 남자 사주만 입력합니다.
        </p>
        <button
          type="button"
          className="btn-primary mt-3 text-sm"
          onClick={() => void copyInvite()}
          data-testid="compat-female-invite-copy"
        >
          {copied ? "복사됨!" : "초대 링크 복사"}
        </button>
        <p className="mt-2 break-all text-[11px] text-muted-foreground">{inviteUrl}</p>
        <button
          type="button"
          className="btn-secondary mt-3 text-sm"
          onClick={() => router.push("/fortune/compatibility")}
        >
          일반 궁합 입력으로
        </button>
      </div>
    );
  }

  return (
    <div data-testid="compat-female-first">
      <BirthForm
        heading="여자 사주 (초대용)"
        fixedGender="female"
        onSubmit={onFemaleSubmit}
      />
    </div>
  );
}
