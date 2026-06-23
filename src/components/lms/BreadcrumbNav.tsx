"use client";

import Link from"next/link";
import { ChevronRight, LayoutDashboard } from"lucide-react";
import { cn } from"@/lib/utils";

export interface BreadcrumbItem {
 label: string;
 href?: string;
}

interface BreadcrumbNavProps {
 items: BreadcrumbItem[];
 className?: string;
}

/**
 * BreadcrumbNav
 *
 * Renders: Dashboard icon > Item 1 > Item 2 > Current Page (bold)
 * - All non-last items with href are clickable links.
 * - Last item is always displayed as non-link (current page).
 * - Dashboard icon always links to /lms/teacher.
 */
export function BreadcrumbNav({ items, className }: BreadcrumbNavProps) {
 return (
 <nav
 aria-label="Breadcrumb"
 className={cn("flex items-center gap-1.5 text-sm flex-wrap", className)}
 >
 <Link
 href="/lms/teacher"
 title="Dashboard giảng viên"
 className="
 text-text-disabled
 hover:text-accent-primary dark:hover:text-accent-secondary
 transition-colors flex-shrink-0
"
 >
 <LayoutDashboard className="w-3.5 h-3.5" />
 </Link>

 {items.map((item, i) => {
 const isLast = i === items.length - 1;
 return (
 <div key={i} className="flex items-center gap-1.5 min-w-0">
 <ChevronRight className="w-3 h-3 text-text-disabled flex-shrink-0" />

 {!isLast && item.href ? (
 <Link
 href={item.href}
 className="
 text-text-muted
 hover:text-accent-primary dark:hover:text-accent-secondary
 hover:underline underline-offset-2
 transition-colors truncate max-w-[140px]
"
 >
 {item.label}
 </Link>
 ) : (
 <span
 className={cn(
"truncate max-w-[200px]",
 isLast
 ?"text-text-heading font-semibold"
 :"text-text-muted"
 )}
 >
 {item.label}
 </span>
 )}
 </div>
 );
 })}
 </nav>
 );
}
