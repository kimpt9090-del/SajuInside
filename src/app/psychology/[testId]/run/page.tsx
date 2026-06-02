import {
  TestRunPage,
  generateTestMetadata,
  generateCategoryTestStaticParams,
} from "@/lib/test-page";

export function generateStaticParams() {
  return generateCategoryTestStaticParams("psychology");
}

type Props = { params: Promise<{ testId: string }> };

export async function generateMetadata({ params }: Props) {
  const { testId } = await params;
  return generateTestMetadata(testId);
}

export default async function Page({ params }: Props) {
  const { testId } = await params;
  return <TestRunPage params={{ testId }} />;
}
