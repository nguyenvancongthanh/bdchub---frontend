import { cn } from"@/lib/utils";

export interface ContentItem {
 id: number;
 type:"TEXT" |"VIDEO" |"IMAGE" |"DOCUMENT" |"QUIZ" |"FORUM" |"ANNOUNCEMENT" | string;
 title: string;
 description?: string;
 metadata?: Record<string, any>;
 file_path?: string | null;
 file_type?: string;
 is_mandatory?: boolean;
}

export function buildFileUrl(filePath?: string | null): string {
 if (!filePath) return"";
 if (filePath.startsWith("http://") || filePath.startsWith("https://")) return filePath;
 return `/lmsapiv1/files/serve/${filePath}`;
}

export function formatFileSize(bytes: number): string {
 if (!bytes) return"Không rõ";
 const units = ["Bytes","KB","MB","GB"];
 const i = Math.floor(Math.log(bytes) / Math.log(1024));
 return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${units[i]}`;
}

export function extractYouTubeId(url: string): string {
 const match = url.match(
 /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/
 );
 return match?.[1] ??"";
}

export function extractVimeoId(url: string): string {
 return url.match(/vimeo\.com\/(\d+)/)?.[1] ??"";
}

export function CompletionBadge({ isCompleted }: { isCompleted: boolean }) {
 if (!isCompleted) return null;
 return (
 <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/50 px-2.5 py-1 rounded-full">
 <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
 <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
 </svg>
 Đã hoàn thành
 </div>
 );
}

export function EmptyState({ message }: { message: string }) {
 return (
 <div className="p-6 bg-bg-section dark:bg-bg-hover border border-border-input rounded-2xl text-center">
 <p className="text-sm text-text-muted">{message}</p>
 </div>
 );
}

export function StatPill({ label, value }: { label: string; value: string }) {
 return (
 <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-bg-section border border-border-input rounded-lg text-xs text-text-body">
 <span className="text-text-muted">{label}:</span>
 <span className="font-semibold">{value}</span>
 </span>
 );
}

export function DownloadLink({
 href, label, secondary = false, compact = false,
}: {
 href: string; label: string; secondary?: boolean; compact?: boolean;
}) {
 return (
 <a
 href={href}
 download
 className={cn(
"inline-flex items-center gap-1.5 font-medium rounded-xl shadow-sm transition-all active:scale-95",
 compact ?"px-3 py-1.5 text-sm" :"px-4 py-2 text-sm",
 secondary
 ?"bg-bg-section border border-border-input text-text-body hover:bg-bg-hover"
 :"bg-accent-primary hover:bg-accent-primary-hover text-white"
 )}
 >
 📥 {label}
 </a>
 );
}

export function ActionButton({
 onClick, label, variant ="primary",
}: {
 onClick: () => void; label: string; variant?:"primary" |"success";
}) {
 return (
 <button
 onClick={onClick}
 className={cn(
"flex-1 px-5 py-3 rounded-xl font-semibold text-sm shadow-sm transition-all active:scale-95",
 variant ==="success"
 ?"bg-emerald-600 hover:bg-emerald-700 text-white"
 :"bg-accent-primary hover:bg-accent-primary-hover text-white"
 )}
 >
 {label}
 </button>
 );
}
