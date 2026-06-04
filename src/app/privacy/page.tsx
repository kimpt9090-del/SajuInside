import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "개인정보·이용 안내",
  description: "데이터 저장 방식, 면책, 위기 연락처 안내",
};

export default function PrivacyPage() {
  return (
    <div className="page-container mx-auto max-w-3xl px-5 py-10">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight">개인정보·이용 안내</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          본 서비스는 자기 이해·참고·오락 목적의 웹 앱입니다.
        </p>
      </header>

      <div className="mt-8 space-y-8 text-sm leading-7 text-muted-foreground">
        <section>
          <h2 className="text-base font-semibold text-foreground">데이터 저장</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5">
            <li>
              테스트 답변·사주 입력·진행 상태는 <strong>브라우저(sessionStorage·localStorage)</strong>에만
              저장됩니다. 서버에 영구 보관하지 않습니다.
            </li>
            <li>
              로그인(이메일 매직 링크) 시 결과 기록·고정·닉네임은{" "}
              <strong>Supabase 클라우드</strong>와 동기화됩니다. 계정별로
              분리되며, 로그아웃 후에도 클라우드에 남습니다.
            </li>
            <li>
              파트너 초대 링크에는 한쪽 생년월일시가 URL에 포함될 수 있습니다.
              신뢰할 수 있는 상대에게만 공유하세요.
            </li>
            <li>
              공유 링크(<code>?r=</code>)에는 결과 데이터가 URL에 포함될 수 있습니다. SNS에
              올릴 때 개인정보(실명·생년월일 전체)는 포함하지 마세요.
            </li>
            <li>
              피드백(별점·댓글)을 제출하면 설정된 경우 Supabase/Firebase에 익명 통계로 저장될 수
              있습니다.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-base font-semibold text-foreground">면책</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5">
            <li>모든 검사·사주 결과는 의료·법률·공식 MBTI® 인증을 대체하지 않습니다.</li>
            <li>우울·불안·사이코패스 등 점수는 자가 선별용이며 진단이 아닙니다.</li>
            <li>사주·운세·전생 콘텐츠는 전통·오락·참고 목적입니다.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-base font-semibold text-foreground">위기·상담 연락처</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5">
            <li>자살예방 상담: 1393</li>
            <li>정신건강 위기상담: 1577-0199</li>
            <li>응급: 119</li>
          </ul>
        </section>

        <section>
          <h2 className="text-base font-semibold text-foreground">문의</h2>
          <p className="mt-3">
            서비스 개선 제안은 결과 페이지 피드백을 이용해 주세요.
          </p>
        </section>
      </div>

      <div className="mt-10">
        <Link href="/" className="btn-secondary text-sm">
          ← 홈으로
        </Link>
      </div>
    </div>
  );
}
