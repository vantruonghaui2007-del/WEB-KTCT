# Kết quả kiểm tra — 15/10/2026

- `npm ci --cache /workspace/.npm-cache`, `npm run prepare:runtime`: thành công, giữ khóa phiên bản và xác minh integrity mặc định của npm.
- `npm run build`: TypeScript và Vite thành công. PWA precache 73 tài nguyên, khoảng 27 MB.
- `npm test`: **44/44 kiểm thử đạt**, 5 tệp. Nội dung/ghi chú đối chiếu trực tiếp XML của DOCX; điều hướng, zoom, quiz, phân loại, ngày luật, đồng bộ và cấu trúc PPTX được kiểm tra.
- `npm run e2e`: **11/11 kiểm thử đạt** trên Chromium. Cả 20 màn hình kiểm tra ở 1024×768 và 1366×768, không có thanh cuộn, ảnh hỏng hay nội dung đè lên chân slide.
- Video MP4 H.264 dài 48 giây: phát, tua tới cuối, kết thúc; không có MediaError. Video vẫn phát khi context mất mạng.
- Presenter: mở giữa bài, nhận trạng thái hiện tại, điều hướng hai chiều và tải lại giữa chừng.
- PowerPoint thực: 20 slide, 20 trang notes, ảnh PNG, tiếng Việt và nguồn; đáp án quiz chỉ ở notes. Có bản xuất trong `/workspace/artifacts/Nhom7_Chu_de_7_Ton_giao_VN.pptx`.
- Offline: tải lại, font, ảnh, video và xuất PowerPoint; không có request tới máy chủ bên ngoài.
- MediaPipe: tải JS/WASM/model từ cache offline, xử lý camera giả lập và giải phóng track khi đóng; từ chối camera có thông báo và vẫn điều hướng bằng bàn phím.
- Hosting đường dẫn con `/WEB-KTCT/`: tải và giải mã ảnh, đăng ký service worker, xuất PPTX; không có lỗi JS hoặc HTTP 4xx/5xx.
- ZIP bản web tĩnh đã kiểm tra CRC đầy đủ, nằm tại `/workspace/artifacts/WEB-KTCT-web.zip`.

## Cần diễn tập trên thiết bị thực

Kiểm thử tự động không thay thế việc thử webcam với bàn tay thật, độ rõ của máy chiếu và mở PPTX trong PowerPoint trên máy sử dụng. Môi trường cloud không có máy chiếu hoặc PowerPoint desktop. Hình và video là minh họa gốc có ghi rõ credit; không phải ảnh/clip tư liệu sự kiện. Video không âm thanh.

## Cấu hình và xuất bản

Đã lưu nháp `install_script` và `start_skill` cho môi trường cloud. Snapshot dùng lại chỉ được tạo khi người dùng xem lại, lưu và Publish môi trường. Việc đưa mã nguồn lên GitHub và xuất bản website công khai là hai thao tác riêng biệt.
