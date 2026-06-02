"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  submitFeedback,
  getFeedbackProviderLabel,
  type FeedbackContentType,
} from "@/lib/db";

export function ResultFeedback({
  contentType,
  contentId,
  resultId,
}: {
  contentType: FeedbackContentType;
  contentId: string;
  resultId?: string;
}) {
  const [rating, setRating] = useState(0);
  const [liked, setLiked] = useState<boolean | null>(null);
  const [comment, setComment] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">(
    "idle",
  );
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit() {
    if (rating < 1) {
      setErrorMsg("별점을 선택해주세요.");
      return;
    }
    setStatus("loading");
    setErrorMsg("");
    const res = await submitFeedback({
      contentType,
      contentId,
      resultId,
      rating,
      liked: liked ?? false,
      comment: comment.trim(),
    });
    if (res.ok) {
      setStatus("done");
    } else {
      setStatus("error");
      setErrorMsg(res.error);
    }
  }

  if (status === "done") {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5 text-center"
      >
        <p className="text-sm font-semibold text-emerald-800">
          소중한 의견 감사합니다!
        </p>
        <p className="mt-1 text-xs text-emerald-700">
          ({getFeedbackProviderLabel()}에 저장되었습니다)
        </p>
      </motion.div>
    );
  }

  return (
    <section className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
      <p className="text-sm font-semibold text-zinc-900">
        이 결과가 얼마나 정확한가요?
      </p>
      <p className="mt-1 text-xs text-zinc-500">
        별점과 간단한 의견을 남겨주세요
      </p>

      <div className="mt-4 flex justify-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            aria-label={`${star}점`}
            onClick={() => setRating(star)}
            className="rounded-lg p-1 transition hover:scale-110"
          >
            <span
              className={[
                "text-2xl",
                star <= rating ? "text-amber-400" : "text-zinc-200",
              ].join(" ")}
            >
              ★
            </span>
          </button>
        ))}
      </div>

      <div className="mt-4 flex justify-center gap-3">
        <button
          type="button"
          onClick={() => setLiked(true)}
          className={[
            "rounded-xl border px-4 py-2 text-sm font-semibold transition",
            liked === true
              ? "border-emerald-300 bg-emerald-50 text-emerald-800"
              : "border-zinc-200 text-zinc-600 hover:bg-zinc-50",
          ].join(" ")}
        >
          👍 도움됐어요
        </button>
        <button
          type="button"
          onClick={() => setLiked(false)}
          className={[
            "rounded-xl border px-4 py-2 text-sm font-semibold transition",
            liked === false
              ? "border-rose-200 bg-rose-50 text-rose-800"
              : "border-zinc-200 text-zinc-600 hover:bg-zinc-50",
          ].join(" ")}
        >
          👎 별로예요
        </button>
      </div>

      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="느낀 점을 짧게 남겨주세요 (선택)"
        rows={3}
        maxLength={500}
        className="mt-4 w-full resize-none rounded-xl border border-zinc-200 px-4 py-3 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-200"
      />

      {errorMsg ? (
        <p className="mt-2 text-xs text-rose-600">{errorMsg}</p>
      ) : null}

      <button
        type="button"
        onClick={handleSubmit}
        disabled={status === "loading"}
        className="btn-primary mt-4 w-full disabled:opacity-50"
      >
        {status === "loading" ? "보내는 중…" : "의견 보내기"}
      </button>
    </section>
  );
}
