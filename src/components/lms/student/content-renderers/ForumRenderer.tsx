"use client";

import { useRouter } from"next/navigation";
import { ContentItem } from"./utils";

interface ForumRendererProps {
 content: ContentItem;
}

export function ForumRenderer({ content }: ForumRendererProps) {
 const router = useRouter();
 return (
 <div className="bg-bg-card border border-border-subtle rounded-2xl p-5 shadow-sm">
 <div className="flex items-start gap-4">
 <div className="w-10 h-10 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800/50 rounded-xl flex items-center justify-center flex-shrink-0 text-lg">
 💬
 </div>
 <div className="flex-1">
 <h3 className="font-semibold text-text-heading mb-1">Diễn đàn thảo luận</h3>
 <p className="text-sm text-text-muted mb-4">
 {content.description ||"Tham gia thảo luận, đặt câu hỏi và chia sẻ kiến thức."}
 </p>
 <button
 onClick={() => router.push(`/lms/forums/${content.id}`)}
 className="px-5 py-2.5 bg-accent-primary hover:bg-accent-primary-hover text-white rounded-xl font-semibold text-sm shadow-sm transition-all active:scale-95"
 >
 Vào diễn đàn →
 </button>
 </div>
 </div>
 </div>
 );
}
