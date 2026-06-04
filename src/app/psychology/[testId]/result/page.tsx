import {
  TestResultPage,
  generateCategoryTestStaticParams,
} from "@/lib/test-page";
import { buildResultShareMetadata } from "@/lib/result-share-metadata";
import { SHARE_PARAM } from "@/lib/share-url";

export function generateStaticParams() {
  return generateCategoryTestStaticParams("psychology");
}

type Props = {
  params: Promise<{ testId: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata({ params, searchParams }: Props) {
  const { testId } = await params;
  const sp = await searchParams;
  const r = typeof sp[SHARE_PARAM] === "string" ? sp[SHARE_PARAM] : undefined;
  return buildResultShareMetadata(testId, r);
}

export default async function Page({ params }: Props) {
  const { testId } = await params;
  return <TestResultPage params={{ testId }} />;
}
