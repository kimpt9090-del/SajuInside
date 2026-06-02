"use client";

import { useRouter } from "next/navigation";
import { BirthForm } from "@/components/fortune/BirthForm";
import type { BirthInput } from "@/features/fortune/types";

export function FortuneClient() {
  const router = useRouter();

  function onSubmit(input: BirthInput) {
    try {
      sessionStorage.setItem("fortune:birth", JSON.stringify(input));
    } catch {
      // ignore
    }
    router.push("/fortune/result");
  }

  return <BirthForm onSubmit={onSubmit} />;
}
