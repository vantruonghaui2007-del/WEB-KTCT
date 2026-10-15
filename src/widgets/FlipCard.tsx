import { useState } from "react";
import { RotateCw } from "lucide-react";
import type { Concept } from "../content/types";
export function FlipCard({
  concept,
  index,
  interactive = true,
}: {
  concept: Concept;
  index: number;
  interactive?: boolean;
}) {
  const [open, setOpen] = useState(false);
  return (
    <button
      className={`flip-card ${open ? "flipped" : ""}`}
      aria-label={`${concept.term}: ${open ? "ẩn" : "xem"} định nghĩa`}
      aria-pressed={open}
      onClick={() => setOpen((v) => !v)}
      disabled={!interactive}
    >
      <span className="flip-inner">
        <span className="flip-front">
          <span className="card-number">0{index + 1}</span>
          <span className="concept-symbol">{["◈", "✳", "◇"][index]}</span>
          <strong>{concept.term}</strong>
          <small>
            <RotateCw size={18} /> Chạm để khám phá
          </small>
        </span>
        <span className="flip-back">
          <span className="eyebrow">{concept.term}</span>
          <span>{concept.definition}</span>
          <small>Chạm để lật lại</small>
        </span>
      </span>
    </button>
  );
}
