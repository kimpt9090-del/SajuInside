import { ContinueTestsSlot } from "@/components/home/ContinueTestsSlot";
import { HomeSearch } from "@/components/home/HomeSearch";
import { RecentResultsSlot } from "@/components/home/RecentResultsSlot";
import { RecommendedRoutes } from "@/components/home/RecommendedRoutes";
import { SiteHeader } from "@/components/layout/SiteHeader";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col bg-gradient-to-b from-muted/50 to-background">
      <SiteHeader
        title="나를 더 잘 아는 테스트 플랫폼"
        subtitle="MBTI · 애착 · 에겐·테토 · 불안 · 우울 · 사주 · 궁합 · 전생"
        actionHref="/types/mbti/start"
        actionLabel="MBTI 시작"
      />

      <main className="page-container mx-auto w-full max-w-5xl flex-1 pb-12">
        <ContinueTestsSlot />
        <RecentResultsSlot />
        <RecommendedRoutes />

        <section>
          <h2 className="text-lg font-semibold text-foreground">
            테스트 · 운세 바로가기
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            검색 · 5점 척도 · 자동 저장 · 30초 요약 · 공유 링크 · 상세 리포트
          </p>
          <div className="mt-5">
            <HomeSearch />
          </div>
        </section>
      </main>
    </div>
  );
}
