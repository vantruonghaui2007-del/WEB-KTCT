# Bản bàn giao: độ tương phản, quay tên lớp và cử chỉ

Nhánh: `feat/revise-religion-presentation`. Workspace: `C:\Users\vantr\WEB-KTCT`.

## Phạm vi đã triển khai

- Giữ 20 slide và nội dung đã biên tập. Khắc phục chữ sáng trên nền kem ở khung thành viên và các thẻ liên quan; tăng cỡ/độ đậm tên, đồng bộ màu theo theme sáng/tối.
- Nút **Gọi tên**, phím **R** mở game chọn ngẫu nhiên từ danh sách lớp. Hỗ trợ dán cột Excel, TXT/CSV UTF-8; giữ riêng người trùng tên qua số thứ tự. Có nhập/sửa/xuất danh sách TXT, chống gọi lại, lịch sử, vòng mới, âm thanh và hoạt ảnh giảm tốc. Dữ liệu chỉ lưu localStorage, hoạt động offline. Đóng khi đang quay hủy lượt chưa hoàn thành.
- Cử chỉ theo dõi tâm lòng bàn tay, làm mượt, ba mức độ nhạy, lọc rung/chuyển động dọc/mất khung hình. Có chấm theo dõi và thanh tiến độ, tự tạm dừng khi mở hộp thoại. Có lịch khung hình dự phòng, xử lý camera ngắt và dừng track khi đóng. Hành động cử chỉ dùng cùng luồng bàn phím, tránh bỏ qua xác nhận quiz.
- Khóa tương tác quiz và đổi theme khi nhập danh sách trong modal để các phím của họ tên không tác động slide phía sau.

## Các tệp cần biết

- `src/widgets/ClassPicker.tsx`: UI, chu kỳ quay, xử lý tệp và lưu trạng thái.
- `src/widgets/roster.ts`: đọc danh sách, định danh theo dòng, chọn ngẫu nhiên không thiên lệch modulo.
- `src/widgets/pickerSound.ts`: âm thanh Web Audio cục bộ, dọn context khi đóng.
- `src/styles/picker.css`: giao diện sân khấu, di động và reduced-motion.
- `src/gesture/GestureControl.tsx`, `src/gesture/swipe.ts`: camera và bộ nhận diện vuốt.
- `src/App.tsx`, `src/deck/useDeck.ts`: nút, phím R, các điều kiện tạm dừng.
- `tests/engagement.test.ts`, `e2e/engagement.spec.ts`: nhập danh sách, không lặp, offline, tương phản và khóa bàn phím quiz.

## Kiểm chứng tại điểm bàn giao

Đã hoàn tất kiểm thử tự động toàn diện:
- **Unit tests (Vitest):** 7/7 test files, 54/54 tests passed (gồm `sync`, `engagement`, `content`, `core`, `export`, `mobile`, `ui`).
- **E2E tests (Playwright):** 16/16 tests passed trên Chrome:
  - `e2e/engagement.spec.ts`: 3/3 passed (quay tên ngẫu nhiên không trùng lặp, import CSV offline, độ tương phản chữ > 4.5 trong cả 2 theme sáng/tối và responsive mobile).
  - `e2e/smoke.spec.ts`: 12/12 passed (điều hướng phím, 20 slide projector, video YouTube/poster, gallery zoom, flip cards, quiz, presenter sync, canvas vẽ, export PowerPoint 20 slide, offline PWA, camera fallback, MediaPipe hand model).
  - `e2e/guide.spec.ts`: 1/1 passed.
- **Production Build:** `npm run build` (`tsc -b && vite build`) hoàn thành thành công, 0 lỗi TypeScript, PWA precache 64 tài nguyên.

## Cách backup và tiếp tục

Sao chép toàn bộ thư mục dự án, gồm `src`, `public`, tài liệu và các tệp cấu hình/lockfile. Không cần sao chép `node_modules`, `dist`, `test-results`, `playwright-report`. Giữ thư mục `.git` nếu muốn bảo toàn nhánh và lịch sử. Danh sách lớp được lưu trong trình duyệt, **không nằm trong source**: bấm biểu tượng tải TXT trong game để backup riêng.

Khởi chạy lại: `npm ci`, `npm run dev -- --host 127.0.0.1`; mở `http://127.0.0.1:5173/`.

## Công việc có thể giao tiếp cho AI khác sau khi người dùng xem

1. **Diễn tập webcam thật:** cùng người dùng thử trong phòng trình chiếu; ghi nhận độ nhạy, khoảng cách, ánh sáng, tình huống vuốt nhầm. Hiệu chỉnh các profile nếu có bằng chứng thực tế, giữ test chống rung và cooldown. Camera giả lập không chứng minh độ chính xác với tay thật.
2. **Rà soát danh sách lớp thật:** nhập danh sách của người dùng, kiểm tra tên trùng/số thứ tự và dấu tiếng Việt; không đưa danh sách vào repo. Nếu người dùng cần nhập thẳng XLSX, bổ sung riêng sau khi biết cấu trúc file; hiện hỗ trợ dán từ Excel và nhập CSV/TXT.
3. **Phát hành sau duyệt:** xem diff cùng các thay đổi nội dung của lượt trước, commit/push trên nhánh riêng và tạo PR khi người dùng yêu cầu. Không merge, deploy, đổi Cloudflare hoặc secrets nếu chưa được đồng ý.

Không có thao tác push, merge hay deploy trong đợt nâng cấp này.
