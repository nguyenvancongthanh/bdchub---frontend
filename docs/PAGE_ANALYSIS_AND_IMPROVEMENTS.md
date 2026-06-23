# BDC Frontend — Phân Tích Chi Tiết & Cải Thiện Từng Trang

> **Kim chỉ nam:** [`DESIGN_SYSTEM_V4.md`](file:///home/thanh/BDCHub---Frontend/docs/DESIGN_SYSTEM_V4.md)
> **Lộ trình tổng thể:** [`FRONTEND_REFACTORING_MASTER_PLAN.md`](file:///home/thanh/BDCHub---Frontend/docs/FRONTEND_REFACTORING_MASTER_PLAN.md)
> Tài liệu này phân tích **hiện trạng → vấn đề → đề xuất cải thiện** cho từng trang.

---

## Quy Ước Ký Hiệu

- 🔴 **Cần fix ngay** — Vấn đề nhất quán, palette lệch
- 🟡 **Nên cải thiện** — Chưa tối ưu nhưng không broken
- 🟢 **Đã tốt** — Giữ nguyên hoặc chỉ đổi token

---

# PHẦN A: LANDING & PUBLIC PAGES

## A1. Landing Page — `(landing)/page.tsx`

### Cấu trúc hiện tại
- [page.tsx](file:///home/thanh/BDCHub---Frontend/src/app/(landing)/page.tsx): Gồm `Hero`, `About`, `Activities`, `Projects`
- [layout.tsx](file:///home/thanh/BDCHub---Frontend/src/app/(landing)/layout.tsx): `Background` + `Navbar` + `Footer`

### Layout — [layout.tsx](file:///home/thanh/BDCHub---Frontend/src/app/(landing)/layout.tsx)
| Phần tử | Hiện trạng | Vấn đề | Đề xuất |
|---|---|---|---|
| Root div | `text-slate-800 dark:text-slate-200` | 🟡 Hardcode Tailwind class, không dùng token | Đổi → `text-text-body` |
| Background | `<Background />` (Worker canvas) | 🟢 Hoạt động tốt | Giữ nguyên |
| Navbar | Component riêng, import | 🟡 Cần audit nội bộ | Xem mục A1.5 |

### Hero Section — [Hero.tsx](file:///home/thanh/BDCHub---Frontend/src/components/home/Hero.tsx)
| Phần tử | Hiện trạng | Vấn đề | Đề xuất |
|---|---|---|---|
| Stats Cards | Triple-Layer CSS Animation | 🟢 Đã fix Hydration + Firefox | Giữ nguyên animation, đổi hardcode hex → tokens |
| Visual Core | Orbiting rings, glassmorphism | 🟢 Hoạt động tốt | Đổi `dark:bg-[#0F1E35]/40` → `bg-bg-card/40` |
| Title | S-Curve character reveal | 🟢 Hoạt động tốt | Thêm `font-heading` (Outfit) |
| CTAs | Auth-aware (Login/Dashboard) | 🟢 Logic tốt | Đổi button colors → tokens |
| Scroll Indicator | Mouse wheel animation | 🟢 Subtle, đẹp | Giữ nguyên |

### About Section — [About.tsx](file:///home/thanh/BDCHub---Frontend/src/components/home/About.tsx)
| Phần tử | Hiện trạng | Vấn đề | Đề xuất |
|---|---|---|---|
| Text card | `dark:bg-[#0F1E35]`, `dark:border-blue-500/10` | 🔴 Hardcode hex | Đổi → `bg-bg-card border-border-subtle` |
| Value cards | Same pattern lặp lại | 🔴 Hardcode hex x4 | Đổi → tokens |
| Hover effects | `dark:hover:shadow-[0_8px_30px_rgba(37,99,235,0.06)]` | 🟡 Hardcode shadow | Có thể giữ hoặc tạo token `hover-glow` |
| Accent text | `text-blue-600 dark:text-cyan-400` | 🟡 Hardcode accent | Đổi → `text-accent-primary dark:text-accent-secondary` |
| Animation | Framer Motion `whileInView` stagger | 🟢 Smooth | Giữ nguyên |

### Activities Section — [Activities.tsx](file:///home/thanh/BDCHub---Frontend/src/components/home/Activities.tsx)
| Phần tử | Hiện trạng | Vấn đề | Đề xuất |
|---|---|---|---|
| Activity cards | `dark:bg-[#0F1E35]`, `dark:border-blue-500/10` | 🔴 Hardcode hex | Đổi → tokens |
| Image container | `dark:bg-[#0A1628]` | 🔴 Hardcode | Đổi → `bg-bg-section` |
| Badge | `dark:bg-blue-900/30 dark:text-cyan-400 dark:border-blue-500/20` | 🟡 Hardcode accent | Đổi → tokens |
| Hover | Image scale + card lift + glow | 🟢 Đẹp, smooth | Giữ nguyên logic, đổi color tokens |
| Animation | Framer Motion `whileInView` | 🟢 Hoạt động tốt | Giữ nguyên |

### Projects Section — [Projects.tsx](file:///home/thanh/BDCHub---Frontend/src/components/home/Projects.tsx)
| Phần tử | Hiện trạng | Vấn đề | Đề xuất |
|---|---|---|---|
| Project cards | `dark:bg-[#0F1E35]`, `dark:border-blue-500/10` | 🔴 Hardcode hex | Đổi → tokens |
| Publication border | `border-blue-600 dark:border-cyan-400` | 🟡 Hardcode accent | Đổi → `border-accent-primary dark:border-accent-secondary` |
| Arrow icon | `dark:text-slate-500 dark:group-hover:text-cyan-400` | 🟡 Hardcode | Đổi → tokens |
| Layout | 2-col grid (projects + publications) | 🟢 Layout tốt | Giữ nguyên |

### Navbar — [Navbar.tsx](file:///home/thanh/BDCHub---Frontend/src/components/layout/Navbar.tsx)
| Vấn đề | Đề xuất |
|---|---|
| 🔴 Cần audit hardcode hex/slate colors | Đổi toàn bộ sang CSS Variable tokens |
| 🟡 Mobile menu styling | Chuẩn hóa theo tokens |

### Footer — [Footer.tsx](file:///home/thanh/BDCHub---Frontend/src/components/layout/Footer.tsx)
| Vấn đề | Đề xuất |
|---|---|
| 🔴 Hardcode hex colors | Đổi sang tokens |
| 🟢 Layout hợp lý | Giữ nguyên structure |

---

## A2. Hackathon 2025 — `(landing)/hackathon2025/`
| Phần tử | Hiện trạng | Đề xuất |
|---|---|---|
| Timeline | `dark:bg-[#0...]` hardcode | 🟡 Đổi → tokens (nếu vẫn active) |
| Toàn trang | Có thể là event page đã qua | Review: nếu expired, đánh dấu deprecated |

---

## A3. Survey Form — `(landing)/forms/survey/`
| Phần tử | Hiện trạng | Đề xuất |
|---|---|---|
| Form components | `SurveyParts.tsx`, `QuestionComponents.tsx` dùng `dark:bg-[#0...]` | 🔴 Đổi → tokens |
| Layout | Nằm trong landing layout | 🟢 Đã kế thừa Background + Navbar |

---

# PHẦN B: AUTH PAGES

## B1. Login — `(auth)/login/`
### [LoginForm.tsx](file:///home/thanh/BDCHub---Frontend/src/components/login/LoginForm.tsx)
| Phần tử | Hiện trạng | Vấn đề | Đề xuất |
|---|---|---|---|
| Auth card | Glassmorphism (`dark:bg-[#0F1E35]/80 backdrop-blur-xl`) | 🟡 Hardcode hex nhưng đúng concept | Đổi → `bg-bg-card/80 backdrop-blur-xl` |
| Inputs | Dùng hex colors | 🔴 Hardcode | Đổi → `bg-bg-input border-border-input` |
| Login button | `bg-blue-600` | 🟡 | Đổi → `bg-accent-primary` |
| Google button | Styling riêng | 🟡 Cần audit | Chuẩn hóa |

## B2. Register — `(auth)/register/`
### [GoogleRegisterForm.tsx](file:///home/thanh/BDCHub---Frontend/src/components/login/GoogleRegisterForm.tsx)
| Phần tử | Vấn đề | Đề xuất |
|---|---|---|
| Card & inputs | 🔴 Hardcode hex | Đổi → tokens, tương tự LoginForm |
| Steps indicator | 🟡 Cần audit | Chuẩn hóa theo tokens |

## B3. Pending — `(auth)/pending/`
| Phần tử | Vấn đề | Đề xuất |
|---|---|---|
| Status card | 🔴 `dark:bg-[#0...]` hardcode | Đổi → tokens |
| Layout | 🟢 Kế thừa AuthShell | Giữ nguyên |

## B4. Confirm Password — `(public)/confirm-password-change/`
### [ConfirmPasswordForm.tsx](file:///home/thanh/BDCHub---Frontend/src/components/login/ConfirmPasswordForm.tsx)
| Phần tử | Vấn đề | Đề xuất |
|---|---|---|
| Card | 🔴 `dark:bg-[#0...]` hardcode | Đổi → tokens |
| Invalid token card | 🔴 Hardcode | Đổi → tokens |

---

# PHẦN C: LMS PAGES

## C1. LMS Role Selection — `lms/page.tsx`
### [page.tsx](file:///home/thanh/BDCHub---Frontend/src/app/(learning)/lms/page.tsx)
| Phần tử | Hiện trạng | Vấn đề | Đề xuất |
|---|---|---|---|
| Root bg | `bg-slate-50 dark:bg-slate-950` | 🔴 Slate palette, không phải Navy | Đổi → `bg-bg-root` |
| Role cards | `dark:bg-slate-900 dark:border-slate-800` | 🔴 Slate palette | Đổi → `bg-bg-card border-border-subtle` |
| Loading spinner | `border-blue-600` | 🟢 Accent đúng | Đổi → `border-accent-primary` |
| Error card | `dark:bg-slate-900 dark:border-slate-800` | 🔴 Slate palette | Đổi → tokens |
| Select role button | `bg-blue-600 hover:bg-blue-700` | 🟡 | Đổi → tokens |
| Header icon | `dark:bg-slate-900 dark:border-slate-800` | 🔴 Slate | Đổi → tokens |

## C2. LMS Root Layout — `lms/layout.tsx`
### [layout.tsx](file:///home/thanh/BDCHub---Frontend/src/app/(learning)/lms/layout.tsx)
| Phần tử | Hiện trạng | Vấn đề | Đề xuất |
|---|---|---|---|
| Root div | `bg-slate-50 dark:bg-slate-950` | 🔴 **Critical** — Slate, không Navy | Đổi → `bg-bg-root` |
| Layout structure | Giống hệt Main layout | 🟡 Copy-paste code | Có thể extract shared layout |

## C3. Student Pages — `lms/student/`
| Page | Vấn đề chính | Đề xuất |
|---|---|---|
| `student/layout.tsx` | 🔴 `dark:bg-slate-950` | Đổi → `bg-bg-root` |
| `student/page.tsx` (40K bytes) | 🔴 File rất lớn, nhiều hardcode slate | Đổi tất cả slate → Navy tokens. Cân nhắc tách component |
| `student/courses/` | 🔴 Slate palette | Đổi → tokens |
| `student/ai-mentor/` | 🟡 Cần audit | Chuẩn hóa |
| `student/discover/` | 🟡 Cần audit | Chuẩn hóa |

## C4. Teacher Pages — `lms/teacher/`
| Page | Vấn đề chính | Đề xuất |
|---|---|---|
| `teacher/layout.tsx` | 🔴 `dark:bg-slate-950` | Đổi → `bg-bg-root` |
| `teacher/page.tsx` (16K) | 🔴 Slate palette | Đổi → tokens |
| `teacher/courses/` | 🔴 Slate palette | Đổi → tokens |
| `teacher/quiz/` | 🟡 Cần audit | Chuẩn hóa |
| `teacher/ai-assistant/` | 🟡 Cần audit | Chuẩn hóa |

## C5. Admin Pages — `lms/admin/`
| Page | Vấn đề chính | Đề xuất |
|---|---|---|
| `admin/layout.tsx` | 🔴 `dark:bg-slate-950` | Đổi → `bg-bg-root` |
| `admin/page.tsx` | 🔴 Slate palette | Đổi → tokens |
| `admin/llm-config/` | 🔴 Slate palette | Đổi → tokens |
| `admin/organizations/` | 🟡 Cần audit | Chuẩn hóa |
| `admin/youtube-manage/` | 🟡 Cần audit | Chuẩn hóa |

## C6. Forums — `lms/forums/`
| Page | Vấn đề chính | Đề xuất |
|---|---|---|
| `forums/posts/` | 🟡 Cần audit | Chuẩn hóa |
| `forums/[contentId]/` | 🔴 `dark:bg-slate-950` | Đổi → tokens |

## C7. LMS Components — `src/components/lms/`
| Component | Vấn đề | Đề xuất |
|---|---|---|
| `agent/AgentChatPanel.tsx` | 🔴 `dark:bg-slate-950` | Đổi → tokens |
| `agent/AgentConsoleSidebar.tsx` | 🔴 `dark:bg-slate-950` | Đổi → tokens |
| `agent/widgets/*.tsx` | 🔴 Slate palette | Đổi → tokens |
| `teacher/ai/*.tsx` | 🔴 Slate palette | Đổi → tokens |
| `teacher/KnowledgeGraph.tsx` | 🔴 Slate palette | Đổi → tokens |
| `student/AIDiagnosisModal.tsx` | 🔴 Slate palette | Đổi → tokens |
| `student/QuizReviewModal.tsx` | 🔴 Slate palette | Đổi → tokens |
| `admin/llm-config/*.tsx` | 🔴 Slate palette | Đổi → tokens |

---

# PHẦN D: DASHBOARD & QUẢN TRỊ (MAIN)

## D1. Main Layout — `(main)/layout.tsx`
### [layout.tsx](file:///home/thanh/BDCHub---Frontend/src/app/(main)/layout.tsx)
| Phần tử | Hiện trạng | Vấn đề | Đề xuất |
|---|---|---|---|
| Root div | `bg-slate-50 dark:bg-slate-950` | 🔴 **Critical** — Slate, không Navy | Đổi → `bg-bg-root` |
| Sidebar wrapper | Sticky, hidden on mobile | 🟢 Logic tốt | Giữ nguyên structure |
| MobileNav | Sticky top | 🟢 Logic tốt | Audit colors |

## D2. Sidebar — [Sidebar.tsx](file:///home/thanh/BDCHub---Frontend/src/components/layout/Sidebar.tsx)
| Phần tử | Hiện trạng | Vấn đề | Đề xuất |
|---|---|---|---|
| Background | Cần audit (slate hay navy?) | 🔴 Có thể slate | Đổi → `bg-bg-shell` (solid, no blur) |
| Nav items | Slate colors | 🔴 Slate | Đổi → `text-text-muted`, `hover:bg-bg-hover` |
| Active state | `bg-blue-600 text-white` | 🟢 | Đổi → `bg-accent-primary` |
| Logo | SafeImage | 🟢 | Giữ nguyên |
| Theme toggle | Inside sidebar | 🟢 Đúng vị trí theo V4 spec | Giữ nguyên |

## D3. Dashboard — `(main)/dashboard/page.tsx`
### [page.tsx](file:///home/thanh/BDCHub---Frontend/src/app/(main)/dashboard/page.tsx)
| Phần tử | Hiện trạng | Vấn đề | Đề xuất |
|---|---|---|---|
| DashboardHeader | Component riêng | 🟡 Cần audit colors | Chuẩn hóa → tokens |
| StatsCards | Component riêng | 🟡 Cần audit | Chuẩn hóa → `bg-bg-card border-border-subtle` |
| Calendar | ModernCalendar component | 🔴 `dark:bg-slate-950` trong sub-components | Đổi → tokens |
| Announcements | AnnouncementList + Modal | 🟡 Cần audit | Chuẩn hóa |
| Events | EventList + Modal | 🟡 Cần audit | Chuẩn hóa |

## D4. Events — `(main)/events/page.tsx`
### [page.tsx](file:///home/thanh/BDCHub---Frontend/src/app/(main)/events/page.tsx)
| Phần tử | Hiện trạng | Vấn đề | Đề xuất |
|---|---|---|---|
| Filter card | `dark:bg-slate-900 dark:border-slate-800` | 🔴 Slate palette | Đổi → `bg-bg-card border-border-subtle` |
| Search input | `dark:bg-slate-800 dark:border-slate-700` | 🔴 Slate palette | Đổi → `bg-bg-input border-border-input` |
| Select triggers | `dark:bg-slate-800 dark:border-slate-700` | 🔴 Slate palette | Đổi → tokens |
| Empty state card | `dark:bg-slate-900 dark:border-slate-800` | 🔴 Slate palette | Đổi → tokens |
| Header icon wrapper | `bg-blue-600` | 🟡 | Đổi → `bg-accent-primary` |
| Back button | `dark:hover:bg-slate-800` | 🔴 Slate | Đổi → `hover:bg-bg-hover` |
| Add button | `bg-blue-600 hover:bg-blue-700` | 🟡 | Đổi → tokens |

## D5. Other Main Pages

### Users — `(main)/users/`
| Vấn đề | Đề xuất |
|---|---|
| 🟡 Cần audit colors | Đổi tất cả slate → Navy tokens |
| 🟡 Table styling | Chuẩn hóa theo V4 Section 8.8 |

### BDCTex — `(main)/bdctex/`
| Vấn đề | Đề xuất |
|---|---|
| 🔴 `dark:bg-slate-950` trong join/token page | Đổi → tokens |
| 🔴 `dark:bg-slate-950` trong project layout | Đổi → tokens |
| 🟡 Editor components (TexEditor, PdfViewer) | Audit & chuẩn hóa |
| 🟡 ProjectCreateModal, FileUploadModal | Chuẩn hóa modal theo V4 spec |

### Chat — `(main)/chat/`
| Vấn đề | Đề xuất |
|---|---|
| 🔴 `dark:bg-slate-950` | Đổi → tokens |
| 🟡 Chat bubble styling | Chuẩn hóa |

### Labs — `(main)/labs/`
| Vấn đề | Đề xuất |
|---|---|
| 🔴 `dark:bg-slate-950` | Đổi → tokens |

### Leaderboard — `(main)/leaderboard/`
| Vấn đề | Đề xuất |
|---|---|
| 🔴 `dark:bg-slate-950` | Đổi → tokens |

### MyAccount — `(main)/myaccount/`
| Vấn đề | Đề xuất |
|---|---|
| 🔴 `dark:bg-slate-950` | Đổi → tokens |

### Settings — `(main)/settings/`
| Vấn đề | Đề xuất |
|---|---|
| 🔴 `dark:bg-slate-950` trong roles, teams-types, mail pages | Đổi → tokens |

### Guide — `(main)/guide/`
| Vấn đề | Đề xuất |
|---|---|
| 🔴 `dark:bg-slate-950` trong InstructorGuideView, StudentGuideView | Đổi → tokens |

---

# PHẦN E: SHARED COMPONENTS

## E1. UI Components — `src/components/ui/`

| Component | Vấn đề | Đề xuất |
|---|---|---|
| `button.tsx` | 🟡 Cần đổi colors → tokens | Chuẩn hóa theo V4 Section 8.2 |
| `card.tsx` | 🟡 Cần đổi → tokens | Chuẩn hóa theo V4 Section 8.1 |
| `input.tsx` | 🟡 Cần đổi → tokens | Chuẩn hóa theo V4 Section 8.3 |
| `dialog.tsx` | 🟡 Cần đổi → tokens | Chuẩn hóa theo V4 Section 8.7 |
| `select.tsx` | 🔴 `dark:bg-[#0...]` hardcode | Đổi → tokens |
| `badge.tsx` | 🟡 Cần audit | Chuẩn hóa theo V4 Section 8.4 |
| `dropdown-menu.tsx` | 🟡 Cần audit | Chuẩn hóa |
| `sheet.tsx` | 🟡 Cần audit | Chuẩn hóa |
| `switch.tsx` | 🟡 Cần audit | Chuẩn hóa |

## E2. Layout Components

| Component | Vấn đề | Đề xuất |
|---|---|---|
| `CoworkerLayout.tsx` | 🔴 `dark:bg-slate-950` | Đổi → tokens |
| `ThemeToggle.tsx` | 🟢 Hoạt động tốt | Có thể đổi colors → tokens |

## E3. Dashboard Components — `src/components/dashboard/`

| Component | Vấn đề | Đề xuất |
|---|---|---|
| `StatsCards.tsx` | 🟡 Cần audit | Chuẩn hóa → tokens |
| `calendar/*.tsx` | 🔴 `dark:bg-slate-950` trong CalendarDayCell, MultiDayTaskBar, CalendarLegend | Đổi → tokens |
| `modals/*.tsx` | 🟡 Cần audit | Chuẩn hóa theo V4 modal spec |

## E4. Other Components

| Component | Vấn đề | Đề xuất |
|---|---|---|
| `user/UserApp.tsx` | 🔴 `dark:bg-slate-950` | Đổi → tokens |
| `events/*.tsx` | 🔴 Hardcode hex trong EventHero, EventDetails, EventTimeline, EventRegistration | Đổi → tokens |
| `bdctex/*.tsx` | 🔴 `dark:bg-slate-950` trong TexEditor, PdfViewer, ProjectCreateModal, FileUploadModal | Đổi → tokens |
| `guide/*.tsx` | 🔴 `dark:bg-slate-950` | Đổi → tokens |

---

# PHẦN F: NGOÀI PHẠM VI (THAM KHẢO)

| Trang | Lý do ngoài phạm vi | Ghi chú |
|---|---|---|
| `(standalone)/hpc-summer-school/` | Trang form đặc biệt, layout riêng | Tham khảo glassmorphism, stepper design |
| Storybook (`*.stories.tsx`) | Tài liệu dev, không phải production | Cập nhật sau khi refactor xong |
| API routes (`src/app/api/`) | Backend logic, không có UI | Không cần refactor |

---

# Tổng Kết Thống Kê

| Loại vấn đề | Số lượng ước tính |
|---|---|
| 🔴 Files cần đổi `dark:bg-slate-950` → Navy token | ~25 files |
| 🔴 Files cần đổi `dark:bg-[#0...]` hardcode → token | ~25 files |
| 🟡 Files cần audit & chuẩn hóa colors | ~20 files |
| 🟢 Files đã tốt (giữ nguyên logic) | ~15 files |
| **Tổng files ảnh hưởng** | **~85 files** |

> **Lưu ý quan trọng:** Phần lớn thay đổi là **đổi token** (search & replace), **không phải viết lại logic**. Cấu trúc component, layout, animation logic đều giữ nguyên.
