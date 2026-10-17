export type SectionId =
  | "mo-dau"
  | "khai-niem"
  | "dac-diem-1"
  | "dac-diem-2"
  | "dac-diem-3"
  | "dac-diem-4"
  | "dac-diem-5"
  | "chinh-sach"
  | "on-tap";
export type Layout =
  | "title"
  | "roadmap"
  | "prompt"
  | "concepts"
  | "feature-map"
  | "points"
  | "stats"
  | "quote"
  | "quiz"
  | "closing";
export interface Stat {
  value: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  label: string;
}
export interface Concept {
  term: string;
  definition: string;
}
export interface QuizItem {
  question: string;
  options: { key: "A" | "B" | "C" | "D"; text: string }[];
  answer: "A" | "B" | "C" | "D";
  explanation: string;
}
export interface Slide {
  id: string;
  section: SectionId;
  layout: Layout;
  title: string;
  points: string[];
  notes: string;
  sourceIds: string[];
  asOf?: string;
  stats?: Stat[];
  concepts?: Concept[];
  quiz?: QuizItem[];
  mediaIds?: string[];
}
export interface Source {
  id: string;
  label: string;
  url?: string;
}
export const sectionLabels: Record<SectionId, string> = {
  "mo-dau": "Mở đầu",
  "khai-niem": "Khái niệm",
  "dac-diem-1": "01 · Nhiều tôn giáo",
  "dac-diem-2": "02 · Đa dạng & đan xen",
  "dac-diem-3": "03 · Tín đồ & cộng đồng",
  "dac-diem-4": "04 · Vai trò chức sắc",
  "dac-diem-5": "05 · Quan hệ quốc tế",
  "chinh-sach": "Chính sách & liên hệ",
  "on-tap": "Ôn tập & kết luận",
};
