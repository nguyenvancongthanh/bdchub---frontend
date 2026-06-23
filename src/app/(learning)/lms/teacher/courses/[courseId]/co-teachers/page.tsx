"use client";

import { useCallback, useEffect, useState, useRef } from"react";
import { useParams } from"next/navigation";
import { UserPlus, Trash2, Shield, Mail, Calendar, Search } from"lucide-react";
import lmsService from"@/services/lmsService";
import { useAuth } from"@/hooks/useAuth";
import { Badge, EmptyState, PageLoader, Spinner } from"@/components/lms/shared";

interface CoTeacher {
 id: number;
 course_id: number;
 user_id: number;
 full_name: string;
 email: string;
 added_by: number;
 created_at: string;
}

interface CourseDetail {
 id: number;
 created_by: number;
}

export default function CoTeachersPage() {
 const { courseId } = useParams<{ courseId: string }>();
 const id = Number(courseId);
 const { user, isAdmin } = useAuth();

 const [coTeachers, setCoTeachers] = useState<CoTeacher[]>([]);
 const [course, setCourse] = useState<CourseDetail | null>(null);
 const [loading, setLoading] = useState(true);

 // Search Co-teachers state
 const [searchQuery, setSearchQuery] = useState("");
 const [searchResults, setSearchResults] = useState<any[]>([]);
 const [selectedUser, setSelectedUser] = useState<any | null>(null);
 const [showDropdown, setShowDropdown] = useState(false);
 const [submitting, setSubmitting] = useState(false);

 const [error, setError] = useState<string | null>(null);
 const [successMsg, setSuccessMsg] = useState<string | null>(null);

 const dropdownRef = useRef<HTMLDivElement>(null);

 const loadData = useCallback(async () => {
 setLoading(true);
 setError(null);
 try {
 const [coTeachersRes, courseRes] = await Promise.all([
 lmsService.getCoTeachers(id),
 lmsService.getCourse(id),
 ]);
 setCoTeachers(coTeachersRes ?? []);
 setCourse(courseRes?.data ?? null);
 } catch (err: any) {
 setError("Không thể tải thông tin đồng giáo viên.");
 } finally {
 setLoading(false);
 }
 }, [id]);

 useEffect(() => {
 loadData();
 }, [loadData]);

 // Click outside listener for search dropdown
 useEffect(() => {
 const handleClickOutside = (event: MouseEvent) => {
 if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
 setShowDropdown(false);
 }
 };
 document.addEventListener("mousedown", handleClickOutside);
 return () => document.removeEventListener("mousedown", handleClickOutside);
 }, []);

 // Debounce search teacher API
 useEffect(() => {
 if (!searchQuery) {
 setSearchResults([]);
 setShowDropdown(false);
 return;
 }

 // Don't search if the query matches the selected user format
 if (selectedUser && searchQuery === `${selectedUser.full_name} (${selectedUser.email})`) {
 return;
 }

 const timer = setTimeout(async () => {
 try {
 const res = await lmsService.searchTeachers(searchQuery);
 setSearchResults(res ?? []);
 setShowDropdown(true);
 } catch {}
 }, 300);

 return () => clearTimeout(timer);
 }, [searchQuery, selectedUser]);

 const handleInputChange = (val: string) => {
 setSearchQuery(val);
 if (selectedUser && val !== `${selectedUser.full_name} (${selectedUser.email})`) {
 setSelectedUser(null);
 }
 };

 const handleSelectUser = (u: any) => {
 setSelectedUser(u);
 setSearchQuery(`${u.full_name} (${u.email})`);
 setShowDropdown(false);
 };

 const handleAdd = async (e: React.FormEvent) => {
 e.preventDefault();
 setError(null);
 setSuccessMsg(null);

 if (!selectedUser) {
 setError("Vui lòng chọn một giáo viên từ kết quả tìm kiếm.");
 return;
 }

 setSubmitting(true);
 try {
 await lmsService.addCoTeacher(id, selectedUser.id);
 setSuccessMsg(`Đã thêm đồng giáo viên ${selectedUser.full_name} thành công!`);
 setSelectedUser(null);
 setSearchQuery("");
 // Reload list
 const coTeachersRes = await lmsService.getCoTeachers(id);
 setCoTeachers(coTeachersRes ?? []);
 } catch (err: any) {
 const msg = err.response?.data?.message || err.message ||"Không thể thêm đồng giáo viên.";
 setError(msg);
 } finally {
 setSubmitting(false);
 }
 };

 const handleRemove = async (userId: number) => {
 if (!confirm("Bạn có chắc chắn muốn xóa đồng giáo viên này khỏi khóa học?")) {
 return;
 }

 setError(null);
 setSuccessMsg(null);
 try {
 await lmsService.removeCoTeacher(id, userId);
 setSuccessMsg("Đã xóa đồng giáo viên thành công!");
 setCoTeachers(prev => prev.filter(ct => ct.user_id !== userId));
 } catch (err: any) {
 const msg = err.response?.data?.message || err.message ||"Không thể xóa đồng giáo viên.";
 setError(msg);
 }
 };

 // Only course creator (owner) or system ADMIN can add/remove co-teachers
 const isOwner = course?.created_by === Number(user?.id);
 const canManage = isOwner || isAdmin;

 if (loading) {
 return <PageLoader />;
 }

 return (
 <div className="space-y-6">
 {/* Title section */}
 <div className="flex flex-col gap-1.5">
 <h2 className="text-lg font-bold text-text-heading flex items-center gap-2">
 <Shield className="w-5 h-5 text-accent-primary dark:text-accent-secondary" />
 Quản lý Đồng giáo viên
 </h2>
 <p className="text-sm text-text-muted">
 Đồng giáo viên có quyền cấu hình nội dung khóa học, quản lý học viên và bài kiểm tra, nhưng không thể xóa khóa học hay quản lý các đồng giáo viên khác.
 </p>
 </div>

 {/* Notifications */}
 {error && (
 <div className="p-3.5 text-sm text-red-600 bg-red-50 dark:bg-red-950/30 dark:text-red-400 rounded-xl border border-red-200 dark:border-red-900/50">
 {error}
 </div>
 )}
 {successMsg && (
 <div className="p-3.5 text-sm text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30 dark:text-emerald-400 rounded-xl border border-emerald-200 dark:border-emerald-900/50">
 {successMsg}
 </div>
 )}

 <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
 {/* Add co-teacher Form */}
 {canManage && (
 <div className="bg-bg-section dark:bg-bg-hover p-5 rounded-2xl border border-border-subtle/60 dark:border-border-subtle space-y-4">
 <h3 className="text-sm font-bold text-text-heading flex items-center gap-1.5">
 <UserPlus className="w-4 h-4 text-text-muted" />
 Thêm đồng giáo viên
 </h3>
 <form onSubmit={handleAdd} className="space-y-3.5">
 <div className="relative" ref={dropdownRef}>
 <label className="block text-xs font-semibold text-text-muted mb-1">
 Tìm kiếm giáo viên
 </label>
 <div className="relative">
 <Search className="absolute left-3 top-3.5 w-4 h-4 text-text-disabled" />
 <input
 type="text"
 value={searchQuery}
 onChange={e => handleInputChange(e.target.value)}
 onFocus={() => { if (searchResults.length > 0) setShowDropdown(true); }}
 placeholder="Nhập tên hoặc email..."
 className="
 w-full pl-9 pr-4 py-2.5 text-sm rounded-xl
 border border-border-input
 bg-bg-card text-text-heading
 focus:border-border-focus focus:ring-2 focus:ring-border-focus/20
 transition-all duration-200 outline-none
"
 disabled={submitting}
 />
 </div>

 {/* Dropdown list search results */}
 {showDropdown && searchResults.length > 0 && (
 <div className="
 absolute left-0 right-0 mt-1.5 max-h-56 overflow-y-auto z-50
 bg-bg-card border border-border-subtle
 rounded-xl shadow-lg divide-y divide-border-section dark:divide-border-section
">
 {searchResults.map(u => (
 <button
 key={u.id}
 type="button"
 onClick={() => handleSelectUser(u)}
 className="
 w-full flex flex-col items-start gap-0.5 px-4 py-2.5
 hover:bg-bg-hover/65 text-left
 transition-colors duration-150
"
 >
 <span className="text-sm font-semibold text-text-heading">
 {u.full_name ||"Chưa cập nhật tên"}
 </span>
 <span className="text-xs text-text-muted">
 {u.email}
 </span>
 </button>
 ))}
 </div>
 )}
 
 {searchQuery && searchResults.length === 0 && !selectedUser && !submitting && (
 <p className="text-[10px] text-text-disabled mt-1 pl-1">
 Không tìm thấy giáo viên nào khớp.
 </p>
 )}
 </div>

 <button
 type="submit"
 disabled={submitting || !selectedUser}
 className="
 w-full flex items-center justify-center gap-1.5 px-4 py-2.5
 bg-accent-primary hover:bg-accent-primary-hover disabled:bg-blue-600/50 text-white font-semibold text-sm
 rounded-xl shadow-sm active:scale-95 transition-all duration-200 disabled:scale-100
"
 >
 {submitting ? (
 <Spinner className="w-4 h-4 border-2 border-white/30 border-t-white" />
 ) : (
 <>
 <UserPlus className="w-4 h-4" />
 Thêm vào khóa học
 </>
 )}
 </button>
 </form>
 </div>
 )}

 {/* Co-teacher list */}
 <div className={canManage ?"lg:col-span-2 space-y-3" :"lg:col-span-3 space-y-3"}>
 <h3 className="text-sm font-bold text-text-heading px-1">
 Danh sách đồng giáo viên ({coTeachers.length})
 </h3>

 {coTeachers.length === 0 ? (
 <EmptyState
 icon={<Shield className="w-10 h-10" />}
 title="Chưa có đồng giáo viên"
 description="Khóa học này hiện chỉ được quản lý bởi giáo viên chủ nhiệm."
 />
 ) : (
 <div className="divide-y divide-border-section dark:divide-border-section rounded-2xl border border-border-subtle overflow-hidden bg-bg-card">
 {coTeachers.map(ct => (
 <div
 key={ct.id}
 className="flex items-center gap-4 px-5 py-4 hover:bg-bg-hover/40 transition-colors"
 >
 {/* Initial letters avatar */}
 <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center font-bold text-sm text-accent-primary dark:text-accent-secondary flex-shrink-0">
 {(ct.full_name ||"U").charAt(0).toUpperCase()}
 </div>

 {/* Teacher info */}
 <div className="flex-1 min-w-0 space-y-0.5">
 <div className="flex items-center gap-2">
 <p className="font-semibold text-text-heading truncate text-sm">
 {ct.full_name ||"Chưa cập nhật tên"}
 </p>
 <Badge variant="blue">
 Co-Teacher
 </Badge>
 </div>
 <div className="flex items-center gap-3 text-xs text-text-muted">
 <span className="flex items-center gap-1">
 <Mail className="w-3 h-3" />
 {ct.email}
 </span>
 <span className="flex items-center gap-1">
 <Calendar className="w-3 h-3" />
 Thêm ngày {new Date(ct.created_at).toLocaleDateString("vi-VN")}
 </span>
 </div>
 </div>

 {/* Remove action */}
 {canManage && (
 <button
 onClick={() => handleRemove(ct.user_id)}
 className="
 p-2 text-text-disabled hover:text-red-500 dark:hover:text-red-400
 hover:bg-bg-hover rounded-xl
 active:scale-95 transition-all duration-200
"
 title="Xóa đồng giáo viên"
 >
 <Trash2 className="w-4.5 h-4.5" />
 </button>
 )}
 </div>
 ))}
 </div>
 )}
 </div>
 </div>
 </div>
 );
}
