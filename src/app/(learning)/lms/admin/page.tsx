"use client";

import { AdminDashboard } from"@/components/dashboard/admin/AdminDashboard";
import dynamic from"next/dynamic";
import { useState } from"react";
import { BrainCircuit, ChevronDown } from"lucide-react";

// Lazy-load the heavy graph panel (22KB) — only rendered when toggle is open
const GlobalKnowledgeGraphPanel = dynamic(
 () => import("@/components/lms/teacher/ai/GlobalKnowledgeGraphPanel"),
 { ssr: false, loading: () => <div className="h-[680px] bg-bg-section rounded-2xl animate-pulse flex items-center justify-center text-sm text-text-disabled">Loading…</div> },
);

export default function AdminPage() {
 const [graphOpen, setGraphOpen] = useState(true);

 return (
 <div className="space-y-8">
 <AdminDashboard />

 <section>
 <button
 onClick={() => setGraphOpen(v => !v)}
 className="w-full flex items-center justify-between px-5 py-4 bg-bg-root border border-border-subtle rounded-2xl hover:border-border-subtle transition-colors group"
 >
 <div className="flex items-center gap-3">
 <div className="w-8 h-8 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center">
 <BrainCircuit className="w-4 h-4 text-indigo-400" />
 </div>
 <div className="text-left">
 <p className="font-bold text-text-heading dark:text-text-disabled text-sm">Global Knowledge Graph</p>
 <p className="text-xs text-text-muted mt-0.5">
 Toàn bộ knowledge nodes & liên kết từ tất cả khóa học trong hệ thống
 </p>
 </div>
 </div>
 <ChevronDown
 className={`w-4 h-4 text-text-muted transition-transform duration-200 ${graphOpen ?"rotate-180" :""}`}
 />
 </button>

 {graphOpen && (
 <div className="mt-3 rounded-2xl overflow-hidden" style={{ height: 680 }}>
 <GlobalKnowledgeGraphPanel
 title="Global Knowledge Graph — Toàn hệ thống"
 global={true}
 />
 </div>
 )}
 </section>
 </div>
 );
}