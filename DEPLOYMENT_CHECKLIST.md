# 배포 · 최적화 · 부족한 부분 정리

## 배포 URL

- **프로덕션**: https://saju-inside.vercel.app  
- **GitHub**: https://github.com/kimpt9090-del/SajuInside

---

## 이번에 적용한 최적화

| 항목 | 내용 |
|------|------|
| 라우팅 | `/psychology`, `/types` 허브가 홈으로 리다이렉트되던 오류 제거 |
| 번들 | Recharts(`ResultChart`), 최근 결과(`RecentResults`) 동적 로딩 |
| 캐시 | manifest·정적 에셋 `Cache-Control` 헤더 |
| SEO | sitemap에 `/guide` 추가 |
| 품질 | ESLint(궁합 초대·Auth) 수정, `npm run check` 스크립트 |
| 저장소 | `test-results/`, Playwright 산출물 `.gitignore` |

---

## 완료된 기능 (코드 기준 100%)

- 9종 심리/유형 테스트, PHQ-9·GAD-7 채점, MBTI A/B 93문항
- 사주·만세력·궁합·전생·날짜 검색·파트너 초대
- 동적 OG, JSON-LD, sitemap/robots, 마이페이지·가이드
- Supabase 매직 링크 로그인 + 결과 클라우드 동기화(설정 시)
- Vitest 단위 테스트, Playwright E2E 5건

---

## 부족한 부분 — **당신이 해야 할 일**

### 1. Vercel 환경 변수 (필수·권장)

Vercel 프로젝트 → **Settings → Environment Variables**

| 변수 | Production | 설명 |
|------|------------|------|
| `NEXT_PUBLIC_SITE_URL` | ✅ | `https://saju-inside.vercel.app` |
| `NEXT_PUBLIC_SUPABASE_URL` | 선택 | 클라우드 로그인·동기화 |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | 선택 | Supabase anon key |
| `NEXT_PUBLIC_DB_PROVIDER` | 선택 | `local` / `supabase` / `firebase` |

### 2. Supabase (클라우드 로그인·동기화 쓸 때)

1. [supabase.com](https://supabase.com) 프로젝트 생성  
2. SQL Editor에서 `supabase/schema.sql` 실행  
3. Authentication → **Email** 활성화  
4. URL Configuration:  
   - Site URL: `https://saju-inside.vercel.app`  
   - Redirect URLs: `https://saju-inside.vercel.app/auth/callback`  
5. Vercel에 `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` 등록 후 **Redeploy**

### 3. Supabase 피드백 테이블 (선택)

`NEXT_PUBLIC_DB_PROVIDER=supabase` 사용 시 `feedbacks` 테이블이 없으면 피드백만 실패합니다.  
(앱 핵심 기능에는 영향 없음)

### 4. 카카오톡 공유 (미구현)

README에 언급된 `NEXT_PUBLIC_KAKAO_JS_KEY`는 **아직 코드에 연결되지 않음**.  
필요 시 Kakao SDK 연동 작업이 추가로 필요합니다.

### 5. 도메인·Search Console (선택)

- 커스텀 도메인 연결: Vercel → Domains  
- Google Search Console에 sitemap 제출: `https://saju-inside.vercel.app/sitemap.xml`

### 6. 로컬에서 E2E 실행 시

```bash
npm run build
npm run start   # 다른 터미널
npm run test:e2e
```

포트 3000이 사용 중이면 `reuseExistingServer`가 재사용합니다.

---

## 배포 방법

### Git push (연동된 경우 자동 배포)

```bash
git add -A
git commit -m "feat: optimize and deploy production-ready build"
git push origin main
```

### Vercel CLI

```bash
npx vercel --prod
```

---

## 점수·한계 (솔직한 정리)

| 영역 | 상태 |
|------|------|
| 프론트·기능 | **95** — 핵심 플로우 완료 |
| SEO·공유 | **90** |
| 인프라(로그인·DB) | **70** — Supabase 설정은 운영자 작업 |
| E2E·CI | **85** — GitHub Actions 미연동 |
| 전문 만세력 | **60** — 절기·음력 변환·API 미연동 |

**100점이 되려면**: Supabase 운영 설정, CI에 `npm run check` + E2E, 카카오 공유, 절기 기반 만세력 API 등이 추가로 필요합니다.
