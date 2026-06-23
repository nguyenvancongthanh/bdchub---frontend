"use client";

/**
 * Student Course Detail Layout
 * Route: /lms/student/courses/[courseId]
 *
 * Provides:
 * - Sticky header with course title + tab switcher (Học tập / Thống kê)
 * - Desktop sidebar (sections / progress)
 * - Mobile sidebar drawer
 * - StudentCourseContext for child pages
 */

import { useEffect, useState, useCallback, useMemo, useRef, Suspense } from"react";
import { useParams, useRouter, usePathname, useSearchParams } from"next/navigation";
import Link from"next/link";
import {
 ChevronDown, ChevronRight, Menu, X,
 Play, FileText, Image as ImageIcon, HelpCircle,
 MessageSquare, Megaphone, File as FileIcon, BookOpen,
 BarChart3, CheckCircle2,
} from"lucide-react";

import lmsService from"@/services/lmsService";
import progressService, { CourseProgress, ProgressDetailItem } from"@/services/progressService";
import { useSession } from"next-auth/react";

import { ProgressBar, PageLoader } from"@/components/lms/shared";
import { BreadcrumbNav, type BreadcrumbItem } from"@/components/lms/BreadcrumbNav";
import { StudentCourseContext } from"@/components/lms/student/StudentCourseContext";
import { Content, Course, Section } from"@/types";
import { cn } from"@/lib/utils";
import { useSetPageContext } from"@/hooks/usePageContext";

// ─── Content type icon map & styles ──────────────────────────────────────────

const CONTENT_TYPE_STYLE: Record<string, { bg: string; text: string; icon: React.ReactNode }> = {
 VIDEO: {
 bg:"bg-blue-50 dark:bg-blue-900/30",
 text:"text-accent-primary dark:text-accent-secondary",
 icon: <Play className="w-3.5 h-3.5 fill-current" />,
 },
 DOCUMENT: {
 bg:"bg-green-50 dark:bg-green-900/30",
 text:"text-green-600 dark:text-green-400",
 icon: <FileText className="w-3.5 h-3.5" />,
 },
 IMAGE: {
 bg:"bg-teal-50 dark:bg-teal-900/30",
 text:"text-teal-600 dark:text-teal-400",
 icon: <ImageIcon className="w-3.5 h-3.5" />,
 },
 TEXT: {
 bg:"bg-amber-50 dark:bg-amber-900/30",
 text:"text-amber-600 dark:text-amber-400",
 icon: <FileText className="w-3.5 h-3.5" />,
 },
 QUIZ: {
 bg:"bg-violet-50 dark:bg-violet-900/30",
 text:"text-accent-tertiary",
 icon: <HelpCircle className="w-3.5 h-3.5" />,
 },
 FORUM: {
 bg:"bg-sky-50 dark:bg-sky-900/30",
 text:"text-sky-600 dark:text-sky-400",
 icon: <MessageSquare className="w-3.5 h-3.5" />,
 },
 ANNOUNCEMENT: {
 bg:"bg-rose-50 dark:bg-rose-900/30",
 text:"text-rose-600 dark:text-rose-400",
 icon: <Megaphone className="w-3.5 h-3.5" />,
 },
};

// ─── Tab definitions ──────────────────────────────────────────────────────────

const TABS = [
 { id:"learn", label:"Học tập", path:"/learn", icon: null },
 { id:"stats", label:"Thống kê", path:"/stats", icon: <BarChart3 className="w-3.5 h-3.5" /> },
];

// ─────────────────────────────────────────────────────────────────────────────
// SIDEBAR SECTION
// ─────────────────────────────────────────────────────────────────────────────

interface SidebarSectionProps {
 section: Section;
 index: number;
 contents: Content[];
 loading: boolean;
 isExpanded: boolean;
 onToggle: () => void;
 activeContentId: number | null;
 onSelect: (c: Content) => void;
 completedIds: Set<number>;
}

function SidebarSection({
 section, index, contents, loading,
 isExpanded, onToggle, activeContentId, onSelect,
 completedIds,
}: SidebarSectionProps) {
 const mandatoryCount = contents.filter(c => c.is_mandatory).length;
 const completedMandatory = contents.filter(c => c.is_mandatory && completedIds.has(c.id)).length;

 return (
 <div className="border-b border-border-section last:border-b-0 transition-all duration-300">
 {/* Section header */}
 <button
 className={cn(
"w-full flex items-center gap-3 px-4 py-3.5 text-left transition-colors duration-200 border-l-2",
 isExpanded
 ?"bg-bg-hover border-accent-primary"
 :"hover:bg-bg-hover border-transparent"
 )}
 onClick={onToggle}
 >
 <div className={cn(
"w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-extrabold flex-shrink-0 border transition-all duration-300 shadow-xs",
 isExpanded
 ?"bg-accent-primary border-accent-primary text-white"
 :"bg-bg-section border-border-subtle text-text-body"
 )}>
 {index + 1}
 </div>
 <div className="flex-1 min-w-0">
 <p className={cn(
"text-sm font-semibold truncate transition-colors duration-200",
 isExpanded ?"text-accent-primary dark:text-accent-secondary" :"text-text-subheading"
 )}>
 {section.title}
 </p>
 {contents.length > 0 && (
 <p className="text-[11px] text-text-muted mt-0.5 font-medium flex items-center gap-1.5">
 <span className="inline-block w-1 h-1 rounded-full bg-text-disabled" />
 {mandatoryCount > 0
 ? `${completedMandatory}/${mandatoryCount} bài bắt buộc`
 : `${contents.length} tài liệu`}
 </p>
 )}
 </div>
 <ChevronDown className={cn(
"w-4 h-4 text-text-disabled flex-shrink-0 transition-transform duration-300",
 isExpanded ?"transform rotate-0 text-accent-primary dark:text-accent-secondary" :"transform -rotate-90"
 )} />
 </button>

 {/* Content items */}
 {isExpanded && (
 <div className="pb-2 px-2 pt-1 space-y-1">
 {loading && !contents.length ? (
 <div className="px-3 py-2 space-y-2">
 {[0, 1, 2].map(i => (
 <div key={i} className="h-8 bg-bg-section rounded-lg animate-pulse" />
 ))}
 </div>
 ) : contents.length === 0 ? (
 <p className="px-3 py-2 text-xs text-text-muted">Chưa có nội dung</p>
 ) : (
 contents.map((c, i) => {
 const isActive = c.id === activeContentId;
 const isDone = completedIds.has(c.id);
 const style = CONTENT_TYPE_STYLE[c.type] || {
 bg:"bg-bg-section",
 text:"text-text-muted",
 icon: <FileIcon className="w-3.5 h-3.5" />,
 };

 return (
 <button
 key={c.id}
 className={cn(
"w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left transition-all duration-200 group active:scale-[0.98] border-l-4",
 isActive
 ?"bg-blue-50/80 dark:bg-blue-900/30 border-accent-primary text-accent-primary dark:text-accent-secondary font-semibold shadow-xs"
 :"text-text-muted hover:bg-bg-hover hover:text-text-heading hover:translate-x-1 border-transparent"
 )}
 onClick={() => onSelect(c)}
 >
 {/* Content type icon container */}
 <span className={cn(
"w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors duration-200",
 isActive
 ?"bg-accent-primary text-white"
 : cn(style.bg, style.text)
 )}>
 {style.icon}
 </span>

 {/* Title */}
 <span className={cn(
"text-[13px] flex-1 truncate font-medium",
 isActive
 ?"text-accent-primary dark:text-accent-secondary"
 :"text-text-body"
 )}>
 {i + 1}. {c.title}
 </span>

 {/* Status dot / Checkmark */}
 <span className="flex-shrink-0 w-4 flex items-center justify-center">
 {isDone ? (
 <CheckCircle2 className="w-4 h-4 text-emerald-500 fill-emerald-500/10" />
 ) : c.is_mandatory ? (
 <span className="w-1.5 h-1.5 rounded-full bg-orange-400" title="Bắt buộc" />
 ) : null}
 </span>
 </button>
 );
 })
 )}
 </div>
 )}
 </div>
 );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN LAYOUT
// ─────────────────────────────────────────────────────────────────────────────

function StudentCourseDetailLayoutInner({ children }: { children: React.ReactNode }) {
 const { courseId } = useParams<{ courseId: string }>();
 const router = useRouter();
 const pathname = usePathname();
 const searchParams = useSearchParams();
 const id = Number(courseId);

 // Track whether we've already restored from URL param
 const restoredFromUrl = useRef(false);
 const initialContentId = useRef<number | null>(
 searchParams.get("contentId") ? Number(searchParams.get("contentId")) : null
 );
 const basePath = `/lms/student/courses/${id}`;

 // ── Core state ──
 const [course, setCourse] = useState<Course | null>(null);
 const [sections, setSections] = useState<Section[]>([]);
 const [coTeachers, setCoTeachers] = useState<any[]>([]);
 
 const { data: session } = useSession();
 const userId = session?.user ? Number((session.user as any).id || (session.user as any).userId) : undefined;
 const [userRoles, setUserRoles] = useState<string[]>([]);

 useEffect(() => {
 lmsService.getMyRoles().then(roles => setUserRoles(roles || [])).catch(() => {});
 }, []);

 const isCourseTeacher = useMemo(() => {
 if (!userId || !course) return false;
 const isCreator = course.created_by === userId;
 const isCo = coTeachers.some(ct => ct.user_id === userId);
 const isAdmin = userRoles.includes("ADMIN");
 return isCreator || isCo || isAdmin;
 }, [userId, course, coTeachers, userRoles]);
 const [sectionContents, setSectionContents] = useState<Record<number, Content[]>>({});
 const [loadingSection, setLoadingSection] = useState<Record<number, boolean>>({});
 const [expanded, setExpanded] = useState<Set<number>>(new Set());
 const [activeContent, setActiveContent] = useState<Content | null>(null);
 const [loadingPage, setLoadingPage] = useState(true);
 const [sidebarOpen, setSidebarOpen] = useState(false);

 // ── Progress state ──
 const [progress, setProgress] = useState<CourseProgress | null>(null);
 const [completedIds, setCompletedIds] = useState<Set<number>>(new Set());
 const [progressDetail, setProgressDetail] = useState<ProgressDetailItem[]>([]);
 const [markingComplete, setMarkingComplete] = useState(false);

 // ─── Load progress ────────────────────────────────────────────────────────

 const loadProgress = useCallback(async () => {
 try {
 const [prog, detail] = await Promise.all([
 progressService.getMyCourseProgress(id),
 progressService.getMyCourseProgressDetail(id),
 ]);
 if (prog) {
 setProgress(prog);
 setCompletedIds(new Set(prog.completed_content_ids ?? []));
 }
 setProgressDetail(detail ?? []);
 } catch {
 // Progress API may not be available yet — degrade gracefully
 }
 }, [id]);

 // ─── Load course + sections ───────────────────────────────────────────────

 useEffect(() => {
 (async () => {
 try {
 const [courseRes, sectionsRes, coTeachersRes] = await Promise.all([
 lmsService.getCourse(id),
 lmsService.listSections(id),
 lmsService.getCoTeachers(id).catch(() => []),
 ]);
 setCourse(courseRes?.data ?? null);
 setCoTeachers(coTeachersRes ?? []);
 const secs: Section[] = sectionsRes?.data ?? [];
 setSections(secs);

 if (secs.length > 0) {
 const allIds = secs.map(s => s.id);
 setExpanded(new Set(allIds));
 // Prefetch all contents (parallel, will be cached by loadSectionContentsInner)
 allIds.forEach(sid => loadSectionContentsInner(sid));

 // Only auto-select first content if there's no contentId to restore from URL
 if (!initialContentId.current) {
 loadSectionContentsInner(secs[0].id, true);
 }
 }
 } catch {
 router.back();
 } finally {
 setLoadingPage(false);
 }
 })();
 loadProgress();
 }, [id]); // eslint-disable-line

 // ─── Restore content from URL param ────────────────────────────────────────
 // Once all section contents are fetched, find the content matching the URL param
 useEffect(() => {
 if (restoredFromUrl.current || !initialContentId.current) return;
 const targetId = initialContentId.current;
 // Search across all fetched section contents
 for (const items of Object.values(sectionContents)) {
 const found = items.find(c => c.id === targetId);
 if (found) {
 setActiveContent(found);
 restoredFromUrl.current = true;
 return;
 }
 }
 }, [sectionContents]); // eslint-disable-line

 // ─── Load section contents ────────────────────────────────────────────────

 const loadSectionContentsInner = useCallback(async (sectionId: number, autoSelect = false) => {
 if (sectionContents[sectionId]) {
 if (autoSelect && !activeContent) {
 const first = sectionContents[sectionId][0];
 if (first) setActiveContent(first);
 }
 return;
 }
 setLoadingSection(prev => ({ ...prev, [sectionId]: true }));
 try {
 const res = await lmsService.listContent(sectionId);
 const items: Content[] = res?.data ?? [];
 setSectionContents(prev => ({ ...prev, [sectionId]: items }));
 if (autoSelect && !activeContent && items.length > 0) {
 setActiveContent(items[0]);
 }
 } finally {
 setLoadingSection(prev => ({ ...prev, [sectionId]: false }));
 }
 }, [sectionContents, activeContent]);

 const loadSectionContents = useCallback((sectionId: number, autoSelect = false) => {
 loadSectionContentsInner(sectionId, autoSelect);
 }, [loadSectionContentsInner]);

 const toggleSection = useCallback((sectionId: number) => {
 setExpanded(prev => {
 const next = new Set(prev);
 if (next.has(sectionId)) {
 next.delete(sectionId);
 } else {
 next.add(sectionId);
 loadSectionContentsInner(sectionId);
 }
 return next;
 });
 }, [loadSectionContentsInner]);

 // ─── Mark content complete ────────────────────────────────────────────────

 const handleMarkComplete = useCallback(async (contentId: number) => {
 if (completedIds.has(contentId) || markingComplete) return;
 setMarkingComplete(true);
 try {
 await progressService.markContentComplete(contentId);
 setCompletedIds(prev => new Set([...prev, contentId]));
 await loadProgress();
 } catch {
 // fail silently; will retry on next interaction
 } finally {
 setMarkingComplete(false);
 }
 }, [completedIds, markingComplete, loadProgress]);

 // ─── Select content (navigate to learn page) ─────────────────────────────

 const handleSelectContent = useCallback((c: Content) => {
 setActiveContent(c);
 setSidebarOpen(false);
 // Update URL search param to persist the active content
 const target = `${basePath}/learn?contentId=${c.id}`;
 if (!pathname.endsWith("/learn")) {
 router.push(target);
 } else {
 // Replace (not push) to avoid polluting browser history on every content switch
 router.replace(target, { scroll: false });
 }
 }, [pathname, basePath, router]);

 // ─── Derived progress numbers ─────────────────────────────────────────────

 const totalMandatory = progress?.total_mandatory
 ?? Object.values(sectionContents).flat().filter(c => c.is_mandatory).length;
 const completedCount = progress?.completed_count ?? completedIds.size;
 const progressPct = totalMandatory > 0 ? Math.round((completedCount / totalMandatory) * 100) : 0;

 // ─── Active tab ───────────────────────────────────────────────────────────
 const activeTab = TABS.find(tab => pathname.includes(tab.path)) || TABS[0];
 const activeTabId = activeTab.id;

 // ─── Breadcrumb items ─────────────────────────────────────────────────────
 const breadcrumbItems: BreadcrumbItem[] = [
 { label:"Học tập", href:"/lms/student" },
 {
 label: loadingPage ?"..." : (course?.title ??"Khóa học"),
 href: `${basePath}/learn`,
 },
 ...(activeTabId !=="learn" ? [{ label: activeTab.label }] : []),
 ];

 // ─── Context value ────────────────────────────────────────────────────────

 const contextValue = useMemo(() => ({
 course,
 sections,
 courseId: id,
 coTeachers,
 activeContent,
 setActiveContent: handleSelectContent,
 sectionContents,
 loadSectionContents,
 loadingSection,
 expanded,
 toggleSection,
 sidebarOpen,
 setSidebarOpen,
 completedIds,
 handleMarkComplete,
 markingComplete,
 progress,
 progressDetail,
 loadProgress,
 }), [
 course, sections, id, coTeachers,
 activeContent, handleSelectContent,
 sectionContents, loadSectionContents, loadingSection,
 expanded, toggleSection,
 sidebarOpen,
 completedIds, handleMarkComplete, markingComplete,
 progress, progressDetail, loadProgress,
 ]);

 // ── Push page context for AI sidebar ───────────────────────────────────────

 const { setPageContext, clearPageContext } = useSetPageContext();

 useEffect(() => {
 if (!course) return;
 setPageContext({
 pageType: activeContent ?"lesson" :"course_detail",
 courseId: id,
 courseName: course.title,
 contentId: activeContent?.id,
 contentTitle: activeContent?.title,
 });
 return () => clearPageContext();
 }, [course, activeContent, id, setPageContext, clearPageContext]);

 if (loadingPage) return <PageLoader message="Đang tải khóa học..." />;

 // ─── Sidebar JSX ──────────────────────────────────────────────────────────

 const SidebarContent = (
 <div className="h-full flex flex-col">
 {/* Progress header */}
 <div className="px-5 py-5 border-b border-border-subtle bg-bg-section">
 <div className="flex justify-between items-center mb-2">
 <p className="text-xs font-bold text-text-disabled uppercase tracking-wider">
 Tiến độ học tập
 </p>
 <span className="text-[10px] font-extrabold text-accent-primary dark:text-accent-secondary bg-blue-50 dark:bg-blue-900/30 px-2 py-0.5 rounded-full">
 {progressPct}%
 </span>
 </div>
 <ProgressBar
 value={completedCount}
 max={totalMandatory || 1}
 color="blue"
 showPercent={false}
 className="h-2 rounded-full overflow-hidden mb-2"
 />
 <p className="text-[11px] font-medium text-text-muted">
 Đã hoàn thành <span className="font-bold text-text-body">{completedCount}</span> trên <span className="font-bold text-text-body">{totalMandatory}</span> bài bắt buộc
 </p>

 {/* Giảng viên & Trợ giảng */}
 <div className="mt-3 pt-3 border-t border-border-subtle flex flex-col gap-1.5">
 <p className="text-[10px] font-bold text-text-disabled uppercase tracking-wider">
 Giảng viên phụ trách
 </p>
 <div className="flex flex-col gap-1">
 <div className="flex items-center gap-1.5">
 <span className="w-1.5 h-1.5 rounded-full bg-accent-primary" />
 <span className="text-xs font-bold text-text-body">
 {course?.teacher_name ||"Giáo viên"}
 </span>
 </div>
 {coTeachers.map((ct: any) => (
 <div key={ct.id} className="flex items-center gap-1.5 pl-3 group relative cursor-help" title={ct.email}>
 <span className="w-1 h-1 rounded-full bg-text-disabled" />
 <span className="text-[11px] font-medium text-text-muted hover:text-accent-primary dark:hover:text-accent-secondary transition-colors">
 {ct.full_name}
 </span>
 </div>
 ))}
 </div>
 </div>
 </div>

 {/* Section list */}
 <div className="flex-1 overflow-y-auto">
 {sections.length === 0 ? (
 <div className="px-4 py-8 text-center">
 <BookOpen className="w-8 h-8 text-text-disabled mx-auto mb-2" />
 <p className="text-sm text-text-muted">Khóa học chưa có nội dung</p>
 </div>
 ) : (
 sections.map((sec, i) => (
 <SidebarSection
 key={sec.id}
 section={sec}
 index={i}
 contents={sectionContents[sec.id] ?? []}
 loading={!!loadingSection[sec.id]}
 isExpanded={expanded.has(sec.id)}
 onToggle={() => toggleSection(sec.id)}
 activeContentId={activeContent?.id ?? null}
 onSelect={handleSelectContent}
 completedIds={completedIds}
 />
 ))
 )}
 </div>
 </div>
 );

 // ─────────────────────────────────────────────────────────────────────────
 // RENDER
 // ─────────────────────────────────────────────────────────────────────────

 return (
 <StudentCourseContext.Provider value={contextValue}>
 <div className="min-h-screen bg-bg-root flex flex-col">

 {/* ── Header ── */}
 <header className="sticky top-0 z-30 bg-bg-shell border-b border-border-subtle shadow-sm">
 <div className="max-w-screen-2xl mx-auto px-4 h-14 flex items-center gap-3">
 <BreadcrumbNav items={breadcrumbItems} className="flex-1 min-w-0" />

 {isCourseTeacher && (
 <Link
 href={`/lms/teacher/courses/${id}/overview`}
 className="
 flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold
 bg-accent-primary hover:bg-accent-primary-hover
 text-white rounded-xl shadow-xs hover:shadow-md
 active:scale-95 transition-all duration-200
"
 >
 ⚙️ Quản lý
 </Link>
 )}

 {/* Tab switcher pill */}
 <div className="hidden sm:flex items-center gap-1.5 bg-bg-section border border-border-subtle rounded-xl p-1 flex-shrink-0 shadow-inner">
 {TABS.map(tab => {
 const isActive = activeTabId === tab.id;
 return (
 <Link
 key={tab.id}
 href={`${basePath}${tab.path}`}
 className={cn(
"flex items-center gap-2 px-4 py-1.5 text-xs font-bold rounded-lg transition-all duration-200 active:scale-95",
 isActive
 ?"bg-bg-card text-accent-primary dark:text-accent-secondary shadow-sm border border-border-subtle"
 :"text-text-muted hover:text-text-heading"
 )}
 >
 {tab.icon}
 {tab.label}
 </Link>
 );
 })}
 </div>

 {/* Mobile: sidebar toggle */}
 <button
 className="lg:hidden p-2 rounded-lg hover:bg-bg-hover text-text-muted"
 onClick={() => setSidebarOpen(true)}
 >
 <Menu className="w-5 h-5" />
 </button>
 </div>

 {/* Mobile tab bar */}
 <div className="sm:hidden flex items-center gap-1 px-4 pb-2">
 {TABS.map(tab => (
 <Link
 key={tab.id}
 href={`${basePath}${tab.path}`}
 className={cn(
"flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors",
 activeTabId === tab.id
 ?"bg-blue-50 dark:bg-blue-900/30 text-accent-primary dark:text-accent-secondary"
 :"text-text-muted"
 )}
 >
 {tab.icon}
 {tab.label}
 </Link>
 ))}
 </div>
 </header>

 {/* ── Body ── */}
 <div className="flex-1 max-w-screen-2xl mx-auto w-full flex overflow-hidden">

 {/* Desktop sidebar */}
 <aside className="hidden lg:flex flex-col w-72 xl:w-80 border-r border-border-subtle bg-bg-shell flex-shrink-0 sticky top-14 h-[calc(100vh-3.5rem)] overflow-hidden">
 {SidebarContent}
 </aside>

 {/* Mobile sidebar drawer */}
 {sidebarOpen && (
 <div className="lg:hidden fixed inset-0 z-40 flex">
 <div className="absolute inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
 <aside className="relative w-80 max-w-[85vw] bg-bg-shell h-full overflow-hidden flex flex-col">
 <div className="flex items-center justify-between px-4 py-3 border-b border-border-subtle">
 <span className="font-bold font-heading text-text-heading">Nội dung khóa học</span>
 <button onClick={() => setSidebarOpen(false)} className="p-1 rounded text-text-muted hover:bg-bg-hover">
 <X className="w-5 h-5" />
 </button>
 </div>
 {SidebarContent}
 </aside>
 </div>
 )}

 {/* ── Main content (child pages) ── */}
 <main className="flex-1 overflow-y-auto min-w-0">
 {children}
 </main>
 </div>
 </div>
 </StudentCourseContext.Provider>
 );
}

// ── Wrap in Suspense for useSearchParams ──────────────────────────────────────

export default function StudentCourseDetailLayout({ children }: { children: React.ReactNode }) {
 return (
 <Suspense fallback={<PageLoader message="Đang tải khóa học..." />}>
 <StudentCourseDetailLayoutInner>{children}</StudentCourseDetailLayoutInner>
 </Suspense>
 );
}
