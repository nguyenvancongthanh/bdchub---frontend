"use client";
import { Activity } from "lucide-react";
import clubData from "@/data/clubData.json";
import SectionHeader from "../common/SectionHeader";
import SafeImage from "../common/SafeImage";
import { motion } from "framer-motion";

export default function Activities() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { 
        duration: 0.6
      },
    },
  };

  return (
    <section id="activities" className="py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <SectionHeader icon={Activity} title="Hoạt Động Cốt Lõi" />

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {clubData.activities.map((activity) => (
            <motion.div 
              key={activity.id} 
              variants={itemVariants}
              className="bg-bg-card
                                               rounded-2xl
                                               border border-border-subtle
                                               overflow-hidden
                                               shadow-sm dark:shadow-none
                                               hover:-translate-y-1.5
                                               hover:shadow-xl hover:shadow-blue-500/5
                                               dark:hover:shadow-[0_12px_40px_rgba(37,99,235,0.08)]
                                               hover:border-border-hover
                                               transition-all duration-300 group"
            >
              <div className="h-48 bg-bg-section relative overflow-hidden">
                <SafeImage src={activity.imageUrl} alt={activity.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-blue-600/0 group-hover:bg-blue-600/5 dark:group-hover:bg-cyan-400/5 transition-colors duration-300" />
              </div>
              <div className="p-6">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full
                                 text-xs font-semibold uppercase tracking-wider mb-3 w-fit
                                 bg-blue-50 dark:bg-blue-900/30
                                 text-accent-primary dark:text-accent-secondary
                                 border border-blue-200 dark:border-blue-500/20">
                   {activity.type}
                </span>
                <h3 className="text-xl font-bold text-text-heading mb-2 group-hover:text-accent-primary dark:group-hover:text-accent-secondary transition-colors duration-300">{activity.title}</h3>
                <p className="text-text-body dark:text-text-muted text-sm line-clamp-3">{activity.description}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}