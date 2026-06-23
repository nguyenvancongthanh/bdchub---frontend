"use client";

import { useState } from"react";
import { ContentItem, EmptyState, buildFileUrl, formatFileSize, DownloadLink } from"./utils";

interface DocumentRendererProps {
 content: ContentItem;
}

export function DocumentRenderer({ content }: DocumentRendererProps) {
 const [iframeError, setIframeError] = useState(false);

 const filePath = content.metadata?.file_path || content.file_path;
 const docUrl = filePath ? buildFileUrl(filePath) : (content.metadata?.file_url ??"");

 if (!docUrl) return <EmptyState message="Tài liệu chưa được tải lên." />;

 const isPdf = docUrl.toLowerCase().includes(".pdf");
 const isOfficeDoc = /\.(docx|pptx|xlsx|doc|ppt|xls)$/i.test(docUrl);
 const fileName = content.metadata?.file_name || content.title;
 const fileSize = content.metadata?.file_size ? formatFileSize(content.metadata.file_size) : null;
 const downloadUrl = docUrl.replace("/serve/","/download/");

 return (
 <div className="space-y-4">
 {/* File info card */}
 <div className="flex items-center gap-4 p-4 bg-bg-section dark:bg-bg-hover border border-border-input rounded-2xl">
 <div className="w-10 h-10 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800/50 rounded-xl flex items-center justify-center flex-shrink-0 text-lg">
 {isPdf ?"📄" : isOfficeDoc ?"📊" :"📋"}
 </div>
 <div className="flex-1 min-w-0">
 <p className="font-semibold text-text-heading truncate">{fileName}</p>
 {fileSize && <p className="text-xs text-text-muted mt-0.5">{fileSize}</p>}
 </div>
 <div className="flex gap-2 flex-shrink-0">
 <a
 href={docUrl}
 target="_blank"
 rel="noopener noreferrer"
 className="px-3 py-1.5 text-sm font-medium bg-accent-primary hover:bg-accent-primary-hover text-white rounded-lg shadow-sm transition-all active:scale-95"
 >
 Xem
 </a>
 <DownloadLink href={downloadUrl} label="Tải xuống" secondary compact />
 </div>
 </div>

 {/* PDF embed */}
 {isPdf && !iframeError && (
 <div className="border border-border-input rounded-2xl overflow-hidden bg-bg-section">
 <iframe
 src={`${docUrl}#view=FitH`}
 className="w-full h-[600px]"
 title={fileName}
 onError={() => setIframeError(true)}
 />
 </div>
 )}

 {/* Office Document Embed */}
 {isOfficeDoc && !iframeError && (
 <div className="border border-border-input rounded-2xl overflow-hidden bg-bg-section">
 <iframe
 src={`https://view.officeapps.live.com/op/view.aspx?src=${encodeURIComponent(docUrl)}`}
 className="w-full h-[600px]"
 title={fileName}
 frameBorder="0"
 />
 <div className="p-3 bg-bg-root dark:bg-bg-card/50 border-t border-border-input text-[10px] text-text-disabled text-center">
 Bản xem trước được cung cấp bởi Microsoft Office Online. Nếu không hiển thị, vui lòng tải xuống để xem.
 </div>
 </div>
 )}

 {(isPdf || isOfficeDoc) && iframeError && (
 <div className="p-4 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/50 rounded-xl text-sm text-amber-700 dark:text-amber-400">
 Không thể hiển thị tài liệu trực tiếp. Vui lòng tải xuống để xem.
 </div>
 )}
 </div>
 );
}
