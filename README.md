# Nhóm 7 · Đặc điểm của tôn giáo ở Việt Nam

Web thuyết trình môn **Chủ nghĩa xã hội khoa học**, Chủ đề 7. `src/content/slides.ts` là nguồn nội dung chính cho slide, ghi chú thuyết trình và PowerPoint.

## Chạy dự án

Dùng Node.js 24 (phiên bản phát triển: 24.19.0) và npm.

```bash
npm ci
npm run dev
```

Để diễn tập đúng bản trình chiếu có offline:

```bash
npm run build
npm run preview
```

Mở địa chỉ được terminal in ra bằng Chrome hoặc Edge. **Không mở `dist/index.html` trực tiếp bằng `file://`**: trình duyệt cần máy chủ HTTP để tải module, video và service worker. Máy chủ chỉ phục vụ tệp tĩnh, không có backend ứng dụng.

## Trình bày trước lớp

1. Khi vào lần đầu, đóng hướng dẫn nhanh sau khi xem các phím tắt. Mở bản production một lần khi có mạng và chờ nhãn **“Đã lưu để dùng offline”**; ảnh, phông chữ và bộ nhận diện tay được lưu tại máy.
2. Nhấn **F** để toàn màn hình. Khung 1920 × 1080 tự co vừa máy chiếu 16:9 hoặc 4:3, có khoảng trống giữ đúng tỷ lệ.
3. Nhấn **P** để mở cửa sổ người trình bày. Kéo cửa sổ này về màn laptop, để cửa sổ chính trên máy chiếu. Cho phép popup khi trình duyệt yêu cầu.
4. Đồng hồ mặc định 15 phút; có nút bắt đầu, tạm dừng, đặt lại và ô thay đổi thời lượng. Ghi chú thuyết trình biên tập nằm cạnh slide hiện tại và nội dung tiếp theo.
5. Bút trình chiếu dùng `PageDown` / `PageUp` hoặc nhấp vùng trống để mở ý tiếp theo; các nút tương tác vẫn giữ thao tác riêng. Ở mini-game cần chọn đáp án rồi xác nhận. Có thể dùng thanh tiến độ hoặc tổng quan để nhảy nhanh.
6. Trước buổi học, thử máy chiếu, font chữ, tắt mạng rồi tải lại, xuất PPTX và mở thử trong PowerPoint trên chính máy sẽ sử dụng.

| Phím                 | Chức năng                                                |
| -------------------- | -------------------------------------------------------- |
| → / PageDown / Space | Mở ý tiếp theo                                           |
| ← / PageUp           | Quay lại ý trước                                         |
| Home / End           | Đầu / cuối bài                                           |
| O                    | Tổng quan 20 thumbnail                                   |
| P                    | Cửa sổ người trình bày                                   |
| F                    | Toàn màn hình                                            |
| L / S                | Laser có vệt / đèn soi                                   |
| D / C                | Bút vẽ / xóa nét của slide hiện tại                      |
| Z / B                | Kính lúp 2,5× / màn đen                                  |
| E                    | Tải PowerPoint có ghi chú                                |
| G                    | Bật/tắt bảng điều khiển cử chỉ                           |
| Escape               | Đóng hộp thoại hoặc tắt công cụ                          |
| A / B / C / D        | Chọn phương án trong mini-game                           |
| 1 / 2                | Phân loại thẻ đang được chọn                             |
| + / − / 0            | Phóng, thu, đặt lại ảnh khi đang chọn ảnh trong lightbox |
| Ctrl + / −           | Cỡ chữ ghi chú trong cửa sổ presenter                    |
| ?                    | Bảng hướng dẫn                                           |

Phím tắt không can thiệp khi nhập vào ô văn bản. Mọi thao tác có nút hoặc cách dùng bàn phím. Chế độ giảm chuyển động của hệ điều hành được tôn trọng.

## Tương tác

- **Slide 03:** video tư liệu VNA phát trực tuyến khi người xem bấm nút; poster vẫn hiển thị offline. Bảy thẻ ảnh thật kéo vào hai nhóm, hoặc chọn bằng Tab rồi nhấn 1/2. Chỉ khóa thẻ khi phân loại đúng.
- **Slide 04 và 12:** thẻ khái niệm lật bằng click, Enter hoặc Space.
- **Slide 05:** bản đồ năm đặc điểm; nhấn mỗi nút để tới phần tương ứng.
- **Slide 06:** thư viện 6 ảnh tư liệu thật. Mở ảnh để xem ghi công, lăn chuột/pinch zoom 1–4×, kéo pan, nhấp đúp đặt lại. Parallax nhẹ và Ken Burns khi nghỉ được tắt với reduced motion.
- **Slide 07 và 15:** số liệu chạy đếm, luôn có nguồn và ngày công bố.
- **Slide 17:** phân biệt luật đang có hiệu lực tại tháng 10/2026 với Luật 07/2026/QH16 sẽ có hiệu lực 01/01/2027. Trước khi trình bày sau mốc này, cần cập nhật nội dung căn cứ pháp lý.
- **Slide 19:** 7 câu A/B/C/D; chọn rồi xác nhận để xem phản hồi và giải thích. Kết thúc có tổng điểm và nút chơi lại.
- **Công cụ:** nét vẽ riêng từng slide, 3 màu; laser, đèn soi đổi bán kính bằng lăn chuột, kính lúp, màn đen.
- **PowerPoint:** 20 slide, ảnh JPEG tư liệu, ghi nguồn và ghi chú tiếng Việt; đáp án quiz chỉ xuất trong ghi chú. PPTX là bản tĩnh để dự phòng, không chứa tương tác web hay video nhúng.

## Ảnh, video và offline

Ảnh, font và mô hình được phục vụ từ `public/`. Ảnh WebP có bản cục bộ để hoạt động offline; ảnh dự phòng nội bộ được hiển thị khi một ảnh không tải được. Video không được tải về hoặc lưu offline: khi người xem chủ động chọn phát, website nhúng video của VNA qua YouTube Privacy Enhanced Mode; khi ngoại tuyến, poster ảnh thật và thông báo trạng thái thay thế.

Hình ảnh sử dụng ảnh chụp thật từ Wikimedia Commons với ghi công, giấy phép và liên kết trang gốc trong giao diện, PowerPoint và `public/media/CREDITS.md`. Poster Vesak là tư liệu Lễ Phật đản tại Sa Đéc năm 2008, không phải ảnh Đại lễ Vesak 2025.

Bản production lưu tài nguyên cục bộ bằng service worker. Video nhúng và các liên kết nguồn chỉ được truy cập khi người xem chủ động mở chúng. Offline không được bật trong `npm run dev`. Cần HTTPS khi triển khai công khai; localhost được trình duyệt cho phép để diễn tập.

## Camera và cử chỉ

Mặc định tắt. Nhấn G rồi **Bật camera** để cấp quyền. Dùng bộ **MediaPipe Hands** chính thức, phiên bản cố định; JS/WASM/model được lưu trong dự án. Bản này dùng gói Hands có mô hình đi kèm thay cho `tasks-vision` trong kế hoạch, vì máy dựng không được phép tải model riêng từ Google Storage. Nhận diện và xử lý ảnh diễn ra ngay trên máy.

Nhìn vào ảnh camera đã lật gương: vuốt sang trái để tiếp, sang phải để lùi. Có ba mức **Chắc chắn / Cân bằng / Nhạy**, tương ứng ngưỡng 21% / 15% / 10% chiều ngang khung hình trong 700 ms; khoảng nghỉ lần lượt 950 / 750 / 650 ms. Mặc định Cân bằng. Bộ nhận diện lấy tâm lòng bàn tay, làm mượt rung nhỏ và loại chuyển động dọc, đổi hướng nhiều hoặc mất khung hình. Chấm xanh và thanh tiến độ giúp căn chỉnh; giữ tay yên sau mỗi lượt. Cử chỉ tạm dừng khi mở hộp thoại, và tôn trọng bước chọn/xác nhận trong quiz.

Tắt bảng điều khiển sẽ dừng toàn bộ track camera. Trình duyệt thiếu `requestVideoFrameCallback` dùng `requestAnimationFrame` dự phòng. Nếu không cấp quyền hoặc máy không hỗ trợ WebGL/camera, tiếp tục bằng clicker hay bàn phím. Pipeline được kiểm tra với camera giả lập; cần diễn tập bàn tay thật với webcam và ánh sáng phòng học.

## Quay tên từ danh sách lớp

Trên màn trình chiếu, bấm **Gọi tên** hoặc phím **R**. Dán cột họ tên từ Excel (mỗi người một dòng), hoặc nhập tệp TXT/CSV UTF-8. CSV nhiều cột cần tiêu đề **Họ và tên** hoặc **Họ tên**. Tên trùng được giữ như các cá nhân riêng theo số thứ tự; giới hạn 500 người. Chọn **Dùng danh sách**, sau đó **Bắt đầu quay tên** (hoặc Space/Enter khi nút được chọn).

Mặc định không gọi lại người đã được chọn. Có lịch sử, nút **Vòng mới**, tùy chọn gọi lặp và bật/tắt âm thanh. Danh sách, những người đã gọi và tùy chọn được lưu trong localStorage của trình duyệt; tải TXT để sao lưu hoặc chuyển máy. Thay danh sách bắt đầu vòng mới. Đóng hộp thoại lúc đang quay sẽ hủy lượt chưa kết thúc. Quay tên và âm thanh chạy offline; không gửi danh sách lên máy chủ.

Kết quả được lấy bằng `crypto.getRandomValues` với rejection sampling; hoạt ảnh chỉ tạo nhịp chờ. Chế độ giảm chuyển động rút hoạt ảnh xuống khoảng nửa giây. Tệp chính: `src/widgets/ClassPicker.tsx`, `src/widgets/roster.ts`, `src/widgets/pickerSound.ts`, `src/styles/picker.css`.

## Kiểm thử

```bash
npm test
npm run build
npm run e2e
```

Playwright mặc định dùng `/usr/bin/chromium` trong môi trường cloud. Trên máy khác, đặt `CHROMIUM_PATH` trỏ tới Chrome/Chromium đã cài. Kiểm thử E2E dùng camera giả lập, không truy cập camera thật.

Các kiểm tra bao gồm 20 slide, nguồn, ảnh và ghi chú; điều hướng, zoom, phân loại, bảy câu quiz A/B/C/D, bố cục ở 1024×768 và 1366×768, đồng bộ presenter sau reload, video nhúng có poster offline, tệp PPTX 20 slide + 20 notes, khởi động bộ nhận diện offline, dừng camera và tải lại ứng dụng khi mất mạng.

## Bảo trì nội dung và tài nguyên

- `src/content/slides.ts`: nguồn dữ liệu chung cho web và PowerPoint.
- `src/content/sources.ts`: nguồn số liệu, sự kiện và căn cứ pháp luật đã kiểm chứng.
- `src/content/media.ts`: manifest ảnh, alt, credit và giấy phép.
- `public/media/CREDITS.md`: metadata, giấy phép, ghi công và nguồn ảnh/video.
- `npm run prepare:runtime`: sao chép lại font và MediaPipe từ các gói đã khóa phiên bản; không tải từ CDN.

## Đưa lên hosting

### GitHub Pages miễn phí

Workflow `.github/workflows/deploy-pages.yml` tự cài thư viện theo lockfile, chạy kiểm thử, dựng và xuất bản website mỗi khi có commit mới trên nhánh `main`. Website được GitHub phục vụ ngay cả khi máy của nhóm tắt; không cần chạy localhost để người khác xem.

Với tài khoản GitHub Free, repository cần để **Public**. Bật Pages một lần:

1. Mở repository trên GitHub → **Settings → Pages**.
2. Trong **Build and deployment → Source**, chọn **GitHub Actions**.
3. Vào **Actions → Deploy presentation to GitHub Pages → Run workflow**, chọn nhánh `main` rồi chạy. Nếu lượt chạy trước khi bật Pages bị lỗi, chạy lại sau khi đã chọn Source.
4. Chờ cả hai job **Build and validate** và **Publish website** có dấu tích xanh. URL website xuất hiện trong phần deployment `github-pages`.

Địa chỉ dự kiến sau khi triển khai thành công: **https://vantruonghaui2007-del.github.io/WEB-KTCT/**. Cấu hình workflow trong mã nguồn chưa chứng minh website đã được xuất bản; kiểm tra lượt chạy Actions và địa chỉ Pages sau khi bật.

Các cập nhật sau đó chỉ cần push lên `main`; không nhập token hoặc mật khẩu vào mã nguồn. GitHub Actions sử dụng quyền triển khai của repository. GitHub Pages có các hạn mức sử dụng của dịch vụ, phù hợp với website thuyết trình tĩnh này.

### Static hosting khác

`npm run build` tạo thư mục `dist/` để phục vụ trên static hosting. Vite dùng `base: './'`, hỗ trợ đường dẫn con như GitHub Pages. Các tệp ảnh, video và MediaPipe nằm trong bản dựng; hosting không cần backend hoặc cơ sở dữ liệu.
