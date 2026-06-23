"use client";

import { useEffect, useState } from"react";
import { X, FileText, Play, DollarSign, Loader } from"lucide-react";
import lmsService from"@/services/lmsService";
import { cn } from"@/lib/utils";

interface Content {
 id: number;
 type:"TEXT" |"VIDEO" |"DOCUMENT" |"IMAGE" |"QUIZ" |"FORUM" |"ANNOUNCEMENT";
 title: string;
 description?: string;
 metadata?: Record<string, any>;
}

interface Section {
 id: number;
 title: string;
 description?: string;
}

interface Props {
 courseId: number;
 onSelect: (contentId: number, fileUrl?: string) => void;
 onClose: () => void;
 isLoading?: boolean;
}

const contentIcons = {
 TEXT: <FileText className="w-4 h-4" />,
 VIDEO: <Play className="w-4 h-4" />,
 DOCUMENT: <FileText className="w-4 h-4" />,
 IMAGE: <FileText className="w-4 h-4" />,
 QUIZ: <DollarSign className="w-4 h-4" />,
 FORUM: <FileText className="w-4 h-4" />,
 ANNOUNCEMENT: <FileText className="w-4 h-4" />,
};

export function ContentPickerModal({
 courseId,
 onSelect,
 onClose,
 isLoading = false,
}: Props) {
 const [sections, setSections] = useState<Section[]>([]);
 const [contentBySection, setContentBySection] = useState<Map<number, Content[]>>(new Map());
 const [loading, setLoading] = useState(true);
 const [error, setError] = useState("");

 useEffect(() => {
 const loadContent = async () => {
 try {
 setLoading(true);
 setError("");
 
 // Get sections
 const sectionsResponse = await lmsService.listSections(courseId);
 const sectionsList = sectionsResponse?.data || [];
 setSections(sectionsList);

 // Get content for each section
 const contentMap = new Map<number, Content[]>();
 for (const section of sectionsList) {
 const contentResponse = await lmsService.listContent(section.id);
 const contentList = contentResponse?.data || [];
 contentMap.set(section.id, contentList);
 }
 setContentBySection(contentMap);
 } catch (e: any) {
 setError(e?.response?.data?.error ??"Không thể tải nội dung");
 } finally {
 setLoading(false);
 }
 };

 loadContent();
 }, [courseId]);

 const handleSelectContent = (content: Content) => {
 // Extract file URL from metadata if available
 const fileUrl = content.metadata?.file_path || content.metadata?.url;
 onSelect(content.id, fileUrl);
 };

 return (
 <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
 <div className="bg-bg-card rounded-lg shadow-lg w-96 max-h-96 overflow-hidden flex flex-col">
 {/* Header */}
 <div className="flex items-center justify-between p-4 border-b border-border-subtle">
 <h3 className="font-semibold text-text-heading">
 Chọn nội dung để liên kết
 </h3>
 <button
 onClick={onClose}
 className="text-text-disabled hover:text-text-muted dark:hover:text-text-disabled"
 >
 <X className="w-5 h-5" />
 </button>
 </div>

 {/* Content */}
 <div className="overflow-y-auto flex-1">
 {loading ? (
 <div className="flex items-center justify-center h-48 text-text-disabled">
 <Loader className="w-5 h-5 animate-spin mr-2" />
 Đang tải nội dung...
 </div>
 ) : error ? (
 <div className="p-4 text-sm text-red-600 dark:text-red-400">
 {error}
 </div>
 ) : sections.length === 0 ? (
 <div className="p-4 text-center text-text-disabled">
 <p>Chưa có section nào</p>
 </div>
 ) : (
 <div className="space-y-1">
 {sections.map(section => {
 const sectionContent = contentBySection.get(section.id) || [];
 return (
 <div key={section.id}>
 {/* Section header */}
 <div className="px-4 py-2 bg-bg-section sticky top-0">
 <p className="text-xs font-semibold text-text-body uppercase">
 {section.title}
 </p>
 </div>

 {/* Content items */}
 {sectionContent.length === 0 ? (
 <div className="px-4 py-2 text-xs text-text-disabled">
 Không có nội dung
 </div>
 ) : (
 sectionContent.map(content => (
 <button
 key={content.id}
 onClick={() => handleSelectContent(content)}
 disabled={isLoading}
 className={cn(
"w-full text-left px-4 py-2 flex items-start gap-2 hover:bg-bg-hover transition-colors disabled:opacity-50",
 content.type !=="DOCUMENT" && content.type !=="VIDEO" &&"opacity-50 cursor-not-allowed"
 )}
 title={content.type !=="DOCUMENT" && content.type !=="VIDEO" ?"Chỉ liên kết DOCUMENT hoặc VIDEO" :""}
 >
 <span className="text-blue-500 flex-shrink-0 mt-0.5">
 {contentIcons[content.type]}
 </span>
 <div className="flex-1 min-w-0">
 <p className="text-sm text-text-heading font-medium truncate">
 {content.title}
 </p>
 <p className="text-xs text-text-muted">
 {content.type}
 </p>
 </div>
 </button>
 ))
 )}
 </div>
 );
 })}
 </div>
 )}
 </div>

 {/* Footer hint */}
 <div className="border-t border-border-subtle p-3 bg-bg-section dark:bg-bg-hover">
 <p className="text-xs text-text-muted">
 ℹ️ Chỉ hỗ trợ liên kết DOCUMENT hoặc VIDEO
 </p>
 </div>
 </div>
 </div>
 );
}
