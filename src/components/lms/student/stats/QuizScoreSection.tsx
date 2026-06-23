"use client";

/**
 * QuizScoreSection.tsx
 *
 * Hiển thị danh sách quiz và kết quả tốt nhất của sinh viên.
 * Click vào quiz → điều hướng đến trang làm bài.
 */

import { useRouter } from"next/navigation";
import {
 HelpCircle, CheckCircle2, XCircle, Clock, AlertCircle,
 ChevronRight, Play, RotateCcw, Minus
} from"lucide-react";
import { StudentQuizScore } from"@/services/analyticsService";
import { cn } from"@/lib/utils";

interface Props {
 scores: StudentQuizScore[];
 courseId: number;
}

type Status = StudentQuizScore["status"];

const STATUS_CONFIG: Record<Status, {
 label: string;
 icon: React.ReactNode;
 bg: string;
 text: string;
 border: string;
}> = {
 not_started: {
 label:"Chưa làm",
 icon: <Minus className="w-3.5 h-3.5" />,
 bg:"bg-bg-section",
 text:"text-text-muted",
 border:"border-border-input",
 },
 in_progress: {
 label:"Đang làm",
 icon: <Clock className="w-3.5 h-3.5" />,
 bg:"bg-amber-50 dark:bg-amber-950/30",
 text:"text-amber-600 dark:text-amber-400",
 border:"border-amber-200 dark:border-amber-700",
 },
 submitted: {
 label:"Đã nộp",
 icon: <AlertCircle className="w-3.5 h-3.5" />,
 bg:"bg-blue-50 dark:bg-blue-950/30",
 text:"text-accent-primary dark:text-accent-secondary",
 border:"border-blue-200 dark:border-blue-700",
 },
 passed: {
 label:"Đã đạt",
 icon: <CheckCircle2 className="w-3.5 h-3.5" />,
 bg:"bg-emerald-50 dark:bg-emerald-950/30",
 text:"text-emerald-600 dark:text-emerald-400",
 border:"border-emerald-200 dark:border-emerald-700",
 },
 failed: {
 label:"Chưa đạt",
 icon: <XCircle className="w-3.5 h-3.5" />,
 bg:"bg-red-50 dark:bg-red-950/30",
 text:"text-red-600 dark:text-red-400",
 border:"border-red-200 dark:border-red-700",
 },
};

function ScoreBar({ pct, status }: { pct: number; status: Status }) {
 const colorClass =
 status ==="passed"
 ?"bg-emerald-500"
 : status ==="failed"
 ?"bg-red-400"
 : status ==="in_progress" || status ==="submitted"
 ?"bg-blue-400"
 :"bg-text-disabled";

 return (
 <div className="h-1.5 w-full bg-bg-section rounded-full overflow-hidden">
 <div
 className={cn("h-full rounded-full transition-all duration-700", colorClass)}
 style={{ width: `${Math.min(pct, 100)}%` }}
 />
 </div>
 );
}

function QuizCard({ score, courseId }: { score: StudentQuizScore; courseId: number }) {
 const router = useRouter();
 const cfg = STATUS_CONFIG[score.status] ?? STATUS_CONFIG.not_started;
 const pct = score.best_percentage ?? 0;
 const lastDate = score.last_attempt_at
 ? new Date(score.last_attempt_at).toLocaleDateString("vi-VN", {
 day:"2-digit", month:"2-digit", year:"numeric",
 })
 : null;

 const actionIcon =
 score.status ==="not_started"
 ? <Play className="w-4 h-4" />
 : score.status ==="in_progress"
 ? <Play className="w-4 h-4" />
 : <RotateCcw className="w-4 h-4" />;

 const actionLabel =
 score.status ==="not_started" ?"Làm bài" :
 score.status ==="in_progress" ?"Tiếp tục" :"Làm lại";

 return (
 <div className="bg-bg-card rounded-2xl border border-border-subtle shadow-sm hover:shadow-md hover:border-border-hover transition-all p-5">
 <div className="flex items-start justify-between gap-3 mb-3">
 {/* Left: title + meta */}
 <div className="flex items-start gap-3 min-w-0">
 <div className="w-9 h-9 rounded-xl bg-violet-50 dark:bg-violet-950/30 flex items-center justify-center flex-shrink-0 border border-violet-200 dark:border-violet-800/50">
 <HelpCircle className="w-4.5 h-4.5 text-violet-600 dark:text-violet-400" />
 </div>
 <div className="min-w-0">
 <p className="font-semibold text-text-heading truncate">
 {score.quiz_title}
 </p>
 <div className="flex items-center gap-3 mt-1 text-xs text-text-muted">
 {score.attempts_count > 0 && (
 <span>{score.attempts_count} lần làm</span>
 )}
 {lastDate && (
 <span>Lần cuối: {lastDate}</span>
 )}
 {score.passing_score != null && (
 <span>Điểm qua: {score.passing_score}%</span>
 )}
 </div>
 </div>
 </div>

 {/* Right: status badge */}
 <span className={cn(
"flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full border flex-shrink-0",
 cfg.bg, cfg.text, cfg.border
 )}>
 {cfg.icon}
 {cfg.label}
 </span>
 </div>

 {/* Score display */}
 {score.status !=="not_started" && (
 <div className="mb-3">
 <div className="flex items-end justify-between mb-1.5">
 <span className="text-2xl font-extrabold text-text-heading">
 {pct.toFixed(1)}
 <span className="text-sm font-medium text-text-muted ml-1">%</span>
 </span>
 {score.best_points != null && (
 <span className="text-xs text-text-muted">
 {score.best_points.toFixed(1)} / {score.total_points} điểm
 </span>
 )}
 </div>
 <ScoreBar pct={pct} status={score.status} />
 </div>
 )}

 {/* Action button */}
 <button
 onClick={() => router.push(`/lms/student/courses/${courseId}/quiz/${score.quiz_id}`)}
 className={cn(
"w-full flex items-center justify-center gap-2 py-2 rounded-xl text-sm font-semibold transition-all active:scale-95",
 score.status ==="passed"
 ?"bg-bg-section text-text-body hover:bg-bg-hover"
 :"bg-accent-primary hover:bg-accent-primary-hover text-white shadow-sm"
 )}
 >
 {actionIcon}
 {actionLabel}
 <ChevronRight className="w-4 h-4" />
 </button>
 </div>
 );
}

export function QuizScoreSection({ scores, courseId }: Props) {
 if (scores.length === 0) {
 return (
 <section>
 <h2 className="text-lg font-bold text-text-heading mb-4">
 Kết quả Quiz
 </h2>
 <div className="bg-bg-card rounded-2xl border border-border-subtle p-10 text-center">
 <HelpCircle className="w-10 h-10 text-text-disabled mx-auto mb-3" />
 <p className="text-text-muted text-sm">
 Khóa học này chưa có quiz nào.
 </p>
 </div>
 </section>
 );
 }

 const passed = scores.filter(s => s.status ==="passed").length;
 const failed = scores.filter(s => s.status ==="failed").length;
 const pending = scores.filter(s => s.status ==="not_started" || s.status ==="in_progress").length;

 return (
 <section>
 {/* Header */}
 <div className="flex items-center justify-between mb-4">
 <div>
 <h2 className="text-lg font-bold text-text-heading">
 Kết quả Quiz
 </h2>
 <p className="text-sm text-text-muted mt-0.5">
 {passed > 0 && <span className="text-emerald-600 dark:text-emerald-400 font-medium">{passed} đạt</span>}
 {passed > 0 && (failed > 0 || pending > 0) && <span className="mx-1 text-text-disabled">·</span>}
 {failed > 0 && <span className="text-red-500 dark:text-red-400 font-medium">{failed} chưa đạt</span>}
 {failed > 0 && pending > 0 && <span className="mx-1 text-text-disabled">·</span>}
 {pending > 0 && <span>{pending} chưa làm</span>}
 </p>
 </div>
 </div>

 {/* Grid */}
 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
 {scores.map(score => (
 <QuizCard key={score.quiz_id} score={score} courseId={courseId} />
 ))}
 </div>
 </section>
 );
}