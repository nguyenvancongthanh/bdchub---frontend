import React from "react";

export const inputCls =
  "w-full rounded-xl px-4 py-3 text-sm transition-all duration-300 outline-none " +
  "bg-slate-50/50 dark:bg-slate-800/40 " +
  "border border-slate-200 dark:border-slate-700/60 " +
  "text-slate-900 dark:text-slate-100 " +
  "placeholder:text-slate-400 dark:placeholder:text-slate-500 " +
  "backdrop-blur-sm " +
  "focus:border-cyan-500 dark:focus:border-cyan-400 " +
  "focus:ring-4 focus:ring-cyan-500/10 dark:focus:ring-cyan-400/10 " +
  "focus:shadow-[0_0_15px_rgba(6,182,212,0.15)]";

export const errInputCls = "border-red-400 dark:border-red-500/70 bg-red-50/50 dark:bg-red-950/10";

export function FL({ children, req }: { children: React.ReactNode; req?: boolean }) {
  return (
    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5 transition-colors duration-200">
      {children}{req && <span className="text-cyan-600 dark:text-cyan-400 ml-1 font-bold animate-pulse">*</span>}
    </label>
  );
}

export function Err({ msg }: { msg?: string }) {
  if (!msg) return null;
  return <p className="mt-1.5 text-xs text-red-500 dark:text-red-400 flex items-center gap-1.5 animate-fadeIn">⚠ {msg}</p>;
}

export function FIn({ error, ...p }: React.InputHTMLAttributes<HTMLInputElement> & { error?: string }) {
  return (
    <div className="relative w-full">
      <input {...p} className={`${inputCls} ${error ? errInputCls : ""}`} />
      <Err msg={error} />
    </div>
  );
}

export function FTa({ error, rows = 4, ...p }: React.TextareaHTMLAttributes<HTMLTextAreaElement> & { error?: string }) {
  return (
    <div className="relative w-full">
      <textarea rows={rows} {...p} className={`${inputCls} resize-none ${error ? errInputCls : ""}`} />
      <Err msg={error} />
    </div>
  );
}

export function FSel({ error, children, ...p }: React.SelectHTMLAttributes<HTMLSelectElement> & { error?: string }) {
  return (
    <div className="relative w-full">
      <select {...p} className={`${inputCls} appearance-none cursor-pointer ${error ? errInputCls : ""}`}>{children}</select>
      <div className="absolute right-4 top-[18px] pointer-events-none text-slate-400 dark:text-slate-500">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
        </svg>
      </div>
      <Err msg={error} />
    </div>
  );
}
