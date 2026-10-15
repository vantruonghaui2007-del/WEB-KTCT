# Nhóm 7 · Đặc điểm của tôn giáo ở Việt Nam

Web thuyết trình môn **Chủ nghĩa xã hội khoa học**, xây dựng theo kế hoạch trong `docs/superpowers/plans/2026-10-15-web-thuyet-trinh-chu-de-7.md` và nội dung của `Noi_dung_Chu_de_7_da_bien_tap.docx`.

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

1. Mở bản production một lần khi có mạng. Chờ nhãn **“Đã lưu để dùng offline”**; bản offline khoảng 27 MB, gồm cả bộ nhận diện tay.
2. Nhấn **F** để toàn màn hình. Khung 1920 × 1080 tự co vừa máy chiếu 16:9 hoặc 4:3, có khoảng trống giữ đúng tỷ lệ.
3. Nhấn **P** để mở cửa sổ người trình bày. Kéo cửa sổ này về màn laptop, để cửa sổ chính trên máy chiếu. Cho phép popup khi trình duyệt yêu cầu.
4. Đồng hồ mặc định 15 phút; có nút bắt đầu, tạm dừng, đặt lại và ô thay đổi thời lượng. Ghi chú nguyên văn từ Word nằm cạnh slide hiện tại và nội dung tiếp theo.
5. Bút trình chiếu dùng `PageDown` / `PageUp`. Mỗi lần nhấn mở một ý; hết ý mới sang slide tiếp theo. Có thể dùng thanh tiến độ hoặc tổng quan để nhảy nhanh.
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
| 1 / 2                | Chọn A/B trong quiz; phân loại thẻ đang được chọn        |
| + / − / 0            | Phóng, thu, đặt lại ảnh khi đang chọn ảnh trong lightbox |
| Ctrl + / −           | Cỡ chữ ghi chú trong cửa sổ presenter                    |
| ?                    | Bảng hướng dẫn                                           |

Phím tắt không can thiệp khi nhập vào ô văn bản. Mọi thao tác có nút hoặc cách dùng bàn phím. Chế độ giảm chuyển động của hệ điều hành được tôn trọng.

## Tương tác

- **Slide 03:** video mở đầu 48 giây; 7 thẻ minh họa kéo vào hai nhóm, hoặc chọn bằng Tab rồi nhấn 1/2. Chỉ khóa thẻ khi phân loại đúng.
- **Slide 04 và 12:** thẻ khái niệm lật bằng click, Enter hoặc Space.
- **Slide 05:** bản đồ năm đặc điểm; nhấn mỗi nút để tới phần tương ứng.
- **Slide 06:** thư viện 6 minh họa. Mở ảnh để lăn chuột/pinch zoom 1–4×, kéo pan, nhấp đúp đặt lại. Parallax nhẹ và Ken Burns khi nghỉ được tắt với reduced motion.
- **Slide 07 và 15:** số liệu chạy đếm, luôn có nguồn và ngày công bố.
- **Slide 17:** mốc ban hành/hiệu lực luật, ngày Việt Nam (`Asia/Ho_Chi_Minh`), cảnh báo từ 01/01/2027. Nội dung gốc của Word vẫn giữ mốc biên tập; nhóm cần cập nhật căn cứ khi trình bày sau ngày này.
- **Slide 19:** 5 câu A/B; nhấn chọn chỉ đánh dấu, nhấn tiếp mới lộ đáp án và giải thích.
- **Công cụ:** nét vẽ riêng từng slide, 3 màu; laser, đèn soi đổi bán kính bằng lăn chuột, kính lúp, màn đen.
- **PowerPoint:** 20 slide, ảnh PNG tương thích, nguồn, tiếng Việt, ghi chú; đáp án quiz chỉ xuất trong ghi chú. PPTX là bản tĩnh để dự phòng, không chứa tương tác web hay video nhúng.

## Ảnh, video và offline

Tất cả ảnh, video, font và mô hình được phục vụ từ `public/`. Không dùng iframe YouTube, hotlink hay CDN khi trình chiếu. Ảnh WebP chỉ khoảng 6–20 KB mỗi ảnh; có ảnh dự phòng nội bộ nếu một tệp ảnh không tải được.

Ảnh là **minh họa kiến trúc tự tạo**, không phải ảnh chụp địa điểm hay ảnh tư liệu sự kiện Vesak. Video là **clip minh họa gốc 48 giây, không âm thanh**, H.264/yuv420p, có phụ đề tiếng Việt và poster. Credit và giấy phép CC0 1.0 được hiển thị trong giao diện; xem `public/media/CREDITS.md`. Đây là lựa chọn thay thế tư liệu chưa được nhóm cung cấp, để toàn bộ media có nguồn rõ ràng và chạy được offline.

Bản production lưu toàn bộ tài nguyên bằng service worker; chỉ truy cập một nguồn bên ngoài khi người dùng chủ động mở liên kết nguồn. Offline không được bật trong `npm run dev`. Cần HTTPS khi triển khai công khai; localhost được trình duyệt cho phép để diễn tập.

## Camera và cử chỉ

Mặc định tắt. Nhấn G rồi **Bật camera** để cấp quyền. Dùng bộ **MediaPipe Hands** chính thức, phiên bản cố định; JS/WASM/model được lưu trong dự án. Bản này dùng gói Hands có mô hình đi kèm thay cho `tasks-vision` trong kế hoạch, vì máy dựng không được phép tải model riêng từ Google Storage. Nhận diện và xử lý ảnh diễn ra ngay trên máy.

Vuốt tay sang trái của chính người trình bày để tiếp, sang phải để lùi; ngưỡng 25% khung hình trong 600 ms, nghỉ tối thiểu 1 giây. Tắt bảng điều khiển sẽ dừng toàn bộ track camera. Nếu không cấp quyền hoặc máy không hỗ trợ WebGL/camera, tiếp tục bằng clicker hay bàn phím. Pipeline đã được kiểm tra với camera giả lập; cần diễn tập nhận diện bàn tay thật ở khoảng cách phù hợp với webcam của nhóm.

## Kiểm thử

```bash
npm test
npm run build
npm run e2e
```

Playwright mặc định dùng `/usr/bin/chromium` trong môi trường cloud. Trên máy khác, đặt `CHROMIUM_PATH` trỏ tới Chrome/Chromium đã cài. Kiểm thử E2E dùng camera giả lập, không truy cập camera thật.

Các kiểm tra bao gồm nội dung đối chiếu DOCX, timezone tại giao thừa, điều hướng, zoom, phân loại, quiz, bố cục cả 20 slide ở 1024×768 và 1366×768, đồng bộ presenter sau reload, video phát/seek/kết thúc, tệp PPTX thực có 20 slide + 20 notes, khởi động bộ nhận diện offline, dừng camera và tải lại ứng dụng khi mất mạng.

## Bảo trì nội dung và tài nguyên

- `src/content/slides.ts`: nguồn dữ liệu chung cho web và PowerPoint.
- `src/content/sources.ts`: 6 nguồn trong Word.
- `src/content/media.ts`: manifest ảnh, alt, credit và giấy phép.
- `npm run content`: trích xuất lại slide từ DOCX, chuẩn hóa Unicode NFC, không gõ lại nội dung.
- `npm run prepare:runtime`: sao chép lại font và MediaPipe từ các gói đã khóa phiên bản; không tải từ CDN.
- `scripts/create-media.py`, `scripts/render-media.mjs`: tạo SVG và raster hóa minh họa. Bước raster cần Chromium và Pillow cho bước đổi WebP/PNG.
- `scripts/create-video.py`: dựng lại MP4 từ ảnh local, cần Python/Pillow, ffmpeg và font DejaVu Sans. Các tệp media đã có sẵn, không cần dựng lại khi cài bình thường.

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
