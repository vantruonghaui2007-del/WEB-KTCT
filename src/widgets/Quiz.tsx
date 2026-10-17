import { useEffect, useRef, useState } from "react";
import { ArrowRight, Check, RotateCcw, Volume2, X } from "lucide-react";
import type { QuizItem } from "../content/types";
import { quizView } from "./quizState";
import { isTyping } from "../deck/useDeck";

export function Quiz({
  items,
  step,
  onNext,
  onRestart,
  interactive = true,
}: {
  items: QuizItem[];
  step: number;
  onNext?: () => void;
  onRestart?: () => void;
  interactive?: boolean;
}) {
  const { index, revealed, result } = quizView(step, items.length);
  const [picks, setPicks] = useState<Record<number, QuizItem["answer"]>>({});
  const lastSoundStep = useRef(-1);
  const q = items[index];
  const chosen = picks[index];
  const score = items.reduce(
    (sum, item, i) => sum + (picks[i] === item.answer ? 1 : 0),
    0,
  );
  const pick = (key: QuizItem["answer"]) => {
    if (interactive && !revealed && !result)
      setPicks((previous) => ({ ...previous, [index]: key }));
  };
  const confirm = () => {
    if (result) onNext?.();
    else if (revealed || chosen) onNext?.();
  };

  useEffect(() => {
    if (
      !interactive ||
      !revealed ||
      result ||
      !chosen ||
      lastSoundStep.current === step
    )
      return;
    lastSoundStep.current = step;
    const AudioContextClass = window.AudioContext;
    if (!AudioContextClass) return;
    try {
      const context = new AudioContextClass();
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      const correct = chosen === q.answer;
      oscillator.type = "sine";
      oscillator.frequency.value = correct ? 660 : 220;
      gain.gain.setValueAtTime(0.0001, context.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.045, context.currentTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(
        0.0001,
        context.currentTime + 0.22,
      );
      oscillator.connect(gain);
      gain.connect(context.destination);
      oscillator.start();
      oscillator.stop(context.currentTime + 0.23);
      oscillator.onended = () => void context.close();
    } catch {
      // The quiz remains fully usable when audio is unavailable or blocked.
    }
  }, [chosen, interactive, q, result, revealed, step]);

  useEffect(() => {
    if (!interactive) return;
    const key = (event: KeyboardEvent) => {
      if (
        document.querySelector("dialog[open]") ||
        isTyping(event.target) ||
        event.ctrlKey ||
        event.metaKey ||
        event.altKey
      )
        return;
      const letter = event.key.toUpperCase();
      if (["A", "B", "C", "D"].includes(letter)) {
        if (!result && !revealed) {
          event.preventDefault();
          pick(letter as QuizItem["answer"]);
        }
        return;
      }
      const nextKey =
        event.key === "ArrowRight" ||
        event.key === "PageDown" ||
        event.key === " ";
      if (nextKey) {
        if (
          event.key === " " &&
          (event.target as HTMLElement)?.closest?.("button,a")
        )
          return;
        event.preventDefault();
        confirm();
      } else if (event.key === "Enter") {
        if ((event.target as HTMLElement)?.closest?.("button,a")) return;
        event.preventDefault();
        confirm();
      }
    };
    addEventListener("keydown", key);
    return () => removeEventListener("keydown", key);
  }, [chosen, index, interactive, result, revealed, step]);

  return (
    <div className="quiz">
      <div className="quiz-steps">
        {items.map((_, i) => (
          <span
            key={i}
            className={
              i === index ? "active" : i < index || result ? "done" : ""
            }
          >
            {i + 1}
          </span>
        ))}
        <b>{result ? "Kết quả" : `Câu ${index + 1} / ${items.length}`}</b>
      </div>
      {result ? (
        <div className="quiz-result" aria-live="polite">
          <span className="eyebrow">HOÀN THÀNH 7 CÂU HỎI</span>
          <h2>
            Bạn trả lời đúng {score}/{items.length} câu
          </h2>
          <p>
            {score === items.length
              ? "Xuất sắc! Bạn đã nắm vững các nội dung trọng tâm."
              : score >= 5
                ? "Rất tốt! Hãy xem lại những câu chưa đúng để củng cố kiến thức."
                : "Cảm ơn bạn đã tham gia. Có thể chơi lại để ôn tập thêm."}
          </p>
          <div className="quiz-actions">
            <button
              className="secondary"
              disabled={!interactive}
              onClick={() => {
                setPicks({});
                lastSoundStep.current = -1;
                onRestart?.();
              }}
            >
              <RotateCcw /> Chơi lại
            </button>
            <button
              className="primary"
              disabled={!interactive}
              onClick={onNext}
            >
              Tiếp tục bài <ArrowRight />
            </button>
          </div>
        </div>
      ) : (
        <>
          <h2>{q.question}</h2>
          <div className="quiz-options">
            {q.options.map((option) => (
              <button
                disabled={!interactive || revealed}
                key={option.key}
                aria-label={`${option.key}. ${option.text}`}
                aria-pressed={chosen === option.key}
                data-correct={revealed ? option.key === q.answer : undefined}
                className={`${chosen === option.key ? "picked" : ""} ${revealed ? (option.key === q.answer ? "correct" : "muted") : ""}`}
                onClick={() => pick(option.key)}
              >
                <span>{option.key}</span>
                {option.text}
                {revealed && option.key === q.answer && <Check />}
              </button>
            ))}
          </div>
          <div
            className={`quiz-answer ${revealed ? (chosen === q.answer ? "is-correct" : "is-wrong") : ""}`}
            aria-live="polite"
          >
            {revealed ? (
              <>
                {chosen === q.answer ? <Check /> : <X />}
                <span>
                  <b>
                    {chosen === q.answer
                      ? "Chính xác."
                      : `Chưa chính xác. Đáp án là ${q.answer}.`}
                  </b>{" "}
                  {q.explanation}
                </span>
                <Volume2 aria-hidden="true" className="quiz-sound-icon" />
              </>
            ) : (
              <>
                <ArrowRight /> Chọn A, B, C hoặc D rồi xác nhận · Có thể dùng
                bàn phím
              </>
            )}
          </div>
          <div className="quiz-actions">
            <button
              className="primary"
              disabled={!interactive || (!chosen && !revealed)}
              onClick={confirm}
            >
              {revealed
                ? index === items.length - 1
                  ? "Xem kết quả"
                  : "Câu tiếp theo"
                : "Xác nhận đáp án"}
              <ArrowRight />
            </button>
          </div>
        </>
      )}
    </div>
  );
}
