"use client";

import React, { useState } from "react";
import { 
  GraduationCap, 
  Plus, 
  FileText, 
  Sparkles, 
  Settings, 
  Cpu, 
  Database, 
  Network, 
  CheckCircle, 
  ChevronRight, 
  Info,
  Clock,
  RotateCw,
  FolderPlus,
  Play
} from "lucide-react";
import { cn } from "@/lib/utils";

// Types
interface GeneratedQuestion {
  question: string;
  options: string[];
  answer: string;
}

export function InstructorGuideView() {
  const [activeTab, setActiveTab] = useState<number>(0);

  // 1. Create Course State
  const [courseName, setCourseName] = useState("");
  const [courseDesc, setCourseDesc] = useState("");
  const [createStep, setCreateStep] = useState<"idle" | "creating" | "success">("idle");

  // 2. Add Content State
  const [sections, setSections] = useState<string[]>([
    "Chương 1: Giới thiệu Tổng quan",
    "Chương 2: Lập trình cơ bản với dữ liệu"
  ]);
  const [newSectionName, setNewSectionName] = useState("");

  // 3. Quiz Settings State
  const [quizMode, setQuizMode] = useState<"mcq" | "fill_blank" | "file_upload">("mcq");

  // 4. AI Indexing State
  const [indexState, setIndexState] = useState<Record<string, "idle" | "pending" | "chunking" | "vector" | "neo4j" | "success">>({
    "intro_spark.pdf": "success",
    "advanced_spark.pdf": "idle"
  });

  // 5. AI Quiz Gen State
  const [selectedDoc, setSelectedDoc] = useState("intro_spark.pdf");
  const [numQuestions, setNumQuestions] = useState(3);
  const [difficulty, setDifficulty] = useState("medium");
  const [quizGenStatus, setQuizGenStatus] = useState<"idle" | "generating" | "success">("idle");
  const [generatedQuestions, setGeneratedQuestions] = useState<GeneratedQuestion[]>([]);

  // Simulation handlers
  const handleCreateCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseName.trim()) return;
    setCreateStep("creating");
    setTimeout(() => {
      setCreateStep("success");
    }, 1500);
  };

  const handleAddSection = () => {
    if (!newSectionName.trim()) return;
    setSections(prev => [...prev, newSectionName]);
    setNewSectionName("");
  };

  const handleIndexAI = (fileName: string) => {
    setIndexState(prev => ({ ...prev, [fileName]: "pending" }));
    
    // Simulate pipeline steps
    setTimeout(() => {
      setIndexState(prev => ({ ...prev, [fileName]: "chunking" }));
      setTimeout(() => {
        setIndexState(prev => ({ ...prev, [fileName]: "vector" }));
        setTimeout(() => {
          setIndexState(prev => ({ ...prev, [fileName]: "neo4j" }));
          setTimeout(() => {
            setIndexState(prev => ({ ...prev, [fileName]: "success" }));
          }, 800);
        }, 800);
      }, 800);
    }, 800);
  };

  const handleGenerateAIQuiz = () => {
    setQuizGenStatus("generating");
    setGeneratedQuestions([]);
    
    setTimeout(() => {
      setQuizGenStatus("success");
      setGeneratedQuestions([
        {
          question: "Apache Spark sử dụng cấu trúc dữ liệu chính nào dưới đây?",
          options: ["RDD (Resilient Distributed Dataset)", "MySQL Table", "Hadoop DFS Files", "Graph DB Nodes"],
          answer: "RDD (Resilient Distributed Dataset)"
        },
        {
          question: "Đâu là thành phần tối ưu hóa truy vấn Spark SQL?",
          options: ["Spark Streaming", "Catalyst Optimizer", "MapReduce Engine", "YARN Resource Manager"],
          answer: "Catalyst Optimizer"
        },
        {
          question: "Spark nhanh hơn Hadoop MapReduce chủ yếu do yếu tố nào?",
          options: ["Sử dụng ngôn ngữ Scala", "Tính toán trong bộ nhớ trong (In-memory computation)", "Bỏ qua lớp bảo mật", "Không cần lưu trữ dữ liệu"],
          answer: "Tính toán trong bộ nhớ trong (In-memory computation)"
        }
      ]);
    }, 2000);
  };

  const guideSteps = [
    {
      title: "1. Tạo Khóa học mới",
      icon: Plus,
      desc: "Cách khởi tạo khóa học và thiết lập thông tin cơ bản.",
      details: [
        { title: "Truy cập tạo mới", text: "Vào Dashboard Giảng viên (/lms/teacher), nhấp chọn 'Khóa học' rồi bấm nút '+ Tạo khóa học' để mở form (/lms/teacher/courses/create)." },
        { title: "Khai báo thông tin", text: "Nhập Tên khóa học đầy đủ, viết mô tả tóm tắt nội dung học tập, đặt cấu hình chế độ hiển thị (công khai hoặc giới hạn người học)." },
        { title: "Ảnh đại diện khóa học", text: "Tải lên ảnh bìa đại diện của khóa học (kích thước tối ưu 16:9) để hiển thị bắt mắt trên trang khám phá." }
      ]
    },
    {
      title: "2. Quản lý Tài liệu Học tập",
      icon: FolderPlus,
      desc: "Xây dựng khung bài giảng và đăng tải các tài liệu PDF/Video bài học.",
      details: [
        { title: "Tạo cấu trúc Section", text: "Bên trong tab 'Bài học' của khóa học, chọn '+ Thêm Section' để chia khóa học thành các chương mục logic." },
        { title: "Upload tài liệu học tập", text: "Tại mỗi Section, bấm 'Thêm nội dung', chọn loại tài liệu (PDF bài giảng, Video hoặc ghi chú Markdown). Hệ thống tải file trực tiếp lên MinIO." },
        { title: "Sắp xếp thứ tự học", text: "Sử dụng thao tác kéo thả (drag & drop) đơn giản để thay đổi thứ tự các chương mục hoặc bài học theo đúng lộ trình mong muốn." }
      ]
    },
    {
      title: "3. Biên soạn Quiz & Bài tập",
      icon: Settings,
      desc: "Tạo ngân hàng câu hỏi kiểm tra dưới nhiều định dạng phong phú.",
      details: [
        { title: "Khởi tạo bài kiểm tra", text: "Bấm nút 'Thêm nội dung' trong Section và chọn loại 'Quiz'. Cài đặt thời gian làm bài, điểm đạt yêu cầu, và số lần làm bài tối đa." },
        { title: "Lựa chọn loại câu hỏi", text: "Hệ thống hỗ trợ câu hỏi trắc nghiệm (MCQ), câu hỏi điền vào chỗ trống dạng chọn Dropdown hoặc dạng điền Text tự do." },
        { title: "Cài đặt đáp án & Giải thích", text: "Đặt đáp án chính xác cho hệ thống tự chấm điểm và viết phần Giải thích đáp án chi tiết phục vụ học viên ôn tập." }
      ]
    },
    {
      title: "4. Index tài liệu cho AI (RAG)",
      icon: Database,
      desc: "Kích hoạt tính năng đọc hiểu tài liệu tự động của Trợ lý AI.",
      details: [
        { title: "Nhấp nút Index AI", text: "Tại danh mục tài liệu đã tải lên, bạn sẽ thấy nút 'Index AI' (biểu tượng robot/sấm sét) bên cạnh các tệp tin định dạng PDF." },
        { title: "Theo dõi Pipeline xử lý", text: "Khi nhấn Index AI, một yêu cầu sẽ gửi qua Kafka: Ingest tài liệu -> Cắt nhỏ văn bản (Chunking) -> Lưu Vector Embeddings vào Qdrant DB." },
        { title: "Đồng bộ Sơ đồ tri thức", text: "Sau khi lưu Vector, hệ thống tự động trích xuất thực thể để lưu vào Neo4j Graph DB giúp chatbot AI trả lời cực kỳ chính xác ngữ cảnh." }
      ]
    },
    {
      title: "5. Các Tác vụ AI Hỗ trợ",
      icon: Sparkles,
      desc: "Tự động tạo Quiz đề thi và quản lý Sơ đồ tri thức bằng AI.",
      details: [
        { title: "AI Quiz Generator", text: "Vào mục AI của khóa học, sử dụng công cụ tạo quiz tự động: Chọn tài liệu làm nguồn, chọn số lượng câu, chọn độ khó. AI sẽ sinh đề thi chỉ trong 5 giây!" },
        { title: "Knowledge Graph Manager", text: "Xem trực quan sơ đồ liên kết tri thức (Graph View). Bạn có thể thêm nút khái niệm mới, liên kết chúng lại hoặc củng cố sơ đồ bằng nút củng cố." },
        { title: "Trợ lý ảo Teacher AI", text: "Truy cập mục 'AI Assistant' dành riêng cho giảng viên để trò chuyện, nhờ AI soạn thảo đề cương bài giảng hoặc viết gợi ý quiz nhanh." }
      ]
    }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="bg-blue-600 p-3 rounded-2xl shadow-sm text-white">
          <GraduationCap className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-slate-50 leading-tight">
            Hướng dẫn Giảng viên từ A - Z
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5">
            Cẩm nang quản lý khóa học, tạo đề thi tự động và vận hành các tác vụ AI thông minh.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Side: Steps Navigation */}
        <div className="lg:col-span-4 space-y-3">
          <p className="text-xs font-semibold text-slate-400 dark:text-slate-600 uppercase tracking-wider px-1">
            Mục lục hướng dẫn
          </p>
          <div className="space-y-1">
            {guideSteps.map((step, idx) => {
              const Icon = step.icon;
              const isActive = activeTab === idx;
              return (
                <button
                  key={idx}
                  onClick={() => {
                    setActiveTab(idx);
                    // Reset simulator states
                    if (idx === 0) setCreateStep("idle");
                    if (idx === 4) { setQuizGenStatus("idle"); setGeneratedQuestions([]); }
                  }}
                  className={cn(
                    "w-full text-left flex gap-3.5 p-4 rounded-2xl border transition-all duration-200 active:scale-98",
                    isActive
                      ? "bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/10"
                      : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-700"
                  )}
                >
                  <Icon className={cn("h-5 w-5 flex-shrink-0 mt-0.5", isActive ? "text-white" : "text-blue-500")} />
                  <div className="min-w-0">
                    <p className="font-bold text-sm leading-snug">{step.title}</p>
                    <p className={cn("text-xs mt-1 truncate", isActive ? "text-blue-100" : "text-slate-500 dark:text-slate-500")}>
                      {step.desc}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Side: Step details & Mockup */}
        <div className="lg:col-span-8 space-y-6">
          {/* Instructions card */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-50 mb-4 flex items-center gap-2">
              <span className="bg-blue-50 dark:bg-slate-800 text-blue-600 px-3 py-1 rounded-lg text-sm">
                Chi tiết
              </span>
              {guideSteps[activeTab].title.substring(3)}
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Detailed Steps text */}
              <div className="space-y-4">
                {guideSteps[activeTab].details.map((detail, stepIdx) => (
                  <div key={stepIdx} className="flex gap-3 items-start">
                    <div className="bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-full h-5 w-5 flex items-center justify-center text-xs font-semibold flex-shrink-0 mt-0.5">
                      {stepIdx + 1}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">{detail.title}</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">{detail.text}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Alert Tips */}
              <div className="bg-blue-50/50 dark:bg-slate-800/40 border border-blue-100 dark:border-blue-900/30 rounded-xl p-4 self-start">
                <div className="flex gap-2.5">
                  <Info className="h-4 w-4 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h5 className="text-xs font-bold text-blue-950 dark:text-blue-300">Lưu ý Giảng dạy</h5>
                    <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                      {activeTab === 0 && "Nên đặt tiêu đề khóa học rõ ràng kèm mã học phần (nếu có). Điền mô tả chi tiết để tăng tỷ lệ đăng ký của học viên."}
                      {activeTab === 1 && "Định dạng file PDF tối ưu nhất nên dưới 15MB để quá trình đọc tài liệu trên trình duyệt diễn ra mượt mà nhất."}
                      {activeTab === 2 && "Bạn có thể trộn ngẫu nhiên câu hỏi bằng cách kích hoạt cài đặt Shuffle trong Quiz settings trước khi xuất bản."}
                      {activeTab === 3 && "Vui lòng đợi trạng thái Index hiển thị màu xanh lá cây thành công trước khi yêu cầu học viên hỏi đáp tài liệu đó."}
                      {activeTab === 4 && "Đề thi được sinh ra bằng AI có thể chỉnh sửa lại dễ dàng. Bạn nên kiểm tra lại các đáp án do AI sinh trước khi công bố đề thi."}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Mockup container */}
          <div className="space-y-2">
            <div className="flex justify-between items-center px-1">
              <p className="text-xs font-semibold text-slate-400 dark:text-slate-600 uppercase tracking-wider">
                Giao diện giảng viên minh họa (Có thể tương tác)
              </p>
              {activeTab === 0 && createStep !== "idle" && (
                <button onClick={() => setCreateStep("idle")} className="text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 font-medium">
                  <RotateCw className="h-3 w-3" /> Reset Mockup
                </button>
              )}
            </div>

            <div className="bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800/80 rounded-2xl p-4 sm:p-6 shadow-inner min-h-[300px] flex items-center justify-center">
              
              {/* MOCKUP 1: CREATE COURSE */}
              {activeTab === 0 && (
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 w-full max-w-sm shadow-md space-y-3">
                  <h4 className="text-xs font-extrabold text-slate-800 dark:text-slate-200 border-b border-slate-100 dark:border-slate-800 pb-2">
                    Tạo khóa học mới
                  </h4>

                  {createStep !== "success" ? (
                    <form onSubmit={handleCreateCourse} className="space-y-3">
                      <div className="space-y-1">
                        <label className="text-[9px] font-bold text-slate-500">TÊN KHÓA HỌC *</label>
                        <input
                          type="text"
                          required
                          value={courseName}
                          onChange={(e) => setCourseName(e.target.value)}
                          placeholder="e.g. Lập trình Big Data với Spark"
                          className="w-full bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 rounded-lg p-2 text-[10px] text-slate-900 dark:text-slate-150 outline-none focus:border-blue-500"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] font-bold text-slate-500">MÔ TẢ KHÓA HỌC</label>
                        <textarea
                          rows={2}
                          value={courseDesc}
                          onChange={(e) => setCourseDesc(e.target.value)}
                          placeholder="Mô tả tóm tắt nội dung học tập..."
                          className="w-full bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 rounded-lg p-2 text-[10px] text-slate-900 dark:text-slate-150 outline-none focus:border-blue-500 resize-none"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={createStep === "creating"}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg py-1.5 text-xs transition-all active:scale-95 shadow-sm flex items-center justify-center gap-1.5"
                      >
                        {createStep === "creating" && <span className="h-3 w-3 border-2 border-white border-t-transparent rounded-full animate-spin"></span>}
                        {createStep === "creating" ? "Đang xử lý..." : "Lưu & Tiếp tục"}
                      </button>
                    </form>
                  ) : (
                    <div className="text-center py-4 space-y-3">
                      <div className="h-10 w-10 bg-green-100 dark:bg-green-950 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center mx-auto text-xl">
                        ✓
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-800 dark:text-slate-200">Khóa học đã được khởi tạo!</p>
                        <p className="text-[9px] text-slate-400 mt-0.5">Tiếp theo, bạn có thể thêm Section và bài học.</p>
                      </div>
                      <button 
                        onClick={() => { setCourseName(""); setCourseDesc(""); setCreateStep("idle"); }}
                        className="text-[9px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-350 px-3 py-1 rounded hover:bg-slate-200 dark:hover:bg-slate-750 font-bold transition-all"
                      >
                        Tạo khóa học khác
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* MOCKUP 2: ADD CONTENT */}
              {activeTab === 1 && (
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl w-full max-w-sm shadow-md p-4 space-y-3">
                  <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-2">
                    <h4 className="text-xs font-extrabold text-slate-800 dark:text-slate-200">Cấu trúc bài giảng</h4>
                    <span className="text-[9px] text-blue-600 font-bold">{sections.length} Section(s)</span>
                  </div>

                  {/* Sections list */}
                  <div className="space-y-2 max-h-[140px] overflow-y-auto pr-1">
                    {sections.map((sec, idx) => (
                      <div key={idx} className="bg-slate-50 dark:bg-slate-850 border border-slate-150 dark:border-slate-800 rounded-lg p-2 flex items-center justify-between">
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="text-[8px] bg-blue-500/20 text-blue-600 dark:text-blue-400 font-black px-1 py-0.5 rounded">S{idx+1}</span>
                          <span className="text-[9.5px] font-bold text-slate-800 dark:text-slate-200 truncate">{sec}</span>
                        </div>
                        <span className="text-[8px] text-slate-400 cursor-grab">⋮⋮</span>
                      </div>
                    ))}
                  </div>

                  {/* Add section form */}
                  <div className="flex gap-1.5 pt-2 border-t border-slate-100 dark:border-slate-800">
                    <input
                      type="text"
                      value={newSectionName}
                      onChange={(e) => setNewSectionName(e.target.value)}
                      placeholder="Tên chương bài giảng mới..."
                      className="flex-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1 text-[9px] text-slate-800 dark:text-slate-200 outline-none"
                    />
                    <button
                      onClick={handleAddSection}
                      className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-2.5 py-1 text-[9px] font-bold transition-all active:scale-95 flex items-center gap-0.5"
                    >
                      <Plus className="h-3 w-3" /> Thêm
                    </button>
                  </div>
                </div>
              )}

              {/* MOCKUP 3: QUIZ EDITOR */}
              {activeTab === 2 && (
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl w-full max-w-sm shadow-md p-4 space-y-3">
                  <div className="border-b border-slate-100 dark:border-slate-800 pb-2">
                    <h4 className="text-xs font-extrabold text-slate-850 dark:text-slate-200">Biên soạn Câu hỏi</h4>
                  </div>

                  {/* Mode Selector */}
                  <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
                    {[
                      { mode: "mcq", label: "Trắc nghiệm" },
                      { mode: "fill_blank", label: "Điền từ" },
                      { mode: "file_upload", label: "Tải file" }
                    ].map((item) => (
                      <button
                        key={item.mode}
                        onClick={() => setQuizMode(item.mode as any)}
                        className={cn(
                          "flex-1 text-[8px] font-bold py-1 rounded-md transition-all",
                          quizMode === item.mode 
                            ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-50 shadow-sm" 
                            : "text-slate-400 hover:text-slate-600"
                        )}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>

                  {/* Render content depending on selected mode */}
                  <div className="border border-slate-100 dark:border-slate-800 rounded-lg p-2.5 bg-slate-50/50 dark:bg-slate-900/30 min-h-[110px] flex flex-col justify-between">
                    {quizMode === "mcq" && (
                      <div className="space-y-1.5">
                        <p className="text-[9px] font-bold text-slate-500">Mẫu trắc nghiệm (MCQ):</p>
                        <div className="h-6 bg-white dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700 px-2 flex items-center text-[9px] text-slate-700 dark:text-slate-350">
                          Nhập câu hỏi: e.g. RDD là gì?
                        </div>
                        <div className="grid grid-cols-2 gap-1">
                          <div className="h-5 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 rounded px-1.5 flex items-center text-[7px] text-slate-400">A. HDFS Files</div>
                          <div className="h-5 border border-green-500 bg-green-500/5 rounded px-1.5 flex items-center justify-between text-[7px] text-green-600 font-bold">
                            <span>B. Distributed Dataset</span>
                            <span>✓</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {quizMode === "fill_blank" && (
                      <div className="space-y-1.5">
                        <p className="text-[9px] font-bold text-slate-500">Mẫu điền vào chỗ trống:</p>
                        <p className="text-[8px] text-slate-400 leading-normal">
                          Viết câu chứa đáp án đặt trong dấu ngoặc nhọn. Ví dụ: Apache Spark được phát triển tại trường đại học {"{UC Berkeley}"}.
                        </p>
                        <div className="h-10 bg-white dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700 p-1.5 text-[8.5px] text-slate-500">
                          Spark được lập trình chủ yếu bằng ngôn ngữ {"{Scala}"}.
                        </div>
                      </div>
                    )}

                    {quizMode === "file_upload" && (
                      <div className="space-y-1.5">
                        <p className="text-[9px] font-bold text-slate-500">Mẫu bài tập tự luận nộp tệp:</p>
                        <div className="h-8 bg-white dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700 px-2 flex items-center text-[9px] text-slate-400">
                          Nhập yêu cầu: e.g. Viết báo cáo thực hành Spark...
                        </div>
                        <div className="text-[7.5px] text-slate-400">Giới hạn định dạng: PDF, ZIP, DOCX. Dung lượng tối đa: 50MB.</div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* MOCKUP 4: AI INDEXING PIPELINE */}
              {activeTab === 3 && (
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl w-full max-w-sm shadow-md p-4 space-y-3">
                  <h4 className="text-xs font-extrabold text-slate-800 dark:text-slate-200 border-b border-slate-100 dark:border-slate-850 pb-2">
                    Ingestion & Indexing Status
                  </h4>

                  {/* Documents with status */}
                  <div className="space-y-2">
                    {[
                      { name: "intro_spark.pdf", size: "1.2 MB" },
                      { name: "advanced_spark.pdf", size: "2.4 MB" }
                    ].map((doc) => {
                      const state = indexState[doc.name];
                      return (
                        <div key={doc.name} className="border border-slate-100 dark:border-slate-800 rounded-lg p-2.5 bg-slate-50/50 dark:bg-slate-900/10 space-y-2">
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="text-[9.5px] font-bold text-slate-800 dark:text-slate-200">{doc.name}</p>
                              <p className="text-[8px] text-slate-400 mt-0.5">{doc.size}</p>
                            </div>
                            
                            {state === "idle" && (
                              <button
                                onClick={() => handleIndexAI(doc.name)}
                                className="bg-blue-600 hover:bg-blue-700 text-white font-bold rounded px-2 py-1 text-[8.5px] transition-all active:scale-95 flex items-center gap-0.5"
                              >
                                <Sparkles className="h-2.5 w-2.5" /> Index AI
                              </button>
                            )}

                            {state === "success" && (
                              <span className="bg-green-500/10 text-green-600 dark:text-green-400 text-[8.5px] font-bold border border-green-500/20 px-1.5 py-0.5 rounded flex items-center gap-0.5">
                                <CheckCircle className="h-2.5 w-2.5" /> Hoàn thành
                              </span>
                            )}

                            {state !== "idle" && state !== "success" && (
                              <span className="text-[8.5px] text-blue-600 dark:text-blue-400 font-bold flex items-center gap-1">
                                <span className="h-2 w-2 border border-blue-500 border-t-transparent rounded-full animate-spin"></span>
                                Đang index...
                              </span>
                            )}
                          </div>

                          {/* Indexing pipeline animation steps */}
                          {state !== "idle" && (
                            <div className="grid grid-cols-4 gap-1 pt-1.5 border-t border-slate-100 dark:border-slate-800">
                              {[
                                { step: "pending", icon: Clock, label: "Kafka" },
                                { step: "chunking", icon: Cpu, label: "Chunk" },
                                { step: "vector", icon: Database, label: "Qdrant" },
                                { step: "neo4j", icon: Network, label: "Neo4j" }
                              ].map((item, indexIdx) => {
                                const stepOrder = ["pending", "chunking", "vector", "neo4j", "success"];
                                const isDone = stepOrder.indexOf(state) > stepOrder.indexOf(item.step);
                                const isCurrent = state === item.step;
                                const StepIcon = item.icon;
                                return (
                                  <div 
                                    key={item.step} 
                                    className={cn(
                                      "p-1 rounded flex flex-col items-center justify-center text-[7px] font-bold border transition-colors",
                                      isDone 
                                        ? "bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-900/30 text-green-600 dark:text-green-400"
                                        : isCurrent
                                          ? "bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900/30 text-blue-600 dark:text-blue-400 animate-pulse"
                                          : "bg-slate-50 dark:bg-slate-850 border-slate-100 dark:border-slate-800 text-slate-400"
                                    )}
                                  >
                                    <StepIcon className="h-3 w-3 mb-0.5" />
                                    <span>{item.label}</span>
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* MOCKUP 5: AI TASKS */}
              {activeTab === 4 && (
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl w-full max-w-sm shadow-md p-4 space-y-3">
                  <div className="flex items-center gap-1.5 border-b border-slate-100 dark:border-slate-850 pb-2">
                    <Sparkles className="h-4 w-4 text-blue-600" />
                    <h4 className="text-xs font-extrabold text-slate-850 dark:text-slate-200">AI Quiz Generator</h4>
                  </div>

                  {quizGenStatus !== "success" ? (
                    <div className="space-y-2.5">
                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-1">
                          <label className="text-[8px] font-bold text-slate-400">CHỌN TÀI LIỆU NGUỒN</label>
                          <select 
                            value={selectedDoc} 
                            onChange={(e) => setSelectedDoc(e.target.value)}
                            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-1.5 text-[8.5px] outline-none"
                          >
                            <option value="intro_spark.pdf">intro_spark.pdf</option>
                            <option value="advanced_spark.pdf">advanced_spark.pdf</option>
                          </select>
                        </div>
                        <div className="space-y-1">
                          <label className="text-[8px] font-bold text-slate-400">ĐỘ KHÓ ĐỀ THI</label>
                          <div className="flex bg-slate-50 dark:bg-slate-800 p-0.5 rounded-lg border border-slate-200 dark:border-slate-750">
                            {["easy", "medium", "hard"].map((diff) => (
                              <button 
                                key={diff}
                                onClick={() => setDifficulty(diff)}
                                className={cn("flex-1 py-1 rounded text-[7.5px] font-bold capitalize", difficulty === diff ? "bg-white dark:bg-slate-900 text-blue-600" : "text-slate-400")}
                              >
                                {diff === "easy" ? "Dễ" : diff === "medium" ? "TB" : "Khó"}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[8px] font-bold text-slate-400">SỐ LƯỢNG CÂU HỎI: {numQuestions}</label>
                        <input
                          type="range"
                          min="1"
                          max="5"
                          value={numQuestions}
                          onChange={(e) => setNumQuestions(Number(e.target.value))}
                          className="w-full h-1 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
                        />
                      </div>

                      <button
                        onClick={handleGenerateAIQuiz}
                        disabled={quizGenStatus === "generating"}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg py-1.5 text-xs transition-all active:scale-95 shadow-sm flex items-center justify-center gap-1"
                      >
                        {quizGenStatus === "generating" ? (
                          <>
                            <span className="h-3 w-3 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                            AI Đang biên soạn đề thi...
                          </>
                        ) : (
                          <>
                            <Sparkles className="h-3 w-3" /> Sinh đề thi tự động bằng AI
                          </>
                        )}
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-2.5">
                      <div className="flex justify-between items-center text-[8.5px] text-green-600 font-bold bg-green-500/10 px-2 py-1 rounded border border-green-500/20">
                        <span>✓ Đã sinh thành công {numQuestions} câu hỏi!</span>
                        <button 
                          onClick={() => setQuizGenStatus("idle")} 
                          className="text-[7.5px] text-slate-500 underline"
                        >
                          Làm lại
                        </button>
                      </div>

                      {/* Generated questions list */}
                      <div className="space-y-2 max-h-[140px] overflow-y-auto pr-1">
                        {generatedQuestions.map((q, idx) => (
                          <div key={idx} className="border border-slate-150 dark:border-slate-800 rounded p-2 bg-slate-50/50 dark:bg-slate-900/20 space-y-1 text-left">
                            <p className="text-[9px] font-bold text-slate-800 dark:text-slate-200">Câu {idx+1}: {q.question}</p>
                            <div className="grid grid-cols-2 gap-1 text-[7.5px]">
                              {q.options.map((opt) => (
                                <span 
                                  key={opt} 
                                  className={cn(
                                    "p-0.5 rounded border border-slate-100 dark:border-slate-800 pl-1",
                                    opt === q.answer ? "bg-green-500/10 text-green-600 border-green-200 dark:border-green-900/30 font-bold" : "text-slate-400"
                                  )}
                                >
                                  {opt}
                                </span>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
