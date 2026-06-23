"use client";

import { useEffect, useState } from"react";
import { useRouter } from"next/navigation";
import lmsService from"@/services/lmsService";
import { organizationService } from"@/services/organizationService";
import { Button } from"@/components/ui/button";
import FileUpload from"@/components/lms/teacher/upload/FileUpload";
import { FileInfo, Organization } from"@/types";

const COURSE_LEVELS = [
 { value:"BEGINNER", label:"Cơ bản" },
 { value:"INTERMEDIATE", label:"Trung cấp" },
 { value:"ADVANCED", label:"Nâng cao" },
 { value:"ALL_LEVELS", label:"Mọi cấp độ" }
];

export default function CreateCoursePage() {
 const router = useRouter();
 const [loading, setLoading] = useState(false);
 const [errors, setErrors] = useState<Record<string, string>>({});
 const [orgs, setOrgs] = useState<Organization[]>([]);
 const [orgLoading, setOrgLoading] = useState(true);
 const [formData, setFormData] = useState({
 title:"",
 description:"",
 category:"",
 level:"BEGINNER",
 thumbnail_url:"",
 visibility:"PUBLIC" as"PUBLIC" |"ORG_ONLY",
 org_id: undefined as number | undefined,
 });

 useEffect(() => {
 async function fetchOrgs() {
 try {
 setOrgLoading(true);
 const list = await organizationService.getMyOrgs();
 setOrgs(list);
 if (list.length > 0) {
 const defaultOrg = list.find(o => o.slug ==="bdc") || list[0];
 setFormData(prev => ({ ...prev, org_id: defaultOrg.id }));
 }
 } catch (err) {
 console.error("Failed to load organizations:", err);
 } finally {
 setOrgLoading(false);
 }
 }
 fetchOrgs();
 }, []);

 const validateForm = () => {
 const newErrors: Record<string, string> = {};

 if (!formData.title.trim()) {
 newErrors.title ="Tên khóa học là bắt buộc";
 } else if (formData.title.length < 3) {
 newErrors.title ="Tên khóa học phải có ít nhất 3 ký tự";
 } else if (formData.title.length > 255) {
 newErrors.title ="Tên khóa học không được quá 255 ký tự";
 }

 if (formData.description && formData.description.length > 5000) {
 newErrors.description ="Mô tả không được quá 5000 ký tự";
 }

 setErrors(newErrors);
 return Object.keys(newErrors).length === 0;
 };

 const handleSubmit = async (e: React.FormEvent) => {
 e.preventDefault();
 
 if (!validateForm()) {
 return;
 }

 try {
 setLoading(true);
 const result = await lmsService.createCourse({
 title: formData.title,
 description: formData.description || undefined,
 category: formData.category || undefined,
 level: formData.level || undefined,
 thumbnail_url: formData.thumbnail_url ? formData.thumbnail_url : undefined,
 visibility: formData.visibility,
 org_id: formData.org_id,
 });
 
 alert("Tạo khóa học thành công!");
 router.push(`/lms/teacher/courses/${result.data.id}`);
 } catch (error: any) {
 alert(error.response?.data?.error ||"Lỗi khi tạo khóa học");
 console.error(error);
 } finally {
 setLoading(false);
 }
 };

 return (
 <div className="max-w-4xl mx-auto">
 <div className="mb-6">
 <Button
 onClick={() => router.back()}
 className="text-blue-600 hover:text-blue-700 font-medium mb-4"
 >
 ← Quay lại
 </Button>
 <h1 className="text-3xl font-bold text-text-heading">Tạo khóa học mới</h1>
 <p className="text-text-muted mt-2">Nhập thông tin chi tiết để tạo khóa học của bạn</p>
 </div>

 <form onSubmit={handleSubmit} className="bg-bg-card rounded-2xl shadow-sm border border-border-subtle p-8">
 <div className="mb-8">
 <h2 className="text-lg font-semibold text-text-heading mb-4 pb-2 border-b border-border-subtle">
 Thông tin cơ bản
 </h2>
 
 <div className="mb-4">
 <label className="block text-sm font-medium text-text-body mb-2">
 Tên khóa học <span className="text-red-500">*</span>
 </label>
 <input
 type="text"
 value={formData.title}
 onChange={(e) => setFormData({ ...formData, title: e.target.value })}
 placeholder="VD: Lập trình Python cơ bản"
 className={`w-full px-4 py-2 border rounded-lg bg-bg-card text-text-heading placeholder:text-text-disabled focus:ring-2 focus:ring-border-focus/20 focus:border-border-focus transition-all ${
 errors.title ?"border-red-500 dark:border-red-500" :"border-border-input"
 }`}
 />
 {errors.title && <p className="text-red-600 dark:text-red-400 text-sm mt-1">{errors.title}</p>}
 </div>

 <div className="mb-4">
 <label className="block text-sm font-medium text-text-body mb-2">
 Mô tả khóa học
 </label>
 <textarea
 value={formData.description}
 onChange={(e) => setFormData({ ...formData, description: e.target.value })}
 placeholder="Nhập mô tả chi tiết về khóa học, mục tiêu học tập, đối tượng học viên..."
 rows={5}
 className={`w-full px-4 py-2 border rounded-lg bg-bg-card text-text-heading placeholder:text-text-disabled focus:ring-2 focus:ring-border-focus/20 focus:border-border-focus transition-all ${
 errors.description ?"border-red-500 dark:border-red-500" :"border-border-input"
 }`}
 />
 {errors.description && <p className="text-red-600 dark:text-red-400 text-sm mt-1">{errors.description}</p>}
 </div>
 </div>

 <div className="mb-8">
 <h2 className="text-lg font-semibold text-text-heading mb-4 pb-2 border-b border-border-subtle">
 Chi tiết khóa học
 </h2>

 <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
 <div>
 <label className="block text-sm font-medium text-text-body mb-2">
 Danh mục
 </label>
 <input
 type="text"
 value={formData.category}
 onChange={(e) => setFormData({ ...formData, category: e.target.value })}
 placeholder="VD: Lập trình, Thiết kế, Kinh doanh..."
 className="w-full px-4 py-2 border border-border-input rounded-lg bg-bg-card text-text-heading placeholder:text-text-disabled focus:ring-2 focus:ring-border-focus/20 focus:border-border-focus transition-all"
 />
 </div>

 <div>
 <label className="block text-sm font-medium text-text-body mb-2">
 Mức độ khó
 </label>
 <select
 value={formData.level}
 onChange={(e) => setFormData({ ...formData, level: e.target.value })}
 className="w-full px-4 py-2 border border-border-input rounded-lg bg-bg-card text-text-heading focus:ring-2 focus:ring-border-focus/20 focus:border-border-focus transition-all"
 >
 {COURSE_LEVELS.map((level) => (
 <option key={level.value} value={level.value}>
 {level.label}
 </option>
 ))}
 </select>
 </div>
 </div>

 {/* Organization Select */}
 <div className="mb-4">
 <label className="block text-sm font-medium text-text-body mb-2">
 Tổ chức sở hữu <span className="text-red-500">*</span>
 </label>
 {orgLoading ? (
 <div className="text-sm text-text-muted animate-pulse py-2.5">Đang tải danh sách tổ chức...</div>
 ) : (
 <select
 value={formData.org_id ||""}
 onChange={(e) => setFormData({ ...formData, org_id: Number(e.target.value) })}
 className="w-full px-4 py-2.5 border border-border-input rounded-lg bg-bg-card text-text-heading focus:ring-2 focus:ring-border-focus/20 focus:border-border-focus transition-all font-medium"
 >
 {orgs.length === 0 ? (
 <option value="">Không thuộc tổ chức nào (Mặc định: Big Data Club)</option>
 ) : (
 orgs.map((org) => (
 <option key={org.id} value={org.id}>
 {org.name} ({org.slug})
 </option>
 ))
 )}
 </select>
 )}
 <p className="text-xs text-text-disabled mt-1.5">
 Chọn tổ chức chịu trách nhiệm quản lý và sở hữu khóa học này.
 </p>
 </div>

 {/* Visibility */}
 <div className="mb-4">
 <label className="block text-sm font-medium text-text-body mb-2">
 Khả năng hiển thị
 </label>
 <div className="grid grid-cols-2 gap-3">
 <button
 type="button"
 id="visibility-public"
 onClick={() => setFormData({ ...formData, visibility:"PUBLIC" })}
 className={`flex items-center gap-2 px-4 py-3 rounded-xl border text-sm font-medium transition-all duration-200 active:scale-95 ${
 formData.visibility ==="PUBLIC"
 ?"border-blue-500 bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-400"
 :"border-border-input text-text-muted hover:border-border-input"
 }`}
 >
 🌐 Public — Ai cũng có thể đăng ký
 </button>
 <button
 type="button"
 id="visibility-org-only"
 onClick={() => setFormData({ ...formData, visibility:"ORG_ONLY" })}
 className={`flex items-center gap-2 px-4 py-3 rounded-xl border text-sm font-medium transition-all duration-200 active:scale-95 ${
 formData.visibility ==="ORG_ONLY"
 ?"border-blue-500 bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-400"
 :"border-border-input text-text-muted hover:border-border-input"
 }`}
 >
 🔒 Chỉ thành viên tổ chức
 </button>
 </div>
 <p className="text-xs text-text-disabled mt-1.5">
 Public: bất kỳ ai đăng ký được. Org Only: chỉ thành viên của tổ chức bạn.
 </p>
 </div>

 <div className="mb-4">
 <label className="block text-sm font-medium text-text-body mb-2">
 URL ảnh đại diện
 </label>
 <FileUpload
 onFileUploaded={(fileInfo: FileInfo) => {
 setFormData({ ...formData, thumbnail_url: fileInfo.file_url });
 }}
 fileType="image"
 maxSize={10}
 disabled={loading}
 />
 {formData.thumbnail_url && (
 <div className="mt-3 p-3 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg flex items-center gap-2">
 <span className="text-green-700 dark:text-green-400 text-sm">✓ Đã upload ảnh thành công</span>
 <button
 type="button"
 onClick={() => setFormData({ ...formData, thumbnail_url:"" })}
 className="text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 text-sm font-medium ml-auto"
 >
 Xóa
 </button>
 </div>
 )}
 </div>
 </div>

 <div className="mb-8 p-4 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-xl">
 <p className="text-sm text-blue-700 dark:text-blue-400">
 <strong>Mẹo:</strong> Bạn có thể chỉnh sửa thông tin này sau khi tạo khóa học. 
 Khóa học sẽ được tạo ở trạng thái Nháp và bạn cần xuất bản để học viên có thể xem.
 </p>
 </div>

 <div className="flex gap-3 border-t border-border-subtle pt-6">
 <Button
 type="submit"
 disabled={loading}
 className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
 >
 {loading ?"Đang tạo khóa học..." :"Tạo khóa học"}
 </Button>
 <Button
 type="button"
 onClick={() => router.back()}
 className="px-4 py-3 bg-bg-card border border-border-input text-text-body rounded-xl hover:bg-bg-section dark:hover:bg-bg-hover transition-colors font-medium"
 >
 Hủy
 </Button>
 </div>
 </form>
 </div>
 );
}