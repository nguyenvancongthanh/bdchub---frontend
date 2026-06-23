"use client";

import dynamic from"next/dynamic";
import { ContentItem } from"./utils";

const MarkdownRenderer = dynamic(
 () => import("@/components/markdown/MarkdownRenderer"),
 { ssr: false, loading: () => <div className="h-32 bg-bg-section rounded-xl animate-pulse" /> },
);

interface AnnouncementRendererProps {
 content: ContentItem;
}

export function AnnouncementRenderer({ content }: AnnouncementRendererProps) {
 return (
 <div className="bg-bg-card border border-border-subtle rounded-2xl p-5 shadow-sm">
 <div className="flex items-center gap-2 mb-3">
 <span className="text-lg">📢</span>
 <h3 className="font-semibold text-text-heading">Thông báo</h3>
 </div>
 {content.description && (
 <p className="text-text-muted text-sm mb-4">{content.description}</p>
 )}
 {content.metadata?.content && (
 <div className="pt-4 border-t border-border-subtle">
 <MarkdownRenderer content={content.metadata.content} />
 </div>
 )}
 </div>
 );
}
