"use client";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { ArrowRight } from "lucide-react";

export default function Hero() {
  const router = useRouter();
  const { status } = useSession();
  const isAuthenticated = status === "authenticated";

  return (
    <section className="relative min-h-[75vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 text-center mt-8">
      <div className="max-w-4xl mx-auto space-y-8 relative z-10">
        {/* Title — gradient in dark mode */}
        <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight">
          <span className="text-slate-900 dark:text-transparent dark:bg-gradient-to-r dark:from-blue-400 dark:to-cyan-400 dark:bg-clip-text">
            Big Data Club
          </span>
        </h1>

        <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed">
          Câu lạc bộ học thuật hàng đầu tại HCMUT chuyên nghiên cứu và phát triển trong lĩnh vực Dữ liệu lớn, Trí tuệ nhân tạo, Điện toán đám mây và Điện toán lượng tử.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
          <a
            href="#about"
            className="px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-sm dark:shadow-blue-900/30 active:scale-95 transition-all duration-200 flex items-center gap-2"
          >
            Tìm hiểu thêm <ArrowRight className="w-4 h-4" />
          </a>
          {isAuthenticated && (
            <button
              onClick={() => router.push("/dashboard")}
              className="px-8 py-3.5 bg-white dark:bg-[#0F1E35] text-slate-800 dark:text-slate-300 font-medium rounded-xl border border-slate-200 dark:border-blue-500/20 hover:bg-slate-50 dark:hover:bg-[#162644] hover:border-slate-300 dark:hover:border-blue-500/40 active:scale-95 transition-all duration-200"
            >
              Bảng quản trị
            </button>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-12 border-t border-slate-200 dark:border-blue-500/10 mt-12">
          {[
            { label: "Thành viên", value: "200+" },
            { label: "Năm hoạt động", value: "4" },
            { label: "Dự án NCKH", value: "10+" },
            { label: "Giải thưởng", value: "15+" }
          ].map((stat, i) => (
            <div key={i} className="text-center">
              <div className="text-3xl font-extrabold text-blue-600 dark:text-cyan-400">{stat.value}</div>
              <div className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}