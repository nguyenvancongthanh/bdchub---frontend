# BDC — Design System v4.0 (Single Source of Truth)
## Enterprise AI · Academic Intelligence · Precision-First

> **Phiên bản:** 4.0 · **Cập nhật:** 23/06/2026
> Đây là tài liệu **Kim Chỉ Nam (Single Source of Truth)** cho toàn bộ hệ thống giao diện BDC Hub.
> Mọi component, trang, và tính năng mới **bắt buộc** phải tuân thủ các quy tắc trong file này.
> Mở rộng từ Design Rhythm v3.0, tập trung vào **Khả năng mở rộng (Scalability)** và **Tính nhất quán (Consistency)** thông qua CSS Variables.

---

## 1. Triết Lý Thiết Kế (Design Philosophy)

```
Minimal Structure.  Massive Clarity.
AI-Native Identity. Enterprise Precision.
```

### Ba Trụ Cột

| Trụ cột | Ý nghĩa | Biểu hiện trong UI |
|---|---|---|
| **Academic & Minimal** | Giao diện học thuật, tinh giản | Tránh màu loè loẹt, gradient dày đặc |
| **Data-First** | Nội dung là nhân vật chính | Typography rõ ràng, spacing rộng |
| **AI-Native** | Mang ngôn ngữ hình ảnh AI | Pipeline cards, step indicators, glow subtle |

### Cảm Giác Mục Tiêu

Giao diện phải **cảm giác như** sản phẩm của một công ty công nghệ lớn — không phải đồ án sinh viên.

✅ Futuristic · Intelligent · Premium · Scalable · Enterprise-ready
❌ Startup chaos · Infographic clutter · Cartoon UI · Cyberpunk overload

### Nguyên Tắc Quản Lý Tập Trung

- **Single Source of Truth:** Toàn bộ màu sắc được định nghĩa bằng **CSS Variables** trong `globals.css` và map vào Tailwind. Không sử dụng hardcode hex code trong các file `.tsx`.
- **Dễ dàng chuyển đổi (Themeable):** Khi BDC muốn đổi màu nhận diện (ví dụ từ Blue sang Teal hoặc Purple), chỉ cần thay đổi CSS Variables tại **một nơi duy nhất**.
- **Scalable:** Mọi component mới phải tái sử dụng design tokens có sẵn, không được tạo thêm token ngoài hệ thống.

---

## 2. Hệ Thống Màu Sắc (Color System)

### Kiến Trúc: CSS Variables → Tailwind

Toàn bộ màu sắc được định nghĩa trong `:root` / `.dark` trong `globals.css`, sau đó Tailwind v4 tự nhận qua `@theme`.
Khi cần đổi palette, chỉ cần sửa giá trị hex **tại đây**, toàn bộ giao diện tự động cập nhật.

### 2.1. Dark Mode — Navy Blue Palette (Default)

Đây là giao diện chủ đạo của BDC Hub. Nền sử dụng hệ màu Navy xuyên suốt.

```css
@theme {
  /* ── Backgrounds (tối → sáng, layered) ── */
  --color-bg-root: #050B18;           /* html, body */
  --color-bg-shell: #070E1C;          /* Sidebar, top-nav shell */
  --color-bg-section: #0A1628;        /* Page content area */
  --color-bg-card: #0F1E35;           /* Primary cards, modals */
  --color-bg-card-hover: #132240;     /* Hover state, nested cards */
  --color-bg-input: #0D192E;          /* Inputs, selects */
  --color-bg-hover: #162644;          /* Hover trên card/row */

  /* ── Borders ── */
  --color-border-subtle: rgba(59, 130, 246, 0.10);   /* Card border default */
  --color-border-hover: rgba(59, 130, 246, 0.25);    /* Card border hover */
  --color-border-section: rgba(148, 163, 184, 0.08); /* Section divider */
  --color-border-input: rgba(59, 130, 246, 0.20);    /* Input border */
  --color-border-focus: rgba(6, 182, 212, 0.50);     /* Input focus border (cyan) */

  /* ── Text ── */
  --color-text-heading: #FFFFFF;
  --color-text-subheading: #F1F5F9;   /* slate-100 */
  --color-text-body: #CBD5E1;         /* slate-300 */
  --color-text-muted: #94A3B8;        /* slate-400 */
  --color-text-disabled: #64748B;     /* slate-500 */

  /* ── Accents ── */
  --color-accent-primary: #2563EB;    /* blue-600 — CTA buttons */
  --color-accent-primary-hover: #1D4ED8; /* blue-700 */
  --color-accent-secondary: #22D3EE;  /* cyan-400 — AI labels, badges */
  --color-accent-tertiary: #A78BFA;   /* violet-400 — Tags, secondary highlights */
  --color-accent-glow: rgba(37, 99, 235, 0.06); /* Subtle card glow */

  /* ── Gradient ── */
  --color-gradient-from: #60A5FA;     /* blue-400 — Hero gradient text */
  --color-gradient-to: #22D3EE;       /* cyan-400 */
}
```

> **Quy tắc:** Không dùng `bg-slate-900` / `bg-slate-950` cho dark mode. Xuyên suốt toàn bộ ứng dụng (Landing, LMS, Dashboard) đều dùng Navy blue palette trên để đảm bảo brand identity nhất quán.

### 2.2. Light Mode — Premium Enterprise

Light mode phải cảm giác **premium enterprise** — không flat, không generic SaaS.

```css
@theme {
  /* ── Backgrounds ── */
  --color-bg-root: #F8FAFC;           /* slate-50 */
  --color-bg-shell: #FFFFFF;
  --color-bg-section: #F1F5F9;        /* slate-100 */
  --color-bg-card: #FFFFFF;
  --color-bg-card-hover: #F8FAFC;
  --color-bg-input: #F8FAFC;
  --color-bg-hover: #F1F5F9;

  /* ── Borders ── */
  --color-border-subtle: #E2E8F0;     /* slate-200 */
  --color-border-hover: #CBD5E1;      /* slate-300 */
  --color-border-section: #E2E8F0;
  --color-border-input: #CBD5E1;
  --color-border-focus: #3B82F6;      /* blue-500 */

  /* ── Text ── */
  --color-text-heading: #0F172A;      /* slate-900 */
  --color-text-subheading: #1E293B;   /* slate-800 */
  --color-text-body: #475569;         /* slate-600 */
  --color-text-muted: #64748B;        /* slate-500 */
  --color-text-disabled: #94A3B8;     /* slate-400 */
}
```

### 2.3. Semantic Colors (Shared — Danger / Success / Warning / Info)

| Semantic | Light Mode | Dark Mode |
|---|---|---|
| **Danger** | `text-red-500` · `bg-red-50` · `border-red-200` | `text-red-400` · `bg-red-950/40` · `border-red-800/30` |
| **Success** | `text-green-600` · `bg-green-50` · `border-green-200` | `text-green-400` · `bg-green-950/40` · `border-green-800/30` |
| **Warning** | `text-amber-600` · `bg-amber-50` · `border-amber-200` | `text-amber-400` · `bg-amber-950/40` · `border-amber-800/30` |
| **Info** | `text-blue-600` · `bg-blue-50` · `border-blue-200` | `text-cyan-400` · `bg-blue-950/40` · `border-blue-800/30` |

---

## 3. Typography System

### 3.1. Font Stack

```css
/* Heading: Outfit — Geometric, modern, tech-forward */
/* Body: Inter — Clean, highly readable, wide language support */
font-family-heading: 'Outfit', 'Inter', system-ui, sans-serif;
font-family-body: 'Inter', 'Geist', system-ui, sans-serif;
```

> **Cài đặt:** Import từ Google Fonts trong `layout.tsx` qua `next/font/google`.

### 3.2. Type Scale

| Role | Classes | Notes |
|---|---|---|
| **Hero / H1** | `font-heading text-3xl md:text-4xl lg:text-5xl font-extrabold leading-tight` | Gradient text trong dark mode |
| **Section title / H2** | `font-heading text-2xl md:text-3xl font-bold leading-snug` | |
| **Card title / H3** | `font-heading text-lg font-bold` | |
| **Sub-heading** | `text-base font-semibold` | |
| **Body** | `text-base leading-relaxed` | Inter body font |
| **Caption / Meta** | `text-sm text-text-muted` | |
| **Badge / Tag** | `text-xs font-semibold uppercase tracking-wider` | |
| **Step number** | `text-lg font-bold text-accent-secondary` | Pipeline AI elements |
| **Pipeline label** | `text-xs font-bold uppercase tracking-widest text-accent-secondary` | |

### 3.3. Gradient Text (Dark Mode)

```tsx
<h1 className="font-heading text-4xl font-extrabold
  bg-gradient-to-r from-gradient-from to-gradient-to
  bg-clip-text text-transparent">
  AI Quiz Generator
</h1>
```

---

## 4. Spacing System

Dựa trên **8px base unit** (tương thích Signal-Ledger). Mọi spacing phải là bội số của 4px hoặc 8px.

### 4.1. Spacing Scale

| Token | Value | Tailwind | Dùng cho |
|---|---|---|---|
| `xs` | 4px | `p-1` / `gap-1` | Icon gaps |
| `sm` | 8px | `p-2` / `gap-2` | Between related items |
| `md` | 12px | `p-3` / `gap-3` | Button padding, badge gaps |
| `lg` | 16px | `p-4` / `gap-4` | Card internal padding (compact) |
| `xl` | 24px | `p-6` / `gap-6` | Card internal padding (standard), between cards |
| `2xl` | 32px | `p-8` / `gap-8` | Section title → content |
| `3xl` | 48px | `py-12` | Section padding top/bottom |
| `4xl` | 64px | `py-16` | Major section spacing |
| `5xl` | 96px | `py-24` | Hero, landing sections |

### 4.2. Layout Wrappers

```tsx
{/* Standard page content */}
<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

{/* Section spacing */}
<section className="space-y-8">

{/* Grid — feature cards */}
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

{/* Grid — pipeline cards */}
<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
```

### 4.3. Transition Durations

| Usage | Duration | Tailwind |
|---|---|---|
| Interactions (hover, focus) | 200ms | `duration-200` |
| Reveals (fade-in, slide) | 300ms | `duration-300` |
| Image zoom (hover) | 500ms | `duration-500` |
| Entrance animations | 700ms | Via CSS keyframes |
| Continuous loops (float) | 4-5s | Via CSS keyframes |

---

## 5. Motion & Animation System

### 5.1. Triết Lý Motion — Expressive nhưng Có Kiểm Soát

- **Landing Page:** Expressive — Cosmic background, floating badges, entrance springs, scroll-reveal
- **LMS & Dashboard:** Controlled — Fade-in nhẹ nhàng, hover subtle, không distract khỏi nội dung
- **Tất cả:** CSS keyframes ưu tiên trên Framer Motion cho hiệu năng. Framer Motion chỉ dùng cho scroll-triggered animations (`whileInView`).

### 5.2. Easing Curves

| Curve | Value | Dùng cho |
|---|---|---|
| **Out Expo** (Primary) | `cubic-bezier(0.16, 1, 0.3, 1)` | Entrance, fade-in, slide. Đường cong chính. |
| **Spring Bounce** | `cubic-bezier(0.34, 1.56, 0.64, 1)` | Card entrance (landing page only) |
| **Ease-in-out** | `ease-in-out` | Continuous loops (float, pulse) |
| **Ease-out** | `ease-out` | Subtle transitions |

### 5.3. CSS Variables cho Motion

```css
:root {
  --duration-fast: 150ms;
  --duration-normal: 300ms;
  --duration-slow: 500ms;
  --duration-stagger: 100ms;
  --ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1);
}
```

### 5.4. Danh Mục Animation

| Animation | Dùng ở đâu | Loại |
|---|---|---|
| `premium-card-entrance` | Hero stats badges (landing) | One-shot, staggered |
| `float-badge-*` | Hero stats badges (landing) | Infinite loop |
| `shimmer-sweep` | Card shine effect (landing) | One-shot |
| `fade-in-up` / `slide-up` | Scroll reveal (tất cả trang) | One-shot |
| `fade-in-delayed` | Delayed content reveal | One-shot |
| `pulse-slow` | Decorative elements | Infinite loop |

### 5.5. Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
  *, ::before, ::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## 6. Elevation & Depth

### 6.1. Shadow System

| Context | Light Mode | Dark Mode |
|---|---|---|
| Card resting | `shadow-sm` | `shadow-none` |
| Card hover | `shadow-lg shadow-blue-500/5` | `shadow-[0_8px_30px_rgba(37,99,235,0.06)]` |
| AI Feature Card | — | `shadow-[0_0_30px_rgba(37,99,235,0.06)]` |
| Modal | `shadow-xl` | `shadow-[0_25px_60px_rgba(0,0,0,0.5)]` |

### 6.2. Glassmorphism (Hạn Chế — Chỉ Auth & Special Pages)

```tsx
{/* Glassmorphic Card — CHỈ dùng cho Auth, không dùng ở layout shell */}
<div className="
  bg-white/90 dark:bg-bg-card/80
  backdrop-blur-xl
  border border-border-subtle
  shadow-lg dark:shadow-[0_8px_40px_rgba(37,99,235,0.08)]
  rounded-2xl p-8
">
```

> **Quy tắc:** `backdrop-blur` **CHỈ** dùng cho Auth Cards, Modal Overlays, và special pages (HPC Summer School). **KHÔNG** dùng cho Sidebar, Navbar, hay layout shell — dùng solid `bg-bg-shell` thay thế.

---

## 7. Corner Radius — Thống Nhất

| Element | Radius | Tailwind |
|---|---|---|
| Cards, Modals | 16px | `rounded-2xl` |
| Buttons, Inputs, Badges | 12px | `rounded-xl` |
| Avatar, Status dot | 50% | `rounded-full` |
| Image containers | 16px | `rounded-2xl` |
| Table containers | 16px | `rounded-2xl` |

> **Quy tắc:** Không dùng `rounded-md`, `rounded-lg`, hay `rounded-3xl` cho components chính. Giữ nhất quán `2xl` + `xl`.

---

## 8. Component Library

Tất cả components phải sử dụng CSS Variable tokens. Dưới đây là specs chuẩn.

### 8.1. Cards

#### Standard Card
```tsx
<div className="
  bg-bg-card hover:bg-bg-card-hover
  border border-border-subtle hover:border-border-hover
  rounded-2xl p-6
  shadow-sm dark:shadow-none
  hover:shadow-lg hover:shadow-blue-500/5
  dark:hover:shadow-[0_8px_30px_rgba(37,99,235,0.06)]
  transition-all duration-300
">
```

#### AI Feature Card (Dark Mode emphasis)
```tsx
<div className="
  bg-bg-card
  border border-blue-500/15
  rounded-2xl p-6
  shadow-[0_0_30px_rgba(37,99,235,0.06)]
  hover:border-blue-500/30
  hover:shadow-[0_0_40px_rgba(37,99,235,0.10)]
  transition-all duration-300
">
```

#### Pipeline Step Card (Numbered)
```tsx
<div className="
  bg-bg-card border border-border-subtle
  rounded-xl p-5 relative
  hover:border-border-hover
  transition-all duration-200
">
  {/* Step number badge */}
  <div className="
    w-8 h-8 rounded-full
    border border-border-hover
    bg-bg-section
    flex items-center justify-center
    text-sm font-bold text-accent-secondary
    mb-4
  ">1</div>
  <h4 className="text-sm font-bold uppercase tracking-widest text-text-subheading mb-1">
    Input Materials
  </h4>
  <p className="text-sm text-text-muted">Upload documents, slides, or videos.</p>
</div>
```

### 8.2. Buttons

```tsx
{/* Primary */}
<button className="
  bg-accent-primary hover:bg-accent-primary-hover
  text-white font-semibold
  rounded-xl px-6 py-2.5
  shadow-sm dark:shadow-blue-900/30
  active:scale-95 transition-all duration-200
">

{/* Secondary */}
<button className="
  bg-bg-card
  border border-border-input
  text-text-body
  hover:bg-bg-hover
  hover:border-border-hover
  rounded-xl px-6 py-2.5 font-medium
  active:scale-95 transition-all duration-200
">

{/* Ghost */}
<button className="
  text-text-muted
  hover:text-text-heading
  hover:bg-bg-hover
  rounded-xl px-4 py-2 font-medium
  active:scale-95 transition-all duration-200
">

{/* Danger */}
<button className="
  bg-red-50 dark:bg-red-950/30
  text-red-600 dark:text-red-400
  border border-red-200 dark:border-red-800/30
  hover:bg-red-100 dark:hover:bg-red-950/50
  rounded-xl px-4 py-2 font-medium
  active:scale-95 transition-all duration-200
">
```

### 8.3. Inputs & Forms

```tsx
<input className="
  w-full rounded-xl px-4 py-3
  bg-bg-input border border-border-input
  text-text-heading placeholder:text-text-disabled
  focus:bg-bg-card focus:outline-none
  focus:ring-2 focus:ring-border-focus/20
  focus:border-border-focus
  transition-all duration-200
" />
```

### 8.4. Badges & Tags

```tsx
{/* AI / Feature badge */}
<span className="
  inline-flex items-center gap-1.5
  px-2.5 py-1 rounded-full
  text-xs font-semibold uppercase tracking-wider
  bg-blue-50 dark:bg-blue-900/30
  text-accent-primary dark:text-accent-secondary
  border border-blue-200 dark:border-blue-500/20
">

{/* Pipeline label */}
<span className="
  text-xs font-bold uppercase tracking-widest
  text-accent-secondary
">
  Quiz Generation Pipeline
</span>

{/* Status tag — Success */}
<span className="
  px-2 py-0.5 rounded-md text-xs font-medium
  bg-green-50 dark:bg-green-900/30
  text-green-600 dark:text-green-400
  border border-green-200 dark:border-green-800/30
">
  Active
</span>
```

### 8.5. Section Headers (Pipeline-style)

```tsx
<div className="flex items-center gap-4 mb-8">
  <div className="flex-1 h-px bg-gradient-to-r from-transparent to-blue-500/30 dark:to-accent-secondary/20" />
  <span className="text-xs font-bold uppercase tracking-widest text-accent-primary dark:text-accent-secondary whitespace-nowrap">
    Quiz Generation Pipeline
  </span>
  <div className="flex-1 h-px bg-gradient-to-l from-transparent to-blue-500/30 dark:to-accent-secondary/20" />
</div>
```

### 8.6. Sidebar / Navigation

```tsx
<aside className="
  bg-bg-shell
  border-r border-border-subtle
  h-full
">
  {/* Nav item — default */}
  <a className="
    flex items-center gap-3 px-4 py-2.5 rounded-xl mx-2
    text-text-muted
    hover:bg-bg-hover
    hover:text-text-heading
    transition-all duration-200
  ">

  {/* Nav item — active */}
  <a className="
    flex items-center gap-3 px-4 py-2.5 rounded-xl mx-2
    bg-accent-primary text-white
    shadow-sm dark:shadow-blue-900/40
  ">
```

### 8.7. Modals / Dialogs

```tsx
{/* Overlay */}
<div className="fixed inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-sm z-50" />

{/* Dialog panel */}
<div className="
  bg-bg-card
  border border-border-subtle
  rounded-2xl shadow-xl dark:shadow-[0_25px_60px_rgba(0,0,0,0.5)]
  p-6 w-full max-w-lg
">
  {/* Header */}
  <div className="border-b border-border-section pb-4 mb-5">
    <h2 className="text-lg font-bold text-text-heading">Modal Title</h2>
  </div>
```

### 8.8. Tables

```tsx
<div className="rounded-2xl border border-border-subtle overflow-hidden">
  <table className="w-full">
    <thead>
      <tr className="bg-bg-section border-b border-border-subtle">
        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-text-muted">
          Column
        </th>
      </tr>
    </thead>
    <tbody>
      <tr className="border-b border-border-section
                     hover:bg-bg-hover
                     transition-colors duration-150">
        <td className="px-4 py-3.5 text-sm text-text-body">
          Data
        </td>
      </tr>
    </tbody>
  </table>
</div>
```

### 8.9. Dividers

```tsx
{/* Standard */}
<hr className="border-border-section" />

{/* Section divider với label */}
<div className="relative my-8">
  <hr className="border-border-subtle" />
  <span className="absolute left-1/2 -translate-x-1/2 -top-2.5 px-3
                   text-xs text-text-muted
                   bg-bg-root">
    OR
  </span>
</div>
```

---

## 9. AI-Native Visual Elements

Những element này định nghĩa bản sắc AI của BDC — dùng có chọn lọc, không lạm dụng.

### 9.1. Pipeline Connector Arrow
```tsx
<div className="flex items-center justify-center text-accent-secondary/60">
  <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
    <path d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"/>
  </svg>
</div>
```

### 9.2. Metric / KPI Block
```tsx
<div className="flex items-center gap-3">
  <div className="w-10 h-10 rounded-xl
    bg-blue-50 dark:bg-blue-900/20
    border border-blue-200 dark:border-blue-500/20
    flex items-center justify-center
    text-accent-primary dark:text-accent-secondary">
    <IconComponent size={18} />
  </div>
  <div>
    <p className="text-xl font-extrabold text-text-heading">80%+</p>
    <p className="text-xs text-text-muted">Time saved</p>
  </div>
</div>
```

### 9.3. Capability Badge Row
```tsx
<div className="flex flex-wrap gap-3">
  {capabilities.map(cap => (
    <div key={cap.id} className="
      flex items-center gap-2 px-3 py-2 rounded-xl
      bg-bg-section
      border border-border-subtle
      text-sm
    ">
      <IconComponent size={14} className="text-accent-primary dark:text-accent-secondary shrink-0" />
      <span className="font-semibold text-text-body">{cap.title}</span>
      <span className="text-text-muted text-xs">{cap.desc}</span>
    </div>
  ))}
</div>
```

---

## 10. Đặc Tả Theo Phân Hệ

### 10.1. Landing Page & Auth (Bộ mặt dự án)
- **Background:** Cosmic star-field (Worker-based, Zero Main-Thread Impact)
- **Thiết kế:** Glassmorphism Cards cho Auth pages. Split-screen layout cho Hero.
- **Motion:** Expressive — Triple-Layer CSS Animations, floating badges, entrance springs
- **CTAs:** Phân cấp rõ: Primary (accent filled) và Secondary (outline)
- **Theme:** Dark mode as default appearance

### 10.2. Hệ Thống LMS (Student, Teacher, Admin)
- **Default:** Dark Mode mặc định (giảm mỏi mắt khi học lâu)
- **Layout:** Sidebar + Content. Data-first — Video/Tài liệu là nhân vật chính
- **Motion:** Controlled — fade-in nhẹ, hover subtle
- **Components:** Standard Cards, không dùng glassmorphism
- **Background:** Solid `bg-bg-root`, không dùng Cosmic background

### 10.3. Quản Trị & Dashboard (Main)
- **Palette:** Navy blue xuyên suốt (thống nhất với Landing & LMS)
- **Layout:** Sidebar + Content. Data-first, bảng biểu rõ ràng
- **Spacing:** Tuân thủ 8px rhythm
- **Tables:** Striped alternate, hover highlight, focus visible
- **Background:** Solid `bg-bg-root`

---

## 11. Responsive Strategy

| Breakpoint | Tailwind | Layout |
|---|---|---|
| **Mobile** | `< sm (640px)` | Single column, stack everything, hamburger nav |
| **Tablet** | `sm - md (640-768px)` | 2 columns for cards, sidebar hidden |
| **Small Desktop** | `md - lg (768-1024px)` | Sidebar visible, 2-3 column grids |
| **Desktop** | `lg - xl (1024-1280px)` | Full layout, 3+ column grids |
| **Wide** | `xl+ (1280px+)` | Max-width container `max-w-7xl` |

> **Yêu cầu tối thiểu:** Mọi component phải co giãn tốt xuống iPhone 375px width.

---

## 12. Accessibility (WCAG 2.1 AA)

- [ ] Contrast ratio ≥ 4.5:1 cho body text, ≥ 3:1 cho large text (cả hai mode)
- [ ] Focus visible rõ ràng (`focus:ring-2 focus:ring-border-focus/20`)
- [ ] `aria-label` trên tất cả icon-only buttons
- [ ] `role="status"` trên loading states
- [ ] `prefers-reduced-motion` support (đã có trong globals.css)
- [ ] Heading hierarchy: 1 `<h1>` mỗi trang, structure semantic

---

## 13. Dark Mode Setup & Theme Toggle

```tsx
// providers/MainProvider.tsx
import { ThemeProvider } from "next-themes";
<ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
  {children}
</ThemeProvider>
```

### Theme Toggle Placement
| Vị trí | Component |
|---|---|
| Auth pages | Fixed top-right via `AuthShell` |
| Landing pages | Inside `Navbar` component |
| Dashboard/LMS | Inside `Sidebar` component |

---

## 14. Anti-Patterns — Tuyệt Đối Tránh

| ❌ Không làm (Don't) | ✅ Nên làm (Do) |
|---|---|
| Dùng `bg-slate-900` / `bg-slate-950` cho dark mode | Dùng `bg-bg-root` hoặc `bg-bg-card` (Navy palette) |
| Hardcode hex `bg-[#0F1E35]` trong `.tsx` | Dùng CSS Variable token `bg-bg-card` |
| `backdrop-blur` trên Sidebar/Navbar/Layout shell | Solid `bg-bg-shell`. Blur CHỈ cho Auth Cards & Modal overlays |
| Gradient nhiều màu rực rỡ | Solid hoặc cùng dải (blue→cyan) |
| Shadow nặng trên dark mode | `dark:shadow-none` hoặc glow subtle |
| Text thuần `#FFF` cho body text trên nền tối | `text-text-body` (slate-300) cho body, `text-text-heading` cho headings |
| `rounded-md` hoặc `rounded-lg` cho card | `rounded-2xl` cho card, `rounded-xl` cho controls |
| Thiếu `dark:` pair trên bất kỳ màu nào | Dùng CSS Variables — tự động handle cả hai |
| Animation library nặng (Framer Motion cho mọi thứ) | CSS keyframes ưu tiên. Framer Motion chỉ cho `whileInView` |
| Tạo token mới ngoài hệ thống | Tái sử dụng tokens có sẵn trong Section 2 |

---

## 15. Developer Checklist

### Màu Sắc
- [ ] Mọi màu dùng CSS Variable tokens (`bg-bg-card`, `text-text-heading`...)
- [ ] Không còn hardcode hex trong className
- [ ] Dark mode dùng Navy palette xuyên suốt
- [ ] Semantic colors đủ cho Danger/Success/Warning/Info

### Typography
- [ ] Heading dùng Outfit: `font-heading font-bold` / `font-extrabold`
- [ ] Body dùng Inter: `leading-relaxed`
- [ ] Caption: `text-sm text-text-muted`
- [ ] Pipeline label: `text-xs uppercase tracking-widest text-accent-secondary`

### Components
- [ ] Card: `rounded-2xl border border-border-subtle shadow-sm dark:shadow-none`
- [ ] Button: `active:scale-95 transition-all duration-200`
- [ ] Input: `focus:ring-2 focus:ring-border-focus/20`
- [ ] Modal overlay: `bg-black/40 dark:bg-black/60 backdrop-blur-sm`
- [ ] Sidebar: Solid `bg-bg-shell`, không blur

### Layout
- [ ] Section title có connector line hoặc spacing đủ rộng
- [ ] Grid responsive: 1 → 2 → 3+ columns
- [ ] Max-width `max-w-7xl` cho content wrapper
- [ ] Spacing tuân thủ 8px rhythm

### Accessibility
- [ ] Contrast đủ WCAG AA ở cả hai mode
- [ ] Focus visible rõ ràng
- [ ] `aria-label` trên icon-only buttons
- [ ] `prefers-reduced-motion` respected
