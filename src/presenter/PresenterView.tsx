import { useEffect, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Grid2X2,
  Monitor,
  Download,
  Minus,
  Plus,
} from "lucide-react";
import { slides } from "../content/slides";
import { next, type DeckPos } from "../deck/useDeck";
import { Stage } from "../deck/Stage";
import { SlideView } from "../deck/SlideView";
import { Timer } from "./Timer";
import { SourceChip } from "../widgets/SourceChip";
import { lawStatus, lawLabel } from "../legal/status";
import type { Tool } from "../tools/useTool";
export function PresenterView({
  pos,
  onPrev,
  onNext,
  onOverview,
  onTool,
  onExport,
  connected,
}: {
  pos: DeckPos;
  onPrev: () => void;
  onNext: () => void;
  onOverview: () => void;
  onTool: (t: Tool) => void;
  onExport: () => void;
  connected: boolean;
}) {
  const [font, setFont] = useState(23);
  const s = slides[pos.slide],
    n = next(pos, slides);
  useEffect(() => {
    const key = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && ["+", "=", "-"].includes(e.key)) {
        e.preventDefault();
        setFont((f) =>
          Math.max(16, Math.min(40, f + (e.key === "-" ? -2 : 2))),
        );
      }
    };
    addEventListener("keydown", key);
    return () => removeEventListener("keydown", key);
  }, []);
  return (
    <main className="presenter">
      <header className="presenter-header">
        <div>
          <span className="brand-seven">7</span>
          <b>Bàn điều khiển người trình bày</b>
          <span className={`connection ${connected ? "online" : ""}`}>
            {connected
              ? "Đã đồng bộ cửa sổ trình chiếu"
              : "Đang chờ cửa sổ trình chiếu"}
          </span>
        </div>
        <button onClick={onExport}>
          <Download size={18} /> Xuất PowerPoint
        </button>
      </header>
      <Timer slide={pos.slide} />
      <div className="presenter-workspace">
        <section className="presenter-preview">
          <div className="panel-title">
            <span>
              <Monitor size={18} /> KHÁN GIẢ ĐANG XEM
            </span>
            <b>
              {s.id} / 20 · Ý {pos.step}
            </b>
          </div>
          <div className="current-preview" inert>
            <Stage>
              <SlideView key={s.id} slide={s} step={pos.step} mode="thumb" />
            </Stage>
          </div>
          <div className="presenter-nav">
            <button onClick={onPrev}>
              <ArrowLeft /> Trước
            </button>
            <button onClick={onOverview}>
              <Grid2X2 /> Tổng quan
            </button>
            <button className="primary" onClick={onNext}>
              Tiếp <ArrowRight />
            </button>
          </div>
          <div className="presenter-tools">
            {(
              [
                "laser",
                "spotlight",
                "pen",
                "magnifier",
                "blackout",
                "none",
              ] as Tool[]
            ).map((t, i) => (
              <button key={t} onClick={() => onTool(t)}>
                {
                  [
                    "Laser",
                    "Đèn soi",
                    "Bút vẽ",
                    "Kính lúp",
                    "Màn đen",
                    "Tắt công cụ",
                  ][i]
                }
              </button>
            ))}
          </div>
          <div className="next-panel">
            <div className="next-preview" inert>
              <Stage>
                <SlideView slide={slides[n.slide]} step={n.step} mode="thumb" />
              </Stage>
            </div>
            <div>
              <span className="eyebrow">TIẾP THEO</span>
              <h3>{slides[n.slide].title}</h3>
              <p>
                {n.slide === pos.slide
                  ? `Mở ý ${n.step}`
                  : `Màn hình ${n.slide + 1}`}
              </p>
            </div>
          </div>
        </section>
        <section className="speaker-notes">
          <div className="panel-title">
            <span>GHI CHÚ THUYẾT TRÌNH</span>
            <div>
              <button
                aria-label="Thu nhỏ chữ ghi chú"
                onClick={() => setFont((f) => Math.max(16, f - 2))}
              >
                <Minus size={18} />
              </button>
              <button
                aria-label="Phóng to chữ ghi chú"
                onClick={() => setFont((f) => Math.min(40, f + 2))}
              >
                <Plus size={18} />
              </button>
            </div>
          </div>
          {s.sourceIds.includes("luat-2016") &&
            lawStatus().phase === "in-force" && (
              <p className="legal-alert">{lawLabel()}</p>
            )}
          <h2>{s.title}</h2>
          <p className="notes-text" style={{ fontSize: font }}>
            {s.notes}
          </p>
          {s.quiz && (
            <div className="quiz-notes">
              {s.quiz.map((q, i) => (
                <p key={i}>
                  Câu {i + 1}: <b>{q.answer}</b> — {q.explanation}
                </p>
              ))}
            </div>
          )}
          <SourceChip ids={s.sourceIds} full />
          <small className="notes-tip">
            Ctrl + / − để thay đổi cỡ chữ. Phím điều hướng gửi tới cửa sổ khán
            giả.
          </small>
        </section>
      </div>
    </main>
  );
}
