# Tài liệu kỹ thuật: Lỗi hoạt ảnh thẻ thống kê Hero (Hero Stats Animation Issue)

Tài liệu này ghi nhận toàn bộ quá trình chẩn đoán, đề xuất chỉnh sửa kỹ thuật liên quan đến hoạt ảnh của các thẻ số liệu Glassmorphic trên màn hình máy tính (Desktop Hero Stats Cards). 

> [!WARNING]
> **TRẠNG THÁI HIỆN TẠI: CHƯA SỬA ĐƯỢC (UNRESOLVED)**
> Mặc dù đã xác định rõ các lỗi xung đột cơ chế hoạt ảnh của Framer Motion và Hydration trong Next.js, lỗi hoạt ảnh xuất hiện của các container thẻ vẫn được đánh dấu là **chưa khắc phục được** trên môi trường của người dùng.

---

## 1. Mô tả hiện tượng lỗi (Problem Description)

Khi trang chủ BDC Hub được tải trên môi trường Desktop:
- **Hiện tượng lỗi**: Các thẻ số liệu thống kê (100+ Kết nối, 4+ Năm hoạt động, 10+ Dự án NCKH, 5+ Giải thưởng) **không có bất kỳ hoạt ảnh (animation) xuất hiện nào**, mà chỉ **xuất hiện một cách đột ngột lần lượt (abruptly/suddenly one after another)** mà không đi kèm hiệu ứng chuyển động vật lý nào khác.
- **Hoạt ảnh khác hoạt động tốt**: Các hoạt ảnh khác như **text bên trong thẻ** (bộ đếm số chạy `StatCounter` và mở chữ mờ mềm `SoftBlurInText`) cũng như **hiệu ứng Hover** (rê chuột vào phóng to `scale: 1.04` và đàn hồi lò xo nâng lên `y: -4`) **vẫn hoạt động hoàn hảo**.

---

## 2. Kết quả rà soát toàn bộ hệ thống (System Audit & Diagnosis)

Chúng tôi đã tiến hành rà soát kỹ lưỡng các component liên quan và rút ra kết luận chi tiết:

### A. [Background.tsx](file:///home/thanh/BDCHub---Frontend/src/components/layout/Background.tsx) & [background.worker.ts](file:///home/thanh/BDCHub---Frontend/src/components/layout/background.worker.ts)
- **Cơ chế**: Hoạt động dưới dạng OffscreenCanvas chạy trên một Web Worker riêng biệt (background thread).
- **Kết luận xung đột**: **Không có xung đột**. Web Worker hoàn toàn độc lập và không chiếm dụng luồng xử lý giao diện chính (main thread), không làm chậm hoặc cản trở hoạt ảnh của Framer Motion.

### B. [HeroTitle.tsx](file:///home/thanh/BDCHub---Frontend/src/components/home/hero/HeroTitle.tsx) & [HeroDescription.tsx](file:///home/thanh/BDCHub---Frontend/src/components/home/hero/HeroDescription.tsx)
- **Cơ chế**: Sử dụng hoạt ảnh xuất hiện từng ký tự (S-Curve reveal) và từng dòng văn bản (mask-reveal-up) mượt mà.
- **Kết luận xung đột**: **Không có xung đột**. Hoạt động hoàn toàn bình thường và độc lập.

### C. [HeroStatsMobile.tsx](file:///home/thanh/BDCHub---Frontend/src/components/home/hero/HeroStatsMobile.tsx)
- **Cơ chế**: Bố cục lưới 2x2 tĩnh cho thiết bị di động, hoạt ảnh trượt lên đơn giản (`fade-in-up`).
- **Kết luận xung đột**: **Không có xung đột** do chỉ kích hoạt ở kích thước màn hình nhỏ (`lg:hidden`).

### D. [HeroStatsCards.tsx](file:///home/thanh/BDCHub---Frontend/src/components/home/hero/HeroStatsCards.tsx) & [globals.css](file:///home/thanh/BDCHub---Frontend/src/app/globals.css)
Đây là khu vực **gây ra lỗi trực tiếp** do các xung đột cơ chế:
1. **Lan truyền Variant (Framer Motion Context Propagation)**:
   Container cha kích hoạt `animate="visible"`. Thẻ con tự động kế thừa và bị ép chạy theo variant cha. Việc thêm `inherit={false}` là bắt buộc để ngăn chặn điều này.
2. **"Sập" nhịp Paint khi Hydration (Next.js Hydration Paint-Tick Collapse)**:
   Trình duyệt cập nhật trạng thái mounted đồng bộ quá nhanh, làm mất trạng thái ẩn ban đầu. Trì hoãn 150ms bằng `setTimeout` giúp sửa lỗi này.
3. **Lệch pha thời gian trễ chuyển vị (Transform Delay Asynchrony - Phát hiện đột phá mới)**:
   - *Phân tích*: Trong variant `cardVisible`, thuộc tính `opacity` và `filter` được cấu hình độ trễ trễ tường minh (`delay: 0.5 + index * 0.22`), trong khi các thuộc tính chuyển vị `x`, `y`, `scale`, `rotate` không được định nghĩa độ trễ phụ mà chỉ kế thừa độ trễ gốc ở lớp trên cùng.
   - *Hậu quả*: Do cơ chế biên dịch của Framer Motion, các thuộc tính chuyển vị `x`, `y`, `scale`, `rotate` chạy ngay khi component vừa mount (`delay: 0`). **Hiệu ứng bay vào từ góc đã hoàn tất trong khi thẻ vẫn đang ẩn (`opacity: 0`)**. Khi hết thời gian trễ của `opacity` (sau `0.5s` đến `1.16s`), thẻ mới đổi từ `opacity: 0` thành `1` khiến chúng **xuất hiện đột ngột lần lượt tại vị trí cuối cùng** mà hoàn toàn không đi kèm hiệu ứng chuyển động nào khác!
4. **Thuộc tính Hover đè hoạt ảnh nổi (Float Loop Overwrite)**:
   Truyền thuộc tính `transition` trực tiếp ở thẻ con làm đè lên và vô hiệu hóa hoạt ảnh bồng bềnh lặp vô tận (`repeat: Infinity`).

---

## 3. Các đề xuất chỉnh sửa kỹ thuật mới (Technical Fix Proposals)

Các bước cấu hình mã nguồn đề xuất mới nhằm giải quyết triệt để lỗi:

### Bước 1: Khóa kế thừa variant và trì hoãn nhịp Hydration
```typescript
useEffect(() => {
  const timer = setTimeout(() => setMounted(true), 150);
  return () => clearTimeout(timer);
}, []);
```

### Bước 2: Thiết lập độ trễ đồng bộ tường minh (Explicit Delay Synchronization) cho `x`, `y`, `scale`, `rotate` (Đã thử nghiệm nhưng CHƯA SỬA ĐƯỢC)
Chúng ta ép các thuộc tính chuyển động vật lý chờ đúng thời gian trễ giống hệt `opacity` để hoạt ảnh bay vào diễn ra đúng lúc thẻ hiển thị. Phương pháp này đã được viết vào mã nguồn thực tế nhưng vẫn chưa khắc phục được lỗi trên máy khách:
```typescript
cardVisible: (index: number) => ({
  opacity: 1,
  scale: 1,
  x: 0,
  y: 0,
  rotate: 0,
  filter: "blur(0px)",
  transition: {
    type: shouldReduceMotion ? "tween" : "spring",
    stiffness: 90,
    damping: 12,
    mass: 0.85,
    // Đồng bộ độ trễ tường minh cho tất cả các trục chuyển vị vật lý
    x: { type: "spring", stiffness: 90, damping: 12, mass: 0.85, delay: 0.5 + index * 0.22 },
    y: { type: "spring", stiffness: 90, damping: 12, mass: 0.85, delay: 0.5 + index * 0.22 },
    scale: { type: "spring", stiffness: 90, damping: 12, mass: 0.85, delay: 0.5 + index * 0.22 },
    rotate: { type: "spring", stiffness: 90, damping: 12, mass: 0.85, delay: 0.5 + index * 0.22 },
    opacity: { duration: 0.5, ease: "easeOut", delay: 0.5 + index * 0.22 },
    filter: { duration: 0.7, ease: "easeOut", delay: 0.5 + index * 0.22 },
  },
})
```

### Bước 3: Đưa cấu hình chuyển cảnh Hover vào trong thuộc tính `whileHover`
Cô lập hiệu ứng Hover lò xo đàn hồi trong `whileHover` để tránh ghi đè vòng lặp nổi bồng bềnh vô hạn.

---

## 4. Tổng kết trạng thái ghi nhận mới

| Thành phần | Lỗi chẩn đoán mới | Kết quả thử nghiệm mới | Trạng thái ghi nhận |
| :--- | :--- | :--- | :--- |
| **Bay vào và Xoay (`x`, `y`, `rotate`)** | Chạy trước khi thẻ hiện (Lệch pha delay với opacity) | Cấu hình trễ tường minh riêng cho `x, y, scale, rotate` | 🔴 **Chưa sửa được** |
| **Nhịp Hydration** | Mất nhịp vẽ ban đầu của trình duyệt | Trì hoãn 150ms bằng `setTimeout` | 🔴 **Chưa sửa được** |
| **Hoạt ảnh nổi (`float`)** | Bị đè bởi transition của thuộc tính hover | Tách cấu hình chuyển cảnh vào `whileHover` | 🔴 **Chưa sửa được** |
| **Text bên trong** | Không bị ảnh hưởng | Hoạt động bình thường | 🟢 Đã chạy tốt |
| **Hiệu ứng Hover** | Không bị ảnh hưởng | Hoạt động đàn hồi mượt mà | 🟢 Đã chạy tốt |
