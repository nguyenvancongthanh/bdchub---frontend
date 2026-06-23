"use client";

import { motion, useReducedMotion, Variants } from "framer-motion";
import { statsData } from "./HeroStatsCards";

export interface HeroStatsMobileProps {
  statsDuration: number;
  statsYOffset: number;
}

export function HeroStatsMobile({
  statsDuration,
  statsYOffset,
}: HeroStatsMobileProps) {
  const shouldReduceMotion = useReducedMotion();

  const statsVariants: Variants = {
    hidden: { 
      opacity: 0, 
      y: shouldReduceMotion ? 0 : statsYOffset,
      filter: shouldReduceMotion ? "none" : "blur(4px)"
    },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: {
        duration: statsDuration,
        ease: [0.16, 1, 0.3, 1], // Premium out-expo easing
        delay: 1.1, // Cascaded sequentially after CTA actions
      },
    },
  };

  return (
    <motion.div 
      variants={statsVariants}
      initial="hidden"
      animate="visible"
      className="w-full lg:hidden grid grid-cols-2 gap-3 pt-8 border-t border-border-subtle mt-8"
    >
      {statsData.map((stat, i) => (
        <div 
          key={i} 
          className="group flex flex-col items-center justify-center p-4 rounded-xl cursor-default
                     bg-white/70 dark:bg-bg-card/40 backdrop-blur-lg
                     border border-border-subtle
                     shadow-sm shadow-slate-100 dark:shadow-none
                     hover:border-border-hover
                     transition-all duration-300"
        >
          <div className="text-2xl font-extrabold text-accent-primary dark:text-accent-secondary group-hover:scale-105 transition-transform duration-300">
            {stat.value}
          </div>
          <div className="text-xs font-semibold text-text-muted uppercase tracking-wider mt-0.5">
            {stat.label}
          </div>
        </div>
      ))}
    </motion.div>
  );
}
