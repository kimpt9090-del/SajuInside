/** 상세 리포트 공통 섹션 (사주·심리·유형 검사) */
export type ReportSection = {
  id: string;
  title: string;
  subtitle?: string;
  /** 본문 단락 */
  paragraphs?: string[];
  /** 불릿 목록 */
  bullets?: string[];
  /** 강조 박스 (한 줄 요약·핵심 조언) */
  highlight?: string;
  /** 태그 (예: #재물운 #연애) */
  tags?: string[];
};

export type DetailedReport = {
  headline: string;
  subheadline?: string;
  keywords?: string[];
  sections: ReportSection[];
};
