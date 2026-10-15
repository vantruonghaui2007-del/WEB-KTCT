import { useState } from "react";
import {
  RotateCw,
  Award,
  Briefcase,
  UserCheck,
  Sparkles,
  Globe,
  Users,
} from "lucide-react";
import type { Concept } from "../content/types";

function getConceptIcon(term: string, index: number) {
  if (term.includes("Chức sắc")) return Award;
  if (term.includes("Chức việc")) return Briefcase;
  if (term.includes("Nhà tu hành")) return UserCheck;
  if (term.includes("Tín ngưỡng")) return Sparkles;
  if (term.includes("Tôn giáo")) return Globe;
  if (term.includes("Tín đồ")) return Users;
  return [Award, Briefcase, UserCheck][index % 3];
}

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
  const Icon = getConceptIcon(concept.term, index);

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
          <span className="concept-symbol" aria-hidden="true">
            <Icon size={58} strokeWidth={1.8} />
          </span>
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
