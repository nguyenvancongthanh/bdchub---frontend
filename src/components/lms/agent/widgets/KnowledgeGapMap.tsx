"use client";

/**
 * KnowledgeGapMap — visualizes student knowledge weaknesses.
 * Shows mastery bars and prerequisite chains.
 */
import { cn } from"@/lib/utils";

interface Gap {
 name: string;
 mastery: number;
 wrong_count?: number;
}

interface Prerequisite {
 weak_node: string;
 related_concepts: string[];
}

interface KnowledgeGapMapProps {
 props: {
 gaps: Gap[];
 prerequisites?: Prerequisite[];
 message?: string;
 };
}

function masteryColor(m: number): string {
 if (m >= 0.7) return"bg-green-500";
 if (m >= 0.4) return"bg-yellow-500";
 return"bg-red-500";
}

export function KnowledgeGapMap({ props }: KnowledgeGapMapProps) {
 const { gaps, prerequisites, message } = props;

 if (!gaps || gaps.length === 0) {
 return (
 <div className="p-4 rounded-xl bg-bg-section text-sm text-text-muted">
 {message ||"Chưa có dữ liệu phân tích."}
 </div>
 );
 }

 return (
 <div className="space-y-4">
 <div className="text-xs font-semibold text-accent-primary dark:text-accent-secondary uppercase tracking-wider">
 Knowledge Gap Analysis
 </div>

 {/* Mastery bars */}
 <div className="space-y-2">
 {gaps.map((g, i) => (
 <div
 key={i}
 className="p-3 rounded-xl bg-bg-card border border-border-subtle"
 >
 <div className="flex items-center justify-between mb-1.5">
 <span className="text-sm font-medium text-text-subheading truncate">
 {g.name}
 </span>
 <span className="text-xs text-text-muted dark:text-text-muted flex-shrink-0 ml-2">
 {Math.round(g.mastery * 100)}%
 {g.wrong_count !== undefined && (
 <span className="text-red-400 ml-1">({g.wrong_count} sai)</span>
 )}
 </span>
 </div>
 <div className="w-full h-2 bg-bg-section rounded-full overflow-hidden">
 <div
 className={cn("h-full rounded-full transition-all duration-500", masteryColor(g.mastery))}
 style={{ width: `${Math.max(g.mastery * 100, 2)}%` }}
 />
 </div>
 </div>
 ))}
 </div>

 {/* Prerequisite chains */}
 {prerequisites && prerequisites.length > 0 && (
 <div className="space-y-2">
 <div className="text-xs font-medium text-text-muted dark:text-text-muted">
 Chuỗi tiên quyết cần ôn:
 </div>
 {prerequisites.map((p, i) => (
 <div
 key={i}
 className="flex items-center gap-2 text-xs text-text-muted"
 >
 <span className="font-medium text-red-500 dark:text-red-400">{p.weak_node}</span>
 <span className="text-text-disabled dark:text-text-body">←</span>
 <span>{p.related_concepts.join(",")}</span>
 </div>
 ))}
 </div>
 )}
 </div>
 );
}
