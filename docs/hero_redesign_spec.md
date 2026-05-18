# BDC Hub Hero & Stats Redesign Specification

This document presents the UX/UI redesign concept, structural architecture, and technical specifications of the **Hero and Stats** sections of BDC Hub. It details the rationale behind the visual transitions, the conversion-driven Call to Action (CTA) hierarchy, and the high-fidelity animation mechanics.

---

## 1. Executive Summary & Core Objectives

The BDC Hub landing page serves as the digital front-door for the Big Data Club at HCMUT. The previous design relied on a standard center-stacked layout with high-redundancy CTAs and blocky static stats, leading to cognitive friction and diminished user conversion.

The redesign achieves three core objectives:

* **Resolve CTA Redundancy**: Align the landing page navigation to steer users toward a primary conversion target rather than repeating local scroll links.
* **Establish Tech-Forward Premium Aesthetics**: Integrate statistics dynamically to reflect the club’s technical identity in Big Data, AI, and Cloud Computing.
* **Optimize Multi-Device Responsive Flows**: Ensure an equally captivating, high-performance experience on both ultra-wide screens and compact mobile devices.

---

## 2. UX Bottleneck Analysis (The "Why")

Before the redesign, a guest user encountered multiple competing actions pointing to identical sections:

```plaintext
[Navbar]               "Về CLB" ---> Scrolls to #about
                       "Dự Án"  ---> Scrolls to #projects

[Hero Buttons]         "Khám phá dự án" (Primary) ---> Scrolls to #projects
                       "Tìm hiểu thêm"  (Secondary) -> Scrolls to #about

[Scroll Indicator]     "Khám phá" (Text Label) ------> Scrolls to #about
```

### The Cognitive Pitfalls

1. **Hick's Law Violation**: Presenting multiple visually weighted options that trigger the exact same local navigation scroll dilutes user focus and decreases overall click-through rates.
2. **Lack of Active Conversion Goals**: Inactive local scrolling buttons make the site feel passive. A premium SaaS-like hub should drive high-value actions (e.g., student registration, learning management platform sign-in).
3. **Visual Overcrowding**: Large, heavy static blocks for stats beneath the CTAs consume excessive vertical screen space (above the fold) without establishing an organic connection to the hero copy.

---

## 3. The Redesign Blueprint: Split-Screen & Floating Glassmorphic Stats

To solve these bottlenecks, the layout is redesigned into a modern **2-Column Split-Screen Grid Layout** on desktop screens, separating informational hierarchy from interactive visual showcase.

```plaintext
+------------------------------------------------------------+
|                        BDC HUB NAVBAR                      |
+------------------------------------------------------------+
|                                                            |
|  [COLUMN 1: CONTENT & CTAs]     [COLUMN 2: VISUAL CORE]    |
|                                                            |
|   TITLE (S-Curve Reveal)                 (   )             |
|   Big Data Club                    Stat 1 (BDC) Stat 2     |
|                                           (   )            |
|   DESCRIPTION                      Stat 3       Stat 4     |
|   leading academic club...                                 |
|                                                            |
|   CTAs (Conversion-Focused)                                |
|   [Start Now] [View Projects]                              |
|                                                            |
+------------------------------------------------------------+
|                       (Mouse Scroll)                       |
+------------------------------------------------------------+
```

### 3.1 Left Column: Conversion-Oriented Copy & Actions

* **Title & Text Alignment**: Aligned to the left (`lg:text-left lg:items-start`) on desktop, and centered on mobile to prioritize read-flow.
* **Primary Conversion Gateways (CTAs)**:
  * **Unauthenticated Users (Guests)**:
    * *Primary (Filled Blue)*: **"Bắt đầu ngay" (Start Now)** -> Redirects to `/login`. Drives user registration and onboarding to the LMS.
    * *Secondary (Minimal Outlined)*: **"Xem dự án" (View Projects)** -> Scrolls to `#projects`.
  * **Authenticated Users (Members)**:
    * *Primary (Filled Blue)*: **"Bảng quản trị" (Dashboard)** -> Redirects to `/dashboard`.
    * *Secondary (Minimal Outlined)*: **"Về BDC Hub" (About BDC)** -> Scrolls to `#about`.

### 3.2 Right Column: Interactive Ambient Visual Core & Glassmorphic Stats

Instead of basic grids, club statistics are integrated into an organic **visual showcase area**:

* **Visual Core**: Built with layered ambient glowing gradients and dual dashed/double concentric borders rotating in opposite directions.
* **Glassmorphic Floating Badges**:
  * Four statistic cards (**100+ Connections**, **4+ Years**, **10+ R&D Projects**, **5+ Key Awards**) float around the core.
  * **Style**: Ultra-light transparent glassmorphism (`backdrop-blur-md bg-white/40 dark:bg-[#0F1E35]/40 border border-slate-200/50 dark:border-blue-500/10`) with glowing hover shadows.

### 3.3 Progressive Scroll Indicator

The duplicate text label "Khám phá" is removed. It is replaced with a silent **mouse scroll wheel simulation** with an animated scroll dot moving downwards, offering a luxury, minimalist hint of progression.

---

## 4. Animation Choreography & Technical Specs

All animations are powered by **Framer Motion** to guarantee native-like rendering speeds and zero rendering lag.

### 4.1 Entrance Choreography

* **Staggered Cascade**: Children elements animate sequentially to create a clean, intentional entry flow.
* **Easing Curve**: Leverages a premium out-expo bezier curve `[0.16, 1, 0.3, 1]` for ultra-smooth zoom transitions on the title and description block.

### 4.2 Floating Badges Physics (Continuous Loops)

To achieve a natural floating effect, each statistic card is split into two concentric containers:

1. **Entrance Wrapper**: Handles the staggered entrance transition.
2. **Continuous Physics Loop**: Animates continuously using infinite repeats and staggered cycle durations to prevent synchronous motion.

```typescript
// Staggered Floating Constants
const statsData = [
  { label: "Kết nối", value: "100+", floatClasses: "top-[8%] left-[2%]", duration: 4.2 },
  { label: "Năm hoạt động", value: "4", floatClasses: "top-[24%] right-[0%]", duration: 4.8 },
  { label: "Dự án NCKH", value: "10+", floatClasses: "bottom-[24%] left-[4%]", duration: 5.2 },
  { label: "Giải thưởng", value: "5+", floatClasses: "bottom-[8%] right-[2%]", duration: 4.5 }
];
```

Each inner badge loops perpetually:

```typescript
animate={{ y: [0, -12, 0] }}
transition={{
  repeat: Infinity,
  duration: duration, // staggered duration per card
  ease: "easeInOut"
}}
```

---

## 5. Responsive Adaptation Schema

The design employs a strict responsive design system using Tailwind CSS to adapt dynamically:

| Screen Breakpoint | Layout Behavior | Stats Presentation | Scroll Indicator |
| :--- | :--- | :--- | :--- |
| **Desktop** (`>= lg: 1024px`) | Split-screen Grid (Col-Span 7 / Col-Span 5) | Interactive Floating Badges in Right Column | Minimalist Mouse-wheel with animated scroll-dot |
| **Tablet** (`768px - 1023px`) | Single-column Centered Stack | Compact 2x2 Glassmorphic Grid underneath CTAs | Minimalist Mouse-wheel with animated scroll-dot |
| **Mobile** (`< 768px`) | Single-column Centered Stack | Compact 2x2 Glassmorphic Grid underneath CTAs | Minimalist Mouse-wheel with animated scroll-dot |

This guarantees that visitors on smartphones and tablets have full access to BDC's statistics and key credibility metrics without the visual clutter of desktop-oriented coordinates.
