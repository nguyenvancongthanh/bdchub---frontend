"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { ThemeToggle } from "@/components/layout/ThemeToggle";

import hpcLogo    from "@/assets/hpc-school-logo.png";
import hcmutLogo  from "@/assets/hcmut.png";
import hpccLogo   from "@/assets/hpcc-logo.png";
import cseLogo    from "@/assets/CSE_logo.png";
import bdcLogo    from "@/assets/bdclogo.png";
import doanLogo   from "@/assets/logo-Doan.png";
import hoiLogo    from "@/assets/logo-Hoi.png";

// ─── Types ────────────────────────────────────────────────────────────────────
type Lang = "en" | "vi";

interface FormData {
  agreePrivacy: boolean;
  fullName: string; dob: string; studentId: string;
  emailUni: string; emailPersonal: string; phone: string;
  university: string; major: string; year: string; gpa: string;
  cvFile: File | null; cvUrl: string;
  researchInterests: string; publications: string;
  motivation: string; achievements: string; futurePlans: string;
  source: string; sourceOther: string;
}
interface Errors { [key: string]: string; }

const ORGANIZERS = [
  { src: hcmutLogo, alt: "HCMUT",              cls: "w-6 h-6" },
  { src: hpccLogo,  alt: "HPCC",               cls: "w-9 h-9" },
  { src: cseLogo,   alt: "CSE",               cls: "w-6 h-6" },
  { src: bdcLogo,   alt: "Big Data Club",     cls: "w-6 h-6" },
  { src: doanLogo,  alt: "Youth Union",       cls: "w-6 h-6" },
  { src: hoiLogo,   alt: "Student Association", cls: "w-6 h-6" },
];

// ─── Translations ─────────────────────────────────────────────────────────────
const T = {
  en: {
    tagline: "HPCC × CSE × Big Data Club — HCMUT",
    title: "HPC Summer School 2026",
    subtitle: "Start Local · Compute at Scale",
    langToggle: "Tiếng Việt",
    steps: ["Privacy & Data Protection", "Personal & Academic Info", "Technical Profile & Motivation"],
    privacyTitle: "Privacy & Data Protection Commitment",
    privacyDesc: "We are committed to protecting participant information responsibly, transparently, and securely. All submitted data is collected strictly for academic evaluation, communication, and program organization purposes.",
    privacyCommitments: [
      "Your information will never be sold or used for commercial advertising purposes.",
      "Uploaded CVs and materials are only accessible by authorized selection committee members.",
      "Data is securely stored and protected against unauthorized access or disclosure.",
      "Personal information will not be publicly disclosed without your explicit consent.",
    ],
    privacyCollectedTitle: "Information We May Collect",
    privacyCollected: [
      "Personal identification & contact details",
      "Academic background & cumulative GPA",
      "Scientific publications & research projects",
      "CV and portfolio materials",
      "Research interests & career orientation",
      "Program feedback & survey responses",
    ],
    privacyCheckLabel: "I have read and agree to the Privacy & Data Protection Policy.",
    privacyCheckDesc: "By checking this box, you consent to HPCC & BDC using your information for the HPC Summer School 2026 selection and program management process.",
    privacyError: "You must agree to the privacy policy to proceed.",
    step2Title: "Personal & Academic Information",
    step2Desc: "Please provide accurate information to facilitate contact and verification by the organizing committee.",
    fullName: "Full Name", fullNamePh: "Nguyen Van A",
    dob: "Date of Birth",
    studentId: "Student ID (MSSV)", studentIdPh: "231xxxx",
    phone: "Phone Number", phonePh: "+84 9xx xxx xxx",
    emailUni: "University Email (.edu.vn)", emailUniPh: "nguyen.vana@hcmut.edu.vn",
    emailPersonal: "Personal Email", emailPersonalPh: "nguyenvana@gmail.com",
    university: "Current University", universityPh: "Ho Chi Minh City University of Technology",
    major: "Faculty / Major", majorPh: "e.g. Computer Science",
    yearOfStudy: "Year of Study", yearPh: "-- Select year --",
    years: ["Year 1", "Year 2", "Year 3", "Year 4", "Year 5+", "Graduate"],
    gpa: "Cumulative GPA", gpaPh: "e.g. 3.52 / 4.0",
    errFullName: "Full name is required.", errStudentId: "Student ID is required.",
    errEmailUni: "University email is required.", errEmailFmt: "Please enter a valid email address.",
    errPhone: "Phone number is required.", errUniversity: "University name is required.",
    errMajor: "Faculty / Major is required.", errYear: "Please select your year of study.",
    errGpa: "Cumulative GPA is required.",
    step3Title: "Technical Profile & Motivation",
    step3Desc: "Help us understand your passion, research background, and reasons for applying.",
    cvLabel: "Upload Your CV (PDF, max 5 MB)",
    cvDrag: "Drag & drop your file here, or", cvClick: "click to browse",
    cvHint: "Accepted format: .PDF · Maximum size: 5 MB",
    cvUploading: "Uploading to Cloudinary…", cvSuccess: "Uploaded successfully · Click to replace",
    researchLabel: "Research Interests & Orientation",
    researchHint: "Describe the fields you are currently exploring or wish to pursue (e.g. HPC, GPU Computing, Distributed AI, Systems Programming…)",
    researchPh: "e.g. I am interested in GPU Programming with CUDA and distributed machine learning training on HPC clusters…",
    pubLabel: "Scientific Publications / Notable Research Projects (if any)",
    pubHint: "List paper titles, conference/journal names, or provide links. Leave blank if not applicable.",
    pubPh: "e.g.\n• [SOSP'25] Paper Title — Conference Name\n• Research Project: Title — Role: Research Member\n• https://arxiv.org/abs/...",
    motivationLabel: "Motivation Statement",
    motivationHint: "What do you hope to learn and achieve over the 3 days of HPC Summer School 2026?",
    motivationPh: "Share your motivation and goals…",
    achievementsLabel: "Academic & Research Achievements (if any)",
    achievementsPh: "Awards, personal projects, scholarships, competitions…",
    futurePlansLabel: "Future Career Plans",
    futurePlansPh: "Career goals, research directions you plan to pursue…",
    sourceTitle: "How Did You Hear About Us?",
    sourceDesc: "Help us understand how applicants discover HPC Summer School.",
    sourceLabel: "Primary information source", sourcePh: "-- Select a source --",
    sourceOptions: [
      { value: "HPCC Fanpage",      label: "HPCC HCMUT Official Fanpage" },
      { value: "BDC Fanpage",       label: "Big Data Club (BDC) Official Fanpage" },
      { value: "University Portal", label: "University Website / Student Portal" },
      { value: "Friend Referral",   label: "Referred by a Friend or Classmate" },
      { value: "Faculty/Advisor",   label: "Recommended by a Lecturer or Academic Advisor" },
      { value: "Email Newsletter",  label: "University or Club Email Newsletter" },
      { value: "Other",             label: "Other" },
    ],
    sourceOtherLabel: "Please specify", sourceOtherPh: "e.g. LinkedIn, a research group, etc.",
    errCvRequired: "Please upload your CV before submitting.",
    errCvUploading: "Please wait for the file upload to complete.",
    errCvFailed: "Upload failed. Please try again.",
    errCvType: "Only PDF files are accepted.", errCvSize: "File exceeds the 5 MB size limit.",
    errResearch: "Please describe your research interests.",
    errMotivation: "Please provide your motivation statement.",
    back: "Back", next: "Continue", submit: "Submit Application", submitting: "Submitting…",
    successTag: "Application Submitted",
    successTitle1: "Thank you,", successTitle2: "for applying!",
    successDesc: "Your application has been successfully submitted to the HPC Summer School 2026 selection committee. We will review all submissions and notify you of the outcome via email as soon as possible.",
    followUs: "Stay up to date at:",
    links: [
      { label: "HPCC HCMUT",   href: "https://hpcc.hcmut.edu.vn/",          color: "text-cyan-600 dark:text-cyan-400 hover:text-cyan-500 dark:hover:text-cyan-300" },
      { label: "BDC Hub",       href: "https://bdc.hpcc.vn/",                color: "text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300" },
      { label: "Facebook HPCC", href: "https://www.facebook.com/hpcc.hcmut", color: "text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300" },
    ],
    copyright: "© 2026 High-Performance Computing Center — HCMUT. All rights reserved.",
  },
  vi: {
    tagline: "HPCC × CSE × Big Data Club — HCMUT",
    title: "HPC Summer School 2026",
    subtitle: "Start Local · Compute at Scale",
    langToggle: "English",
    steps: ["Quyền Riêng Tư", "Thông Tin Cá Nhân", "Hồ Sơ & Nguyện Vọng"],
    privacyTitle: "Cam Kết Quyền Riêng Tư & Bảo Mật Dữ Liệu",
    privacyDesc: "Chúng tôi cam kết bảo vệ thông tin người tham gia một cách có trách nhiệm, minh bạch và an toàn. Mọi thông tin chỉ được thu thập phục vụ mục đích xét tuyển học thuật và tổ chức chương trình.",
    privacyCommitments: [
      "Thông tin của bạn không bao giờ được bán hoặc dùng cho mục đích thương mại.",
      "CV và tài liệu tải lên chỉ ban tuyển sinh mới có quyền truy cập.",
      "Dữ liệu được lưu trữ an toàn và bảo vệ khỏi truy cập trái phép.",
      "Thông tin cá nhân sẽ không bị tiết lộ công khai khi chưa có sự đồng ý của bạn.",
    ],
    privacyCollectedTitle: "Thông Tin Chúng Tôi Có Thể Thu Thập",
    privacyCollected: [
      "Thông tin định danh & liên hệ cá nhân",
      "Nền tảng học thuật & GPA tích lũy",
      "Bài báo khoa học & đề tài nghiên cứu",
      "CV và hồ sơ cá nhân",
      "Lĩnh vực quan tâm & định hướng nghiên cứu",
      "Phản hồi & khảo sát chương trình",
    ],
    privacyCheckLabel: "Tôi đã đọc và đồng ý với chính sách bảo mật dữ liệu.",
    privacyCheckDesc: "Bằng việc đánh dấu vào ô này, bạn đồng ý cho phép HPCC & BDC sử dụng thông tin của bạn cho quá trình tuyển sinh HPC Summer School 2026.",
    privacyError: "Bạn cần đồng ý với chính sách bảo mật để tiếp tục.",
    step2Title: "Thông Tin Cá Nhân & Học Thuật",
    step2Desc: "Vui lòng cung cấp thông tin chính xác để ban tổ chức tiện liên hệ và xét tuyển.",
    fullName: "Họ và tên", fullNamePh: "Nguyễn Văn A",
    dob: "Ngày sinh",
    studentId: "MSSV", studentIdPh: "231xxxx",
    phone: "Số điện thoại", phonePh: "09xx xxx xxx",
    emailUni: "Email sinh viên (.edu.vn)", emailUniPh: "nguyen.vana@hcmut.edu.vn",
    emailPersonal: "Email cá nhân", emailPersonalPh: "nguyenvana@gmail.com",
    university: "Trường đang theo học", universityPh: "Trường Đại học Bách Khoa – ĐHQG-HCM",
    major: "Khoa / Ngành học", majorPh: "VD: Khoa học Máy tính",
    yearOfStudy: "Năm học", yearPh: "-- Chọn năm --",
    years: ["Năm 1", "Năm 2", "Năm 3", "Năm 4", "Năm 5+", "Đã tốt nghiệp"],
    gpa: "GPA tích lũy", gpaPh: "VD: 3.52 / 4.0",
    errFullName: "Vui lòng nhập họ và tên.", errStudentId: "Vui lòng nhập MSSV.",
    errEmailUni: "Vui lòng nhập email trường.", errEmailFmt: "Email không hợp lệ.",
    errPhone: "Vui lòng nhập số điện thoại.", errUniversity: "Vui lòng nhập tên trường.",
    errMajor: "Vui lòng nhập khoa / ngành.", errYear: "Vui lòng chọn năm học.",
    errGpa: "Vui lòng nhập GPA tích lũy.",
    step3Title: "Hồ Sơ Kỹ Thuật & Nguyện Vọng",
    step3Desc: "Hãy cho chúng tôi biết về đam mê, nền tảng nghiên cứu và lý do bạn muốn tham gia.",
    cvLabel: "Tải lên CV của bạn (PDF, tối đa 5MB)",
    cvDrag: "Kéo thả file vào đây hoặc", cvClick: "click để chọn",
    cvHint: "Chỉ chấp nhận .PDF · Tối đa 5MB",
    cvUploading: "Đang tải lên Cloudinary…", cvSuccess: "Đã tải lên thành công · Click để thay đổi",
    researchLabel: "Lĩnh vực quan tâm & Định hướng nghiên cứu",
    researchHint: "Mô tả các lĩnh vực bạn đang hoặc muốn theo đuổi (HPC, GPU Computing, Distributed AI, Systems Programming…)",
    researchPh: "VD: Tôi quan tâm đến GPU Programming với CUDA và Distributed ML Training trên HPC clusters…",
    pubLabel: "Bài báo khoa học / Đề tài nghiên cứu nổi bật (nếu có)",
    pubHint: "Liệt kê tên bài báo, hội nghị/tạp chí hoặc đính kèm link. Để trống nếu chưa có.",
    pubPh: "VD:\n• [SOSP'25] Tên bài báo — Conference Name\n• Đề tài NCKH: Tên đề tài — Vai trò: Thành viên\n• https://arxiv.org/abs/...",
    motivationLabel: "Nguyện vọng tham gia",
    motivationHint: "Bạn mong muốn học hỏi và đạt được điều gì sau 3 ngày của HPC Summer School 2026?",
    motivationPh: "Chia sẻ nguyện vọng và mục tiêu của bạn…",
    achievementsLabel: "Thành tích học tập / nghiên cứu khác (nếu có)",
    achievementsPh: "Giải thưởng, dự án cá nhân, học bổng, cuộc thi…",
    futurePlansLabel: "Dự định tương lai",
    futurePlansPh: "Định hướng nghề nghiệp, hướng nghiên cứu tiếp theo…",
    sourceTitle: "Bạn Biết Đến Chương Trình Qua Đâu?",
    sourceDesc: "Thông tin này giúp chúng tôi hiểu rõ hơn về kênh tiếp cận của người đăng ký.",
    sourceLabel: "Nguồn thông tin chính", sourcePh: "-- Chọn nguồn thông tin --",
    sourceOptions: [
      { value: "Fanpage HPCC",     label: "Fanpage chính thức HPCC HCMUT" },
      { value: "Fanpage BDC",      label: "Fanpage chính thức Big Data Club (BDC)" },
      { value: "Cổng thông tin",   label: "Website / Cổng thông tin trường" },
      { value: "Bạn bè",           label: "Bạn bè / Người quen giới thiệu" },
      { value: "Giảng viên",       label: "Giảng viên / Thầy cô giới thiệu" },
      { value: "Email newsletter", label: "Email thông báo của trường / CLB" },
      { value: "Khác",             label: "Khác" },
    ],
    sourceOtherLabel: "Vui lòng ghi rõ", sourceOtherPh: "VD: LinkedIn, nhóm nghiên cứu, v.v.",
    errCvRequired: "Vui lòng tải lên CV trước khi nộp đơn.",
    errCvUploading: "Vui lòng chờ file tải lên hoàn tất.",
    errCvFailed: "Tải lên thất bại. Vui lòng thử lại.",
    errCvType: "Chỉ chấp nhận file PDF.", errCvSize: "File vượt quá giới hạn 5MB.",
    errResearch: "Vui lòng điền định hướng nghiên cứu.",
    errMotivation: "Vui lòng chia sẻ nguyện vọng tham gia.",
    back: "Quay lại", next: "Tiếp tục", submit: "Nộp Đơn Đăng Ký", submitting: "Đang gửi đơn…",
    successTag: "Đăng ký thành công",
    successTitle1: "Cảm ơn bạn,", successTitle2: "đã nộp đơn!",
    successDesc: "Hồ sơ của bạn đã được gửi thành công đến ban tuyển sinh HPC Summer School 2026. Chúng tôi sẽ xét duyệt và thông báo kết quả qua email sớm nhất có thể.",
    followUs: "Theo dõi thông tin mới nhất tại:",
    links: [
      { label: "HPCC HCMUT",   href: "https://hpcc.hcmut.edu.vn/",          color: "text-cyan-600 dark:text-cyan-400 hover:text-cyan-500 dark:hover:text-cyan-300" },
      { label: "BDC Hub",       href: "https://bdc.hpcc.vn/",                color: "text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300" },
      { label: "Facebook HPCC", href: "https://www.facebook.com/hpcc.hcmut", color: "text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300" },
    ],
    copyright: "© 2026 Trung tâm Tính toán Hiệu năng Cao — HCMUT. All rights reserved.",
  },
} as const;

type Translation = typeof T["en"] | typeof T["vi"];

// ─── Shared field primitives ──────────────────────────────────────────────────

const inputCls =
  "w-full rounded-xl px-4 py-3 text-sm transition-all duration-200 outline-none " +
  "bg-slate-50 dark:bg-slate-800/60 " +
  "border border-slate-300 dark:border-slate-700 " +
  "text-slate-900 dark:text-slate-100 " +
  "placeholder:text-slate-400 dark:placeholder:text-slate-500 " +
  "focus:border-cyan-500 dark:focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20";

const errInputCls = "border-red-400 dark:border-red-500/70 bg-red-50 dark:bg-red-950/20";

function FL({ children, req }: { children: React.ReactNode; req?: boolean }) {
  return (
    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
      {children}{req && <span className="text-cyan-600 dark:text-cyan-400 ml-1">*</span>}
    </label>
  );
}
function Err({ msg }: { msg?: string }) {
  if (!msg) return null;
  return <p className="mt-1 text-xs text-red-500 dark:text-red-400 flex items-center gap-1">⚠ {msg}</p>;
}
function FIn({ error, ...p }: React.InputHTMLAttributes<HTMLInputElement> & { error?: string }) {
  return (
    <>
      <input {...p} className={`${inputCls} ${error ? errInputCls : ""}`} />
      <Err msg={error} />
    </>
  );
}
function FTa({ error, rows = 4, ...p }: React.TextareaHTMLAttributes<HTMLTextAreaElement> & { error?: string }) {
  return (
    <>
      <textarea rows={rows} {...p} className={`${inputCls} resize-none ${error ? errInputCls : ""}`} />
      <Err msg={error} />
    </>
  );
}
function FSel({ error, children, ...p }: React.SelectHTMLAttributes<HTMLSelectElement> & { error?: string }) {
  return (
    <>
      <select {...p} className={`${inputCls} appearance-none cursor-pointer ${error ? errInputCls : ""}`}>{children}</select>
      <Err msg={error} />
    </>
  );
}

// ─── Step 1: Privacy ──────────────────────────────────────────────────────────
function Step1({ t, agreed, onToggle, error }: { t: Translation; agreed: boolean; onToggle: () => void; error?: string }) {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-cyan-50 dark:bg-cyan-500/10 border border-cyan-200 dark:border-cyan-500/20 mb-1">
          <svg className="w-6 h-6 text-cyan-600 dark:text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
          </svg>
        </div>
        <h2 className="text-xl font-black text-slate-900 dark:text-white">{t.privacyTitle}</h2>
        <p className="text-slate-500 dark:text-slate-400 text-sm max-w-xl mx-auto leading-relaxed">{t.privacyDesc}</p>
      </div>

      <div className="grid sm:grid-cols-2 gap-3">
        {t.privacyCommitments.map((item, i) => (
          <div key={i} className="flex items-start gap-3 bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60 rounded-xl p-4 hover:border-cyan-300 dark:hover:border-cyan-700/60 transition-colors">
            <div className="mt-0.5 flex-shrink-0 w-5 h-5 rounded-lg bg-cyan-100 dark:bg-cyan-500/15 border border-cyan-300 dark:border-cyan-500/30 flex items-center justify-center">
              <svg className="w-3 h-3 text-cyan-600 dark:text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{item}</p>
          </div>
        ))}
      </div>

      <div className="border border-cyan-200 dark:border-cyan-800/60 bg-cyan-50/50 dark:bg-cyan-900/10 rounded-xl p-4">
        <h3 className="text-xs font-bold text-cyan-700 dark:text-cyan-300 mb-3 uppercase tracking-wider">{t.privacyCollectedTitle}</h3>
        <div className="grid sm:grid-cols-2 gap-2">
          {t.privacyCollected.map((item, i) => (
            <div key={i} className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
              <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 flex-shrink-0" />
              {item}
            </div>
          ))}
        </div>
      </div>

      <div
        onClick={onToggle}
        className={`flex items-start gap-3 rounded-xl p-4 cursor-pointer transition-all duration-200 select-none border
          ${agreed
            ? "border-cyan-400 dark:border-cyan-600 bg-cyan-50 dark:bg-cyan-900/20"
            : "border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/40 hover:border-cyan-300 dark:hover:border-cyan-700"}
          ${error ? "border-red-400 dark:border-red-600 bg-red-50 dark:bg-red-950/20" : ""}`}
      >
        <div className={`mt-0.5 flex-shrink-0 w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all duration-200 ${agreed ? "bg-cyan-500 dark:bg-cyan-500 border-cyan-500" : "border-slate-400 dark:border-slate-600"}`}>
          {agreed && (
            <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
          )}
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">{t.privacyCheckLabel}</p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">{t.privacyCheckDesc}</p>
          {error && <p className="mt-1.5 text-xs text-red-500 dark:text-red-400">⚠ {error}</p>}
        </div>
      </div>
    </div>
  );
}

// ─── Step 2: Personal Info ────────────────────────────────────────────────────
function Step2({ t, data, errors, onChange }: { t: Translation; data: FormData; errors: Errors; onChange: (f: keyof FormData, v: string) => void }) {
  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-black text-slate-900 dark:text-white mb-0.5">{t.step2Title}</h2>
        <p className="text-slate-500 dark:text-slate-400 text-sm">{t.step2Desc}</p>
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <div><FL req>{t.fullName}</FL><FIn type="text" placeholder={t.fullNamePh} value={data.fullName} onChange={e => onChange("fullName", e.target.value)} error={errors.fullName} /></div>
        <div><FL>{t.dob}</FL><FIn type="date" value={data.dob} onChange={e => onChange("dob", e.target.value)} /></div>
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <div><FL req>{t.studentId}</FL><FIn type="text" placeholder={t.studentIdPh} value={data.studentId} onChange={e => onChange("studentId", e.target.value)} error={errors.studentId} /></div>
        <div><FL req>{t.phone}</FL><FIn type="tel" placeholder={t.phonePh} value={data.phone} onChange={e => onChange("phone", e.target.value)} error={errors.phone} /></div>
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <div><FL req>{t.emailUni}</FL><FIn type="email" placeholder={t.emailUniPh} value={data.emailUni} onChange={e => onChange("emailUni", e.target.value)} error={errors.emailUni} /></div>
        <div><FL>{t.emailPersonal}</FL><FIn type="email" placeholder={t.emailPersonalPh} value={data.emailPersonal} onChange={e => onChange("emailPersonal", e.target.value)} /></div>
      </div>
      <div><FL req>{t.university}</FL><FIn type="text" placeholder={t.universityPh} value={data.university} onChange={e => onChange("university", e.target.value)} error={errors.university} /></div>
      <div className="grid sm:grid-cols-3 gap-4">
        <div className="sm:col-span-1"><FL req>{t.major}</FL><FIn type="text" placeholder={t.majorPh} value={data.major} onChange={e => onChange("major", e.target.value)} error={errors.major} /></div>
        <div>
          <FL req>{t.yearOfStudy}</FL>
          <FSel value={data.year} onChange={e => onChange("year", e.target.value)} error={errors.year}>
            <option value="">{t.yearPh}</option>
            {t.years.map(y => <option key={y} value={y}>{y}</option>)}
          </FSel>
        </div>
        <div><FL req>{t.gpa}</FL><FIn type="text" placeholder={t.gpaPh} value={data.gpa} onChange={e => onChange("gpa", e.target.value)} error={errors.gpa} /></div>
      </div>
    </div>
  );
}

// ─── Step 3: Profile ──────────────────────────────────────────────────────────
function Step3({ t, data, errors, onChange, onFileChange, uploadingCv }: {
  t: Translation; data: FormData; errors: Errors;
  onChange: (f: keyof FormData, v: string) => void;
  onFileChange: (file: File) => void; uploadingCv: boolean;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const showOther = data.source === "Other" || data.source === "Khác";

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-black text-slate-900 dark:text-white mb-0.5">{t.step3Title}</h2>
        <p className="text-slate-500 dark:text-slate-400 text-sm">{t.step3Desc}</p>
      </div>

      {/* CV Upload */}
      <div>
        <FL req>{t.cvLabel}</FL>
        <div
          onDrop={e => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) onFileChange(f); }}
          onDragOver={e => e.preventDefault()}
          onClick={() => fileRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all duration-200 group
            ${errors.cvFile
              ? "border-red-400 dark:border-red-600/60 bg-red-50 dark:bg-red-950/10"
              : data.cvUrl
                ? "border-cyan-400 dark:border-cyan-600 bg-cyan-50 dark:bg-cyan-900/10"
                : "border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/30 hover:border-cyan-400 dark:hover:border-cyan-600 hover:bg-cyan-50/50 dark:hover:bg-cyan-900/10"}`}
        >
          <input ref={fileRef} type="file" accept=".pdf" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) onFileChange(f); }} />
          {uploadingCv ? (
            <div className="space-y-2">
              <div className="w-8 h-8 border-4 border-slate-200 dark:border-slate-700 border-t-cyan-500 rounded-full animate-spin mx-auto" />
              <p className="text-cyan-600 dark:text-cyan-400 font-medium text-sm">{t.cvUploading}</p>
            </div>
          ) : data.cvUrl ? (
            <div className="space-y-1">
              <svg className="w-8 h-8 text-cyan-500 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
              </svg>
              <p className="text-cyan-600 dark:text-cyan-400 font-semibold text-sm">{data.cvFile?.name}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">{t.cvSuccess}</p>
            </div>
          ) : (
            <div className="space-y-1">
              <svg className="w-8 h-8 text-slate-400 dark:text-slate-500 mx-auto group-hover:text-cyan-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
              </svg>
              <p className="text-slate-600 dark:text-slate-300 text-sm font-medium">
                {t.cvDrag} <span className="text-cyan-600 dark:text-cyan-400">{t.cvClick}</span>
              </p>
              <p className="text-xs text-slate-400 dark:text-slate-500">{t.cvHint}</p>
            </div>
          )}
        </div>
        <Err msg={errors.cvFile} />
      </div>

      <div>
        <FL req>{t.researchLabel}</FL>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-1.5">{t.researchHint}</p>
        <FTa rows={3} placeholder={t.researchPh} value={data.researchInterests} onChange={e => onChange("researchInterests", e.target.value)} error={errors.researchInterests} />
      </div>

      <div>
        <FL>{t.pubLabel}</FL>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-1.5">{t.pubHint}</p>
        <FTa rows={3} placeholder={t.pubPh} value={data.publications} onChange={e => onChange("publications", e.target.value)} />
      </div>

      <div>
        <FL req>{t.motivationLabel}</FL>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-1.5">{t.motivationHint}</p>
        <FTa rows={4} placeholder={t.motivationPh} value={data.motivation} onChange={e => onChange("motivation", e.target.value)} error={errors.motivation} />
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div><FL>{t.achievementsLabel}</FL><FTa rows={3} placeholder={t.achievementsPh} value={data.achievements} onChange={e => onChange("achievements", e.target.value)} /></div>
        <div><FL>{t.futurePlansLabel}</FL><FTa rows={3} placeholder={t.futurePlansPh} value={data.futurePlans} onChange={e => onChange("futurePlans", e.target.value)} /></div>
      </div>

      {/* How did you hear about us */}
      <div className="border border-slate-200 dark:border-slate-700/60 bg-slate-50 dark:bg-slate-800/30 rounded-xl p-4 space-y-3">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-blue-100 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 flex items-center justify-center flex-shrink-0">
            <svg className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.34 15.84c-.688-.06-1.386-.09-2.09-.09H7.5a4.5 4.5 0 110-9h.75c.704 0 1.402-.03 2.09-.09m0 9.18c.253.962.584 1.892.985 2.783.247.55.06 1.21-.463 1.511l-.657.38c-.551.318-1.26.117-1.527-.461a20.845 20.845 0 01-1.44-4.282m3.102.069a18.03 18.03 0 01-.59-4.59c0-1.586.205-3.124.59-4.59m0 9.18a23.848 23.848 0 018.835 2.535M10.34 6.66a23.847 23.847 0 008.835-2.535m0 0A23.74 23.74 0 0018.795 3m.38 1.125a23.91 23.91 0 011.014 5.395m-1.014 8.855c-.118.38-.245.754-.38 1.125m.38-1.125a23.91 23.91 0 001.014-5.395m0-3.46c.495.413.811 1.035.811 1.73 0 .695-.316 1.317-.811 1.73m0-3.46a24.347 24.347 0 010 3.46" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-bold text-slate-800 dark:text-slate-100">{t.sourceTitle}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">{t.sourceDesc}</p>
          </div>
        </div>
        <div>
          <FL>{t.sourceLabel}</FL>
          <FSel value={data.source} onChange={e => onChange("source", e.target.value)}>
            <option value="">{t.sourcePh}</option>
            {t.sourceOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </FSel>
        </div>
        {showOther && (
          <div>
            <FL>{t.sourceOtherLabel}</FL>
            <FIn type="text" placeholder={t.sourceOtherPh} value={data.sourceOther} onChange={e => onChange("sourceOther", e.target.value)} />
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Success ──────────────────────────────────────────────────────────────────
function Success({ t, name }: { t: Translation; name: string }) {
  return (
    <div className="py-16 text-center space-y-8">
      <div className="relative inline-flex">
        <div className="w-24 h-24 rounded-full border-2 border-cyan-400 dark:border-cyan-500/40 bg-cyan-50 dark:bg-cyan-500/10 flex items-center justify-center">
          <svg className="w-12 h-12 text-cyan-600 dark:text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div className="absolute inset-0 rounded-full bg-cyan-400/20 dark:bg-cyan-400/10 animate-ping" />
      </div>
      <div className="space-y-2">
        <p className="text-cyan-600 dark:text-cyan-400 uppercase tracking-[0.25em] text-xs font-bold">{t.successTag}</p>
        <h2 className="text-3xl font-black text-slate-900 dark:text-white">
          {t.successTitle1}<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-blue-500">{name || "Applicant"}</span>
          {" "}{t.successTitle2}
        </h2>
        <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed max-w-md mx-auto">{t.successDesc}</p>
      </div>
      <div className="border border-slate-200 dark:border-slate-700/60 bg-slate-50 dark:bg-slate-800/40 rounded-2xl p-5 space-y-3 max-w-sm mx-auto">
        <p className="text-slate-500 dark:text-slate-400 text-xs">{t.followUs}</p>
        <div className="flex flex-wrap justify-center gap-5">
          {t.links.map(l => (
            <a key={l.href} href={l.href} target="_blank" rel="noopener noreferrer" className={`text-sm font-semibold transition-colors ${l.color}`}>{l.label} →</a>
          ))}
        </div>
      </div>
      <div className="flex flex-wrap justify-center gap-4">
        {ORGANIZERS.map(o => (
          <div key={o.alt} className="relative w-9 h-9">
            <Image src={o.src} alt={o.alt} fill className="object-contain opacity-50 dark:opacity-40" />
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Already Submitted Screen ────────────────────────────────────────────────
const ALREADY_MSG = {
  en: {
    tag: "Already Submitted",
    title1: "You've already", title2: "applied!",
    desc: "Our records show that an application has already been submitted from this device. If you believe this is a mistake, please contact the organizing committee directly.",
    contact: "Get in touch:",
    clearBtn: "Clear record and re-submit (use with caution)",
    clearConfirm: "This will clear your submission record from this device. Continue?",
  },
  vi: {
    tag: "Đã Nộp Đơn",
    title1: "Bạn đã", title2: "nộp đơn rồi!",
    desc: "Hệ thống ghi nhận rằng một hồ sơ đã được nộp từ thiết bị này. Nếu đây là nhầm lẫn, vui lòng liên hệ trực tiếp với ban tổ chức.",
    contact: "Liên hệ ban tổ chức:",
    clearBtn: "Xóa lịch sử và nộp lại (cẩn thận)",
    clearConfirm: "Thao tác này sẽ xóa lịch sử nộp đơn trên thiết bị. Tiếp tục?",
  },
};

function AlreadySubmitted({ lang, name, onClear }: { lang: Lang; name: string; onClear: () => void }) {
  const m = ALREADY_MSG[lang];
  return (
    <div className="py-14 text-center space-y-7">
      <div className="relative inline-flex">
        <div className="w-24 h-24 rounded-full border-2 border-amber-400 dark:border-amber-500/40 bg-amber-50 dark:bg-amber-500/10 flex items-center justify-center">
          <svg className="w-12 h-12 text-amber-500 dark:text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div className="absolute inset-0 rounded-full bg-amber-400/15 dark:bg-amber-400/10 animate-ping" />
      </div>
      <div className="space-y-2">
        <p className="text-amber-600 dark:text-amber-400 uppercase tracking-[0.25em] text-xs font-bold">{m.tag}</p>
        <h2 className="text-3xl font-black text-slate-900 dark:text-white leading-snug">
          {m.title1}<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">{name || "Applicant"}</span>
          {" "}{m.title2}
        </h2>
        <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed max-w-md mx-auto">{m.desc}</p>
      </div>
      <div className="border border-slate-200 dark:border-slate-700/60 bg-slate-50 dark:bg-slate-800/40 rounded-2xl p-5 space-y-2 max-w-xs mx-auto">
        <p className="text-slate-400 dark:text-slate-500 text-xs">{m.contact}</p>
        <a href="mailto:hpcc@hcmut.edu.vn" className="text-sm font-semibold text-cyan-600 dark:text-cyan-400 hover:text-cyan-500 dark:hover:text-cyan-300 transition-colors">
          hpcc@hcmut.edu.vn →
        </a>
      </div>
      <button
        onClick={onClear}
        className="text-xs text-slate-400 dark:text-slate-500 hover:text-red-500 dark:hover:text-red-400 underline underline-offset-2 transition-colors"
      >
        {m.clearBtn}
      </button>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
const LS_DRAFT = "hpc_ss_2026_draft";
const LS_DONE  = "hpc_ss_2026_submitted";

const EMPTY: FormData = {
  agreePrivacy: false, fullName: "", dob: "", studentId: "", emailUni: "",
  emailPersonal: "", phone: "", university: "", major: "", year: "", gpa: "",
  cvFile: null, cvUrl: "", researchInterests: "", publications: "",
  motivation: "", achievements: "", futurePlans: "", source: "", sourceOther: "",
};

export default function HPCSummerSchoolPage() {
  const [lang, setLang]                 = useState<Lang>("en");
  const t = T[lang];
  const [step, setStep]                 = useState(1);
  const [form, setForm]                 = useState<FormData>(EMPTY);
  const [errors, setErrors]             = useState<Errors>({});
  const [uploadingCv, setUploadingCv]   = useState(false);
  const [submitting, setSubmitting]     = useState(false);
  const [submitted, setSubmitted]       = useState(false);
  const [alreadySubmitted, setAlreadySubmitted] = useState(false);
  const [savedName, setSavedName]       = useState("");
  const [draftRestored, setDraftRestored] = useState(false);

  // ── Mount: check submitted flag or restore draft ──────────────────────────
  useEffect(() => {
    try {
      const done = localStorage.getItem(LS_DONE);
      if (done) {
        const parsed = JSON.parse(done);
        setSavedName(parsed.name || "");
        setAlreadySubmitted(true);
        return;
      }
      const raw = localStorage.getItem(LS_DRAFT);
      if (raw) {
        const draft = JSON.parse(raw);
        setForm(prev => ({ ...prev, ...draft, cvFile: null, cvUrl: "", agreePrivacy: false }));
        if (draft._step && draft._step > 1) setStep(draft._step);
        if (draft._lang) setLang(draft._lang as Lang);
        setDraftRestored(true);
      }
    } catch { /* ignore */ }
  }, []);

  // ── Auto-save draft (debounced 600 ms) ────────────────────────────────────
  useEffect(() => {
    if (submitted || alreadySubmitted) return;
    const timer = setTimeout(() => {
      try {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { cvFile, cvUrl, ...saveable } = form;
        localStorage.setItem(LS_DRAFT, JSON.stringify({ ...saveable, _step: step, _lang: lang }));
      } catch { /* ignore */ }
    }, 600);
    return () => clearTimeout(timer);
  }, [form, step, lang, submitted, alreadySubmitted]);

  const handleClear = () => {
    const msg = lang === "en"
      ? ALREADY_MSG.en.clearConfirm
      : ALREADY_MSG.vi.clearConfirm;
    if (!confirm(msg)) return;
    try { localStorage.removeItem(LS_DONE); localStorage.removeItem(LS_DRAFT); } catch { /* ignore */ }
    window.location.reload();
  };

  const set = (field: keyof FormData, value: string) => {
    setForm(p => ({ ...p, [field]: value }));
    if (errors[field]) setErrors(p => { const e = { ...p }; delete e[field]; return e; });
  };

  const handleFile = async (file: File) => {
    if (file.type !== "application/pdf") { setErrors(p => ({ ...p, cvFile: t.errCvType })); return; }
    if (file.size > 5 * 1024 * 1024)    { setErrors(p => ({ ...p, cvFile: t.errCvSize })); return; }
    setErrors(p => { const e = { ...p }; delete e.cvFile; return e; });
    setForm(p => ({ ...p, cvFile: file, cvUrl: "" }));
    setUploadingCv(true);
    try {
      const fd = new FormData(); fd.append("file", file);
      const res = await fetch("/api/upload-cloudinary", { method: "POST", body: fd });
      const json = await res.json();
      if (json.success) setForm(p => ({ ...p, cvUrl: json.url }));
      else setErrors(p => ({ ...p, cvFile: json.message || t.errCvFailed }));
    } catch { setErrors(p => ({ ...p, cvFile: t.errCvFailed })); }
    finally { setUploadingCv(false); }
  };

  const validate = () => {
    const e: Errors = {};
    if (step === 1) { if (!form.agreePrivacy) e.agreePrivacy = t.privacyError; }
    else if (step === 2) {
      if (!form.fullName.trim())   e.fullName   = t.errFullName;
      if (!form.studentId.trim())  e.studentId  = t.errStudentId;
      if (!form.emailUni.trim())   e.emailUni   = t.errEmailUni;
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.emailUni)) e.emailUni = t.errEmailFmt;
      if (!form.phone.trim())      e.phone      = t.errPhone;
      if (!form.university.trim()) e.university = t.errUniversity;
      if (!form.major.trim())      e.major      = t.errMajor;
      if (!form.year)              e.year       = t.errYear;
      if (!form.gpa.trim())        e.gpa        = t.errGpa;
    } else {
      if (!form.cvUrl) e.cvFile = !form.cvFile ? t.errCvRequired : uploadingCv ? t.errCvUploading : t.errCvFailed;
      if (!form.researchInterests.trim()) e.researchInterests = t.errResearch;
      if (!form.motivation.trim())        e.motivation        = t.errMotivation;
    }
    setErrors(e); return Object.keys(e).length === 0;
  };

  const next = () => { if (validate()) { setStep(s => s + 1); window.scrollTo({ top: 0, behavior: "smooth" }); } };
  const prev = () => { setStep(s => s - 1); window.scrollTo({ top: 0, behavior: "smooth" }); };

  const submit = async () => {
    if (!validate()) return;
    setSubmitting(true);
    try {
      // Capture client IP (non-critical — silently skip on failure)
      let clientIp = "Unknown";
      try {
        const ipRes  = await fetch("/api/get-ip");
        const ipJson = await ipRes.json();
        clientIp = ipJson.ip || "Unknown";
      } catch { /* ignore */ }

      const answers: Record<string, string> = {
        full_name: form.fullName, date_of_birth: form.dob, student_id: form.studentId,
        university_email: form.emailUni, personal_email: form.emailPersonal, phone: form.phone,
        university: form.university, major: form.major, year_of_study: form.year, gpa: form.gpa,
        cv_url: form.cvUrl, research_interests: form.researchInterests,
        publications: form.publications, motivation: form.motivation,
        achievements: form.achievements, future_plans: form.futurePlans,
        source: form.source, source_other: form.sourceOther,
        form_language: lang, client_ip: clientIp,
      };
      const res = await fetch("/api/submit-form", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          formId: "hpc-summer-school-2026-participant",
          formTitle: "Application Form — HPC Summer School 2026",
          sheetName: "HPC_Summer_School_2026", formType: "registration",
          questions: Object.keys(answers).map(k => ({ id: k, question: k })),
          answers, submittedAt: new Date().toISOString(),
          userAgent: typeof navigator !== "undefined" ? navigator.userAgent : "Unknown",
        }),
      });
      const json = await res.json();
      if (json.success) {
        // Persist submission flag → prevents re-submission from this browser
        try {
          localStorage.setItem(LS_DONE, JSON.stringify({ name: form.fullName, at: new Date().toISOString() }));
          localStorage.removeItem(LS_DRAFT);
        } catch { /* ignore */ }
        setSubmitted(true);
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else throw new Error(json.message);
    } catch (err) { alert("❌ An error occurred. Please try again."); console.error(err); }
    finally { setSubmitting(false); }
  };

  const progressPct = Math.round(((step - 1) / (t.steps.length - 1)) * 100);

  return (
    <div className="w-full">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-4 sm:py-6">

        {/* ── Compact header bar ── */}
        <div className="flex items-center justify-between gap-4 mb-5 pb-4 border-b border-slate-200 dark:border-slate-800">
          {/* Left: logo + title */}
          <div className="flex items-center gap-3 min-w-0">
            <div className="relative w-12 h-12 flex-shrink-0">
              <Image src={hpcLogo} alt="HPC Summer School" fill className="object-contain" />
            </div>
            <div className="min-w-0">
              <h1 className="text-base sm:text-lg font-black text-slate-900 dark:text-white leading-tight truncate">
                {t.title}
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{t.tagline}</p>
            </div>
          </div>

          {/* Right: org logos + theme + lang */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {/* Org logos — hidden on mobile */}
            <div className="hidden sm:flex items-center gap-2">
              {ORGANIZERS.map(o => (
                <div key={o.alt} className={`relative flex-shrink-0 ${o.cls}`}>
                  <Image src={o.src} alt={o.alt} fill className="object-contain opacity-70 hover:opacity-100 transition-opacity" />
                </div>
              ))}
            </div>
            <div className="w-px h-5 bg-slate-200 dark:bg-slate-700 hidden sm:block" />
            {/* Theme + Lang controls */}
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-1">
              <ThemeToggle size={15} className="!rounded-lg !p-1.5" />
              <div className="w-px h-4 bg-slate-300 dark:bg-slate-600" />
              <button
                onClick={() => setLang(l => l === "en" ? "vi" : "en")}
                className="flex items-center gap-1 px-2 py-1.5 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 hover:text-cyan-600 dark:hover:text-cyan-400 transition-all duration-200 active:scale-95"
                title={t.langToggle}
              >
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 21l5.25-11.25L21 21m-9-3h7.5M3 5.621a48.474 48.474 0 016-.371m0 0c1.12 0 2.233.038 3.334.114M9 5.25V3m3.334 2.364C11.176 10.658 7.69 15.08 3 17.502m9.334-12.138c.896.061 1.785.147 2.666.257m-4.589 8.495a18.023 18.023 0 01-3.827-5.802" />
                </svg>
                {lang === "en" ? "VI" : "EN"}
              </button>
            </div>
          </div>
        </div>

        {/* ── Progress tracker ── */}
        {!submitted && !alreadySubmitted && (
          <div className="mb-5">
            <div className="relative h-1 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden mb-3">
              <div
                className="absolute inset-y-0 left-0 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full transition-all duration-500"
                style={{ width: `${progressPct}%` }}
              />
            </div>
            <div className="flex justify-between">
              {t.steps.map((label, i) => {
                const s = i + 1;
                return (
                  <div key={s} className="flex flex-col items-center gap-1">
                    <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-bold transition-all duration-300
                      ${step === s ? "border-cyan-500 bg-cyan-50 dark:bg-cyan-900/20 text-cyan-600 dark:text-cyan-400"
                        : step > s  ? "border-cyan-500 bg-cyan-500 text-white"
                        : "border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-400 dark:text-slate-500"}`}
                    >
                      {step > s
                        ? <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                        : String(s).padStart(2, "0")}
                    </div>
                    <span className={`text-xs font-medium hidden sm:block text-center max-w-[90px] leading-tight ${step >= s ? "text-slate-700 dark:text-slate-300" : "text-slate-400 dark:text-slate-600"}`}>
                      {label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── Form card ── */}
        {/* Draft restored banner */}
        {draftRestored && !submitted && !alreadySubmitted && (
          <div className="mb-4 flex items-center justify-between gap-3 px-4 py-2.5 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800/60 rounded-xl text-xs text-blue-700 dark:text-blue-300">
            <span className="flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" /></svg>
              {lang === "en" ? "Your previous progress has been restored." : "Tiến độ điền form trước đó đã được khôi phục."}
            </span>
            <button onClick={() => setDraftRestored(false)} className="flex-shrink-0 hover:text-blue-900 dark:hover:text-blue-100 transition-colors">✕</button>
          </div>
        )}

        <div className="bg-white dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-8 shadow-sm dark:shadow-none">
          {submitted ? (
            <Success t={t} name={form.fullName} />
          ) : alreadySubmitted ? (
            <AlreadySubmitted lang={lang} name={savedName} onClear={handleClear} />
          ) : (
            <>
              {step === 1 && <Step1 t={t} agreed={form.agreePrivacy} onToggle={() => { setForm(p => ({ ...p, agreePrivacy: !p.agreePrivacy })); setErrors(p => { const e = { ...p }; delete e.agreePrivacy; return e; }); }} error={errors.agreePrivacy} />}
              {step === 2 && <Step2 t={t} data={form} errors={errors} onChange={set} />}
              {step === 3 && <Step3 t={t} data={form} errors={errors} onChange={set} onFileChange={handleFile} uploadingCv={uploadingCv} />}

              {/* Navigation */}
              <div className="flex items-center justify-between mt-8 pt-6 border-t border-slate-200 dark:border-slate-800">
                <button
                  onClick={prev} disabled={step === 1}
                  className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 active:scale-95
                    ${step === 1 ? "opacity-0 pointer-events-none"
                      : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"}`}
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" /></svg>
                  {t.back}
                </button>

                {step < t.steps.length ? (
                  <button onClick={next} className="flex items-center gap-1.5 px-7 py-2.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-sm font-bold rounded-xl shadow-sm shadow-cyan-900/20 dark:shadow-cyan-900/30 transition-all duration-200 active:scale-95">
                    {t.next}
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /></svg>
                  </button>
                ) : (
                  <button onClick={submit} disabled={submitting || uploadingCv}
                    className={`flex items-center gap-2 px-8 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-sm font-bold rounded-xl shadow-sm shadow-cyan-900/20 dark:shadow-cyan-900/30 transition-all duration-200 active:scale-95 ${(submitting || uploadingCv) ? "opacity-60 cursor-not-allowed" : ""}`}
                  >
                    {submitting
                      ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />{t.submitting}</>
                      : <><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" /></svg>{t.submit}</>}
                  </button>
                )}
              </div>
            </>
          )}
        </div>

        {/* ── Footer ── */}
        <footer className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400 dark:text-slate-500">
          <div className="flex items-center gap-3">
            {ORGANIZERS.map(o => (
              <div key={o.alt} className={`relative flex-shrink-0 ${o.cls}`}>
                <Image src={o.src} alt={o.alt} fill className="object-contain opacity-50 hover:opacity-80 transition-opacity" />
              </div>
            ))}
          </div>
          <div className="flex items-center gap-4">
            <a href="https://hpcc.hcmut.edu.vn/" target="_blank" rel="noopener noreferrer" className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">hpcc.hcmut.edu.vn</a>
            <span>·</span>
            <a href="https://bdc.hpcc.vn/" target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">bdc.hpcc.vn</a>
          </div>
        </footer>
      </div>
    </div>
  );
}
