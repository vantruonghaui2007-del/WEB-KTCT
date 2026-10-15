# Web thuyết trình Chủ đề 7 – Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Web thuyết trình tĩnh, chạy offline, cho "Chủ đề 7: Đặc điểm của tôn giáo ở Việt Nam" (Nhóm 7), có chế độ người trình bày, ảnh tương tác, xuất PowerPoint kèm ghi chú.

**Architecture:** Toàn bộ nội dung 20 màn hình nằm trong một file dữ liệu có kiểu (`src/content/slides.ts`). UI React chỉ render dữ liệu đó theo `layout`; xuất PPTX đọc cùng dữ liệu nên web và file PowerPoint không bao giờ lệch nhau. Logic thuần (điều hướng, thời gian hiệu lực luật, zoom ảnh, đồng bộ presenter, dựng model PPTX) tách khỏi component để test bằng Vitest.

**Tech Stack:** React + TypeScript + Vite, Framer Motion (chuyển cảnh, hiệu ứng), pptxgenjs (xuất PPTX), vite-plugin-pwa (offline), Vitest + Testing Library, Playwright (1 smoke test), @mediapipe/tasks-vision (tùy chọn, Task 10).

**Spec:** `Noi_dung_Chu_de_7_da_bien_tap.docx` (thư mục gốc) – nội dung 20 màn hình, ghi chú, nguồn và quy tắc biên tập. Yêu cầu tính năng chốt trong trao đổi ngày 15/10/2026: React + Vite, web tĩnh không AI/backend, dùng để thuyết trình trực tiếp trên lớp, có xuất PowerPoint, có hiệu ứng ảnh thao tác trực tiếp, cộng các tính năng nâng cao do plan đề xuất.

## Global Constraints

- Nội dung hiển thị và ghi chú chép nguyên văn từ docx (giữ dấu tiếng Việt, chuẩn hóa NFC). Không thêm nhận định, số liệu, nhân vật hay trích dẫn ngoài docx.
- Quy tắc biên tập của docx là bắt buộc: không dùng số tiền 2.161 / 3.227 tỷ đồng; không có câu "luôn không có mâu thuẫn"; không mô tả Luật 07/2026/QH16 là đã có hiệu lực trước 01/01/2027; số liệu 2025 luôn kèm ngày công bố.
- Mọi slide có nguồn phải hiện nguồn trên màn hình (chip nguồn) và trong PPTX.
- Múi giờ cho mọi phép tính ngày: `Asia/Ho_Chi_Minh`, không phụ thuộc giờ máy.
- Khung slide cố định 1920×1080 (16:9), scale vừa màn hình, letterbox phần dư.
- Không gọi mạng lúc chạy: font Be Vietnam Pro, ảnh, model MediaPipe đều tự host trong `public/`.
- Trình duyệt mục tiêu: Chrome/Edge bản hiện hành (máy chiếu trên lớp).
- Tôn trọng `prefers-reduced-motion`: tắt parallax, Ken Burns, chuyển cảnh trượt (chỉ giữ fade).
- Mọi chức năng dùng được bằng bàn phím; nút có `aria-label`; tương phản chữ ≥ 4.5:1.
- Phụ thuộc cài với phiên bản cố định (`npm i -E`), không dùng range.
- Hình ảnh tôn giáo: chỉ dùng ảnh có giấy phép rõ ràng, có credit; không dùng hình ảnh hoặc chú thích mang tính chế giễu niềm tin.

## Review Focus

1. Máy chiếu 1024×768 hoặc 1366×768: slide phải letterbox đúng tỉ lệ, chữ không tràn, không thanh cuộn. (Task 3: test `computeStageScale`.)
2. Laptop để sai múi giờ (UTC) lúc 23:30 ngày 31/12/2026 giờ VN: badge hiệu lực luật vẫn phải coi là đã sang 2027. (Task 7: test ranh giới.)
3. Bút trình chiếu (clicker) gửi `PageDown`/`PageUp`, không phải phím mũi tên. Phải chuyển slide được. (Task 2: test phím.)
4. Mở cửa sổ presenter giữa chừng hoặc tải lại: presenter phải hiện ngay slide hiện tại, không về slide 1. (Task 6: test `hello` → `state`.)
5. Tiếng Việt trong PPTX: dấu không vỡ, ghi chú có trong từng slide khi mở bằng PowerPoint. (Task 9: test đọc XML trong file .pptx.)

Ngoài ra Task 2 test phím tắt không chạy khi đang gõ trong ô nhập (ví dụ ô hẹn giờ).

---

## File Structure

```
package.json, vite.config.ts, tsconfig.json, index.html
public/fonts/            Be Vietnam Pro (woff2, 400/600/800)
public/media/            Ảnh đã cấp phép + placeholder.svg
src/main.tsx             Mount + chọn chế độ (audience | presenter) theo ?presenter
src/content/types.ts     Kiểu dữ liệu nội dung
src/content/slides.ts    20 slide (nguồn duy nhất của nội dung)
src/content/sources.ts   6 nguồn của docx
src/content/media.ts     Manifest ảnh (src, alt, credit, license)
src/deck/useDeck.ts      Trạng thái điều hướng + phím tắt
src/deck/stage.ts        computeStageScale
src/deck/Stage.tsx, SlideView.tsx, Overview.tsx, ProgressRail.tsx
src/layouts/*.tsx        Mỗi layout một file
src/widgets/FlipCard.tsx, FeatureMap.tsx, CountUp.tsx, Quiz.tsx, SourceChip.tsx
src/media/zoom.ts, ImageStage.tsx, Gallery.tsx
src/presenter/sync.ts, PresenterView.tsx, Timer.tsx
src/tools/ToolLayer.tsx  Laser, spotlight, bút vẽ, kính lúp, màn đen
src/legal/status.ts      Thời gian hiệu lực luật, tuổi số liệu
src/export/pptxModel.ts, exportPptx.ts
src/gesture/swipe.ts, GestureControl.tsx   (tùy chọn)
tests/                   Vitest, cấu trúc gương với src/
e2e/smoke.spec.ts        Playwright
```

### Task 1: Khung dự án và mô hình nội dung

**Files:**
- Create: `package.json`, `vite.config.ts`, `tsconfig.json`, `index.html`, `.gitignore`, `src/content/types.ts`, `src/content/sources.ts`, `src/content/slides.ts`
- Test: `tests/content/slides.test.ts`

**Interfaces:**
- Produces:

```ts
export type SectionId = 'mo-dau' | 'khai-niem' | 'dac-diem-1' | 'dac-diem-2'
  | 'dac-diem-3' | 'dac-diem-4' | 'dac-diem-5' | 'chinh-sach' | 'on-tap';
export type Layout = 'title' | 'roadmap' | 'prompt' | 'concepts' | 'feature-map'
  | 'points' | 'stats' | 'quote' | 'quiz' | 'closing';
export interface Stat { value: number; decimals?: number; prefix?: string; suffix?: string; label: string }
export interface Concept { term: string; definition: string }
export interface QuizItem { question: string; options: { key: 'A' | 'B'; text: string }[]; answer: 'A' | 'B'; explanation: string }
export interface Slide {
  id: string;              // "01".."20"
  section: SectionId;
  layout: Layout;
  title: string;
  points: string[];        // dòng "Nội dung hiển thị", mỗi dòng là một fragment
  notes: string;           // "Ghi chú và lời thuyết trình", nguyên văn
  sourceIds: string[];     // tham chiếu sources.ts
  asOf?: string;           // ISO date của số liệu, vd "2025-08-15"
  stats?: Stat[]; concepts?: Concept[]; quiz?: QuizItem[]; mediaIds?: string[];
}
export interface Source { id: string; label: string; url?: string }
export const slides: Slide[];   // src/content/slides.ts
export const sources: Source[]; // src/content/sources.ts
```

Source ids (cố định): `tai-lieu-nhom`, `vnplus-2025-08-15`, `luat-2016`, `vnplus-2025-05-06`, `congbao-07-2026`, `bdttg-2026`, URL lấy nguyên từ mục "Thông tin nguồn" trong docx.

`title` = tên mục sau số thứ tự trong docx (vd "Đặc điểm 1: Quy mô và cách đọc số liệu"), riêng slide 01 có `title` = "Chủ đề 7: Đặc điểm của tôn giáo ở Việt Nam" và `points` = môn, nhóm, thông điệp.

Gán layout: 01 `title`; 02 `roadmap`; 03 `prompt`; 04, 12 `concepts`; 05 `feature-map`; 07, 15 `stats`; 09 `quote`; 19 `quiz`; 20 `closing`; còn lại `points`. Gán section: 01–03 `mo-dau`; 04 `khai-niem`; 05–07 `dac-diem-1`; 08–09 `dac-diem-2`; 10–11 `dac-diem-3`; 12–13 `dac-diem-4`; 14–15 `dac-diem-5`; 16–18 `chinh-sach`; 19–20 `on-tap`.

Số liệu chốt: slide 07 `stats` = 16 "tôn giáo", 43 "tổ chức", 27,7 (decimals 1, prefix "Trên ", suffix " triệu") "tín đồ", 30.000 (prefix "Gần ") "cơ sở thờ tự", `asOf: "2025-08-15"`. Slide 15 `stats` = 2.700 (prefix "Hơn ") "đại biểu", 85 "quốc gia và vùng lãnh thổ", `asOf: "2025-05-06"`. Slide 19: 5 câu với `explanation` lấy từ ghi chú (C1 "Phân biệt tôn giáo và tổ chức." … C5 "Dựa vào Điều 6 Luật 2016.").

- [ ] **Step 1: Scaffold**

`npm create vite@latest . -- --template react-ts`, rồi `npm i -E framer-motion pptxgenjs` và `npm i -E -D vitest @testing-library/react @testing-library/user-event jsdom jszip`. Cấu hình Vitest `environment: 'jsdom'`. `git init`, commit khung.

- [ ] **Step 2: Viết test nội dung (fail)**

```ts
const visible = (s: Slide) => [s.title, ...s.points, ...(s.concepts ?? []).flatMap(c => [c.term, c.definition])].join('\n');

test('đúng 20 slide, id "01".."20" theo thứ tự', () => {
  expect(slides.map(s => s.id)).toEqual(Array.from({ length: 20 }, (_, i) => String(i + 1).padStart(2, '0')));
});
test('mọi slide có notes không rỗng và sourceIds hợp lệ', () => {
  const ids = new Set(sources.map(s => s.id));
  for (const s of slides) {
    expect(s.notes.trim().length).toBeGreaterThan(0);
    for (const id of s.sourceIds) expect(ids.has(id)).toBe(true);
  }
});
test('quy tắc biên tập: không có chuỗi bị loại trên màn hình', () => {
  const banned = ['2.161', '3.227', 'luôn không có mâu thuẫn'];
  for (const s of slides) for (const b of banned) expect(visible(s)).not.toContain(b);
});
test('slide có stats thì có asOf', () => {
  for (const s of slides.filter(s => s.stats)) expect(s.asOf).toMatch(/^\d{4}-\d{2}-\d{2}$/);
});
test('toàn bộ chuỗi đã chuẩn hóa NFC', () => {
  const all = JSON.stringify(slides);
  expect(all).toBe(all.normalize('NFC'));
});
test('slide 19 có 5 câu, đáp án A,B,B,A,A', () => {
  expect(slides[18].quiz!.map(q => q.answer)).toEqual(['A', 'B', 'B', 'A', 'A']);
});
```

- [ ] **Step 3: Chạy `npx vitest run tests/content`** – Expected: FAIL (module chưa có).

- [ ] **Step 4: Viết `types.ts`, `sources.ts`, `slides.ts`**

Chép nguyên văn từ docx (dùng `pandoc file.docx -t plain` để lấy text, không gõ lại). Ba định nghĩa slide 04 (Tín ngưỡng, Tôn giáo, Tín đồ) và ba khái niệm slide 12 (Chức sắc, Chức việc, Nhà tu hành) đi vào `concepts`, `points` của hai slide này để rỗng. Slide 03 giữ câu hỏi là `points[0]`.

- [ ] **Step 5: Chạy `npx vitest run tests/content`** – Expected: PASS 6 test.

- [ ] **Step 6: Commit** – `git commit -m "feat: content model for 20 slides"`

---

### Task 2: Điều hướng deck (slide + fragment + phím tắt + URL hash)

**Files:**
- Create: `src/deck/useDeck.ts`
- Test: `tests/deck/useDeck.test.ts`

**Interfaces:**
- Consumes: `Slide` từ Task 1.
- Produces:

```ts
export interface DeckPos { slide: number; step: number }   // slide 0-based, step 0..fragmentCount
export function fragmentCount(s: Slide): number;
export function next(pos: DeckPos, deck: Slide[]): DeckPos;
export function prev(pos: DeckPos, deck: Slide[]): DeckPos; // về slide trước thì step = fragmentCount của slide đó
export function parseHash(hash: string, deck: Slide[]): DeckPos; // "#/7/2" -> {slide:6, step:2}, sai -> {0,0}, kẹp biên
export function toHash(pos: DeckPos): string;               // 1-based slide
export function useDeck(deck: Slide[], opts?: { onChange?: (p: DeckPos) => void }): {
  pos: DeckPos; go(p: DeckPos): void; next(): void; prev(): void;
  overview: boolean; toggleOverview(): void;
};
```

Bảng phím (một nguồn duy nhất, export `KEYMAP`): `ArrowRight`/`PageDown`/`Space` → next; `ArrowLeft`/`PageUp` → prev; `Home`/`End` → slide đầu/cuối; `O` → overview; `P` → mở presenter (Task 6); `B` → màn đen, `L` laser, `S` spotlight, `D` bút vẽ, `Z` kính lúp, `C` xóa nét vẽ, `Escape` tắt công cụ (Task 5); `E` → xuất PPTX (Task 9); `G` → bật/tắt cử chỉ tay (Task 10); `1`/`2` dành cho widget trong slide (SortGame, Quiz). Phím chữ không phân biệt hoa thường.

Fragment: slide thường có `fragmentCount = points.length` (step 0 chỉ có tiêu đề). Slide quiz có `fragmentCount = quiz.length * 2 - 1` (step chẵn = hiện câu hỏi, step lẻ = lộ đáp án), nhờ vậy clicker và presenter điều khiển được quiz mà không cần code riêng. Bỏ qua phím khi `event.target` là `input`, `textarea` hoặc `[contenteditable]`.

- [ ] **Step 1: Viết test (fail)**

```ts
test('next qua hết fragment rồi mới sang slide', () => {
  const d = [mk(2), mk(0)];
  expect(next({ slide: 0, step: 0 }, d)).toEqual({ slide: 0, step: 1 });
  expect(next({ slide: 0, step: 2 }, d)).toEqual({ slide: 1, step: 0 });
  expect(next({ slide: 1, step: 0 }, d)).toEqual({ slide: 1, step: 0 }); // cuối deck
});
test('prev về slide trước hiện đủ fragment', () => {
  expect(prev({ slide: 1, step: 0 }, [mk(3), mk(0)])).toEqual({ slide: 0, step: 3 });
});
test('fragmentCount của slide quiz 5 câu là 9', () => {
  expect(fragmentCount(slides[18])).toBe(9);
});
test('parseHash kẹp biên và chịu input rác', () => {
  expect(parseHash('#/7/2', slides)).toEqual({ slide: 6, step: 2 });
  expect(parseHash('#/99', slides)).toEqual({ slide: 19, step: 0 });
  expect(parseHash('#abc', slides)).toEqual({ slide: 0, step: 0 });
});
test('clicker: PageDown/PageUp chuyển slide', async () => { /* renderHook + fireEvent.keyDown(window,{key:'PageDown'}) -> pos đổi */ });
test('không bắt phím khi đang gõ trong input', async () => { /* focus <input>, gõ Space -> pos không đổi */ });
```

`mk(n)` là helper tạo `Slide` giả với `n` points.

- [ ] **Step 2: `npx vitest run tests/deck/useDeck.test.ts`** – Expected: FAIL.
- [ ] **Step 3: Cài đặt** – hàm thuần trước, `useDeck` đồng bộ `pos` ↔ `location.hash` (lắng nghe `hashchange`) và gọi `onChange`.
- [ ] **Step 4: Chạy lại** – Expected: PASS 5 test.
- [ ] **Step 5: Commit** – `git commit -m "feat: deck navigation with fragments and keymap"`

---

### Task 3: Stage, layout và hệ thống thiết kế

**Files:**
- Create: `src/deck/stage.ts`, `src/deck/Stage.tsx`, `src/deck/SlideView.tsx`, `src/deck/ProgressRail.tsx`, `src/deck/Overview.tsx`, `src/layouts/{Title,Roadmap,Prompt,Concepts,Points,Stats,Quote,Closing}.tsx`, `src/widgets/{FlipCard,FeatureMap,CountUp,SourceChip}.tsx`, `src/styles/tokens.css`, `src/App.tsx`, `public/fonts/*`
- Test: `tests/deck/stage.test.ts`, `tests/layouts/render.test.tsx`

**Interfaces:**
- Consumes: `slides`, `sources` (Task 1); `useDeck` (Task 2).
- Produces: `computeStageScale(vw: number, vh: number): { scale: number; offsetX: number; offsetY: number }` (khung 1920×1080). `<SlideView slide step mode="audience" | "thumb" />` – dùng lại cho presenter và overview. `<CountUp value decimals prefix suffix />` hiển thị theo `vi-VN` (dấu chấm hàng nghìn, dấu phẩy thập phân).

Hướng thiết kế: nền giấy ấm (#F6F1E7), chữ mực (#1F1B16), điểm nhấn son đỏ (#9E2A2B) và vàng đồng (#B08D57); hoa văn trống đồng dạng SVG mờ làm motif chuyển cảnh. Mỗi đặc điểm 1–5 có một màu phụ trong `tokens.css` dùng cho ProgressRail và FeatureMap. Font Be Vietnam Pro tự host.

Hành vi chốt: `points` hiện dần theo `step` (Framer Motion fade+rise 300ms); Concepts là FlipCard (mặt trước = term, lật bằng click/Enter/Space, `aria-pressed`); FeatureMap (slide 05) là 5 nút tròn quanh tâm "Tôn giáo ở Việt Nam", click nút → `go` tới slide đầu của đặc điểm đó (06, 08, 10, 12, 14); Stats chạy CountUp khi slide vào khung; Quote (slide 09) hiện 4 giá trị dạng thẻ và dòng "Không diễn giải thành…" dưới dạng thẻ cảnh báo; SourceChip góc dưới phải, hover/focus hiện label + URL; ProgressRail dưới cùng tô theo section; Overview (phím O) là lưới 5×4 thumbnail, click để nhảy. Chuyển giữa section dùng hiệu ứng trống đồng xoay–mờ; trong cùng section dùng trượt ngang.

- [ ] **Step 1: Viết test (fail)**

```ts
test('letterbox 16:9', () => {
  expect(computeStageScale(1920, 1080)).toEqual({ scale: 1, offsetX: 0, offsetY: 0 });
  expect(computeStageScale(1024, 768)).toEqual({ scale: 1024 / 1920, offsetX: 0, offsetY: (768 - 576) / 2 });
  expect(computeStageScale(1366, 768).scale).toBeCloseTo(1366 / 1920, 5);
  expect(computeStageScale(2560, 1080)).toEqual({ scale: 1, offsetX: 320, offsetY: 0 });
});
test.each(slides.map(s => [s.id, s]))('slide %s render được, có title và nguồn', (_, s) => {
  render(<SlideView slide={s} step={fragmentCount(s)} mode="audience" />);
  expect(screen.getByRole('heading', { name: s.title })).toBeInTheDocument();
  if (s.sourceIds.length) expect(screen.getByTestId('source-chip')).toBeInTheDocument();
});
test('CountUp định dạng vi-VN', () => { /* value 27.7 decimals 1 -> "Trên 27,7 triệu" khi xong; 30000 -> "Gần 30.000" */ });
test('FeatureMap nút 3 gọi go tới slide 10', () => { /* index 9 */ });
```

- [ ] **Step 2: Chạy test** – Expected: FAIL.
- [ ] **Step 3: Cài đặt stage, SlideView, layouts, widgets, tokens.** CountUp và mọi animation đọc `useReducedMotion()` của Framer Motion; khi bật thì hiện giá trị cuối ngay.
- [ ] **Step 4: Chạy test** – Expected: PASS. Chạy `npm run dev`, đi hết 20 slide bằng phím, xem ở 1366×768 và 1920×1080 trong DevTools.
- [ ] **Step 5: Commit** – `git commit -m "feat: stage, layouts and design system"`

---

### Task 4: Ảnh tương tác trực tiếp

**Files:**
- Create: `src/content/media.ts`, `src/media/zoom.ts`, `src/media/ImageStage.tsx`, `src/media/Gallery.tsx`, `src/media/SortGame.tsx`, `public/media/placeholder.svg`
- Modify: `src/content/slides.ts` (gắn `mediaIds` cho 03, 06, 15), `src/layouts/Prompt.tsx`, `src/layouts/Points.tsx`, `src/layouts/Stats.tsx`
- Test: `tests/media/zoom.test.ts`, `tests/media/SortGame.test.tsx`, `tests/content/media.test.ts`

**Interfaces:**
- Produces:

```ts
export interface MediaItem { id: string; src: string; alt: string; credit: string; license: string; group?: 'ton-giao' | 'tin-nguong' }
export const media: MediaItem[];
export interface View { scale: number; x: number; y: number }
export const MIN_SCALE = 1, MAX_SCALE = 4;
export function zoomAt(v: View, factor: number, cx: number, cy: number, box: { w: number; h: number }): View; // giữ điểm (cx,cy) đứng yên, kẹp scale và kẹp pan để ảnh không lộ nền
export function panBy(v: View, dx: number, dy: number, box: { w: number; h: number }): View;
```

Thao tác chốt cho `<ImageStage>`: lăn chuột hoặc pinch để zoom tại con trỏ; kéo để pan; double-click (hoặc phím `0`) về `scale 1`; phím `+`/`-` zoom tâm; nghiêng nhẹ theo con trỏ (parallax ±6°) khi `scale = 1`; Ken Burns chậm khi đứng yên 4 giây; chạm vào ảnh trong Gallery → mở lightbox toàn khung với credit + license ở chân. Dùng Pointer Events (một code path cho chuột, bút, cảm ứng).

Slide 03 dùng `<SortGame>`: 7 thẻ ảnh (chùa, nhà thờ, thánh thất, thánh đường, bàn thờ tổ tiên, đình, đền) kéo vào hai cột "Cơ sở tôn giáo" và "Không gian tín ngưỡng". Nhóm theo đúng cách docx tách hai cụm: 4 thẻ đầu `ton-giao`, 3 thẻ sau `tin-nguong`. Thả đúng → thẻ khóa, viền xanh; sai → rung nhẹ, trả về. Thay thế bàn phím: Tab tới thẻ, phím `1`/`2` gửi vào cột. Khi xếp xong hiện dòng "Không đồng nhất mọi hình thức thờ cúng với việc theo một tôn giáo." (đây là `points[2]` của slide 03). Slide 06 dùng Gallery 6 ảnh (4 du nhập, 2 nội sinh); slide 15 có một ảnh Vesak 2025 làm nền ImageStage sau các số liệu.

Ảnh: nhóm tự chọn ảnh có giấy phép (Wikimedia Commons CC BY/CC BY-SA hoặc ảnh nhóm tự chụp), tối ưu sang WebP ≤ 300 KB, lưu `public/media/`. Chưa có ảnh thì dùng `placeholder.svg`, `credit` = "Ảnh minh họa – cần thay".

- [ ] **Step 1: Viết test (fail)**

```ts
const box = { w: 1000, h: 500 };
test('zoomAt giữ điểm dưới con trỏ', () => {
  const v = zoomAt({ scale: 1, x: 0, y: 0 }, 2, 250, 125, box);
  expect(v.scale).toBe(2);
  expect((250 - v.x) / v.scale).toBeCloseTo(250);
  expect((125 - v.y) / v.scale).toBeCloseTo(125);
});
test('scale kẹp trong [1,4]', () => {
  expect(zoomAt({ scale: 3, x: 0, y: 0 }, 10, 0, 0, box).scale).toBe(4);
  expect(zoomAt({ scale: 1, x: 0, y: 0 }, 0.1, 0, 0, box).scale).toBe(1);
});
test('panBy không cho lộ nền', () => {
  expect(panBy({ scale: 1, x: 0, y: 0 }, 300, 0, box)).toEqual({ scale: 1, x: 0, y: 0 });
  expect(panBy({ scale: 2, x: 0, y: 0 }, -5000, 0, box).x).toBe(-1000); // -(w*scale - w)
});
test('mọi media có alt và credit', () => { for (const m of media) { expect(m.alt).not.toBe(''); expect(m.credit).not.toBe(''); } });
test('SortGame: phím 1/2 xếp thẻ, xếp đủ 7 thì hiện dòng lưu ý', async () => { /* đúng 4 ton-giao + 3 tin-nguong -> getByText(/Không đồng nhất mọi hình thức thờ cúng/) */ });
test('SortGame: thả sai thì thẻ không bị khóa', async () => { /* gửi "đình" vào cột 1 -> vẫn ở khay */ });
```

- [ ] **Step 2: Chạy test** – Expected: FAIL.
- [ ] **Step 3: Cài đặt `zoom.ts` (hàm thuần), rồi các component.** Transform bằng `translate3d(x,y,0) scale(s)` trên một wrapper, `touch-action: none`.
- [ ] **Step 4: Chạy test** – Expected: PASS. Thử bằng tay trên touchpad và màn cảm ứng nếu có.
- [ ] **Step 5: Commit** – `git commit -m "feat: interactive images, gallery and sort game"`

---

### Task 5: Công cụ trình chiếu (laser, spotlight, bút vẽ, kính lúp, màn đen)

**Files:**
- Create: `src/tools/ToolLayer.tsx`, `src/tools/useTool.ts`, `src/tools/ink.ts`
- Modify: `src/App.tsx` (đặt `ToolLayer` trên `Stage`)
- Test: `tests/tools/useTool.test.ts`, `tests/tools/ink.test.ts`

**Interfaces:**
- Consumes: phím `B L S D Z Escape` từ `KEYMAP` (Task 2).
- Produces: `type Tool = 'none' | 'laser' | 'spotlight' | 'pen' | 'magnifier' | 'blackout'`; `useTool(): { tool: Tool; set(t: Tool): void }` (bấm lại phím đang bật = tắt); `InkStore` với `add(slideId: string, stroke: Stroke)`, `clear(slideId: string)`, `get(slideId: string): Stroke[]`, nét vẽ lưu theo từng slide, mất khi tải lại trang.

Hành vi: laser là chấm đỏ có vệt mờ 300ms; spotlight làm tối 75% trừ vòng tròn bán kính 180px quanh con trỏ (lăn chuột đổi bán kính 100–400); bút vẽ 3 màu (son đỏ, vàng đồng, trắng), phím `C` xóa slide hiện tại; kính lúp tròn 2,5× theo con trỏ; màn đen che toàn khung. Tọa độ quy về hệ 1920×1080 để nét vẽ đúng chỗ khi đổi kích thước cửa sổ. Thanh công cụ nhỏ góc trái dưới, tự ẩn sau 2 giây không di chuột.

- [ ] **Step 1: Viết test (fail)**

```ts
test('bấm L hai lần thì tắt laser', () => { /* set('laser'); set('laser') -> 'none' */ });
test('Escape tắt mọi công cụ', () => { /* tool 'pen' -> keyDown Escape -> 'none' */ });
test('nét vẽ tách theo slide', () => {
  const ink = new InkStore(); ink.add('07', stroke); ink.add('08', stroke);
  ink.clear('07');
  expect(ink.get('07')).toEqual([]); expect(ink.get('08')).toHaveLength(1);
});
test('toStageCoords quy đổi theo scale và offset', () => {
  expect(toStageCoords(512 + 0, 96, { scale: 0.5, offsetX: 0, offsetY: 96 })).toEqual({ x: 1024, y: 0 });
});
```

`toStageCoords(clientX: number, clientY: number, s: ReturnType<typeof computeStageScale>): { x: number; y: number }` đặt trong `ink.ts`.

- [ ] **Step 2: Chạy test** – Expected: FAIL.
- [ ] **Step 3: Cài đặt.** Vẽ bằng một `<canvas>` 1920×1080 scale theo stage; laser/spotlight/kính lúp bằng CSS (`radial-gradient` mask, `backdrop-filter` cho kính lúp nếu được, fallback là bản sao slide scale 2,5×).
- [ ] **Step 4: Chạy test** – Expected: PASS.
- [ ] **Step 5: Commit** – `git commit -m "feat: presenter tools overlay"`

---

### Task 6: Chế độ người trình bày (2 cửa sổ đồng bộ)

**Files:**
- Create: `src/presenter/sync.ts`, `src/presenter/PresenterView.tsx`, `src/presenter/Timer.tsx`, `src/presenter/timer.ts`
- Modify: `src/main.tsx` (đọc `?presenter`), `src/App.tsx` (phím `P` → `window.open('?presenter' + location.hash, 'presenter')`)
- Test: `tests/presenter/sync.test.ts`, `tests/presenter/timer.test.ts`

**Interfaces:**
- Consumes: `useDeck` (Task 2), `SlideView mode="thumb"` (Task 3).
- Produces:

```ts
export type SyncMsg =
  | { type: 'hello' }                      // cửa sổ mới mở hỏi trạng thái
  | { type: 'state'; pos: DeckPos }        // trả lời hello hoặc khi pos đổi
  | { type: 'nav'; pos: DeckPos }          // presenter yêu cầu khán giả chuyển
  | { type: 'tool'; tool: Tool };
export function createSync(channel: string, onMsg: (m: SyncMsg) => void): { send(m: SyncMsg): void; close(): void };
export function formatClock(ms: number): string;  // "07:05", âm thì "-01:30"
export function paceStatus(elapsedMs: number, targetMs: number, slideIdx: number, total: number): 'ahead' | 'on-track' | 'behind';
```

Kênh `BroadcastChannel('ktct-chu-de-7')`. Cửa sổ khán giả là nguồn sự thật: khi nhận `hello` thì gửi `state`, khi nhận `nav` thì `go` rồi phát `state`. Presenter khi khởi động gửi `hello` và hiển thị theo `state` nhận được.

Màn presenter: slide hiện tại (lớn) + slide/fragment kế tiếp (nhỏ), ghi chú `notes` cỡ chữ chỉnh bằng `Ctrl +/-`, chip nguồn đầy đủ, đồng hồ đã trôi, giờ thực, hẹn giờ mục tiêu (mặc định 15 phút, ô nhập phút), thanh tiến độ đổi màu theo `paceStatus` (lệch quá 10% so với tỉ lệ slide là ahead/behind). Phím điều hướng trên presenter gửi `nav`.

- [ ] **Step 1: Viết test (fail)**

```ts
test('cửa sổ mở sau nhận được slide hiện tại', async () => {
  const got: SyncMsg[] = [];
  const audience = createSync('t', m => m.type === 'hello' && audience.send({ type: 'state', pos: { slide: 6, step: 1 } }));
  const presenter = createSync('t', m => got.push(m));
  presenter.send({ type: 'hello' });
  await vi.waitFor(() => expect(got).toContainEqual({ type: 'state', pos: { slide: 6, step: 1 } }));
});
test('formatClock', () => {
  expect(formatClock(425_000)).toBe('07:05');
  expect(formatClock(-90_000)).toBe('-01:30');
});
test('paceStatus', () => {
  expect(paceStatus(450_000, 900_000, 10, 20)).toBe('on-track');
  expect(paceStatus(700_000, 900_000, 5, 20)).toBe('behind');
  expect(paceStatus(100_000, 900_000, 15, 20)).toBe('ahead');
});
```

jsdom không có `BroadcastChannel` đầy đủ: dùng `BroadcastChannel` của Node (Node ≥ 18 có sẵn ở global) hoặc polyfill nhỏ trong `tests/setup.ts`.

- [ ] **Step 2: Chạy test** – Expected: FAIL.
- [ ] **Step 3: Cài đặt.** `paceStatus`: so `elapsed/target` với `slideIdx/total`, lệch > 0.10 thì ahead/behind.
- [ ] **Step 4: Chạy test** – Expected: PASS. Thử tay: mở `P`, kéo cửa sổ presenter sang màn laptop, chuyển slide từ cả hai phía, tải lại presenter giữa chừng.
- [ ] **Step 5: Commit** – `git commit -m "feat: synced presenter view with notes and timer"`

---

### Task 7: Nhãn hiệu lực pháp luật và độ mới của số liệu

**Files:**
- Create: `src/legal/status.ts`, `src/widgets/LegalBadge.tsx`, `src/widgets/DataAge.tsx`
- Modify: `src/layouts/Points.tsx` (slide 17 hiển thị `LegalBadge`), `src/layouts/Stats.tsx` (hiển thị `DataAge` từ `asOf`)
- Test: `tests/legal/status.test.ts`

**Interfaces:**
- Produces:

```ts
export const LAW_2026 = { number: '07/2026/QH16', issued: '2026-04-23', effective: '2027-01-01' } as const;
export function todayVN(now?: Date): string;   // "YYYY-MM-DD" theo Asia/Ho_Chi_Minh
export function lawStatus(now?: Date): { phase: 'pending'; daysLeft: number } | { phase: 'in-force' };
export function dataAgeLabel(asOf: string, now?: Date): string; // "Số liệu công bố 15/08/2025 · cách đây 14 tháng"
```

Slide 17 hiển thị một dòng thời gian ngang: 2016 (Luật 02/2016/QH14) → 23/04/2026 (ban hành Luật 07/2026/QH16) → 01/01/2027 (có hiệu lực), có một mốc "Hôm nay" theo `todayVN()`. Khi `phase = 'pending'`: badge vàng "Luật 2026 chưa có hiệu lực – còn N ngày". Khi `in-force`: badge đỏ "Luật 2026 đã có hiệu lực – cần cập nhật căn cứ và số điều" và presenter view hiện cảnh báo này ở đầu mọi slide có `luat-2016` trong `sourceIds`.

- [ ] **Step 1: Viết test (fail)**

```ts
test('trước ngày hiệu lực', () => {
  expect(lawStatus(new Date('2026-10-15T03:00:00Z'))).toEqual({ phase: 'pending', daysLeft: 78 });
});
test('ranh giới múi giờ: 31/12/2026 23:30 giờ VN = 16:30Z vẫn pending; 17:00Z là 01/01/2027 giờ VN', () => {
  expect(lawStatus(new Date('2026-12-31T16:30:00Z')).phase).toBe('pending');
  expect(lawStatus(new Date('2026-12-31T17:00:00Z'))).toEqual({ phase: 'in-force' });
});
test('dataAgeLabel', () => {
  expect(dataAgeLabel('2025-08-15', new Date('2026-10-15T03:00:00Z'))).toBe('Số liệu công bố 15/08/2025 · cách đây 14 tháng');
});
```

- [ ] **Step 2: Chạy test** – Expected: FAIL.
- [ ] **Step 3: Cài đặt** bằng `Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Ho_Chi_Minh' })` để lấy ngày; tính ngày chênh theo ngày lịch, không theo mili-giây.
- [ ] **Step 4: Chạy test** – Expected: PASS.
- [ ] **Step 5: Commit** – `git commit -m "feat: legal effectiveness badge and data age labels"`

---

### Task 8: Trắc nghiệm tương tác (slide 19)

**Files:**
- Create: `src/widgets/Quiz.tsx`, `src/widgets/quizState.ts`
- Modify: `src/deck/SlideView.tsx` (layout `quiz` → `Quiz`)
- Test: `tests/widgets/Quiz.test.tsx`

**Interfaces:**
- Consumes: `QuizItem` (Task 1), `step` từ `useDeck` (Task 2, quy ước chẵn/lẻ).
- Produces: `quizView(step: number, n: number): { index: number; revealed: boolean }`; `<Quiz items step onPick? />`.

Hành vi: một câu mỗi lần, hai nút A/B cỡ lớn. Khi `revealed`, đáp án đúng có viền xanh và dấu ✓, đáp án sai mờ đi, `explanation` hiện bên dưới. Nếu người trình bày bấm chọn A/B trước khi lộ đáp án thì lựa chọn được đánh dấu (vòng vàng) để cả lớp thấy, rồi bấm next mới lộ. Phím `1`/`2` chọn A/B khi đang ở slide quiz (không dùng `B` vì trùng màn đen). Đáp án chỉ lộ theo `step`, nên câu hỏi không bao giờ hiện sẵn đáp án như trong docx. Hiệu ứng đúng: một vòng lan tỏa ngắn từ nút đúng (tắt khi reduced motion). Dấu chấm tiến độ 5 câu ở trên.

- [ ] **Step 1: Viết test (fail)**

```ts
test('quizView', () => {
  expect(quizView(0, 5)).toEqual({ index: 0, revealed: false });
  expect(quizView(3, 5)).toEqual({ index: 1, revealed: true });
  expect(quizView(9, 5)).toEqual({ index: 4, revealed: true });
});
test('step 1 lộ đáp án A và giải thích câu 1', () => {
  render(<Quiz items={slides[18].quiz!} step={1} />);
  expect(screen.getByRole('button', { name: /^A/ })).toHaveAttribute('data-correct', 'true');
  expect(screen.getByText(slides[18].quiz![0].explanation)).toBeVisible();
});
test('chưa lộ thì không có giải thích', () => {
  render(<Quiz items={slides[18].quiz!} step={2} />);
  expect(screen.queryByText(slides[18].quiz![1].explanation)).toBeNull();
});
```

- [ ] **Step 2: Chạy test** – Expected: FAIL.
- [ ] **Step 3: Cài đặt.**
- [ ] **Step 4: Chạy test** – Expected: PASS.
- [ ] **Step 5: Commit** – `git commit -m "feat: interactive quiz driven by deck steps"`

---

### Task 9: Xuất PowerPoint (.pptx) có ghi chú

**Files:**
- Create: `src/export/pptxModel.ts`, `src/export/exportPptx.ts`, `src/export/ExportButton.tsx`
- Modify: `src/App.tsx` (nút xuất trên thanh công cụ + phím `E`)
- Test: `tests/export/pptxModel.test.ts`, `tests/export/exportPptx.test.ts`

**Interfaces:**
- Consumes: `slides`, `sources`, `media` (Task 1, 4); `dataAgeLabel`, `lawStatus` (Task 7).
- Produces:

```ts
export interface PptxSlideModel {
  title: string; bullets: string[]; notes: string;
  sourceLine: string;          // "Nguồn: <label>; <label>"
  imagePath?: string;          // ảnh đầu tiên trong mediaIds, nếu không phải placeholder
  footer: string;              // "Nhóm 7 · Chủ đề 7 · 07/20"
}
export function buildPptxModel(deck: Slide[], srcs: Source[], now?: Date): PptxSlideModel[];
export async function exportPptx(deck: Slide[], opts?: { now?: Date }): Promise<Blob>;
export function downloadPptx(blob: Blob, fileName?: string): void; // mặc định "Nhom7_Chu_de_7_Ton_giao_VN.pptx"
```

Quy tắc chuyển đổi trong `buildPptxModel`: `points` → bullets; `concepts` → bullet dạng "Thuật ngữ: định nghĩa"; `stats` → bullet "16 tôn giáo", "Trên 27,7 triệu tín đồ"… và thêm `dataAgeLabel(asOf)` làm bullet cuối; `quiz` → mỗi câu một bullet "Câu n. … A. … B. …", đáp án và giải thích đưa vào `notes` (khán giả không thấy đáp án trên slide); slide 17 thêm bullet trạng thái luật theo `lawStatus(now)`; slide 05 giữ 5 đặc điểm. `notes` = nguyên văn ghi chú. Layout pptxgenjs `LAYOUT_WIDE`, font `Arial` (an toàn cho tiếng Việt trên mọi máy), cùng bảng màu Task 3, tiêu đề son đỏ, footer nhỏ màu xám.

- [ ] **Step 1: Viết test (fail)**

```ts
const m = buildPptxModel(slides, sources, new Date('2026-10-15T03:00:00Z'));
test('20 slide, footer đánh số', () => {
  expect(m).toHaveLength(20);
  expect(m[6].footer).toBe('Nhóm 7 · Chủ đề 7 · 07/20');
});
test('slide 07 có số liệu định dạng vi-VN và ngày công bố', () => {
  expect(m[6].bullets).toContain('Trên 27,7 triệu tín đồ');
  expect(m[6].bullets).toContain('Gần 30.000 cơ sở thờ tự');
  expect(m[6].bullets.at(-1)).toMatch(/^Số liệu công bố 15\/08\/2025/);
});
test('quiz: đáp án chỉ nằm trong notes', () => {
  expect(m[18].bullets.join(' ')).not.toMatch(/Đáp án/);
  expect(m[18].notes).toMatch(/Đáp án/);
});
test('mọi slide có nguồn thì có sourceLine', () => {
  slides.forEach((s, i) => s.sourceIds.length && expect(m[i].sourceLine).toMatch(/^Nguồn: /));
});
test('file .pptx có 20 slide, có notes, tiếng Việt nguyên vẹn', async () => {
  const blob = await exportPptx(slides, { now: new Date('2026-10-15T03:00:00Z') });
  const zip = await JSZip.loadAsync(await blob.arrayBuffer());
  const slideFiles = Object.keys(zip.files).filter(f => /^ppt\/slides\/slide\d+\.xml$/.test(f));
  const noteFiles = Object.keys(zip.files).filter(f => /^ppt\/notesSlides\/notesSlide\d+\.xml$/.test(f));
  expect(slideFiles).toHaveLength(20);
  expect(noteFiles).toHaveLength(20);
  const s1 = await zip.file('ppt/slides/slide1.xml')!.async('string');
  expect(s1).toContain('Đặc điểm của tôn giáo ở Việt Nam'.normalize('NFC'));
});
```

- [ ] **Step 2: Chạy test** – Expected: FAIL.
- [ ] **Step 3: Cài đặt** `buildPptxModel` (thuần) rồi `exportPptx` (`new PptxGenJS()`, `slide.addNotes(notes)`, `pptx.write({ outputType: 'blob' })`). Ảnh nạp qua `fetch` → dataURL; lỗi nạp ảnh thì bỏ ảnh, không làm hỏng cả file. Import pptxgenjs động (`await import('pptxgenjs')`) để không làm nặng lần tải đầu.
- [ ] **Step 4: Chạy test** – Expected: PASS. Mở file xuất ra bằng PowerPoint (và Google Slides nếu có), kiểm tra dấu, ghi chú, ảnh.
- [ ] **Step 5: Commit** – `git commit -m "feat: export deck to pptx with speaker notes"`

---

### Task 10: Chuyển slide bằng cử chỉ tay qua webcam (tùy chọn, chạy cục bộ)

**Files:**
- Create: `src/gesture/swipe.ts`, `src/gesture/GestureControl.tsx`, `public/models/hand_landmarker.task`, `public/mediapipe/wasm/*`
- Modify: `src/App.tsx` (phím `G`, gắn `GestureControl`)
- Test: `tests/gesture/swipe.test.ts`

**Interfaces:**
- Consumes: `useDeck().next/prev` (Task 2).
- Produces:

```ts
export interface HandSample { t: number; x: number }   // x của landmark cổ tay, 0..1, khung camera chưa lật
export function detectSwipe(samples: HandSample[], cfg?: { minDx?: number; maxMs?: number; cooldownMs?: number; lastFireAt?: number }):
  'next' | 'prev' | null;  // mặc định minDx 0.25, maxMs 600, cooldownMs 1000
```

Quy ước hướng: người trình bày vuốt tay sang trái của chính họ (x tăng trong khung chưa lật) → `next`; sang phải → `prev`. Chỉ xét mẫu trong `maxMs` gần nhất; trong `cooldownMs` sau lần kích hoạt trước thì trả `null`.

Chạy `@mediapipe/tasks-vision` (cài `-E`) với model và wasm tự host, không gửi hình ảnh đi đâu. Mặc định tắt. Bật bằng `G`: xin quyền camera, hiện ô xem trước nhỏ góc phải (lật gương) và chấm báo đang nhận tay; từ chối quyền hoặc không có camera → toast "Không dùng được camera, vẫn điều khiển bằng phím được" và tự tắt. Tắt `G` thì dừng mọi track camera.

- [ ] **Step 1: Viết test (fail)**

```ts
const s = (pairs: [number, number][]) => pairs.map(([t, x]) => ({ t, x }));
test('vuốt nhanh đủ xa -> next', () => expect(detectSwipe(s([[0, .3], [200, .45], [400, .62]]))).toBe('next'));
test('chiều ngược -> prev', () => expect(detectSwipe(s([[0, .7], [300, .4]]))).toBe('prev'));
test('quá chậm -> null', () => expect(detectSwipe(s([[0, .3], [900, .7]]))).toBeNull());
test('quá ngắn -> null', () => expect(detectSwipe(s([[0, .4], [200, .5]]))).toBeNull());
test('trong cooldown -> null', () =>
  expect(detectSwipe(s([[1000, .3], [1300, .7]]), { lastFireAt: 500 })).toBeNull());
```

- [ ] **Step 2: Chạy test** – Expected: FAIL.
- [ ] **Step 3: Cài đặt `detectSwipe`, rồi `GestureControl`** (vòng `requestVideoFrameCallback`, giữ cửa sổ mẫu 600ms).
- [ ] **Step 4: Chạy test** – Expected: PASS. Thử tay trước webcam laptop ở khoảng cách 1–2 m.
- [ ] **Step 5: Commit** – `git commit -m "feat: optional on-device hand swipe navigation"`

---

### Task 11: Offline (PWA), build, smoke test E2E, triển khai

**Files:**
- Modify: `vite.config.ts` (thêm `VitePWA`), `package.json` (scripts `test`, `e2e`, `build`)
- Create: `e2e/smoke.spec.ts`, `playwright.config.ts`, `public/manifest.webmanifest`, `public/icons/*`, `README.md` (cách chạy, phím tắt, cách xuất PPTX)
- Test: `e2e/smoke.spec.ts`

**Interfaces:**
- Consumes: toàn bộ app.

Cấu hình: `npm i -E -D vite-plugin-pwa @playwright/test`. `registerType: 'autoUpdate'`, precache `**/*.{js,css,html,woff2,webp,svg,task,wasm}`, `maximumFileSizeToCacheInBytes` 15 MB (model + wasm MediaPipe). `base: './'` để chạy được cả trên GitHub Pages lẫn mở từ thư mục `dist` qua `npx vite preview`.

- [ ] **Step 1: Viết smoke test (fail)**

```ts
test('đi hết deck bằng PageDown và về đầu bằng Home', async ({ page }) => {
  await page.goto('/');
  for (let i = 0; i < 200; i++) await page.keyboard.press('PageDown'); // dư so với tổng fragment, next ở cuối deck là no-op
  await expect(page).toHaveURL(/#\/20/);
  await page.keyboard.press('Home');
  await expect(page).toHaveURL(/#\/1(\/0)?$/);
});
test('xuất PPTX tải về file', async ({ page }) => {
  await page.goto('/');
  const dl = page.waitForEvent('download');
  await page.keyboard.press('e');
  expect((await dl).suggestedFilename()).toBe('Nhom7_Chu_de_7_Ton_giao_VN.pptx');
});
test('tải lại khi mất mạng vẫn chạy', async ({ page, context }) => {
  await page.goto('/'); await page.waitForFunction(() => navigator.serviceWorker.controller);
  await context.setOffline(true); await page.reload();
  await expect(page.getByRole('heading', { name: /Chủ đề 7/ })).toBeVisible();
});
test('không có thanh cuộn ở 1024×768', async ({ page }) => {
  await page.setViewportSize({ width: 1024, height: 768 }); await page.goto('/#/7');
  expect(await page.evaluate(() => document.documentElement.scrollHeight <= innerHeight)).toBe(true);
});
```

Playwright chạy trên `vite preview` (bản build) vì service worker chỉ có trong build.

- [ ] **Step 2: `npm run build && npx playwright test`** – Expected: FAIL ở test offline.
- [ ] **Step 3: Thêm cấu hình PWA, manifest, icon.**
- [ ] **Step 4: Chạy lại toàn bộ** – `npx vitest run && npm run build && npx playwright test`. Expected: PASS hết, `npm run build` không cảnh báo TypeScript.
- [ ] **Step 5: Diễn tập trên máy thật** – Mở web trên laptop, cắm máy chiếu, `P` để mở presenter sang màn laptop, đi hết 20 slide bằng clicker, thử từng công cụ, xuất PPTX, ngắt wifi rồi F5.
- [ ] **Step 6: Commit và triển khai** – `git commit -m "feat: offline PWA, e2e smoke tests, deploy config"`. Triển khai lên GitHub Pages hoặc Vercel là thao tác công khai: hỏi nhóm trước khi push lên repo public.

---

## Ngoài phạm vi (cố ý không làm)

Trợ lý AI và backend (đã chốt web tĩnh); bình chọn realtime của khán giả qua QR (cần server); điều khiển bằng điện thoại (cần server signaling); xuất PDF (có thể dùng in của trình duyệt sau này nếu cần).
