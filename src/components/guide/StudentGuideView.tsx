"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
  BookOpen, 
  Search, 
  Check, 
  Play, 
  FileText, 
  Sparkles, 
  Send, 
  RotateCw, 
  BrainCircuit,
  HelpCircle,
  Video,
  FileCheck,
  Award,
  ChevronRight,
  UserCheck
} from "lucide-react";
import { cn } from "@/lib/utils";

// Types
interface Message {
  id: string;
  sender: "user" | "ai";
  text: string;
}

export function StudentGuideView() {
  const [activeTab, setActiveTab] = useState<number>(0);

  // 1. Discover State
  const [enrollStatus, setEnrollStatus] = useState<"idle" | "loading" | "enrolled">("idle");
  
  // 2. Lesson Viewer State
  const [lessonTab, setLessonTab] = useState<"pdf" | "video" | "markdown">("pdf");
  const [isPlaying, setIsPlaying] = useState(false);

  // 3. Quiz State
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  // 4. Chatbot State
  const [messages, setMessages] = useState<Message[]>([
    { id: "1", sender: "ai", text: "Xin chào! Mình là trợ lý học tập AI Mentor. Mình có thể giải thích nội dung bài giảng, tóm tắt tài liệu PDF hoặc hỗ trợ bạn làm quiz. Bạn cần giúp gì nào?" }
  ]);
  const [chatInput, setChatInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // 5. Flashcard State
  const [isFlipped, setIsFlipped] = useState(false);
  const [cardLevel, setCardLevel] = useState<string | null>(null);

  // Auto-scroll chat to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // Handle Enrollment simulation
  const handleEnroll = () => {
    setEnrollStatus("loading");
    setTimeout(() => {
      setEnrollStatus("enrolled");
    }, 1200);
  };

  const resetEnroll = () => {
    setEnrollStatus("idle");
  };

  // Handle Chatbot simulation
  const handleSendMessage = (textToSend?: string) => {
    const text = textToSend || chatInput;
    if (!text.trim()) return;

    // Add user message
    const userMsgId = Date.now().toString();
    setMessages(prev => [...prev, { id: userMsgId, sender: "user", text }]);
    if (!textToSend) setChatInput("");
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      setIsTyping(false);
      let aiText = "Xin lỗi, mình chưa có dữ liệu cho câu hỏi này. Bạn hãy thử chọn một chủ đề gợi ý ở dưới nhé!";
      const query = text.toLowerCase();
      
      if (query.includes("rdd") || query.includes("resilient")) {
        aiText = "RDD (Resilient Distributed Dataset) là cấu trúc dữ liệu cốt lõi của Spark. Nó là tập hợp các đối tượng được phân tán trên các nút của cụm máy chủ và có thể xử lý song song. Điểm đặc biệt của RDD là tính năng phục hồi lỗi tự động (Resilient) nhờ vào đồ thị tuần tự thực thi (Lineage Graph).";
      } else if (query.includes("tóm tắt") || query.includes("pdf")) {
        aiText = "Tài liệu PDF 'Chương 2: Apache Spark Dataframe' nói về cách khởi tạo SparkSession, đọc dữ liệu từ tệp CSV/JSON vào DataFrame và thực hiện các phép biến đổi như select, filter, groupBy. Điểm cốt lõi là cơ chế tối ưu hóa truy vấn của Catalyst Optimizer.";
      } else if (query.includes("spark") && query.includes("mapreduce")) {
        aiText = "Điểm khác biệt lớn nhất là tốc độ: Apache Spark thực hiện tính toán trên bộ nhớ trong (in-memory processing), trong khi MapReduce phải đọc/ghi liên tục xuống đĩa cứng (HDFS). Nhờ đó, Spark nhanh hơn MapReduce gấp 10-100 lần đối với các tác vụ lặp đi lặp lại (như học máy).";
      }

      setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), sender: "ai", text: aiText }]);
    }, 1000);
  };

  const handleSuggestClick = (prompt: string) => {
    handleSendMessage(prompt);
  };

  const guideSteps = [
    {
      title: "1. Khám phá & Đăng ký Khóa học",
      icon: Search,
      desc: "Tìm kiếm và tham gia vào các khóa học chất lượng cao.",
      details: [
        { title: "Truy cập Khám phá", text: "Từ menu chính, chọn 'Shared Knowledge' rồi chuyển đến mục 'Khám phá Khóa học' (/lms/student/discover)." },
        { title: "Tìm kiếm & Lọc", text: "Sử dụng thanh tìm kiếm theo tên khóa học, hoặc lọc theo danh mục học tập phù hợp với mục tiêu của bạn." },
        { title: "Đăng ký một chạm", text: "Bấm nút 'Đăng ký' để ghi danh ngay lập tức và bắt đầu hành trình học tập." }
      ]
    },
    {
      title: "2. Xem tài liệu & Học tập",
      icon: BookOpen,
      desc: "Học tập linh hoạt với nhiều loại tài liệu (PDF, Video, Markdown).",
      details: [
        { title: "Vào lớp học", text: "Truy cập Dashboard học viên (/lms/student) để thấy danh sách các khóa học bạn đã đăng ký." },
        { title: "Trình duyệt thông minh", text: "Bên trong khóa học, chọn các bài học trong Outline. Trình xem tài liệu hỗ trợ định dạng PDF, Video bài giảng trực quan, hoặc bài viết ghi chú." },
        { title: "Tự động lưu tiến độ", text: "Hệ thống sẽ ghi nhận trạng thái hoàn thành khi bạn xem hết video hoặc cuộn hết tài liệu." }
      ]
    },
    {
      title: "3. Làm bài Kiểm tra (Quiz)",
      icon: FileCheck,
      desc: "Kiểm tra kiến thức trực tiếp và nhận đánh giá chi tiết tức thì.",
      details: [
        { title: "Bắt đầu làm bài", text: "Nhấp vào các mục Quiz trong Outline. Đọc kỹ yêu cầu, số lần thử và thời gian làm bài trước khi bấm bắt đầu." },
        { title: "Đa dạng định dạng", text: "Làm các câu hỏi trắc nghiệm, điền vào chỗ trống (dạng chọn dropdown hoặc gõ văn bản), hoặc tải file lên đối với bài tập tự luận." },
        { title: "Phản hồi thông minh", text: "Sau khi nộp bài, bạn sẽ nhận được điểm số và lời giải chi tiết cho từng câu hỏi để ôn tập lại kiến thức." }
      ]
    },
    {
      title: "4. Trợ lý ảo AI Mentor",
      icon: Sparkles,
      desc: "Hỏi đáp thông minh 24/7 trực tiếp trên ngữ cảnh tài liệu học tập.",
      details: [
        { title: "Hỏi đáp tài liệu", text: "Khi đang đọc PDF, mở ngăn kéo Ask AI (nút lơ lửng AI) để hỏi nhanh bất cứ khái niệm nào trong trang hiện tại." },
        { title: "AI Mentor khóa học", text: "Truy cập mục 'AI Mentor' của khóa học để thảo luận sâu hơn về kiến thức, yêu cầu tóm tắt chương, hoặc giải thích các ví dụ code khó." },
        { title: "Tham chiếu chính xác", text: "AI Mentor luôn trích dẫn nguồn tài liệu tham khảo chính xác từ bài học để bạn kiểm chứng thông tin." }
      ]
    },
    {
      title: "5. Micro-learning & Ôn tập",
      icon: BrainCircuit,
      desc: "Ghi nhớ kiến thức dài hạn bằng Flashcard và thuật toán Lặp lại ngắt quãng.",
      details: [
        { title: "Ôn tập Flashcard", text: "Sử dụng Flashcard ngắn gọn để học nhanh các định nghĩa thuật ngữ, công thức toán học hoặc đoạn code mẫu." },
        { title: "Lặp lại ngắt quãng", text: "Đánh giá độ nhớ của bạn (Quên / Khó / Dễ). Hệ thống sẽ tự động lên lịch nhắc nhở ôn tập lại vào thời điểm tối ưu nhất." },
        { title: "Theo dõi lỗ hổng kiến thức", text: "Tính năng Weakness Tracker sẽ phân tích lịch sử làm quiz để chỉ ra các chủ đề bạn đang bị hổng kiến thức và gợi ý học lại." }
      ]
    }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="bg-blue-600 p-3 rounded-2xl shadow-sm text-white">
          <BookOpen className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-slate-50 leading-tight">
            Hướng dẫn Học viên từ A - Z
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5">
            Khám phá cách học tập hiệu quả, tương tác với AI và làm bài đánh giá trên hệ thống LMS.
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
                    // Reset sub-states when switching tabs to make interaction fresh
                    if (idx === 0) resetEnroll();
                    if (idx === 2) { setSelectedAnswer(null); setQuizSubmitted(false); }
                    if (idx === 4) { setIsFlipped(false); setCardLevel(null); }
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
                  <Sparkles className="h-4 w-4 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h5 className="text-xs font-bold text-blue-950 dark:text-blue-300">Mẹo hữu ích</h5>
                    <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                      {activeTab === 0 && "Bạn có thể tham gia nhiều khóa học cùng một lúc. Hãy bắt đầu với các khóa cơ bản trước khi sang nâng cao."}
                      {activeTab === 1 && "Dùng mục Ghi chú để lưu lại thông tin quan trọng. Ghi chú sẽ tự động được đồng bộ với tài khoản của bạn."}
                      {activeTab === 2 && "Bạn có thể làm lại quiz để nâng cao điểm số. Hãy đọc kỹ phần giải thích đáp án sau khi nộp bài."}
                      {activeTab === 3 && "Nếu câu trả lời của AI chưa rõ ràng, bạn hãy thử yêu cầu: 'Giải thích bằng ví dụ cụ thể' hoặc 'Viết code minh họa'."}
                      {activeTab === 4 && "Hãy hình thành thói quen ôn tập Flashcard hàng ngày. Thuật toán Spaced Repetition sẽ giúp bạn ghi nhớ sâu hơn 80%."}
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
                Giao diện minh họa (Có thể tương tác)
              </p>
              {activeTab === 0 && enrollStatus !== "idle" && (
                <button onClick={resetEnroll} className="text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 font-medium">
                  <RotateCw className="h-3 w-3" /> Reset Mockup
                </button>
              )}
            </div>

            <div className="bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800/80 rounded-2xl p-4 sm:p-6 shadow-inner min-h-[300px] flex items-center justify-center">
              
              {/* MOCKUP 1: DISCOVER */}
              {activeTab === 0 && (
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 w-full max-w-sm shadow-md transition-all">
                  <div className="flex items-center gap-2 mb-3">
                    <Search className="h-4 w-4 text-slate-400" />
                    <div className="h-8 bg-slate-100 dark:bg-slate-800 rounded-lg flex-1 flex items-center px-2 text-[11px] text-slate-400">
                      Tìm kiếm khóa học...
                    </div>
                  </div>
                  
                  {/* Course Card mockup */}
                  <div className="border border-slate-150 dark:border-slate-800 rounded-xl overflow-hidden bg-slate-50/50 dark:bg-slate-900/50">
                    <div className="h-24 bg-gradient-to-r from-blue-600 to-indigo-700 flex items-center justify-center p-3 relative">
                      <div className="absolute top-2 right-2 bg-blue-500/20 text-blue-200 text-[9px] font-bold px-1.5 py-0.5 rounded backdrop-blur-sm">
                        Big Data
                      </div>
                      <span className="text-white text-xs font-black tracking-wider text-center">APACHE SPARK & SCALA</span>
                    </div>
                    <div className="p-3 space-y-2.5">
                      <div>
                        <h4 className="text-xs font-extrabold text-slate-900 dark:text-slate-100">Xử lý Dữ liệu lớn với Spark 3.x</h4>
                        <p className="text-[10px] text-slate-400 mt-0.5">Giảng viên: TS. Nguyễn Văn A</p>
                      </div>
                      <div className="flex justify-between items-center text-[10px] text-slate-500">
                        <span>📚 12 bài học</span>
                        <span>⏱️ 6 tiếng</span>
                      </div>
                      
                      {enrollStatus === "idle" && (
                        <button
                          onClick={handleEnroll}
                          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg py-1.5 text-xs transition-all active:scale-95 shadow-sm"
                        >
                          Đăng ký học
                        </button>
                      )}
                      {enrollStatus === "loading" && (
                        <button
                          disabled
                          className="w-full bg-slate-200 dark:bg-slate-800 text-slate-500 font-semibold rounded-lg py-1.5 text-xs flex items-center justify-center gap-1.5"
                        >
                          <span className="h-3 w-3 border-2 border-slate-500 border-t-transparent rounded-full animate-spin"></span>
                          Đang đăng ký...
                        </button>
                      )}
                      {enrollStatus === "enrolled" && (
                        <div className="w-full bg-green-500/10 text-green-600 dark:text-green-400 font-bold rounded-lg py-1.5 text-xs text-center border border-green-500/20 flex items-center justify-center gap-1">
                          <Check className="h-3 w-3" /> Đã đăng ký thành công!
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* MOCKUP 2: LESSON VIEWER */}
              {activeTab === 1 && (
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl w-full max-w-xl shadow-md overflow-hidden flex flex-col h-[280px]">
                  {/* Top bar */}
                  <div className="bg-slate-50 dark:bg-slate-850 px-3 py-2 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
                    <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300">Khóa học: Lập trình Python</span>
                    <div className="flex gap-1">
                      <button 
                        onClick={() => setLessonTab("pdf")}
                        className={cn("px-2 py-0.5 text-[9px] rounded font-semibold", lessonTab === "pdf" ? "bg-blue-600 text-white" : "text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800")}
                      >
                        PDF
                      </button>
                      <button 
                        onClick={() => setLessonTab("video")}
                        className={cn("px-2 py-0.5 text-[9px] rounded font-semibold", lessonTab === "video" ? "bg-blue-600 text-white" : "text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800")}
                      >
                        Video
                      </button>
                      <button 
                        onClick={() => setLessonTab("markdown")}
                        className={cn("px-2 py-0.5 text-[9px] rounded font-semibold", lessonTab === "markdown" ? "bg-blue-600 text-white" : "text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800")}
                      >
                        Ghi chú
                      </button>
                    </div>
                  </div>
                  
                  {/* Content Body */}
                  <div className="flex-1 flex min-h-0">
                    {/* Sidebar Outlines */}
                    <div className="w-1/3 border-r border-slate-200 dark:border-slate-800 p-2 bg-slate-50/50 dark:bg-slate-900/30 overflow-y-auto space-y-1">
                      <p className="text-[8px] font-bold text-slate-400 uppercase tracking-wider px-1">Outline bài học</p>
                      <div className="p-1 text-[9px] rounded bg-blue-50 dark:bg-slate-800/40 text-blue-600 font-bold flex items-center gap-1">
                        <FileText className="h-2.5 w-2.5" /> 1. Khái niệm Python
                      </div>
                      <div className="p-1 text-[9px] rounded text-slate-600 dark:text-slate-400 flex items-center gap-1">
                        <Video className="h-2.5 w-2.5" /> 2. Cú pháp cơ bản
                      </div>
                      <div className="p-1 text-[9px] rounded text-slate-600 dark:text-slate-400 flex items-center gap-1">
                        <HelpCircle className="h-2.5 w-2.5" /> 3. Quiz thực hành 1
                      </div>
                    </div>

                    {/* Viewer pane */}
                    <div className="w-2/3 p-3 overflow-y-auto flex flex-col justify-between">
                      {lessonTab === "pdf" && (
                        <div className="border border-slate-100 dark:border-slate-800 rounded p-2.5 flex-1 bg-slate-50/30 dark:bg-slate-900/10 flex flex-col justify-between">
                          <div>
                            <h5 className="text-[10px] font-extrabold text-slate-800 dark:text-slate-200">1. Giới thiệu ngôn ngữ Python</h5>
                            <p className="text-[8px] text-slate-500 dark:text-slate-400 mt-1 leading-normal">
                              Python là một ngôn ngữ lập trình bậc cao, thông dịch, hướng đối tượng và đa mục đích do Guido van Rossum phát triển...
                            </p>
                          </div>
                          <div className="flex justify-between items-center border-t border-slate-100 dark:border-slate-850 pt-1 text-[8px] text-slate-400">
                            <span>Trang 1 / 4</span>
                            <span className="text-blue-500 font-semibold cursor-pointer">Xem toàn màn hình</span>
                          </div>
                        </div>
                      )}

                      {lessonTab === "video" && (
                        <div className="border border-slate-100 dark:border-slate-800 rounded flex-1 bg-slate-950 flex flex-col items-center justify-center relative group">
                          {isPlaying ? (
                            <div className="text-center space-y-1">
                              <div className="text-[9px] text-slate-400 animate-pulse">Đang phát bài giảng video...</div>
                              <button 
                                onClick={() => setIsPlaying(false)}
                                className="bg-white/20 hover:bg-white/30 text-white rounded-full p-1.5 transition-all text-[8px] font-bold"
                              >
                                Dừng
                              </button>
                            </div>
                          ) : (
                            <button 
                              onClick={() => setIsPlaying(true)}
                              className="bg-blue-600 hover:bg-blue-700 hover:scale-105 text-white rounded-full p-2.5 shadow-md transition-all active:scale-95"
                            >
                              <Play className="h-4 w-4 fill-white" />
                            </button>
                          )}
                          <div className="absolute bottom-1 left-2 right-2 flex justify-between text-[7px] text-slate-400">
                            <span>{isPlaying ? "0:12" : "0:00"} / 15:45</span>
                            <div className="h-1 bg-slate-700 flex-1 mx-2 self-center rounded overflow-hidden">
                              <div className="h-full bg-blue-500" style={{ width: isPlaying ? "5%" : "0%" }}></div>
                            </div>
                          </div>
                        </div>
                      )}

                      {lessonTab === "markdown" && (
                        <div className="border border-slate-100 dark:border-slate-800 rounded p-2 flex-1 bg-amber-50/30 dark:bg-amber-950/10 text-slate-700 dark:text-slate-300">
                          <h5 className="text-[10px] font-extrabold text-amber-800 dark:text-amber-300">📝 Ghi chú cá nhân</h5>
                          <textarea 
                            placeholder="Gõ ghi chú bài học tại đây..." 
                            className="w-full bg-transparent border-0 outline-none text-[8px] mt-1 placeholder:text-slate-400 resize-none h-[120px]"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* MOCKUP 3: QUIZ */}
              {activeTab === 2 && (
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl w-full max-w-sm shadow-md p-4 space-y-3">
                  <div className="flex justify-between items-center text-[9px] text-slate-500">
                    <span>Câu 1 trên 5</span>
                    <span className="text-amber-500 font-bold bg-amber-50 dark:bg-amber-950/30 px-1.5 py-0.5 rounded">Điểm: +10</span>
                  </div>
                  
                  <h4 className="text-xs font-extrabold text-slate-900 dark:text-slate-100">
                    Trong Apache Spark, RDD viết tắt của từ gì?
                  </h4>

                  <div className="space-y-1.5">
                    {[
                      { key: "A", text: "Relational Data Database" },
                      { key: "B", text: "Resilient Distributed Dataset" },
                      { key: "C", text: "Random Distributed Data" },
                      { key: "D", text: "Realtime Data Delivery" }
                    ].map((opt) => {
                      const isSelected = selectedAnswer === opt.key;
                      const isCorrect = opt.key === "B";
                      return (
                        <button
                          key={opt.key}
                          disabled={quizSubmitted}
                          onClick={() => setSelectedAnswer(opt.key)}
                          className={cn(
                            "w-full text-left p-2.5 rounded-lg border text-[10px] font-semibold flex items-center justify-between transition-all",
                            quizSubmitted
                              ? isCorrect
                                ? "border-green-500 bg-green-500/10 text-green-700 dark:text-green-400"
                                : isSelected
                                  ? "border-red-500 bg-red-500/10 text-red-700 dark:text-red-400"
                                  : "border-slate-150 dark:border-slate-800 text-slate-400"
                              : isSelected
                                ? "border-blue-600 bg-blue-600/5 text-blue-600"
                                : "border-slate-150 dark:border-slate-800 text-slate-700 dark:text-slate-350 hover:bg-slate-50 dark:hover:bg-slate-800"
                          )}
                        >
                          <span>{opt.key}. {opt.text}</span>
                          {quizSubmitted && isCorrect && <Check className="h-3.5 w-3.5 text-green-500" />}
                        </button>
                      );
                    })}
                  </div>

                  {!quizSubmitted ? (
                    <button
                      disabled={!selectedAnswer}
                      onClick={() => setQuizSubmitted(true)}
                      className={cn(
                        "w-full font-bold rounded-lg py-1.5 text-xs transition-all active:scale-95 text-white shadow-sm",
                        selectedAnswer ? "bg-blue-600 hover:bg-blue-700" : "bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed"
                      )}
                    >
                      Nộp bài
                    </button>
                  ) : (
                    <div className="bg-slate-50 dark:bg-slate-800/40 rounded-lg p-2.5 border border-slate-100 dark:border-slate-850">
                      <p className="text-[9px] font-bold text-slate-800 dark:text-slate-200">💡 Giải thích chi tiết:</p>
                      <p className="text-[8px] text-slate-500 dark:text-slate-400 mt-0.5 leading-normal">
                        Chính xác! RDD là một tập hợp các bản ghi dữ liệu phân tán, bất biến và có thể xử lý song song trên toàn cụm Spark Cluster.
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* MOCKUP 4: CHATBOT */}
              {activeTab === 3 && (
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl w-full max-w-sm shadow-md overflow-hidden flex flex-col h-[280px]">
                  {/* Chat Header */}
                  <div className="bg-blue-600 text-white px-3 py-2 flex justify-between items-center">
                    <div className="flex items-center gap-1.5">
                      <Sparkles className="h-3 w-3" />
                      <span className="text-[10px] font-bold">AI Mentor - Lập trình Spark</span>
                    </div>
                    <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
                  </div>

                  {/* Messages list */}
                  <div className="flex-1 overflow-y-auto p-3 space-y-2.5 bg-slate-50/50 dark:bg-slate-950/20">
                    {messages.map((msg) => (
                      <div 
                        key={msg.id} 
                        className={cn("flex", msg.sender === "user" ? "justify-end" : "justify-start")}
                      >
                        <div className={cn(
                          "max-w-[80%] rounded-xl px-2.5 py-1.5 text-[9px] leading-normal shadow-sm",
                          msg.sender === "user" 
                            ? "bg-blue-600 text-white rounded-br-none" 
                            : "bg-white dark:bg-slate-850 border border-slate-100 dark:border-slate-800 text-slate-800 dark:text-slate-200 rounded-bl-none"
                        )}>
                          {msg.text}
                        </div>
                      </div>
                    ))}
                    {isTyping && (
                      <div className="flex justify-start">
                        <div className="bg-white dark:bg-slate-850 border border-slate-100 dark:border-slate-800 rounded-xl px-2.5 py-1.5 text-[9px] rounded-bl-none text-slate-400 flex items-center gap-1">
                          <span className="h-1.5 w-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></span>
                          <span className="h-1.5 w-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></span>
                          <span className="h-1.5 w-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></span>
                        </div>
                      </div>
                    )}
                    <div ref={chatEndRef} />
                  </div>

                  {/* Suggestions */}
                  <div className="px-2 py-1 bg-slate-50 dark:bg-slate-900 border-t border-slate-150 dark:border-slate-850 flex gap-1 overflow-x-auto no-scrollbar">
                    <button 
                      onClick={() => handleSuggestClick("Spark khác MapReduce thế nào?")}
                      className="px-2 py-0.5 border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 rounded-full text-[8px] flex-shrink-0 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    >
                      💡 So sánh Spark vs MapReduce
                    </button>
                    <button 
                      onClick={() => handleSuggestClick("Giải thích Spark RDD")}
                      className="px-2 py-0.5 border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 rounded-full text-[8px] flex-shrink-0 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    >
                      💡 RDD là gì?
                    </button>
                  </div>

                  {/* Input Form */}
                  <form 
                    onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }}
                    className="p-2 border-t border-slate-200 dark:border-slate-850 flex gap-1.5 bg-white dark:bg-slate-900"
                  >
                    <input
                      type="text"
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      placeholder="Hỏi AI Mentor của bạn..."
                      className="flex-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1 text-[9px] focus:outline-none focus:border-blue-500 text-slate-800 dark:text-slate-200"
                    />
                    <button 
                      type="submit"
                      className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg p-1 transition-colors flex items-center justify-center"
                    >
                      <Send className="h-3 w-3" />
                    </button>
                  </form>
                </div>
              )}

              {/* MOCKUP 5: MICRO-LEARNING */}
              {activeTab === 4 && (
                <div className="w-full max-w-sm space-y-4">
                  {/* Flashcard container */}
                  <div 
                    onClick={() => setIsFlipped(!isFlipped)}
                    className={cn(
                      "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl h-36 flex flex-col justify-between p-4 shadow-md cursor-pointer transition-all duration-300 select-none hover:shadow-lg hover:scale-[1.02]",
                      isFlipped ? "border-amber-400 bg-amber-50/5 dark:bg-amber-950/5" : ""
                    )}
                  >
                    <div className="flex justify-between items-center text-[8px] text-slate-400 font-bold">
                      <span>🏷️ HỌC MÁY (MACHINE LEARNING)</span>
                      <span className="flex items-center gap-0.5 text-blue-500"><RotateCw className="h-2 w-2" /> Xoay</span>
                    </div>
                    
                    <div className="text-center py-2">
                      {!isFlipped ? (
                        <h4 className="text-sm font-black text-slate-900 dark:text-slate-50">Supervised Learning là gì?</h4>
                      ) : (
                        <p className="text-[10px] text-slate-600 dark:text-slate-350 leading-relaxed font-medium px-2">
                          Là phương pháp học máy sử dụng tập dữ liệu được dán nhãn (labeled data) để huấn luyện mô hình, giúp dự đoán đầu ra cho dữ liệu mới.
                        </p>
                      )}
                    </div>

                    <div className="text-center text-[7px] text-slate-400 uppercase tracking-widest font-semibold">
                      {!isFlipped ? "Click để xem mặt sau" : "Click để xem câu hỏi"}
                    </div>
                  </div>

                  {/* Action buttons shown on flip */}
                  {isFlipped && (
                    <div className="space-y-2">
                      <p className="text-center text-[8px] font-bold text-slate-400">ĐÁNH GIÁ MỨC ĐỘ GHI NHỚ</p>
                      <div className="flex gap-2">
                        <button 
                          onClick={(e) => { e.stopPropagation(); setCardLevel("forgot"); }}
                          className={cn("flex-1 text-[9px] font-bold py-1.5 px-2 rounded-lg border transition-all active:scale-95", cardLevel === "forgot" ? "bg-red-500 border-red-500 text-white" : "border-red-200 dark:border-red-900/40 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20")}
                        >
                          Quên (1 ngày)
                        </button>
                        <button 
                          onClick={(e) => { e.stopPropagation(); setCardLevel("hard"); }}
                          className={cn("flex-1 text-[9px] font-bold py-1.5 px-2 rounded-lg border transition-all active:scale-95", cardLevel === "hard" ? "bg-amber-500 border-amber-500 text-white" : "border-amber-200 dark:border-amber-900/40 text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-950/20")}
                        >
                          Khó (3 ngày)
                        </button>
                        <button 
                          onClick={(e) => { e.stopPropagation(); setCardLevel("easy"); }}
                          className={cn("flex-1 text-[9px] font-bold py-1.5 px-2 rounded-lg border transition-all active:scale-95", cardLevel === "easy" ? "bg-green-500 border-green-500 text-white" : "border-green-200 dark:border-green-900/40 text-green-500 hover:bg-green-50 dark:hover:bg-green-950/20")}
                        >
                          Dễ (7 ngày)
                        </button>
                      </div>
                      {cardLevel && (
                        <p className="text-[8px] text-center text-slate-500 font-semibold animate-pulse">
                          🎉 Lên lịch ôn tập tiếp theo vào: {cardLevel === "forgot" ? "Ngày mai" : cardLevel === "hard" ? "3 ngày nữa" : "7 ngày nữa"}!
                        </p>
                      )}
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
