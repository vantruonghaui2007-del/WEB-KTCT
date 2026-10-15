import { Home } from "lucide-react";
import { slides } from "../content/slides";
import { sectionLabels } from "../content/types";
import { Modal } from "../widgets/Modal";
import { Stage } from "./Stage";
import { SlideView } from "./SlideView";
import { fragmentCount } from "./useDeck";
export function Overview({
  current,
  onGo,
  onClose,
}: {
  current: number;
  onGo: (n: number) => void;
  onClose: () => void;
}) {
  return (
    <Modal
      title="Toàn cảnh bài thuyết trình"
      onClose={onClose}
      className="overview-modal"
    >
      <div className="overview-header-actions">
        <p className="modal-description">
          20 màn hình · Chạm để chuyển nhanh đến slide bất kỳ.
        </p>
        <button
          type="button"
          className="overview-restart-btn"
          onClick={() => {
            onGo(0);
            onClose();
          }}
        >
          <Home size={16} /> Về slide mở đầu (01)
        </button>
      </div>
      <div className="overview-grid">
        {slides.map((s, i) => {
          const go = () => {
            onGo(i);
            onClose();
          };
          return (
            <div
              role="button"
              tabIndex={0}
              aria-label={`Màn hình ${i + 1}: ${s.title}`}
              className={`overview-item ${i === current ? "current" : ""}`}
              key={s.id}
              aria-current={i === current ? "page" : undefined}
              onClick={go}
              onKeyDown={(e) => {
                if (e.key === " " || e.key === "Enter") {
                  e.preventDefault();
                  go();
                }
              }}
            >
              <div
                className={`thumb-art section-${s.section}`}
                inert
                aria-hidden="true"
              >
                <Stage>
                  <SlideView slide={s} step={fragmentCount(s)} mode="thumb" />
                </Stage>
              </div>
              <small>
                {s.id} · {sectionLabels[s.section]}
              </small>
              <b>{s.title}</b>
            </div>
          );
        })}
      </div>
    </Modal>
  );
}
