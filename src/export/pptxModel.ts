import type { Slide, Source } from "../content/types";
import { formatStat } from "../widgets/CountUp";
import { dataAgeLabel, lawLabel } from "../legal/status";
export interface PptxSlideModel {
  title: string;
  bullets: string[];
  notes: string;
  sourceLine: string;
  imagePath?: string;
  footer: string;
}
export function buildPptxModel(
  deck: Slide[],
  sources: Source[],
  now = new Date(),
): PptxSlideModel[] {
  return deck.map((s, i) => {
    let bullets = [...s.points];
    let notes = s.notes;
    if (s.concepts)
      bullets = s.concepts.map((c) => `${c.term}: ${c.definition}`);
    if (s.stats) {
      bullets = [
        s.points[0],
        ...s.stats.map((st) => `${formatStat(st)} ${st.label}`),
        ...s.points.slice(2),
        dataAgeLabel(s.asOf!, now),
      ];
    }
    if (s.quiz) {
      bullets = s.quiz.map(
        (q, i) =>
          `Câu ${i + 1}. ${q.question} ${q.options.map((o) => `${o.key}. ${o.text}`).join(" ")}`,
      );
      notes +=
        "\n\n" +
        s.quiz
          .map((q, i) => `Câu ${i + 1}. Đáp án ${q.answer}. ${q.explanation}`)
          .join("\n");
    }
    if (s.id === "17") bullets.push(lawLabel(now));
    const m = s.mediaIds?.[0];
    return {
      title: s.title,
      bullets,
      notes,
      sourceLine: s.sourceIds.length
        ? "Nguồn: " +
          s.sourceIds
            .map((id) => {
              const src = sources.find((x) => x.id === id)!;
              return src.label + (src.url ? " — " + src.url : "");
            })
            .join("; ")
        : "",
      imagePath: m
        ? `media/export/${m}.png`
        : s.id === "01"
          ? "media/export/pagoda.png"
          : undefined,
      footer: `Nhóm 7 · Chủ đề 7 · ${String(i + 1).padStart(2, "0")}/${deck.length}`,
    };
  });
}
