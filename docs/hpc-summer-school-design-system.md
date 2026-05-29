# HPC Summer School 2026 — UI/UX Design System & Aesthetic Analysis

Tài liệu này phân tích chi tiết phong cách thiết kế giao diện (UI/UX) của trang đăng ký **HPC Summer School 2026**, làm rõ các quyết định thẩm mỹ, hệ thống token màu sắc, typography, bo góc, bóng đổ và các tương tác vi mô (micro-interactions) để mang lại trải nghiệm chuẩn Premium đúng tinh thần **BDC Design Rhythm**.

---

## 1. Bản Sắc Thiết Kế (Design Identity)

Trang đăng ký hướng tới đối tượng sinh viên kỹ thuật xuất sắc, nhà nghiên cứu và giảng viên trong lĩnh vực Tính toán Hiệu năng cao (HPC). Vì vậy, ngôn ngữ thiết kế được lựa chọn là **Tech-Modernist & High-Trust**:
* **Tech-Modernist**: Hiện đại, đậm chất công nghệ thông qua các dải màu gradient từ lục sang lam (Cyan-to-Blue), các đường nét sắc sảo, tối giản và hệ thống chế độ tối (Dark Mode) chiều sâu.
* **High-Trust**: Tạo sự tin cậy tuyệt đối bằng cách sử dụng hệ màu trung tính dịu nhẹ (Slate), khoảng trắng rộng rãi (generous whitespace), cấu trúc form nhiều bước (Step-by-step) mạch lạc và các thông tin cam kết bảo mật rõ ràng.

---

## 2. Hệ Thống Màu Sắc (Color Palette)

Sự phối hợp màu sắc được may đo chuẩn xác giữa các sắc độ HSL để tối ưu hóa độ tương phản (WCAG AA Compliance) trên cả hai chế độ Light/Dark.

### A. Màu Chủ Đạo & Thương Hiệu (Brand Colors)
* **Cyan (Lục lam)**: Đại diện cho tính toán hiện đại, tốc độ, và sự đột phá.
  * *Light Mode*: `cyan-600` (`#0891b2`) làm điểm nhấn chính, `cyan-50` làm nền bổ trợ.
  * *Dark Mode*: `cyan-400` (`#22d3ee`) phát sáng nhẹ nhàng trên nền tối, `cyan-500/10` cho các bề mặt kính (glass surfaces).
* **Blue (Xanh dương)**: Tượng trưng cho chiều sâu học thuật và uy tín công nghệ cao.
  * Sử dụng dải chuyển màu gradient: `from-cyan-500 to-blue-600` tạo hiệu ứng chuyển dịch năng động và thu hút thị giác ngay từ nút bấm điều hướng.

### B. Màu Trung Tính (Neutrals)
* Sử dụng họ màu **Slate** (Xám đá) thay vì màu xám thuần, giúp giao diện mang hơi hướng lạnh mát mẻ, đậm chất công nghệ:
  * *Bề mặt lớn (Background)*: `slate-50` (sáng dịu mắt) | `slate-950`/`slate-900` (chiều sâu vô cực).
  * *Bề mặt thẻ (Card Surface)*: `white` | `slate-900/70` (kết hợp border bán trong suốt).
  * *Bên trong Input*: `slate-50` | `slate-880/60` (bán trong suốt).
  * *Văn bản chính*: `slate-900` | `slate-100`.
  * *Văn bản phụ (Hint/Sub)*: `slate-500` | `slate-400`.

### C. Trạng Thái Đặc Biệt (Semantic Colors)
* **Error**: Đỏ nhạt (`red-50` / `border-red-400`) đến Đỏ tối (`dark:bg-red-950/20` / `dark:border-red-500/70`) thể hiện sự tinh tế, không gây hoảng hốt cho người dùng.
* **Warning (Đã nộp đơn)**: Amber/Orange (`from-amber-400 to-orange-500`) tạo cảm giác ấm áp, nhắc nhở thận trọng thay vì ngăn cấm tiêu cực.

---

## 3. Hệ Thống Typography

Sử dụng hệ font chữ không chân (sans-serif) hiện đại của hệ thống đảm bảo khả năng đọc cực tốt ở mọi kích thước màn hình.

* **Tiêu đề chính (`h1`, `h2`)**: 
  * Sử dụng độ dày lớn nhất: `font-black` (Heavyweight / Extrabold) tạo điểm nhấn mạnh mẽ.
  * Kích thước lớn: `text-3xl` hoặc `text-xl` tùy ngữ cảnh.
  * Kết hợp hiệu ứng chữ trong suốt đổ màu nền gradient: `text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-blue-500`.
* **Nhãn Form (`label`)**:
  * Định dạng: `text-sm font-semibold` giúp tiêu điểm câu hỏi rõ ràng.
  * Ký tự bắt buộc (*): `text-cyan-600 dark:text-cyan-400 ml-1` nổi bật vừa đủ.
* **Gợi ý & Chú thích (`hint`)**:
  * Định dạng: `text-xs text-slate-500 dark:text-slate-400 leading-relaxed` để người dùng dễ dàng quét nhanh mà không bị rối mắt.

---

## 4. Bề Mặt, Bo Góc & Bóng Đổ (Surfaces, Rounded & Shadows)

Trang web theo đuổi phong cách thiết kế **Semi-Soft Premium**:
* **Bo góc (Border Radius)**:
  * Đầu vào (Input), nút bấm phụ, thẻ phụ: `rounded-xl` (12px) đem lại cảm giác mềm mại, hiện đại và thân thiện.
  * Thẻ chính (Main Wrapper Card): `rounded-2xl` (16px) phân tách rõ ràng cấu trúc biểu mẫu với nền trang.
* **Đường viền (Borders)**:
  * Rất mảnh và nhạt: `border-slate-200` | `dark:border-slate-800` để phân định không gian thay vì dùng các mảng màu đặc bí bách.
* **Bóng đổ (Shadows)**:
  * Sử dụng bóng đổ nhẹ có màu (Colored Glow Shadows): `shadow-sm shadow-cyan-900/20 dark:shadow-cyan-900/30` dưới các nút bấm chính tạo độ nổi khối 3D nhẹ, sang trọng.

---

## 5. Trải Nghiệm Tương Tác Vi Mô (Micro-interactions & Animations)

Đây là yếu tố then chốt làm giao diện "sống động" và mang lại cảm giác cực kỳ Premium:

* **Tương tác nút (Button States)**:
  * Khi nhấn giữ: `active:scale-95` tạo phản hồi vật lý đàn hồi (haptic feedback) chân thực.
  * Rê chuột qua (Hover): Chuyển màu gradient mượt mà nhờ lớp chuyển tiếp `transition-all duration-200`.
* **Tải file (CV Drag & Drop)**:
  * Trạng thái kéo thả tệp tin được phản hồi trực quan bằng việc đổi màu viền đứt nét (`border-dashed border-cyan-400 bg-cyan-50`) đi kèm icon SVG động, kích thích hành vi kéo thả của người dùng.
* **Thanh Tiến Trình (Progress Tracker)**:
  * Đoạn chuyển cảnh bước (Step Transition): Thanh phần trăm tiến trình dịch chuyển mượt mà bằng `transition-all duration-500`.
  * Các node số bước chuyển từ màu xám sang viền sáng lục lam `border-cyan-500 text-cyan-600 bg-cyan-50`, và sang trạng thái tích xanh hoàn tất (`bg-cyan-500 text-white`), tạo cảm giác thỏa mãn khi hoàn thành từng chặng.
* **Trạng Thái Chờ (Loading/Uploading Spinner)**:
  * Vòng quay vô tận siêu mảnh: `animate-spin border-4 border-t-cyan-500` tạo cảm giác hệ thống đang hoạt động nhanh chóng và trơn tru.
* **Hiệu ứng Ping (Success Badge)**:
  * Hào quang phát sáng nhấp nháy `animate-ping` phía sau icon Checkmark thành công giúp chúc mừng người nộp đơn một cách hoành tráng và tinh tế.

---

## 6. Khả Năng Thích Ứng (Responsive Design)

Biểu mẫu được thiết kế ưu tiên thiết bị di động (Mobile-First):
* Trên màn hình nhỏ: Các cột form tự động chuyển sang chế độ 1 cột (`grid-cols-1`), ẩn các logo đơn vị tổ chức không cần thiết ở header để tránh chiếm không gian đọc, nút bấm kéo dài dễ thao tác bằng ngón tay cái.
* Trên màn hình lớn: Tự động phân chia layout dạng lưới thông minh (`sm:grid-cols-2` hoặc `sm:grid-cols-3` cho các trường ngắn như Năm học, GPA), mang lại sự cân bằng hoàn hảo về thị giác.
