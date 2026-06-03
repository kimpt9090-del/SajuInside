-- Supabase SQL Editor에서 실행하세요.
-- .env / API 키는 GitHub에 올리지 마세요. Dashboard에서만 관리합니다.

create table if not exists public.feedbacks (
  id uuid primary key default gen_random_uuid(),
  content_type text not null,
  content_id text not null,
  result_id text,
  rating int not null check (rating between 1 and 5),
  liked boolean not null default false,
  comment text default '',
  created_at timestamptz default now()
);

alter table public.feedbacks enable row level security;

-- anon(공개 키)으로 피드백 INSERT만 허용 (프로덕션 요구에 맞게 조정)
create policy "anon_insert_feedbacks"
  on public.feedbacks
  for insert
  to anon
  with check (true);
