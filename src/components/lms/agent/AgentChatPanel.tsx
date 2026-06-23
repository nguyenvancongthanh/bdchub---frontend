"use client";

/**
 * AgentChatPanel — main chat container for both Mentor and Teacher agents.
 *
 * Layout: full-height flex column with scrollable message area + input bar.
 * Works as a self-contained component that can be embedded in any page.
 */
import { useRef, useEffect, useCallback, useState } from"react";
import { useRouter, usePathname, useSearchParams } from"next/navigation";
import { MessageSquare, Sparkles, Loader2, PanelLeftClose, PanelLeftOpen, Cpu } from"lucide-react";
import { useSession } from"next-auth/react";
import { cn } from"@/lib/utils";
import { useAgentChat } from"@/hooks/useAgentChat";
import { usePageContext } from"@/hooks/usePageContext";
import { AgentMessageBubble } from"./AgentMessageBubble";
import { AgentInputBar } from"./AgentInputBar";
import {
 ConversationSidebar,
 type ConversationSidebarHandle,
} from"./ConversationSidebar";
import { AgentConsoleSidebar } from"./AgentConsoleSidebar";

interface AgentChatPanelProps {
 agentType:"teacher" |"mentor";
 courseId?: number;
 sessionId?: string;
 className?: string;
 defaultSidebarOpen?: boolean;
}

const WELCOME: Record<string, { title: string; subtitle: string; hints: string[] }> = {
 mentor: {
 title:"Virtual Mentor",
 subtitle:"Tôi có thể giúp bạn học tập hiệu quả hơn",
 hints: [
"Giải thích khái niệm OOP",
"Tôi đang yếu phần nào?",
"Cho tôi 1 bài tập nhỏ",
"Lập kế hoạch ôn tập",
 ],
 },
 teacher: {
 title:"Virtual Teaching Assistant",
 subtitle:"Tôi hỗ trợ bạn quản lý nội dung và phân tích học viên",
 hints: [
"Tạo 5 câu hỏi trắc nghiệm",
"Phân tích điểm yếu lớp",
"Đề xuất bài cần ôn lại",
"Index tài liệu mới",
 ],
 },
};

export function AgentChatPanel({
 agentType,
 courseId,
 sessionId: propSessionId,
 className,
 defaultSidebarOpen = true,
}: AgentChatPanelProps) {
 const { data: session } = useSession();
 const userId = session?.user ? Number((session.user as any).id || (session.user as any).userId) : undefined;

 const router = useRouter();
 const pathname = usePathname();
 const searchParams = useSearchParams();

 const sidebarRef = useRef<ConversationSidebarHandle>(null);
 
 const [sidebarOpen, setSidebarOpen] = useState(defaultSidebarOpen);
 const [consoleOpen, setConsoleOpen] = useState(false);
 const [selectedMessageId, setSelectedMessageId] = useState<string | null>(null);

 const handleSessionUpdated = useCallback(
 (update: { sessionId: string; title?: string; reason: string }) => {
 const sidebar = sidebarRef.current;
 if (!sidebar) return;
 if (update.reason ==="title" && update.title) {
 sidebar.patchSession(update.sessionId, { title: update.title });
 } else if (update.reason ==="new" || update.reason ==="reused") {
 sidebar.refresh();
 } else if (update.reason ==="activity") {
 sidebar.touchSession(update.sessionId);
 }
 },
 [],
 );

 const pageContext = usePageContext();

 const {
 messages,
 sessionId,
 isStreaming,
 isLoadingHistory,
 sendMessage,
 stopStreaming,
 startNewChat,
 switchSession,
 deleteSession,
 } = useAgentChat({
 agentType,
 courseId: courseId || (pageContext?.courseId ? Number(pageContext.courseId) : undefined),
 initialSessionId: propSessionId,
 userId,
 pageContext: pageContext || undefined,
 onSessionUpdated: handleSessionUpdated,
 });

 const lastAssistantMsg = [...messages].reverse().find((m) => m.role ==="assistant") || null;

 // Reset selected message log when session ID changes
 useEffect(() => {
 setSelectedMessageId(null);
 }, [sessionId]);

 const activeLogMessage = selectedMessageId
 ? (messages.find((m) => m.id === selectedMessageId) || null)
 : lastAssistantMsg;

 // Sync state sessionId back to URL query parameters
 useEffect(() => {
 const current = new URLSearchParams(Array.from(searchParams.entries()));
 const urlSessionId = current.get("sessionId");
 
 if (sessionId) {
 if (urlSessionId !== sessionId) {
 current.set("sessionId", sessionId);
 router.replace(`${pathname}?${current.toString()}`);
 }
 } else if (urlSessionId) {
 current.delete("sessionId");
 router.replace(`${pathname}?${current.toString()}`);
 }
 }, [sessionId, router, pathname, searchParams]);

 const scrollRef = useRef<HTMLDivElement>(null);
 const welcome = WELCOME[agentType];

 // Auto-scroll to bottom on new messages
 useEffect(() => {
 const el = scrollRef.current;
 if (el) {
 el.scrollTo({ top: el.scrollHeight, behavior:"smooth" });
 }
 }, [messages]);

 const isEmpty = messages.length === 0;

 return (
 <div
 className={cn(
"flex h-full w-full relative",
"bg-bg-root",
"rounded-2xl border border-border-subtle",
"overflow-hidden",
 className,
 )}
 >
 {/* Mobile Sidebar Backdrop */}
 {userId && sidebarOpen && (
 <div
 onClick={() => setSidebarOpen(false)}
 className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden animate-in fade-in duration-200"
 />
 )}

 {/* Sidebar for chat history */}
 {userId && (
 <ConversationSidebar 
 ref={sidebarRef}
 userId={userId} 
 agentType={agentType} 
 activeSessionId={sessionId}
 onSelectSession={(sid) => {
 switchSession(sid);
 if (typeof window !=="undefined" && window.innerWidth < 1024) {
 setSidebarOpen(false);
 }
 }}
 onNewSession={() => {
 startNewChat();
 if (typeof window !=="undefined" && window.innerWidth < 1024) {
 setSidebarOpen(false);
 }
 }}
 onDeleteSession={deleteSession}
 onCloseMobile={() => setSidebarOpen(false)}
 className={cn(
"fixed inset-y-0 left-0 z-50 w-[260px] transition-all duration-300 ease-in-out lg:relative lg:z-0 lg:border-r",
 sidebarOpen 
 ?"translate-x-0 lg:w-1/5 lg:min-w-[220px] lg:max-w-[260px] lg:opacity-100" 
 :"-translate-x-full lg:w-0 lg:opacity-0 lg:pointer-events-none lg:border-none",
 )}
 />
 )}

 {/* Main Chat Area */}
 <div className="flex-1 flex flex-col h-full bg-bg-card dark:bg-bg-root overflow-hidden">
 {/* Header */}
 <div
 className={cn(
"flex items-center gap-3 px-5 py-4",
"border-b border-border-subtle",
"bg-bg-card",
 )}
 >
 {userId && (
 <button
 onClick={() => setSidebarOpen(!sidebarOpen)}
 className="p-1.5 rounded-lg text-text-muted hover:bg-bg-hover transition-colors active:scale-95 flex-shrink-0"
 title={sidebarOpen ?"Thu gọn thanh bên" :"Mở rộng thanh bên"}
 >
 {sidebarOpen ? <PanelLeftClose className="w-5.5 h-5.5" /> : <PanelLeftOpen className="w-5.5 h-5.5" />}
 </button>
 )}
 
 <div className="w-9 h-9 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center flex-shrink-0">
 <Sparkles className="w-4.5 h-4.5 text-accent-primary dark:text-accent-secondary" />
 </div>
 <div>
 <h3 className="text-sm font-bold text-text-heading">
 {welcome.title}
 </h3>
 <p className="text-xs text-text-muted dark:text-text-muted">
 Powered by AI
 </p>
 </div>

 <button
 onClick={() => setConsoleOpen(!consoleOpen)}
 className={cn(
"ml-auto p-1.5 rounded-lg border transition-all duration-200 active:scale-95 flex-shrink-0 flex items-center gap-1.5 text-xs font-semibold",
 consoleOpen
 ?"text-blue-600 bg-blue-50 border-blue-200 dark:text-blue-400 dark:bg-blue-950/40 dark:border-blue-900"
 :"text-text-muted border-border-subtle dark:text-text-disabled dark:border-border-subtle hover:bg-bg-section dark:hover:bg-bg-root"
 )}
 title={consoleOpen ?"Ẩn Console" :"Hiện Console Debugger"}
 >
 <Cpu className="w-4 h-4" />
 <span className="hidden sm:inline">Console</span>
 </button>
 </div>

 {/* Messages area */}
 <div
 ref={scrollRef}
 className="flex-1 overflow-y-auto px-4 py-6 scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-800"
 >
 <div className="max-w-4xl mx-auto w-full px-2 sm:px-4 md:px-6 space-y-5">
 {isEmpty ? (
 /* Empty state — welcome + hint chips */
 <div className="flex flex-col items-center justify-center text-center space-y-6 py-16">
 <div className="w-16 h-16 rounded-2xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center shadow-lg shadow-blue-500/10 animate-in fade-in zoom-in-75 duration-300">
 <MessageSquare className="w-8 h-8 text-accent-primary dark:text-accent-secondary" />
 </div>
 <div className="space-y-2">
 <h2 className="text-xl font-bold text-text-heading">
 {welcome.title}
 </h2>
 <p className="text-sm text-text-muted max-w-sm">
 {welcome.subtitle}
 </p>
 </div>

 <div className="flex flex-wrap gap-2 justify-center max-w-md">
 {welcome.hints.map((hint) => (
 <button
 key={hint}
 onClick={() => sendMessage(hint)}
 className={cn(
"px-4 py-2 rounded-xl text-sm font-medium",
"bg-bg-card",
"border border-border-subtle",
"text-text-muted",
"hover:bg-blue-50 dark:hover:bg-bg-hover/80",
"hover:border-border-hover",
"hover:text-blue-700 dark:hover:text-blue-400",
"transition-all duration-200 active:scale-95",
"shadow-sm",
 )}
 >
 {hint}
 </button>
 ))}
 </div>
 </div>
 ) : (
 <div className="space-y-5">
 {messages.map((msg) => (
 <AgentMessageBubble
 key={msg.id}
 message={msg}
 onClarificationSelect={(option) => sendMessage(option)}
 isSelectedForLogs={activeLogMessage?.id === msg.id}
 onSelectForLogs={() => {
 setSelectedMessageId(msg.id);
 setConsoleOpen(true);
 }}
 />
 ))}
 </div>
 )}
 
 {isLoadingHistory && (
 <div className="flex justify-center items-center py-6">
 <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
 <span className="ml-2.5 text-sm text-text-muted">Đang tải lịch sử...</span>
 </div>
 )}
 </div>
 </div>

 {/* Input bar wrapper */}
 <div className="border-t border-border-subtle bg-bg-card">
 <div className="max-w-4xl mx-auto w-full">
 <AgentInputBar
 onSend={sendMessage}
 isStreaming={isStreaming || isLoadingHistory}
 onStop={stopStreaming}
 className="border-t-0 px-4 sm:px-6 py-4"
 placeholder={
 agentType ==="mentor"
 ?"Hỏi Mentor về bài học..."
 :"Nhờ TA hỗ trợ quản lý khóa học..."
 }
 />
 </div>
 </div>
 </div>
 
 {/* Right Sidebar Console */}
 <AgentConsoleSidebar
 isOpen={consoleOpen}
 onClose={() => setConsoleOpen(false)}
 activeMessage={activeLogMessage}
 />
 </div>
 );
}
