"use client";

import { useRouter } from "next/navigation";
import { BirthForm } from "@/components/fortune/BirthForm";
import type { BirthInput } from "@/features/fortune/types";

export function PastLifeClient() {
  const router = useRouter();

  function onSubmit(input: BirthInput) {
    try {
      sessionStorage.setItem("fortune:past-life", JSON.stringify(input));
    } catch {
      // ignore
    }
    router.push("/fortune/past-life/result");
  }

  return (
    <BirthForm
      heading="생년월일시 입력"
      onSubmit={onSubmit}
    />
  );
}
