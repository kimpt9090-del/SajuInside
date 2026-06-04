import { FortuneResultClient } from "./FortuneResultClient";
import { buildSajuResultMetadata } from "@/lib/fortune-share-metadata";
import { SHARE_PARAM } from "@/lib/share-url";

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata({ searchParams }: Props) {
  const sp = await searchParams;
  const r = typeof sp[SHARE_PARAM] === "string" ? sp[SHARE_PARAM] : undefined;
  return buildSajuResultMetadata(r);
}

export default function FortuneResultPage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-5 py-10">
      <header>
        <p className="text-sm font-medium text-zinc-500">사주/운세</p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight text-zinc-900">
          사주 결과
        </h1>
      </header>
      <div className="mt-6">
        <FortuneResultClient />
      </div>
    </div>
  );
}
