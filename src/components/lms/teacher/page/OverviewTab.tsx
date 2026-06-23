import { Course, Section } from"@/types";

export function OverviewTab({ course, sections }: { course: Course; sections: Section[] }) {
 return (
 <div className="space-y-6">
 <div>
 <h3 className="text-lg font-semibold mb-4 text-text-heading">Thông tin khóa học</h3>
 <div className="grid grid-cols-2 gap-4">
 <div className="p-4 bg-bg-section dark:bg-bg-hover rounded-xl border border-border-subtle">
 <p className="text-sm text-text-muted">Trạng thái</p>
 <p className="font-semibold text-text-heading">{course.status ==="PUBLISHED" ?"Đã xuất bản" :"Nháp"}</p>
 </div>
 <div className="p-4 bg-bg-section dark:bg-bg-hover rounded-xl border border-border-subtle">
 <p className="text-sm text-text-muted">Mức độ</p>
 <p className="font-semibold text-text-heading">{course.level ||"Chưa xác định"}</p>
 </div>
 <div className="p-4 bg-bg-section dark:bg-bg-hover rounded-xl border border-border-subtle">
 <p className="text-sm text-text-muted">Danh mục</p>
 <p className="font-semibold text-text-heading">{course.category ||"Chưa phân loại"}</p>
 </div>
 <div className="p-4 bg-bg-section dark:bg-bg-hover rounded-xl border border-border-subtle">
 <p className="text-sm text-text-muted">Số chương</p>
 <p className="font-semibold text-text-heading">{sections.length}</p>
 </div>
 </div>
 </div>

 <div>
 <h3 className="text-lg font-semibold mb-4 text-text-heading">Danh sách chương</h3>
 {sections.length === 0 ? (
 <p className="text-text-muted">Chưa có chương nào</p>
 ) : (
 <div className="space-y-2">
 {sections.map((section, index) => (
 <div key={section.id} className="p-4 bg-bg-card border border-border-subtle rounded-xl hover:shadow-sm hover:border-border-hover transition-all">
 <p className="font-medium text-text-heading">
 Chương {index + 1}: {section.title}
 </p>
 <p className="text-sm text-text-muted mt-1">{section.description ||"Chưa có mô tả"}</p>
 </div>
 ))}
 </div>
 )}
 </div>
 </div>
 );
}