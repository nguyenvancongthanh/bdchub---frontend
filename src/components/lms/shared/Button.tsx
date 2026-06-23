"use client";

import { ReactNode } from"react";
import { cn } from"@/lib/utils";
import { Spinner } from"./Spinner";

interface BtnProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
 loading?: boolean;
 icon?: ReactNode;
 size?:"sm" |"md" |"lg";
}

const SIZE_CLS = { sm:"px-3 py-1.5 text-sm", md:"px-5 py-2.5 text-sm", lg:"px-6 py-3 text-base" };

export function PrimaryBtn({ children, loading, icon, size ="md", className, disabled, ...rest }: BtnProps) {
 return (
 <button
 className={cn(
"inline-flex items-center gap-2 font-semibold rounded-xl bg-accent-primary text-white",
"hover:bg-accent-primary-hover active:scale-95 transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed",
 SIZE_CLS[size], className
 )}
 disabled={disabled || loading}
 {...rest}
 >
 {loading ? <Spinner className="w-4 h-4 border-2" /> : icon}
 {children}
 </button>
 );
}

export function SecondaryBtn({ children, loading, icon, size ="md", className, disabled, ...rest }: BtnProps) {
 return (
 <button
 className={cn(
"inline-flex items-center gap-2 font-medium rounded-xl",
"bg-bg-card border border-border-input",
"text-text-body hover:bg-bg-hover hover:border-border-hover",
"active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed",
 SIZE_CLS[size], className
 )}
 disabled={disabled || loading}
 {...rest}
 >
 {loading ? <Spinner className="w-4 h-4 border-2" /> : icon}
 {children}
 </button>
 );
}

export function GhostBtn({ children, loading, icon, size ="md", className, disabled, ...rest }: BtnProps) {
 return (
 <button
 className={cn(
"inline-flex items-center gap-2 font-medium rounded-xl",
"text-text-muted hover:text-text-heading",
"hover:bg-bg-hover active:scale-95 transition-all",
"disabled:opacity-50 disabled:cursor-not-allowed",
 SIZE_CLS[size], className
 )}
 disabled={disabled || loading}
 {...rest}
 >
 {loading ? <Spinner className="w-4 h-4 border-2" /> : icon}
 {children}
 </button>
 );
}