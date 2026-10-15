import { useEffect, useState } from "react";
import { Check, ArrowRight } from "lucide-react";
import type { QuizItem } from "../content/types";
import { quizView } from "./quizState";
import { isTyping } from "../deck/useDeck";
export function Quiz({
  items,
  step,
  onPick,
  interactive = true,
}: {
  items: QuizItem[];
  step: number;
  onPick?: (a: string) => void;
  interactive?: boolean;
}) {
  const { index, revealed } = quizView(step, items.length);
  const [picks, setPicks] = useState<Record<number, string>>({});
  const q = items[index];
  const pick = (a: string) => {
    if (!revealed) {
      setPicks((p) => ({ ...p, [index]: a }));
      onPick?.(a);
    }
  };
  useEffect(() => {
    if (!interactive) return;
    const key = (e: KeyboardEvent) => {
      if (isTyping(e.target)) return;
      if (e.key === "1" || e.key === "2") {
        e.preventDefault();
        pick(e.key === "1" ? "A" : "B");
      }
    };
    addEventListener("keydown", key);
    return () => removeEventListener("keydown", key);
  }, [index, revealed, interactive]);
  return (
    <div className="quiz">
      <div className="quiz-steps">
        {items.map((_, i) => (
          <span
            key={i}
            className={i === index ? "active" : i < index ? "done" : ""}
          >
            {i + 1}
          </span>
        ))}
        <b>
          Câu {index + 1} / {items.length}
        </b>
      </div>
      <h2>{q.question}</h2>
      <div className="quiz-options">
        {q.options.map((o) => (
          <button
            disabled={!interactive || revealed}
            key={o.key}
            aria-label={`${o.key}. ${o.text}`}
            aria-pressed={picks[index] === o.key}
            data-correct={revealed ? o.key === q.answer : undefined}
            className={`${picks[index] === o.key ? "picked" : ""} ${revealed ? (o.key === q.answer ? "correct" : "muted") : ""}`}
            onClick={() => pick(o.key)}
          >
            <span>{o.key}</span>
            {o.text}
            {revealed && o.key === q.answer && <Check />}
          </button>
        ))}
      </div>
      <div className="quiz-answer" aria-live="polite">
        {revealed ? (
          <>
            <Check /> {q.explanation}
          </>
        ) : (
          <>
            <ArrowRight /> Chạm chọn đáp án · Bấm [Tiếp] hoặc vuốt để xem giải thích
          </>
        )}
      </div>
    </div>
  );
}
