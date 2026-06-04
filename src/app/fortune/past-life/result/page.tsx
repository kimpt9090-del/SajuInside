import { PastLifeResultClient } from "./PastLifeResultClient";
import { buildPastLifeResultMetadata } from "@/lib/fortune-share-metadata";
import { SHARE_PARAM } from "@/lib/share-url";

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata({ searchParams }: Props) {
  const sp = await searchParams;
  const r = typeof sp[SHARE_PARAM] === "string" ? sp[SHARE_PARAM] : undefined;
  return buildPastLifeResultMetadata(r);
}

export default function PastLifeResultPage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-5 py-10">
      <PastLifeResultClient />
    </div>
  );
}
