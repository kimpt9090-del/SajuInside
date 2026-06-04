"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { BirthForm } from "@/components/fortune/BirthForm";
import type { BirthInput } from "@/features/fortune/types";
import { getUserProfile } from "@/lib/result-history";
import {
  buildCompatInviteUrl,
  compactToBirth,
  decodeSharePayload,
  getShareParamFromUrl,
  type CompatInviteSharePayload,
} from "@/lib/share-url";

export function CompatibilityClient() {
  const router = useRouter();
  const [male, setMale] = useState<BirthInput | null>(null);
  const [pendingFemale, setPendingFemale] = useState<BirthInput | null>(null);
  const [step, setStep] = useState<"male" | "female">("male");
  const [inviteFrom, setInviteFrom] = useState<string | null>(null);
  const [inviteUrl, setInviteUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const raw = getShareParamFromUrl();
    if (!raw) return;
    queueMicrotask(() => {
      const payload = decodeSharePayload<CompatInviteSharePayload>(raw);
      if (payload?.kind !== "compat-invite") return;

      const birth = compactToBirth(payload.b);
      if (payload.n) setInviteFrom(payload.n);

      if (payload.slot === "m") {
        setMale(birth);
        setStep("female");
      } else {
        setPendingFemale(birth);
        setStep("male");
      }
    });
  }, []);

  function goToResult(m: BirthInput, f: BirthInput) {
    try {
      sessionStorage.setItem(
        "fortune:compatibility",
        JSON.stringify({ male: m, female: f }),
      );
    } catch {
      // ignore
    }
    router.push("/fortune/compatibility/result");
  }

  function onMaleSubmit(input: BirthInput) {
    if (pendingFemale) {
      goToResult(input, pendingFemale);
      return;
    }
    setMale(input);
    setStep("female");
    const url = buildCompatInviteUrl(
      "m",
      input,
      getUserProfile().nickname || undefined,
    );
    setInviteUrl(url);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function onFemaleSubmit(female: BirthInput) {
    if (!male) return;
    goToResult(male, female);
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

  if (step === "female" && male) {
    return (
      <div className="space-y-4" data-testid="compat-female-step">
        {inviteFrom ? (
          <p className="rounded-full border border-violet-200 bg-violet-50 px-4 py-2 text-sm text-violet-900">
            {inviteFrom}님이 남자 사주를 공유했습니다. 여자 사주를 입력해 주세요.
          </p>
        ) : (
          <p className="rounded-full border border-violet-200 bg-violet-50 px-4 py-2 text-sm text-violet-900">
            남자 사주 입력 완료 — 이제 여자 사주를 입력해주세요.
          </p>
        )}

        {inviteUrl ? (
          <div
            className="rounded-xl border border-border bg-muted/30 p-4"
            data-testid="compat-invite-box"
          >
            <p className="text-sm font-semibold text-foreground">
              파트너 초대 링크
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              상대방이 링크를 열면 남자 사주가 채워진 상태로 여자 사주만 입력하면
              됩니다.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => void copyInvite()}
                className="btn-primary text-sm"
                data-testid="compat-copy-invite"
              >
                {copied ? "복사됨!" : "초대 링크 복사"}
              </button>
            </div>
            <p className="mt-2 break-all text-[11px] text-muted-foreground">
              {inviteUrl}
            </p>
          </div>
        ) : null}

        <BirthForm
          heading="여자 사주"
          fixedGender="female"
          onSubmit={onFemaleSubmit}
        />
        <button
          type="button"
          onClick={() => setStep("male")}
          className="btn-secondary w-full"
        >
          ← 남자 사주 다시 입력
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4" data-testid="compat-male-step">
      {pendingFemale && inviteFrom ? (
        <p className="rounded-full border border-violet-200 bg-violet-50 px-4 py-2 text-sm text-violet-900">
          {inviteFrom}님이 여자 사주를 공유했습니다. 남자 사주를 입력하면 바로
          궁합 결과를 볼 수 있습니다.
        </p>
      ) : pendingFemale ? (
        <p className="rounded-full border border-violet-200 bg-violet-50 px-4 py-2 text-sm text-violet-900">
          파트너가 여자 사주를 공유했습니다. 남자 사주를 입력해 주세요.
        </p>
      ) : null}
      <BirthForm
        heading="남자 사주"
        fixedGender="male"
        onSubmit={onMaleSubmit}
      />
    </div>
  );
}
