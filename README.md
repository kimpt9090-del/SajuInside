# 테스트/사주/유형 — 통합 플랫폼

심리 테스트, 사주/만세력, MBTI·성격 유형 검사를 한 곳에서 제공하는 **Next.js 16** 반응형 웹 앱입니다.

## 기술 스택

| 구분 | 기술 |
|------|------|
| 프레임워크 | Next.js 16 (App Router) |
| UI | React 19, Tailwind CSS v4 |
| 애니메이션 | Framer Motion |
| 차트 | Recharts (레이더·막대) |
| 배포 | Vercel |

## 설치 및 실행

### 요구 사항

- Node.js 20+
- npm 10+

### 로컬 개발

```bash
git clone <repository-url>
cd 4444
npm install
cp .env.example .env.local
# .env.local 값을 편집한 뒤
npm run dev
```

브라우저: [http://localhost:3000](http://localhost:3000)

### 프로덕션 빌드

```bash
npm run build
npm run start
```

### 린트

```bash
npm run lint
```

---

## 환경 변수

모든 민감/외부 연동 값은 **`.env.local`** (Git 제외)에서만 읽습니다.  
중앙 정의: `src/lib/env.ts` → `publicEnv`

| 변수 | 필수 | 설명 |
|------|------|------|
| `NEXT_PUBLIC_SITE_URL` | 배포 시 권장 | OG/메타 절대 URL |
| `NEXT_PUBLIC_KAKAO_JS_KEY` | 선택 | 카카오톡 공유 |
| `NEXT_PUBLIC_DB_PROVIDER` | 선택 | `local` \| `supabase` \| `firebase` |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase 시 | 프로젝트 URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase 시 | anon public key |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | Firebase 시 | 프로젝트 ID |
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Firebase 시 | Web API key |

**보안 점검 결과 (코드베이스 검색)**

- API 키·Supabase URL이 **소스에 하드코딩된 곳 없음**
- `process.env` 직접 참조는 `src/lib/env.ts`, `src/lib/db.ts`(env 경유), 주석 예시만 존재
- 서비스 롤 키 등 **비밀 키는 `NEXT_PUBLIC_`에 두지 마세요**

---

## 프로젝트 구조

```
4444/
├── src/
│   ├── app/                    # App Router 페이지
│   │   ├── page.tsx            # 홈 (이어하기, 카테고리)
│   │   ├── psychology/         # 심리 테스트
│   │   │   └── [testId]/
│   │   │       ├── start/      # 안내
│   │   │       ├── run/        # 진행
│   │   │       └── result/     # 결과
│   │   ├── types/              # 성격 유형 (MBTI, 기질)
│   │   └── fortune/            # 사주 입력·결과
│   ├── components/
│   │   ├── home/               # ContinueTests, CategoryCard
│   │   ├── test/               # TestRunner, ResultChart, ShareButtons
│   │   ├── fortune/            # BirthForm, SajuPillars
│   │   ├── feedback/           # ResultFeedback
│   │   └── layout/             # ThemeProvider, PageTransition, SiteHeader
│   ├── features/
│   │   ├── tests/              # 테스트 엔진 + 데이터
│   │   │   ├── engine.ts       # sum | pattern | mbti 채점
│   │   │   ├── registry.ts     # 테스트 등록
│   │   │   └── tests/          # attachment, mbti, temperament
│   │   └── fortune/            # calculator, types
│   └── lib/
│       ├── env.ts              # 환경 변수
│       ├── db.ts               # 피드백 (Supabase/Firebase/local)
│       ├── test-storage.ts     # sessionStorage 진행/완료
│       ├── test-paths.ts       # URL 헬퍼
│       └── chart-data.ts       # Recharts 데이터 변환
├── tailwind.config.ts          # darkMode: class, 디자인 토큰
├── next.config.ts              # 이미지·보안 헤더·번들 최적화
├── vercel.json                 # Vercel 배포 설정
└── .env.example
```

---

## 데이터·SSG (배포 환경)

테스트 문항/결과는 **외부 JSON 파일이 아니라** TypeScript 모듈로 번들됩니다.

- `src/features/tests/tests/*.ts` → `registry.ts` → 페이지에서 `getTest(testId)` 호출
- 빌드 시 `generateStaticParams()`로 등록된 `testId` 경로를 **정적 사전 생성**
- 런타임에 별도 API/파일 경로 불필요 → Vercel 배포 시 경로 누락 없음

사용자 답변·진행률은 **브라우저 `sessionStorage`** (서버 데이터 아님).

---

## 테스트 추가 방법

### 1. 데이터 파일 생성

`src/features/tests/tests/my-test.ts`:

```ts
import type { TestDefinition } from "../types";

export const myTest: TestDefinition = {
  id: "my-test",
  category: "psychology", // psychology | types
  title: "제목",
  description: "설명",
  version: 1,
  questions: [{ id: "q1", text: "문항 텍스트" }],
  results: {
    resultA: {
      id: "resultA",
      title: "결과 A",
      summary: "요약",
      details: ["상세 1"],
      color: "emerald",
    },
  },
  scoring: {
    strategy: "pattern", // sum | pattern | mbti
    dimensions: {
      dim1: {
        label: "지표",
        questionIds: ["q1"],
        resultId: "resultA",
      },
    },
  },
};
```

### 2. 레지스트리 등록

`src/features/tests/registry.ts`:

```ts
import { myTest } from "./tests/my-test";

export const TESTS = {
  // ...
  [myTest.id]: myTest,
};
```

### 3. 확인

- `category: "psychology"` → `/psychology` 목록에 표시
- `category: "types"` → `/types` 목록에 표시
- URL: `/{category}/{testId}/start` → `run` → `result`

### MBTI형 (4축)

`scoring.strategy: "mbti"` + `axes[]` — `mbti.ts` 참고.

---

## 주요 기능

| 기능 | 설명 |
|------|------|
| 진행 저장 | `testprogress:*` — 홈 «이어서 계속하기» |
| 결과 | 레이더/막대 차트, 공유, PNG 캡처 |
| 피드백 | 별점·좋아요·댓글 → `db.ts` |
| 테마 | 라이트/다크/시스템 (`ThemeToggle`) |
| 접근성 | 버튼·입력 최소 44px (`touch-target`, `btn-*`) |

---

## Vercel 배포

1. GitHub에 푸시
2. [Vercel](https://vercel.com) → Import Project
3. **Environment Variables**에 `.env.example` 항목 설정
4. `NEXT_PUBLIC_SITE_URL` = `https://your-app.vercel.app`
5. Deploy

`vercel.json`에 `icn1`(서울) 리전·보안 헤더가 포함되어 있습니다.

### Supabase 피드백 테이블 예시

```sql
create table feedbacks (
  id uuid primary key default gen_random_uuid(),
  content_type text not null,
  content_id text not null,
  result_id text,
  rating int not null check (rating between 1 and 5),
  liked boolean not null default false,
  comment text default '',
  created_at timestamptz default now()
);
```

RLS 정책은 프로덕션 요구에 맞게 anon insert만 허용하도록 설정하세요.

---

## 스크립트

| 명령 | 설명 |
|------|------|
| `npm run dev` | 개발 서버 |
| `npm run build` | 프로덕션 빌드 |
| `npm run start` | 프로덕션 서버 |
| `npm run lint` | ESLint |

---

## 라이선스

Private / 프로젝트 정책에 따름.
