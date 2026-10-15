import { Maximize2 } from "lucide-react";
import { findMedia, type MediaItem } from "../content/media";
import { SafeImage } from "./ImageStage";
export function Gallery({
  ids,
  onOpen,
}: {
  ids: string[];
  onOpen?: (m: MediaItem) => void;
}) {
  const names = [
    "Phật giáo",
    "Công giáo",
    "Tin Lành",
    "Hồi giáo",
    "Cao Đài",
    "Phật giáo Hòa Hảo",
  ];
  return (
    <div className="gallery">
      {ids.map((id, i) => {
        const m = findMedia(id);
        return (
          <button
            key={`${id}-${i}`}
            aria-label={`Xem minh họa ${names[i] || m.alt}`}
            onClick={() => onOpen?.(m)}
          >
            <SafeImage item={m} />
            <span>
              <b>{names[i] || m.alt}</b>
              <Maximize2 size={19} />
            </span>
            <small>{i < 4 ? "Du nhập" : "Nội sinh"} · Minh họa</small>
          </button>
        );
      })}
    </div>
  );
}
