# 부족한 부분 · 해결 상태

## 배포

- **URL**: https://saju-inside.vercel.app  
- **저장소**: https://github.com/kimpt9090-del/SajuInside

---

## 코드로 이미 해결된 것 (이번 포함)

| 항목 | 상태 |
|------|------|
| 카카오톡 공유 | `NEXT_PUBLIC_KAKAO_JS_KEY` 설정 시 결과 화면 **카카오톡** 버튼 표시 |
| GitHub Actions CI | `.github/workflows/ci.yml` — `check` + `build` + Playwright E2E |
| Supabase SQL | `user_data` + `feedbacks` 테이블·RLS (`supabase/schema.sql`) |
| PHQ-9 / GAD-7 / 파트너 초대 / 만세력 날짜 검색 | 완료 |

---

## 당신이 해야 하는 일 (외부 설정)

### 1. Vercel 환경 변수 (권장)

| 변수 | 값 예시 |
|------|---------|
| `NEXT_PUBLIC_SITE_URL` | `https://saju-inside.vercel.app` |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase 프로젝트 URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | anon public key |
| `NEXT_PUBLIC_KAKAO_JS_KEY` | 카카오 JavaScript 키 (선택) |
| `NEXT_PUBLIC_DB_PROVIDER` | `local` 또는 `supabase` |

설정 후 **Redeploy** 필수.

### 2. Supabase (로그인·클라우드 동기화)

1. [supabase.com](https://supabase.com)에서 프로젝트 생성  
2. SQL Editor → `supabase/schema.sql` 전체 실행  
3. Authentication → Email 활성화  
4. URL Configuration  
   - Site URL: `https://saju-inside.vercel.app`  
   - Redirect: `https://saju-inside.vercel.app/auth/callback`  
5. Vercel에 Supabase 변수 등록 후 재배포  

### 3. 카카오 개발자 (카카오톡 공유 쓸 때)

1. [developers.kakao.com](https://developers.kakao.com) 앱 생성  
2. **JavaScript 키** → Vercel `NEXT_PUBLIC_KAKAO_JS_KEY`  
3. 플랫폼 → Web → 사이트 도메인에 `https://saju-inside.vercel.app` 등록  
4. 제품 설정 → 카카오 로그인/메시지 → **카카오톡 공유** 활성화  

### 4. 선택

- 커스텀 도메인: Vercel → Domains  
- Search Console: `https://saju-inside.vercel.app/sitemap.xml` 제출  

---

## 코드로 아직 못 채우는 한계

| 항목 | 이유 |
|------|------|
| 절기·음력 만세력 | 전문 만세력 API·절입 시각 DB 필요 |
| 카카오 공유 (키 없을 때) | 카카오 개발자 앱·도메인 등록은 운영자 작업 |
| 로그인·동기화 (Supabase 없을 때) | Supabase 프로젝트·RLS 설정 필요 |
| 100% E2E 커버리지 | 주요 플로우 5건만 자동화 |

---

## 로컬 검증

```bash
npm run check      # typecheck + lint + vitest
npm run build
npm run start      # 다른 터미널
npm run test:e2e
```

---

## 완성도 요약

| 영역 | 점수 |
|------|------|
| 기능·UX | **95** |
| SEO·공유 | **92** (카카오 키만 넣으면 **95**) |
| 인프라 | **75** → Supabase 설정 후 **90** |
| CI | **90** (GitHub Actions 연동됨) |
| 전문 만세력 | **60** |
