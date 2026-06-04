import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-border bg-muted/30">
      <div className="page-container mx-auto max-w-5xl py-8 text-sm text-muted-foreground">
        <p className="font-semibold text-foreground">안내 · 개인정보</p>
        <ul className="mt-3 space-y-2 leading-6">
          <li>
            본 서비스의 테스트·사주 결과는 <strong>자기 이해·오락·참고</strong> 목적이며,
            의료·법률·공식 MBTI® 인증 검사를 대체하지 않습니다.
          </li>
          <li>
            생년월일·테스트 응답은 <strong>브라우저에만 저장</strong>되며, 서버에
            영구 보관하지 않습니다. (피드백 제출 시 익명 통계만 저장될 수 있습니다)
          </li>
          <li>
            우울·자해 생각: <strong>1393</strong> · 위기상담 <strong>1577-0199</strong> ·
            응급 <strong>119</strong>
          </li>
        </ul>
        <div className="mt-4 flex flex-wrap gap-3 text-sm">
          <Link href="/my" className="hover:text-foreground">
            마이페이지
          </Link>
          <Link href="/guide" className="hover:text-foreground">
            가이드
          </Link>
          <Link href="/types/mbti/start" className="hover:text-foreground">
            MBTI
          </Link>
          <Link href="/fortune" className="hover:text-foreground">
            사주
          </Link>
          <Link href="/fortune/compatibility" className="hover:text-foreground">
            궁합
          </Link>
          <Link href="/psychology/depression/start" className="hover:text-foreground">
            우울 자가진단
          </Link>
          <Link href="/privacy" className="hover:text-foreground">
            개인정보
          </Link>
        </div>
        <p className="mt-6 text-xs">© {new Date().getFullYear()} 테스트/사주/유형 플랫폼</p>
      </div>
    </footer>
  );
}
