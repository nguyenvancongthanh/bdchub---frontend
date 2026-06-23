"use client";

import { cn } from"@/lib/utils";

export function Card({ children, className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
 return (
 <div
 className={cn(
"bg-bg-card rounded-2xl border border-border-subtle shadow-sm",
 className
 )}
 {...props}
 >
 {children}
 </div>
 );
}