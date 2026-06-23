"use client";

/**
 * FlashcardWidget — flip-card UI for generated flashcards.
 */
import { useState } from"react";
import { cn } from"@/lib/utils";
import { RotateCw } from"lucide-react";

interface FlashcardItem {
 front: string;
 back: string;
 node_name?: string;
}

interface FlashcardWidgetProps {
 props: {
 cards: FlashcardItem[];
 title?: string;
 };
}

export function FlashcardWidget({ props }: FlashcardWidgetProps) {
 const { cards, title } = props;
 const [currentIndex, setCurrentIndex] = useState(0);
 const [isFlipped, setIsFlipped] = useState(false);

 if (!cards || cards.length === 0) return null;

 const card = cards[currentIndex];

 function handleNext() {
 setIsFlipped(false);
 setCurrentIndex((i) => (i + 1) % cards.length);
 }

 function handlePrev() {
 setIsFlipped(false);
 setCurrentIndex((i) => (i - 1 + cards.length) % cards.length);
 }

 return (
 <div className="space-y-3">
 <div className="flex items-center justify-between">
 <span className="text-xs font-semibold text-accent-primary dark:text-accent-secondary uppercase tracking-wider">
 {title ||"Flashcards"}
 </span>
 <span className="text-xs text-text-disabled">
 {currentIndex + 1}/{cards.length}
 </span>
 </div>

 {/* Card */}
 <button
 onClick={() => setIsFlipped((f) => !f)}
 className={cn(
"w-full min-h-[140px] p-5 rounded-xl",
"border border-border-subtle",
"flex flex-col items-center justify-center text-center gap-2",
"transition-all duration-300 active:scale-[0.98]",
"cursor-pointer select-none",
 isFlipped
 ?"bg-blue-50 dark:bg-blue-950/20"
 :"bg-bg-card",
 )}
 >
 {card.node_name && !isFlipped && (
 <span className="text-[10px] text-text-disabled uppercase tracking-wide">
 {card.node_name}
 </span>
 )}
 <p
 className={cn(
"text-sm leading-relaxed",
 isFlipped
 ?"text-blue-800 dark:text-blue-300 font-medium"
 :"text-text-subheading font-medium",
 )}
 >
 {isFlipped ? card.back : card.front}
 </p>
 <div className="flex items-center gap-1 text-[10px] text-text-disabled mt-1">
 <RotateCw className="w-3 h-3" />
 <span>{isFlipped ?"Mặt sau" :"Nhấn để lật"}</span>
 </div>
 </button>

 {/* Navigation */}
 {cards.length > 1 && (
 <div className="flex justify-center gap-2">
 <button
 onClick={handlePrev}
 className="px-4 py-1.5 rounded-lg text-xs font-medium bg-bg-card border border-border-subtle text-text-muted hover:bg-bg-hover transition-all active:scale-95"
 >
 Trước
 </button>
 <button
 onClick={handleNext}
 className="px-4 py-1.5 rounded-lg text-xs font-medium bg-bg-card border border-border-subtle text-text-muted hover:bg-bg-hover transition-all active:scale-95"
 >
 Tiếp
 </button>
 </div>
 )}
 </div>
 );
}
