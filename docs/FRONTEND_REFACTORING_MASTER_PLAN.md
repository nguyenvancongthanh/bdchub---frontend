# BDC Frontend — Refactoring Master Plan
## Mục Tiêu: Đồng bộ hóa toàn bộ UI/UX dựa trên `DESIGN_SYSTEM_V4.md`

> **Cập nhật:** 23/06/2026
> Tài liệu này là **lộ trình tổng thể** cho quá trình refactor toàn bộ frontend BDC Hub.
> Kim chỉ nam thiết kế: [`DESIGN_SYSTEM_V4.md`](file:///home/thanh/BDCHub---Frontend/docs/DESIGN_SYSTEM_V4.md)
> Phân tích chi tiết từng trang: [`PAGE_ANALYSIS_AND_IMPROVEMENTS.md`](file:///home/thanh/BDCHub---Frontend/docs/PAGE_ANALYSIS_AND_IMPROVEMENTS.md)

---

## 1. Phân Tích Hiện Trạng (Current State Analysis)

### 1.1. Kiến Trúc Route Hiện Tại

```
src/app/
├── (landing)/          ← Landing page công khai
│   ├── page.tsx        ← Trang chủ (Hero, About, Activities, Projects)
│   ├── hackathon2025/  ← Trang hackathon (riêng biệt)
│   └── forms/survey/   ← Form khảo sát
├── (auth)/             ← Đăng nhập/Đăng ký
│   ├── login/
│   ├── register/
│   └── pending/
├── (public)/           ← Trang public không cần auth
│   └── confirm-password-change/
├── (standalone)/       ← Trang độc lập, layout riêng
│   └── hpc-summer-school/ ← (NGOÀI PHẠM VI — chỉ tham khảo)
├── (learning)/lms/     ← Hệ thống LMS
│   ├── page.tsx        ← Chọn vai trò
│   ├── student/        ← Giao diện học viên (courses, ai-mentor, discover)
│   ├── teacher/        ← Giao diện giảng viên (courses, quiz, ai-assistant)
│   ├── admin/          ← Quản trị LMS (llm-config, organizations, youtube)
│   └── forums/         ← Diễn đàn (posts, [contentId])
├── (main)/             ← Dashboard quản trị CLB
│   ├── dashboard/      ← Trang chính (stats, calendar, announcements, events)
│   ├── events/         ← Quản lý sự kiện
│   ├── users/          ← Quản lý thành viên
│   ├── bdctex/         ← Hệ thống LaTeX ([projectId], join)
│   ├── chat/           ← Chat/Tin nhắn
│   ├── labs/           ← Phòng thí nghiệm
│   ├── leaderboard/    ← Bảng xếp hạng
│   ├── tasks/          ← Quản lý task
│   ├── guide/          ← Hướng dẫn
│   ├── myaccount/      ← Thông tin cá nhân
│   └── settings/       ← Cài đặt (roles, teams-types, mail)
└── api/                ← API routes (không đổi)
```

### 1.2. Vấn Đề Chính Được Phát Hiện

#### 🔴 Vấn đề 1: Palette Không Nhất Quán
- **Landing/Auth:** Dùng Navy hex codes (`dark:bg-[#0F1E35]`, `dark:bg-[#0A1628]`) ← Đúng hướng
- **Main/Dashboard:** Dùng Slate (`dark:bg-slate-950`, `dark:bg-slate-900`, `dark:bg-slate-800`) ← **Khác palette**
- **LMS:** Layout dùng `dark:bg-slate-950` ← **Khác palette với Landing**
- **Kết quả:** Chuyển trang giữa Landing → LMS/Dashboard thấy rõ sự khác biệt màu nền

#### 🔴 Vấn đề 2: Hardcode Hex Rải Rác
- ~45+ files đang dùng `dark:bg-[#0F1E35]` hardcode trực tiếp
- ~45+ files đang dùng `dark:bg-slate-950` / `dark:bg-slate-900`
- Nếu cần đổi palette, phải sửa tất cả các file thủ công

#### 🟡 Vấn đề 3: Animation Không Thống Nhất
- `globals.css` có 25+ keyframes, nhiều được đánh dấu `[DEAD]` (unused)
- Landing page dùng hỗn hợp CSS keyframes (hero stats) + Framer Motion (sections)
- LMS và Dashboard không có animation nhất quán
- Các landing sections (About, Activities, Projects) dùng Framer Motion `whileInView` — hoạt động tốt nhưng cần chuẩn hóa variants

#### 🟡 Vấn đề 4: Component Styling Không Tái Sử Dụng
- Card styling lặp đi lặp lại ở nhiều component mà không abstract thành token
- Button styling khác nhau giữa Events page (`dark:bg-slate-800`) vs Landing page (`dark:bg-[#0F1E35]`)
- Input styling khác nhau giữa Events filter vs Auth forms

#### 🟡 Vấn đề 5: Typography Chưa Chuẩn Hóa
- Không có font heading riêng biệt (tất cả dùng system-ui/sans-serif)
- Font sizes không nhất quán (H1 ở landing vs H1 ở LMS vs H1 ở Dashboard)
- Thiếu `font-heading` class cho Outfit font

#### 🟢 Điểm Tốt Cần Giữ
- Cosmic Background System: kiến trúc Worker tuyệt vời, performance tốt
- Hero Triple-Layer CSS Animation: đã fix xong Hydration + Firefox issues
- AuthShell + Glassmorphism: nhất quán và đẹp
- Component structure: tổ chức thư mục components rõ ràng
- Framer Motion scroll animations ở landing sections: smooth, ổn định
- Dashboard components: hooks tách biệt tốt (useAuth, useEvents, etc.)

---

## 2. Lộ Trình Triển Khai (Roadmap)

### Giai Đoạn 0: Thiết Lập Nền Tảng (Foundation)
> **Ưu tiên:** 🔴 BẮT BUỘC ĐẦU TIÊN — Tất cả giai đoạn sau phụ thuộc vào đây
> **Ảnh hưởng:** Toàn bộ project

| Task | Mô tả | Files bị ảnh hưởng |
|---|---|---|
| **0.1** Cập nhật `globals.css` | Thêm CSS Variables theo DESIGN_SYSTEM_V4 Section 2 (colors, borders, text, accents) vào `:root` và `.dark` | `globals.css` |
| **0.2** Cài đặt Fonts | Import Outfit + Inter qua `next/font/google` trong `layout.tsx` | `layout.tsx`, `globals.css` |
| **0.3** Dọn dẹp Dead Animations | Xóa keyframes đánh dấu `[DEAD]` trong globals.css, giữ lại những cái đang dùng | `globals.css` |
| **0.4** Chuẩn hóa layout root | Đổi `dark:bg-slate-950` → `dark:bg-bg-root` ở tất cả layout files | 4 layout files |

**Tiêu chí hoàn thành:** CSS Variables hoạt động, fonts load, `dark:bg-slate-950` không còn tồn tại trong layout files.

---

### Giai Đoạn 1: Landing Page & Auth (Bộ Mặt Dự Án)
> **Ưu tiên:** 🔴 CAO — Ấn tượng đầu tiên
> **Phạm vi:** `(landing)/`, `(auth)/`, `(public)/`

| Task | Mô tả |
|---|---|
| **1.1** Refactor Landing layout | `(landing)/layout.tsx` — đổi text colors sang tokens |
| **1.2** Hero section | Giữ nguyên animation (đã ổn), đổi hardcode hex → CSS Variable tokens |
| **1.3** About section | Đổi `dark:bg-[#0F1E35]` → `bg-bg-card`, áp dụng card tokens |
| **1.4** Activities section | Đổi card styles → tokens, giữ Framer Motion `whileInView` |
| **1.5** Projects section | Đổi card & border styles → tokens |
| **1.6** Navbar & Footer | Đổi hardcode hex/slate → CSS Variable tokens |
| **1.7** Auth pages | Đổi form inputs → token-based, giữ Glassmorphism |
| **1.8** Pending page | Chuẩn hóa styling |
| **1.9** Confirm Password | Chuẩn hóa styling theo tokens |
| **1.10** Hackathon2025 | Review & chuẩn hóa nếu vẫn active |

**Tiêu chí hoàn thành:** Không còn hardcode hex trong Landing/Auth components. Visual không thay đổi (chỉ đổi internal tokens).

---

### Giai Đoạn 2: Hệ Thống LMS (Learning)
> **Ưu tiên:** 🔴 CAO — Core feature
> **Phạm vi:** `(learning)/lms/`

| Task | Mô tả |
|---|---|
| **2.1** LMS root layout | Đổi `bg-slate-50 dark:bg-slate-950` → `bg-bg-root` tokens |
| **2.2** Role Selection page | `lms/page.tsx` — đổi `dark:bg-slate-900` → `bg-bg-card` |
| **2.3** Student layout & pages | Chuẩn hóa sidebar, course cards, ai-mentor, discover |
| **2.4** Teacher layout & pages | Chuẩn hóa course management, quiz editor, ai-assistant |
| **2.5** Admin layout & pages | Chuẩn hóa llm-config, organizations, youtube-manage |
| **2.6** Forums | Chuẩn hóa posts, content detail |
| **2.7** LMS Components | `src/components/lms/*` — Chuẩn hóa shared, agent, student, teacher, admin, forum components |
| **2.8** Dark Mode Default | Enforce dark mode preference cho LMS section |

**Tiêu chí hoàn thành:** LMS dùng Navy palette nhất quán, dark mode mặc định, không còn slate-950.

---

### Giai Đoạn 3: Dashboard & Quản Trị (Main)
> **Ưu tiên:** 🟡 TRUNG BÌNH — Internal tools, ít user thấy
> **Phạm vi:** `(main)/`

| Task | Mô tả |
|---|---|
| **3.1** Main layout | Đổi `bg-slate-50 dark:bg-slate-950` → `bg-bg-root` tokens |
| **3.2** Sidebar component | Đổi từ slate palette → Navy tokens, solid bg (no blur) |
| **3.3** MobileNav component | Chuẩn hóa tương tự Sidebar |
| **3.4** Dashboard page | Stats, Calendar, Announcements, Events — đổi tokens |
| **3.5** Dashboard components | `src/components/dashboard/*` — Cards, Modals, SectionHeader, StatsCards, Calendar |
| **3.6** Events page | `events/page.tsx` — đổi `dark:bg-slate-900` → `bg-bg-card`, inputs → tokens |
| **3.7** Users page | Chuẩn hóa table & cards |
| **3.8** BDCTex | `bdctex/` — project list, editor, join — chuẩn hóa |
| **3.9** Chat | `chat/` — chuẩn hóa |
| **3.10** Labs, Leaderboard, Tasks | Chuẩn hóa |
| **3.11** Guide | Chuẩn hóa InstructorGuideView, StudentGuideView |
| **3.12** MyAccount & Settings | Chuẩn hóa profile, roles, teams, mail settings |

**Tiêu chí hoàn thành:** Dashboard dùng Navy palette nhất quán, cards/tables/inputs đều dùng tokens.

---

### Giai Đoạn 4: Shared Components & Polish
> **Ưu tiên:** 🟢 CUỐI CÙNG — Finishing touches
> **Phạm vi:** `src/components/ui/`, `src/components/common/`, `src/components/layout/`

| Task | Mô tả |
|---|---|
| **4.1** UI Components | Chuẩn hóa `button.tsx`, `card.tsx`, `input.tsx`, `dialog.tsx`, `select.tsx`, `badge.tsx`, etc. → tokens |
| **4.2** Common Components | `SectionHeader.tsx`, `SafeImage.tsx`, `ScrollReset.tsx` — review |
| **4.3** Layout Components | `Footer.tsx`, `CoworkerLayout.tsx` — chuẩn hóa |
| **4.4** Form Components | `src/components/form/*` — survey, question components |
| **4.5** Dead Code Cleanup | Xóa unused component files, unused CSS |
| **4.6** Responsive Audit | Test tất cả trang ở 375px, 768px, 1024px, 1440px |
| **4.7** Accessibility Audit | Kiểm tra contrast, focus visible, aria labels |

---

## 3. Chiến Lược Component Reusability

### Nguyên Tắc
1. **Kiểm tra trước khi tạo mới:** Luôn tìm component tương đương trong `src/components/ui/` trước
2. **Tokens, không styles:** Component mới phải dùng CSS Variable tokens, không hardcode
3. **Compound patterns:** Card patterns nên wrap thành reusable component nếu lặp >3 lần

### Component Mapping (Hiện tại → Target)

| Pattern hiện tại (lặp lại nhiều nơi) | Target Component |
|---|---|
| `bg-white dark:bg-[#0F1E35] border border-slate-200 dark:border-blue-500/10 rounded-2xl p-6 shadow-sm dark:shadow-none` | Dùng `bg-bg-card border-border-subtle rounded-2xl p-6 shadow-sm dark:shadow-none` |
| `bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-6 py-2.5 active:scale-95` | Dùng `bg-accent-primary hover:bg-accent-primary-hover text-white rounded-xl` |
| Input styling lặp ở Events, Auth, LMS | Chuẩn hóa `src/components/ui/input.tsx` dùng tokens |

---

## 4. Animation Audit

### Giữ Lại ✅
| Animation | Vì sao |
|---|---|
| `premium-card-entrance` | Hero stats — đã fix Hydration, hoạt động tốt |
| `float-badge-*` | Hero floating — smooth, đã tối ưu |
| `shimmer-sweep` | Card shine — subtle, đẹp |
| `fade-in-up` / `slide-up` | Scroll reveal — cơ bản, cần thiết |
| `fade-in-delayed` / `fade-in-delayed-2` | Delayed content — đang dùng |
| `scroll` | Scroll indicator — đang dùng |
| `langSlideUp`, `slideInFromRight/Left` | HPC form — ngoài phạm vi nhưng giữ |
| `gpaFadeIn`, `dropdownFadeIn`, `fadeIn` | Functional animations — đang dùng |
| Framer Motion `whileInView` ở landing sections | Scroll-reveal — hoạt động ổn định |

### Xóa / Review 🔴
| Animation | Lý do |
|---|---|
| `float` | Đánh dấu `[DEAD]` — không dùng |
| `float-delayed` | Đánh dấu `[DEAD]` — không dùng |
| `glow-pulse` | Đánh dấu `[DEAD]` — review nếu dùng ở Background |
| `cosmic-drift` | Đánh dấu `[DEAD]` — không dùng |
| `pulse-slow` | Review — có thể dead |
| `gradient-x` | Review — kiểm tra usage |

### Chuẩn Hóa Mới 🟡
- **LMS/Dashboard:** Thêm fade-in entrance cho page transitions (dùng `fade-in-up` có sẵn)
- **Hover feedback:** Đảm bảo `active:scale-95` trên tất cả clickable elements
- **Image hover:** `group-hover:scale-105 duration-500` trên image cards

---

## 5. Hướng Dẫn Dành Cho Lập Trình Viên

### Quy Tắc Vàng
1. **Không dùng mã màu cụ thể:** `text-blue-600` → `text-accent-primary`; `bg-[#0F1E35]` → `bg-bg-card`
2. **Không cần viết `dark:` ở mọi nơi:** CSS Variables tự handle cả hai mode
3. **Kiểm tra `DESIGN_SYSTEM_V4.md` trước:** Tìm token phù hợp trước khi tạo mới
4. **Responsive bắt buộc:** Test ở 375px (iPhone), 768px (iPad), 1440px (Desktop)
5. **No rewriting from scratch:** Tìm component có sẵn trong `src/components/ui/` trước khi tạo mới

### Quy Trình Thêm Feature Mới
```
1. Đọc DESIGN_SYSTEM_V4.md → tìm component pattern phù hợp
2. Dùng CSS Variable tokens cho tất cả colors/borders/text
3. Test cả Dark/Light mode
4. Test responsive (375px → 1440px)
5. Kiểm tra accessibility (contrast, focus, aria)
```

---

## 6. Verification Plan

### Automated
```bash
# Kiểm tra không còn hardcode slate-950 trong layouts
grep -r "bg-slate-950" src/app/**/layout.tsx

# Kiểm tra không còn hardcode hex trong components
grep -rn 'dark:bg-\[#0' src/components/ | wc -l

# TypeScript build check
npx tsc --noEmit

# ESLint check
npx next lint
```

### Manual
- [ ] Visual comparison: screenshot trước/sau mỗi giai đoạn
- [ ] Dark/Light mode toggle test trên mọi trang
- [ ] Responsive test: 375px, 768px, 1024px, 1440px
- [ ] Cross-browser: Chrome + Firefox
- [ ] Playwright E2E tests (ref: `storybook-playwright-debugging.md`)
