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
      <p className="modal-description">
        20 màn hình · Chọn một chủ đề để tiếp tục hành trình.
      </p>
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
