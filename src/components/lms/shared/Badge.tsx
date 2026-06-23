"use client";

import { ReactNode } from"react";
import { cn } from"@/lib/utils";

export type BadgeVariant ="blue"|"green"|"yellow"|"red"|"gray"|"purple";

export function Badge({ children, variant ="gray" }: { children: ReactNode; variant?: BadgeVariant }) {
 const VARIANT_CLS: Record<BadgeVariant, string> = {
 blue:"bg-blue-50 text-accent-primary dark:bg-blue-900/30 dark:text-accent-secondary border border-blue-200/50 dark:border-blue-500/20",
 green:"bg-green-50 text-green-600 dark:bg-green-900/30 dark:text-green-400 border border-green-200/50 dark:border-green-850/30",
 yellow:"bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400 border border-amber-200/50 dark:border-amber-800/30",
 red:"bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-400 border border-red-200/50 dark:border-red-800/30",
 gray:"bg-bg-section text-text-body border border-border-subtle",
 purple:"bg-purple-50 text-accent-tertiary dark:bg-purple-900/30 dark:text-accent-tertiary border border-purple-200/50 dark:border-purple-800/30",
 };
 return (
 <span className={cn("inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold", VARIANT_CLS[variant])}>
 {children}
 </span>
 );
}