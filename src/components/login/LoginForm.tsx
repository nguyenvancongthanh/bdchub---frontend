"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { EyeIcon, EyeOffIcon, Spinner } from "@/components/icons/Icons";
import { validatePassword } from "@/utils/utils";
import ForgotPasswordModal from "./ForgotPasswordModal";
import Mascot from "./Mascot";
import { GoogleLoginButton } from "./GoogleLoginButton";

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [isForgotOpen, setIsForgotOpen] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const v = validatePassword(email, password);
    if (v) return setError(v);

    setLoading(true);
    try {
      const result = await (await import("next-auth/react")).signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        throw new Error("Email hoặc mật khẩu không chính xác.");
      }

      router.push("/lms");
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Đăng nhập thất bại. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ForgotPasswordModal open={isForgotOpen} onClose={() => setIsForgotOpen(false)} />

      <div className="w-full max-w-md rounded-2xl p-8 mx-auto
                      bg-white/90 dark:bg-bg-card/80
                      backdrop-blur-xl
                      border border-border-subtle
                      shadow-lg dark:shadow-[0_8px_40px_rgba(37,99,235,0.08)]
                      hover:shadow-xl hover:shadow-blue-500/5
                      dark:hover:shadow-[0_12px_50px_rgba(37,99,235,0.12)]
                      hover:border-border-hover
                      hover:-translate-y-0.5
                      transition-all duration-300">
        <Mascot isBlindfolded={isPasswordFocused && !showPassword} />

        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-text-heading">Chào mừng trở lại!</h1>
          <p className="text-sm text-text-muted mt-2">Đăng nhập vào hệ thống quản trị BDC</p>
        </div>

        {error && (
          <div className="mb-6 text-sm font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800/30 px-4 py-3 rounded-xl flex items-start gap-2">
            <span>⚠️</span> {error}
          </div>
        )}

        <form onSubmit={onSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-text-subheading mb-1.5">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onFocus={() => setIsPasswordFocused(false)}
              placeholder="nguyenvana@hcmut.edu.vn"
              className="w-full rounded-xl px-4 py-3.5
                         bg-bg-input
                         border border-border-input
                         text-text-heading
                         placeholder:text-text-disabled
                         focus:bg-bg-card
                         focus:outline-none
                         focus:ring-2 focus:ring-border-focus/20
                         focus:border-border-focus
                         transition-all duration-200"
              required
            />
          </div>

          <div className="relative">
            <label className="block text-sm font-semibold text-text-subheading mb-1.5">Mật khẩu</label>
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onFocus={() => setIsPasswordFocused(true)}
              onBlur={() => setIsPasswordFocused(false)}
              placeholder="••••••••"
              className="w-full rounded-xl px-4 py-3.5 pr-12
                         bg-bg-input
                         border border-border-input
                         text-text-heading
                         placeholder:text-text-disabled
                         focus:bg-bg-card
                         focus:outline-none
                         focus:ring-2 focus:ring-border-focus/20
                         focus:border-border-focus
                         transition-all duration-200"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-[38px] text-text-muted hover:text-text-heading transition-colors focus:outline-none active:scale-95"
            >
              {showPassword ? <EyeOffIcon /> : <EyeIcon />}
            </button>
          </div>

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 cursor-pointer group">
              <input type="checkbox" className="w-4 h-4 rounded border-border-input dark:border-blue-500/30 accent-accent-primary cursor-pointer" />
              <span className="text-text-body dark:text-text-muted group-hover:text-text-heading dark:group-hover:text-text-subheading transition-colors">Ghi nhớ đăng nhập</span>
            </label>
            <button
              type="button"
              onClick={() => setIsForgotOpen(true)}
              className="font-semibold text-accent-primary dark:text-accent-secondary hover:text-accent-primary-hover dark:hover:text-cyan-300 transition-colors active:scale-95"
            >
              Quên mật khẩu?
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 bg-accent-primary hover:bg-accent-primary-hover text-white font-semibold rounded-xl px-6 py-3.5 shadow-sm dark:shadow-blue-900/30 transition-all duration-200 active:scale-95 disabled:opacity-70 flex items-center justify-center gap-2"
          >
            {loading ? <Spinner /> : "Đăng nhập"}
          </button>
        </form>

        {/* Divider */}
        <div className="relative my-6">
          <hr className="border-border-subtle" />
          <span className="absolute left-1/2 -translate-x-1/2 -top-2.5 px-3 bg-white/90 dark:bg-bg-card/80 text-xs text-text-muted font-medium">
            hoặc
          </span>
        </div>

        {/* Google Login */}
        <GoogleLoginButton onError={setError} />
      </div>
    </>
  );
}