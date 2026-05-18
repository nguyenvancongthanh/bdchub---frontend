"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useReducedMotion, Variants, animate } from "framer-motion";

export interface StatItem {
  label: string;
  value: string;
  floatClasses: string;
  duration: number;
}

export const statsData: StatItem[] = [
  { label: "Kết nối", value: "100+", floatClasses: "top-[6%] left-[2%]", duration: 4.2 },
  { label: "Năm hoạt động", value: "4", floatClasses: "top-[22%] right-[0%]", duration: 4.8 },
  { label: "Dự án NCKH", value: "10+", floatClasses: "bottom-[22%] left-[2%]", duration: 5.2 },
  { label: "Giải thưởng", value: "5+", floatClasses: "bottom-[6%] right-[2%]", duration: 4.5 }
];

// High-performance direct-DOM Animated Counter for the stats values
function StatCounter({ value, delay = 0 }: { value: string; delay?: number }) {
  const numericPart = parseInt(value.replace(/[^0-9]/g, "")) || 0;
  const suffix = value.replace(/[0-9]/g, "");
  
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const controls = animate(0, numericPart, {
      duration: 1.8,
      ease: [0.16, 1, 0.3, 1], // Elegant out-exponential easing
      delay: delay + 0.25,     // Offset to start during card spring bounce
      onUpdate: (latest) => {
        if (ref.current) {
          ref.current.textContent = String(Math.round(latest));
        }
      }
    });
    return controls.stop;
  }, [numericPart, delay]);

  return (
    <div className="text-3xl font-extrabold text-blue-600 dark:text-cyan-400 group-hover:scale-105 transition-transform duration-300">
      <span ref={ref}>0</span>
      <span>{suffix}</span>
    </div>
  );
}

// Apple Signature Soft Blur In Text Effect for stats labels
function SoftBlurInText({ text, delay = 0 }: { text: string; delay?: number }) {
  const shouldReduceMotion = useReducedMotion();
  const characters = Array.from(text);

  if (shouldReduceMotion) {
    return (
      <div className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mt-1.5 text-center">
        {text}
      </div>
    );
  }

  return (
    <div className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mt-1.5 text-center flex justify-center flex-wrap gap-x-[1px]">
      {characters.map((char, index) => (
        <motion.span
          key={index}
          initial={{ opacity: 0, y: 8, filter: "blur(4px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{
            duration: 0.5,
            ease: [0.22, 1, 0.36, 1],       // Apple Signature easing
            delay: delay + index * 0.035,   // Tight staggered entry
          }}
        >
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
    </div>
  );
}

export interface HeroStatsCardsProps {
  statsDuration: number;
  statsYOffset: number;
}

export function HeroStatsCards({
  statsDuration,
  statsYOffset,
}: HeroStatsCardsProps) {
  const shouldReduceMotion = useReducedMotion();
  const [mounted, setMounted] = useState(false);

  // Guarantee client-side hydration mounts before launching Framer Motion variants
  // Added a deliberate 150ms delay to ensure browser registers initial hidden styles before transition
  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 150);
    return () => clearTimeout(timer);
  }, []);

  // Dramatic explosive entrance: cards sweep in from far outside grid bounds with dynamic rotation
  const cardEnterOffsets = [
    { x: -280, y: -200, rotate: -30 }, // Card 0: Top-Left
    { x: 280, y: -200, rotate: 30 },   // Card 1: Top-Right
    { x: -280, y: 200, rotate: 20 },   // Card 2: Bottom-Left
    { x: 280, y: 200, rotate: -20 },   // Card 3: Bottom-Right
  ];

  const cardVariants: Variants = {
    cardHidden: (index: number) => {
      const offset = cardEnterOffsets[index] ?? { x: 0, y: statsYOffset, rotate: 0 };
      return {
        opacity: 0,
        scale: shouldReduceMotion ? 1 : 0.35,
        x: shouldReduceMotion ? 0 : offset.x,
        y: shouldReduceMotion ? 0 : offset.y,
        rotate: shouldReduceMotion ? 0 : offset.rotate,
        filter: shouldReduceMotion ? "blur(0px)" : "blur(16px)",
      };
    },
    cardVisible: (index: number) => ({
      opacity: 1,
      scale: 1,
      x: 0,
      y: 0,
      rotate: 0,
      filter: "blur(0px)",
      transition: {
        type: shouldReduceMotion ? "tween" : "spring",
        stiffness: 90,   // Snappy, energetic spring
        damping: 12,     // Lower damping for a satisfying rebound bounce
        mass: 0.85,
        // Explicitly define transitions for each transform coordinate to ensure they honor the staggered delay!
        // This prevents them from animating instantly while opacity is still 0.
        x: { type: "spring", stiffness: 90, damping: 12, mass: 0.85, delay: 0.5 + index * 0.22 },
        y: { type: "spring", stiffness: 90, damping: 12, mass: 0.85, delay: 0.5 + index * 0.22 },
        scale: { type: "spring", stiffness: 90, damping: 12, mass: 0.85, delay: 0.5 + index * 0.22 },
        rotate: { type: "spring", stiffness: 90, damping: 12, mass: 0.85, delay: 0.5 + index * 0.22 },
        opacity: { duration: 0.5, ease: "easeOut", delay: 0.5 + index * 0.22 },
        filter: { duration: 0.7, ease: "easeOut", delay: 0.5 + index * 0.22 },
      },
    }),
  };

  // Continuous floating y-bobbing motion
  const floatVariants: Variants = {
    floatHidden: { y: 0 },
    floatVisible: (index: number) => ({
      y: shouldReduceMotion ? 0 : [0, -12, 0],
      transition: {
        repeat: Infinity,
        duration: statsData[index]?.duration ?? 4.5,
        ease: "easeInOut",
        delay: shouldReduceMotion ? 0 : 0.5 + (index * 0.22) + 1.4, // Starts after spring settles
      },
    }),
  };

  return (
    <>
      {statsData.map((stat, i) => {
        const cardDelay = 0.5 + i * 0.22;
        return (
          /* Outer Card Wrapper - Back to Framer Motion variants but hydration-safe via mounted trigger */
          /* inherit={false} blocks parent context variant propagation to prevent transition override */
          <motion.div
            key={i}
            custom={i}
            variants={cardVariants}
            initial="cardHidden"
            animate={mounted ? "cardVisible" : "cardHidden"}
            inherit={false}
            className={`absolute ${stat.floatClasses} w-[170px] z-20`}
          >
            {/* Inner floating motion wrapper */}
            {/* inherit={false} blocks parent context, whileHover is isolated to not override infinite loop */}
            <motion.div
              custom={i}
              variants={floatVariants}
              initial="floatHidden"
              animate={mounted ? "floatVisible" : "floatHidden"}
              inherit={false}
              whileHover={{ 
                scale: 1.04, 
                y: -4,
                transition: {
                  type: "spring",
                  stiffness: 400,
                  damping: 20
                }
              }}
            >
              {/* Visual Card Style with only Targeted CSS transitions */}
              <div
                className="group relative flex flex-col items-center justify-center p-5 rounded-2xl cursor-default
                           bg-white/40 dark:bg-[#0F1E35]/40 backdrop-blur-md overflow-hidden
                           border border-slate-200/50 dark:border-blue-500/10
                           hover:border-blue-300/60 dark:hover:border-blue-500/30
                           hover:shadow-lg hover:shadow-blue-500/5
                           dark:hover:shadow-[0_8px_30px_rgba(37,99,235,0.08)]
                           transition-[border-color,box-shadow] duration-300"
              >
                {/* Diagonal Glass Shimmer Sweep (Executes once exactly when card settles) */}
                {!shouldReduceMotion && (
                  <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none z-10">
                    <motion.div
                      initial={{ x: "-150%" }}
                      animate={{ x: "150%" }}
                      transition={{
                        duration: 1.4,
                        ease: [0.16, 1, 0.3, 1],
                        delay: cardDelay + 0.6, // Sweeps across right as card lands and bounces
                      }}
                      className="w-1/2 h-full bg-gradient-to-r from-transparent via-white/25 dark:via-blue-400/15 to-transparent skew-x-12"
                    />
                  </div>
                )}

                {/* 1. Numerical Count-Up Animation */}
                <StatCounter value={stat.value} delay={cardDelay} />

                {/* 2. Apple Signature Soft Blur Staggered Text Animation */}
                <SoftBlurInText text={stat.label} delay={cardDelay + 0.1} />
              </div>
            </motion.div>
          </motion.div>
        );
      })}
    </>
  );
}
