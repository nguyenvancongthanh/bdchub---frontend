"use client";
import { BookOpen } from "lucide-react";
import SectionHeader from "../common/SectionHeader";
import { motion } from "framer-motion";

export default function About() {
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
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <section id="about" className="py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <SectionHeader icon={BookOpen} title="Về Câu Lạc Bộ" />

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid md:grid-cols-2 gap-12 items-start"
        >
          <motion.div 
            variants={itemVariants}
            className="space-y-6 text-text-body leading-relaxed text-lg
                          bg-bg-card
                          p-8 rounded-2xl
                          border border-border-subtle
                          shadow-sm dark:shadow-none
                          hover:-translate-y-1 hover:shadow-lg hover:shadow-blue-500/5
                          dark:hover:shadow-[0_8px_30px_rgba(37,99,235,0.06)]
                          hover:border-border-hover
                          transition-all duration-300"
          >
            <p><strong className="text-text-heading">Big Data Club</strong> là câu lạc bộ học thuật tại ĐH Bách Khoa TP.HCM, được thành lập năm 2021 dưới sự hướng dẫn của PGS.TS Thoại Nam và HPC Lab.</p>
            <p>Với tinh thần <strong className="text-accent-primary dark:text-accent-secondary">Think Big - Speak Data</strong> và phương châm <strong className="text-accent-primary dark:text-accent-secondary">Learning by Doing</strong>, chúng tôi xây dựng một môi trường cởi mở để sinh viên rèn luyện thực chiến.</p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { title: "Học Hỏi Không Ngừng", desc: "Trân trọng điểm mạnh của từng cá nhân." },
              { title: "Dám Nghĩ Dám Làm", desc: "Tư duy đổi mới, không ngại thử nghiệm." },
              { title: "Chia Sẻ Cởi Mở", desc: "Open Learning - Open Sharing." },
              { title: "Học Qua Dự Án", desc: "Learning by Doing - Thực chiến." }
            ].map((val, idx) => (
              <motion.div 
                key={idx} 
                variants={itemVariants}
                className="group bg-bg-card
                                        p-6 rounded-2xl
                                        border border-border-subtle
                                        shadow-sm dark:shadow-none
                                        hover:-translate-y-1
                                        hover:shadow-lg hover:shadow-blue-500/5
                                        dark:hover:shadow-[0_8px_30px_rgba(37,99,235,0.06)]
                                        hover:border-border-hover
                                        transition-all duration-300"
              >
                <h3 className="font-bold text-text-heading mb-2 group-hover:text-accent-primary dark:group-hover:text-accent-secondary transition-colors duration-300">{val.title}</h3>
                <p className="text-sm text-text-muted">{val.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}