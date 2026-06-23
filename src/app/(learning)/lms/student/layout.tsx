"use client";

import { useEffect, useState } from"react";
import { useRouter, usePathname } from"next/navigation";
import { getCookie } from"@/utils/cookies";
import Link from"next/link";

export default function StudentLayout({ children }: { children: React.ReactNode }) {
 const router = useRouter();
 const pathname = usePathname();
 const [userName, setUserName] = useState("");
 const [loading, setLoading] = useState(true);

 useEffect(() => {
 const selectedRole = sessionStorage.getItem("lms_selected_role");
 if (selectedRole !=="STUDENT") {
 router.push("/lms");
 return;
 }

 const name = getCookie("userName") ||"";
 setUserName(name);
 setLoading(false);
 }, [router]);

 const handleChangeRole = () => {
 sessionStorage.removeItem("lms_selected_role");
 router.push("/lms");
 };

 const navItems = [
 { href:"/lms/student", label:"Dashboard" },
 { href:"/lms/student/discover", label:"Khám phá" },
 { href:"/lms/student/ai-mentor", label:"AI Mentor" },
 ];

 if (loading) {
 return (
 <div className="flex items-center justify-center min-h-screen bg-bg-root">
 <div className="w-16 h-16 border-4 border-accent-primary border-t-transparent rounded-full animate-spin"></div>
 </div>
 );
 }

 return (
 <>
 <div className="min-h-screen bg-bg-root">
 <header className="bg-bg-shell border-b border-border-subtle shadow-sm sticky top-0 z-50">
 <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
 <div className="flex justify-between items-center h-16">
 <div className="flex items-center space-x-3">
 <div>
 <h1 className="text-xl font-bold font-heading text-text-heading">Học viên LMS</h1>
 <p className="text-xs text-text-muted">Xin chào, {userName}</p>
 </div>
 </div>

 <nav className="hidden md:flex items-center space-x-1">
 {navItems.map((item) => {
 const isActive = pathname === item.href ||
 (item.href !=="/lms/student" && pathname.startsWith(item.href));

 return (
 <Link
 key={item.href}
 href={item.href}
 className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${isActive
 ?"bg-blue-50 dark:bg-blue-900/30 text-accent-primary dark:text-accent-secondary"
 :"text-text-muted hover:bg-bg-hover hover:text-text-heading"
 }`}
 >
 {item.label}
 </Link>
 );
 })}
 </nav>

 <div className="flex items-center gap-2">
 <Link
 href="/"
 className="px-3 py-2 text-sm text-text-body border border-border-input rounded-xl hover:text-text-heading hover:bg-bg-hover hover:border-border-hover transition-colors active:scale-95"
 >
 Trang chủ
 </Link>
 <button
 onClick={handleChangeRole}
 className="px-3 py-2 text-sm text-text-body border border-border-input rounded-xl hover:text-text-heading hover:bg-bg-hover hover:border-border-hover transition-colors font-medium active:scale-95"
 >
 Đổi vai trò
 </button>
 </div>
 </div>

 <nav className="md:hidden flex items-center space-x-1 pb-3 overflow-x-auto">
 {navItems.map((item) => {
 const isActive = pathname === item.href ||
 (item.href !=="/lms/student" && pathname.startsWith(item.href));

 return (
 <Link
 key={item.href}
 href={item.href}
 className={`px-3 py-1.5 rounded-xl text-sm font-medium whitespace-nowrap transition-colors ${isActive
 ?"bg-blue-50 dark:bg-blue-900/30 text-accent-primary dark:text-accent-secondary"
 :"text-text-muted hover:bg-bg-hover hover:text-text-heading"
 }`}
 >
 {item.label}
 </Link>
 );
 })}
 </nav>
 </div>
 </header>

 <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
 {children}
 </main>
 </div>
 </>
 );
}
