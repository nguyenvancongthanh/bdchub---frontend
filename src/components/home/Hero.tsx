"use client";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { ArrowRight, ChevronDown } from "lucide-react";
import { motion, useReducedMotion, Variants } from "framer-motion";

export interface HeroProps {
  totalStagger?: number;
  p?: number;
  yOffset?: number;
  duration?: number;
  ease?: [number, number, number, number];
  enableConfirm?: boolean;
  confirmInitialScale?: number;
  confirmDelay?: number;
  confirmDuration?: number;
  enableTitleFade?: boolean;
  titleFadeDuration?: number; // Dedicated fade duration control
  focusSection?: "all" | "title" | "description" | "actions" | "stats";
  descriptionDuration?: number;
  descriptionYOffset?: number;
  actionsDuration?: number;
  actionsYOffset?: number;
  statsDuration?: number;
  statsYOffset?: number;
  customTime?: number;
  titleText?: string;
}

// Bộ giải phương trình Cubic Bezier bằng phương pháp tìm kiếm nhị phân (Bisection Search)
function solveBezier(x1: number, y1: number, x2: number, y2: number, x: number): number {
  if (x <= 0) return 0;
  if (x >= 1) return 1;
  let start = 0;
  let end = 1;
  let t = 0.5;
  for (let i = 0; i < 14; i++) {
    const curX = 3 * (1 - t) * (1 - t) * t * x1 + 3 * (1 - t) * t * t * x2 + t * t * t;
    if (Math.abs(curX - x) < 0.0001) break;
    if (curX < x) {
      start = t;
    } else {
      end = t;
    }
    t = (start + end) / 2;
  }
  return 3 * (1 - t) * (1 - t) * t * y1 + 3 * (1 - t) * t * t * y2 + t * t * t;
}

export default function Hero({
  totalStagger = 0.55,
  p = 2.0, // Mặc định mũ 2 cho đồ thị S-Curve đối xứng
  yOffset = 40,
  duration = 0.35,
  ease = [0.1, 1, 0.5, 1.4],
  enableConfirm = true,
  confirmInitialScale = 0.85,
  confirmDelay = 1,
  confirmDuration = 0.35,
  enableTitleFade = true,
  titleFadeDuration = 0.25, // Snappy fade-in by default
  focusSection = "all",
  descriptionDuration = 0.6,
  descriptionYOffset = 15,
  actionsDuration = 0.6,
  actionsYOffset = 15,
  statsDuration = 0.6,
  statsYOffset = 15,
  customTime,
  titleText = "Big Data Club",
}: HeroProps = {}) {
  const router = useRouter();
  const { status } = useSession();
  const isAuthenticated = status === "authenticated";
  const shouldReduceMotion = useReducedMotion();

  const statsData = [
    { label: "Kết nối", value: "100+", floatClasses: "top-[8%] left-[2%]", duration: 4.2 },
    { label: "Năm hoạt động", value: "4", floatClasses: "top-[24%] right-[0%]", duration: 4.8 },
    { label: "Dự án NCKH", value: "10+", floatClasses: "bottom-[24%] left-[4%]", duration: 5.2 },
    { label: "Giải thưởng", value: "5+", floatClasses: "bottom-[8%] right-[2%]", duration: 4.5 }
  ];

  const handleScrollToElement = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      const offset = 80; // Offset for Navbar
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };

  // Section isolation is handled via React conditional rendering to prevent hidden components from rendering or animating.

  // Animation variants with staggered choreography
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.2,
      },
    },
  };

  const titleContainerVariants: Variants = {
    hidden: { 
      opacity: 1, // Loại bỏ mờ tỏ kép từ khung cha để tránh xung đột stagger
      scale: enableConfirm ? confirmInitialScale : 1,
    },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        delayChildren: 0.1,
        ...(enableConfirm ? {
          scale: {
            delay: confirmDelay,
            duration: confirmDuration,
            ease: [0.16, 1, 0.3, 1], // Premium out-expo: zooms smoothly and locks at 1.0
          },
        } : {}),
      },
    },
  };

  const letterVariants: Variants = {
    hidden: { 
      opacity: enableTitleFade ? 0 : 1, 
      y: shouldReduceMotion ? 0 : yOffset, // Tọa độ dịch chuyển động
    },
    visible: ({ index, total }: { index: number; total: number }) => {
      const x = total > 1 ? index / (total - 1) : 0;
      
      // Hàm S-Curve đối xứng tổng quát cho mọi số mũ p >= 1 (không lo NaN với cơ số âm)
      const diff = x - 0.5;
      const progress = 0.5 + Math.sign(diff) * Math.pow(Math.abs(diff), p) * Math.pow(2, p - 1);
      
      const delay = shouldReduceMotion ? 0.1 : 0.1 + progress * totalStagger;
      
      return {
        opacity: 1,
        y: 0,
        transition: {
          y: {
            duration,
            ease,
            delay,
          },
          opacity: {
            duration: titleFadeDuration,
            ease: "easeOut",
            delay,
          },
        },
      };
    },
  };

  const descriptionVariants: Variants = {
    hidden: { 
      opacity: 0, 
      y: shouldReduceMotion ? 0 : descriptionYOffset,
      filter: shouldReduceMotion ? "none" : "blur(4px)"
    },
    visible: {
      opacity: 1,
      y: 0,
      filter: "none",
      transition: {
        duration: descriptionDuration,
        ease: [0.16, 1, 0.3, 1], // Premium out-expo easing
      },
    },
  };

  const actionsVariants: Variants = {
    hidden: { 
      opacity: 0, 
      y: shouldReduceMotion ? 0 : actionsYOffset,
      filter: shouldReduceMotion ? "none" : "blur(4px)"
    },
    visible: {
      opacity: 1,
      y: 0,
      filter: "none",
      transition: {
        duration: actionsDuration,
        ease: [0.16, 1, 0.3, 1], // Premium out-expo easing
      },
    },
  };

  const statsVariants: Variants = {
    hidden: { 
      opacity: 0, 
      y: shouldReduceMotion ? 0 : statsYOffset,
      filter: shouldReduceMotion ? "none" : "blur(4px)"
    },
    visible: {
      opacity: 1,
      y: 0,
      filter: "none",
      transition: {
        duration: statsDuration,
        ease: [0.16, 1, 0.3, 1], // Premium out-expo easing
      },
    },
  };

  // Tính toán chỉ số ký tự động dựa trên tổng thời gian trễ toàn cục
  const printableCharsCount = titleText.replace(/\s/g, "").length; // 11
  let charIndex = 0;

  return (
    <motion.section 
      id="hero" 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="relative min-h-[85vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 pt-28 pb-20 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center relative z-10">
        
        {/* Left Column - Content & Action CTAs */}
        <div className="lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left space-y-6 w-full">
          
          {(focusSection === "all" || focusSection === "title") && (() => {
            const isScrubMode = typeof customTime === "number" && !isNaN(customTime);
            const confirmScale = (() => {
              if (!isScrubMode || !enableConfirm) return 1.0;
              if (customTime < confirmDelay) return confirmInitialScale;
              if (customTime >= confirmDelay && customTime <= confirmDelay + confirmDuration) {
                const linearProgress = (customTime - confirmDelay) / confirmDuration;
                const easedProgress = solveBezier(0.16, 1.0, 0.3, 1.0, linearProgress); // Khớp [0.16, 1, 0.3, 1]
                return confirmInitialScale + (1.0 - confirmInitialScale) * easedProgress;
              }
              return 1.0;
            })();

            return (
              <motion.div 
                variants={titleContainerVariants}
                animate={isScrubMode ? false : undefined}
                style={isScrubMode ? { opacity: 1, scale: 1 } : undefined}
                className="will-change-transform [backface-visibility:hidden] w-full"
              >
                {/* Title — bottom-up-letters per-character reveal (crisp edges, zero blur, Apple-style stagger) */}
                <h1 
                  className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight pt-2 pb-4 px-1 leading-[1.15]
                             bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent
                             dark:from-blue-400 dark:to-cyan-400 flex flex-wrap justify-center lg:justify-start text-center lg:text-left"
                  style={isScrubMode ? { transform: `scale(${confirmScale})` } : undefined}
                >
                  {titleText.split(" ").map((word, wordIdx) => (
                    <span key={wordIdx} className="inline-block whitespace-nowrap mr-[0.25em] last:mr-0">
                      {Array.from(word).map((char, charIdx) => {
                        const index = charIndex++;
                        
                        let letterStyleProps = {};
                        if (isScrubMode) {
                          const x = printableCharsCount > 1 ? index / (printableCharsCount - 1) : 0;
                          const diff = x - 0.5;
                          const progress = 0.5 + Math.sign(diff) * Math.pow(Math.abs(diff), p) * Math.pow(2, p - 1);
                          const start = 0.1 + progress * totalStagger;
                          const endY = start + duration;
                          const endOpacity = start + titleFadeDuration;
                          
                          let opacity = 1;
                          let y = 0;
                          
                          // 1. Calculate Y translation
                          if (customTime < start) {
                            y = yOffset;
                          } else if (customTime >= start && customTime <= endY) {
                            const linearFactor = (customTime - start) / duration;
                            const [eX1, eY1, eX2, eY2] = Array.isArray(ease) && ease.length === 4 ? ease : [0.1, 1, 0.5, 1.4];
                            const easedFactor = solveBezier(eX1, eY1, eX2, eY2, linearFactor);
                            y = yOffset * (1 - easedFactor);
                          } else {
                            y = 0;
                          }

                          // 2. Calculate Opacity fade with its dedicated duration
                          if (!enableTitleFade) {
                            opacity = 1;
                          } else if (customTime < start) {
                            opacity = 0;
                          } else if (customTime >= start && customTime <= endOpacity) {
                            const linearFactor = (customTime - start) / titleFadeDuration;
                            opacity = Math.min(1, Math.max(0, linearFactor));
                          } else {
                            opacity = 1;
                          }
                          
                          letterStyleProps = {
                            style: {
                              opacity,
                              transform: `translateY(${y}px)`,
                            }
                          };
                        }

                        return (
                          <motion.span
                            key={charIdx}
                            custom={{ index, total: printableCharsCount }}
                            variants={letterVariants}
                            animate={isScrubMode ? false : undefined}
                            className="inline-block will-change-transform [backface-visibility:hidden]"
                            {...letterStyleProps}
                          >
                            {char}
                          </motion.span>
                        );
                      })}
                    </span>
                  ))}
                </h1>
              </motion.div>
            );
          })()}

          {(focusSection === "all" || focusSection === "description") && (
            <motion.p 
              variants={descriptionVariants}
              className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 max-w-2xl lg:max-w-xl leading-relaxed text-center lg:text-left transition-all duration-200"
            >
              Câu lạc bộ học thuật hàng đầu tại HCMUT chuyên nghiên cứu và phát triển trong lĩnh vực Dữ liệu lớn, Trí tuệ nhân tạo, Điện toán đám mây và Điện toán lượng tử.
            </motion.p>
          )}
          
          {(focusSection === "all" || focusSection === "actions") && (
            <motion.div 
              variants={actionsVariants}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start items-center pt-2 w-full sm:w-auto transition-all duration-200"
            >
              {isAuthenticated ? (
                <>
                  <button
                    onClick={() => router.push("/dashboard")}
                    aria-label="Đi đến Bảng quản trị"
                    className="group px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl w-full sm:w-auto
                               shadow-sm hover:shadow-lg hover:shadow-blue-600/20
                               dark:shadow-blue-900/30 dark:hover:shadow-blue-500/20
                               active:scale-95 transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    Bảng quản trị <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                  <a
                    href="#about"
                    onClick={(e) => handleScrollToElement(e, "about")}
                    aria-label="Tìm hiểu thêm về Big Data Club"
                    className="px-8 py-3.5 bg-white dark:bg-[#0F1E35] text-slate-800 dark:text-slate-300 font-medium rounded-xl w-full sm:w-auto text-center
                               border border-slate-200 dark:border-blue-500/20
                               hover:bg-slate-50 dark:hover:bg-[#162644]
                               hover:border-slate-300 dark:hover:border-blue-500/40
                               hover:-translate-y-1 hover:shadow-md
                               active:scale-95 transition-all duration-300"
                  >
                    Về BDC Hub
                  </a>
                </>
              ) : (
                <>
                  <button
                    onClick={() => router.push("/login")}
                    aria-label="Bắt đầu ngay tại BDC Hub"
                    className="group px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl w-full sm:w-auto
                               shadow-sm hover:shadow-lg hover:shadow-blue-600/20
                               dark:shadow-blue-900/30 dark:hover:shadow-blue-500/20
                               active:scale-95 transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    Bắt đầu ngay <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                  <a
                    href="#projects"
                    onClick={(e) => handleScrollToElement(e, "projects")}
                    aria-label="Khám phá các dự án nổi bật của BDC"
                    className="px-8 py-3.5 bg-white dark:bg-[#0F1E35] text-slate-800 dark:text-slate-300 font-medium rounded-xl w-full sm:w-auto text-center
                               border border-slate-200 dark:border-blue-500/20
                               hover:bg-slate-50 dark:hover:bg-[#162644]
                               hover:border-slate-300 dark:hover:border-blue-500/40
                               hover:-translate-y-1 hover:shadow-md
                               active:scale-95 transition-all duration-300"
                  >
                    Xem dự án
                  </a>
                </>
              )}
            </motion.div>
          )}

          {/* Mobile Stats Fallback (visible under CTAs on mobile/tablet) */}
          {(focusSection === "all" || focusSection === "stats") && (
            <motion.div 
              variants={statsVariants}
              className="w-full lg:hidden grid grid-cols-2 gap-3 pt-8 border-t border-slate-200/50 dark:border-blue-500/5 mt-8"
            >
              {statsData.map((stat, i) => (
                <div 
                  key={i} 
                  className="group flex flex-col items-center justify-center p-4 rounded-xl cursor-default
                             bg-white/60 dark:bg-[#0F1E35]/40 backdrop-blur-md
                             border border-slate-200/60 dark:border-blue-500/10
                             hover:border-blue-300/60 dark:hover:border-blue-500/30
                             transition-all duration-300"
                >
                  <div className="text-2xl font-extrabold text-blue-600 dark:text-cyan-400 group-hover:scale-105 transition-transform duration-300">
                    {stat.value}
                  </div>
                  <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mt-0.5">
                    {stat.label}
                  </div>
                </div>
              ))}
            </motion.div>
          )}

        </div>

        {/* Right Column - Glowing Visual Core & Floating Glassmorphic Stats (Desktop Only) */}
        {(focusSection === "all" || focusSection === "stats") && (
          <div className="lg:col-span-5 relative w-full h-[480px] hidden lg:flex items-center justify-center select-none">
            
            {/* Ambient Glowing Cores */}
            <div className="absolute w-72 h-72 rounded-full bg-gradient-to-tr from-blue-500/10 to-cyan-500/10 dark:from-blue-500/5 dark:to-cyan-500/5 blur-3xl animate-pulse" />
            <div className="absolute w-56 h-56 rounded-full border border-dashed border-blue-500/20 dark:border-blue-400/10 animate-[spin_60s_linear_infinite]" />
            <div className="absolute w-40 h-40 rounded-full border border-double border-cyan-500/20 dark:border-cyan-400/10 animate-[spin_40s_linear_infinite_reverse]" />
            
            <div className="absolute flex flex-col items-center justify-center text-center p-6 bg-slate-50/50 dark:bg-[#070E1C]/50 backdrop-blur-md border border-slate-200 dark:border-blue-500/10 rounded-full w-28 h-28 shadow-inner">
              <span className="text-2xl font-black bg-gradient-to-r from-blue-600 to-cyan-600 dark:from-blue-400 dark:to-cyan-400 bg-clip-text text-transparent">BDC</span>
              <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-0.5">HUB</span>
            </div>

            {/* Floating Glassmorphic Stats */}
            {statsData.map((stat, i) => (
              <motion.div
                key={i}
                variants={statsVariants}
                className={`absolute ${stat.floatClasses} w-[150px] z-20`}
              >
                <motion.div
                  animate={{ y: [0, -12, 0] }}
                  transition={{
                    repeat: Infinity,
                    duration: stat.duration,
                    ease: "easeInOut"
                  }}
                  className="group flex flex-col items-center justify-center p-4 rounded-2xl cursor-default
                             bg-white/40 dark:bg-[#0F1E35]/40 backdrop-blur-md
                             border border-slate-200/50 dark:border-blue-500/10
                             hover:border-blue-300/60 dark:hover:border-blue-500/30
                             hover:shadow-lg hover:shadow-blue-500/5
                             dark:hover:shadow-[0_8px_30px_rgba(37,99,235,0.08)]
                             transition-all duration-300"
                >
                  <div className="text-2xl font-extrabold text-blue-600 dark:text-cyan-400 group-hover:scale-105 transition-transform duration-300">
                    {stat.value}
                  </div>
                  <div className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mt-1 text-center">
                    {stat.label}
                  </div>
                </motion.div>
              </motion.div>
            ))}

          </div>
        )}

        {/* Scroll indicator */}
        {(focusSection === "all" || focusSection === "actions") && (
          <motion.div 
            variants={actionsVariants}
            className="pt-12 flex justify-center transition-all duration-200 w-full col-span-12"
          >
            <a 
              href="#about" 
              onClick={(e) => handleScrollToElement(e, "about")}
              aria-label="Cuộn xuống để xem thêm"
              className="flex flex-col items-center gap-2 text-slate-400 dark:text-slate-500 hover:text-blue-600 dark:hover:text-cyan-400 transition-colors group cursor-pointer"
            >
              <span className="text-[10px] font-semibold uppercase tracking-[0.25em] opacity-60 group-hover:opacity-100 transition-opacity">Tiếp tục</span>
              <div className="w-6 h-10 rounded-full border-2 border-slate-300 dark:border-slate-700 flex items-start justify-center p-1.5 group-hover:border-blue-500 dark:group-hover:border-cyan-400 transition-colors">
                <motion.div 
                  animate={{ y: [0, 8, 0] }}
                  transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
                  className="w-1 h-1.5 rounded-full bg-slate-400 dark:bg-slate-500 group-hover:bg-blue-600 dark:group-hover:bg-cyan-400 transition-colors"
                />
              </div>
            </a>
          </motion.div>
        )}
      </div>
    </motion.section>
  );
}