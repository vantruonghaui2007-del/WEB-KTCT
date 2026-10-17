import { useRef, useState } from "react";
import { Check, RotateCcw } from "lucide-react";
import { findMedia, type MediaItem } from "../content/media";
import { SafeImage } from "./ImageStage";
const ids = [
  "pagoda",
  "church",
  "caodai",
  "mosque",
  "altar",
  "communal",
  "temple",
];
const labels: Record<string, string> = {
  pagoda: "Chùa",
  church: "Nhà thờ",
  caodai: "Thánh thất",
  mosque: "Thánh đường",
  altar: "Bàn thờ tổ tiên",
  communal: "Đình",
  temple: "Đền",
};
export function SortGame({ conclusion }: { conclusion: string }) {
  const [placed, setPlaced] = useState<string[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [wrong, setWrong] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const drag = useRef<{ id: string; x: number; y: number } | null>(null);
  const [ghost, setGhost] = useState<{
    id: string;
    x: number;
    y: number;
  } | null>(null);
  const assign = (id: string, group: MediaItem["group"]) => {
    if (placed.includes(id)) return;
    const m = findMedia(id);
    if (m.group === group) {
      setPlaced((p) => [...p, id]);
      setSelected(null);
      setMessage(`${m.alt}: chính xác.`);
    } else {
      setWrong(id);
      setMessage(`${m.alt}: hãy thử nhóm còn lại.`);
      setTimeout(() => setWrong(null), 500);
    }
  };
  const card = (id: string) => {
    const m = findMedia(id),
      done = placed.includes(id);
    return (
      <button
        key={id}
        className={`sort-card ${selected === id ? "selected" : ""} ${wrong === id ? "shake" : ""} ${done ? "sorted" : ""}`}
        aria-label={`${labels[id]}${done ? ", đã xếp đúng" : ""}`}
        aria-description={m.alt}
        aria-pressed={selected === id}
        onClick={() => !done && setSelected(id)}
        onKeyDown={(e) => {
          if (!done && (e.key === "1" || e.key === "2")) {
            e.preventDefault();
            assign(id, e.key === "1" ? "ton-giao" : "tin-nguong");
          }
        }}
        onPointerDown={(e) => {
          if (done) return;
          e.currentTarget.setPointerCapture(e.pointerId);
          drag.current = { id, x: e.clientX, y: e.clientY };
        }}
        onPointerMove={(e) => {
          if (
            drag.current &&
            Math.hypot(e.clientX - drag.current.x, e.clientY - drag.current.y) >
              8
          )
            setGhost({ id, x: e.clientX, y: e.clientY });
        }}
        onPointerUp={(e) => {
          if (drag.current) {
            const hit = document
              .elementFromPoint(e.clientX, e.clientY)
              ?.closest("[data-group]")
              ?.getAttribute("data-group") as MediaItem["group"];
            if (hit) assign(id, hit);
          }
          drag.current = null;
          setGhost(null);
        }}
        onPointerCancel={() => {
          drag.current = null;
          setGhost(null);
        }}
      >
        <SafeImage item={m} />
        <span>
          {labels[id]}
          {done && <Check size={18} />}
        </span>
      </button>
    );
  };
  return (
    <div className="sort-game">
      <div className="sort-instructions">
        <span>Chạm thẻ rồi chạm nhóm bên dưới để phân loại (hoặc kéo thả)</span>
        <button
          aria-label="Chơi lại phân loại"
          onClick={() => {
            setPlaced([]);
            setSelected(null);
            setMessage("");
          }}
        >
          <RotateCcw size={18} /> Chơi lại
        </button>
      </div>
      <div className="sort-tray">
        {ids.filter((id) => !placed.includes(id)).map(card)}
        {placed.length === 7 && (
          <div className="sort-complete">
            <Check /> Đã phân loại đủ 7 hình ảnh
          </div>
        )}
      </div>
      <div className="sort-zones">
        {(["ton-giao", "tin-nguong"] as const).map((group, i) => (
          <div
            key={group}
            data-group={group}
            className={`sort-zone ${selected ? "ready-to-place" : ""}`}
          >
            <button
              className="zone-label"
              aria-label={`Xếp thẻ đã chọn vào ${i === 0 ? "Cơ sở tôn giáo" : "Không gian tín ngưỡng"}`}
              onClick={() => selected && assign(selected, group)}
            >
              <kbd>{i + 1}</kbd>
              {i === 0 ? "Cơ sở tôn giáo" : "Không gian tín ngưỡng"}
              <span>
                {placed.filter((id) => findMedia(id).group === group).length}/
                {i === 0 ? 4 : 3}
              </span>
            </button>
            <div className="sorted-cards">
              {placed.filter((id) => findMedia(id).group === group).map(card)}
            </div>
          </div>
        ))}
      </div>
      <div className="sort-feedback" aria-live="polite">
        {placed.length === 7
          ? conclusion
          : message ||
            "Chọn ảnh tư liệu thật rồi phân loại theo cơ sở tôn giáo hoặc không gian tín ngưỡng."}
      </div>
      {ghost && (
        <div className="drag-hint">Đang kéo: {findMedia(ghost.id).alt}</div>
      )}
    </div>
  );
}
