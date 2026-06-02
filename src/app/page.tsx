import Link from "next/link";
import { CategoryCard } from "@/components/home/CategoryCard";
import { ContinueTests } from "@/components/home/ContinueTests";
import { SiteHeader } from "@/components/layout/SiteHeader";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col bg-gradient-to-b from-muted/50 to-background">
      <SiteHeader
        title="나를 더 잘 아는 테스트 플랫폼"
        subtitle="심리 · 사주/운세 · 성격유형"
        actionHref="/types/mbti/start"
        actionLabel="MBTI 시작"
      />

      <main className="page-container mx-auto w-full max-w-5xl flex-1 pb-12">
        <ContinueTests />

        <div className="grid gap-4 sm:grid-cols-3">
          <CategoryCard
            title="심리 테스트"
            description="사이코패스, 우울, 자존감 등"
            href="/psychology"
            accent="rose"
          />
          <CategoryCard
            title="사주/운세"
            description="사주 풀이, 만세력, 궁합"
            href="/fortune"
            accent="amber"
          />
          <CategoryCard
            title="성격 유형"
            description="MBTI, 애착, 기질 검사"
            href="/types"
            accent="sky"
          />
        </div>

        <section className="card-surface mt-8">
          <h2 className="text-base font-semibold text-card-foreground">
            지금 바로 해보기
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            5점 척도 · 진행 자동 저장 · 레이더 차트 · 공유/캡처
          </p>
          <div className="mt-4 flex flex-col gap-2 sm:flex-row">
            <Link href="/types/mbti/start" className="btn-primary">
              MBTI 성격 유형
            </Link>
            <Link href="/fortune" className="btn-secondary">
              사주 팔자 보기
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
