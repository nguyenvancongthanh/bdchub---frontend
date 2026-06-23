"use client";

import { cn } from"@/lib/utils";

export function TabBar<T extends string>({
 tabs, active, onChange
}: { tabs: { id: T; label: string; badge?: number }[]; active: T; onChange: (id: T) => void }) {
 return (
 <div className="flex items-center gap-1 bg-bg-section rounded-xl p-1">
 {tabs.map(t => (
 <button
 key={t.id}
 onClick={() => onChange(t.id)}
 className={cn(
"flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all",
 active === t.id
 ?"bg-bg-card text-text-heading shadow-sm"
 :"text-text-muted hover:text-text-heading dark:hover:text-text-disabled"
 )}
 >
 {t.label}
 {t.badge !== undefined && t.badge > 0 && (
 <span className="bg-blue-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
 {t.badge > 99 ?"99+" : t.badge}
 </span>
 )}
 </button>
 ))}
 </div>
 );
}