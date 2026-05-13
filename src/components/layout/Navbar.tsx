"use client";

import React, { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { Logo } from "@/components/layout/Logo";
import { Button } from "@/components/ui/button";
import { LogOut, Sun, Moon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";

export default function Navbar() {
  const router = useRouter();
  const { status } = useSession();
  const { theme, setTheme } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const isAuthenticated = status === "authenticated";

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/login" });
  };

  const navItems = [
    { href: "/#about", label: "Về CLB" },
    { href: "/#activities", label: "Hoạt Động" },
    { href: "/#projects", label: "Dự Án" },
    // { href: "/#members", label: "Thành Viên" }
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white dark:bg-[#070E1C] shadow-sm dark:shadow-none border-b border-slate-200 dark:border-blue-500/8 py-3"
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.scrollTo(0, 0)}>
            <Logo />
            <div className="hidden sm:block">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white leading-tight">BDC Hub</h2>
              <p className="text-xs text-blue-600 dark:text-cyan-400 font-semibold tracking-wide uppercase">Think Big • Speak Data</p>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item, index) => (
              <a key={index} href={item.href} className="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-cyan-400 transition-colors">
                {item.label}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-3">
            {/* Theme Toggle */}
            {mounted && (
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-[#162644] hover:text-slate-700 dark:hover:text-slate-200 active:scale-95 transition-all duration-200"
                aria-label="Toggle theme"
              >
                {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
              </button>
            )}

            {isAuthenticated ? (
              <Button
                onClick={handleLogout}
                variant="outline"
                className="text-slate-600 dark:text-slate-300 border-slate-300 dark:border-blue-500/20 hover:bg-slate-50 dark:hover:bg-[#162644] rounded-xl active:scale-95 transition-all duration-200"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Đăng xuất
              </Button>
            ) : (
              <button
                onClick={() => router.push("/login")}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl shadow-sm dark:shadow-blue-900/30 active:scale-95 transition-all duration-200"
              >
                Đăng nhập
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}