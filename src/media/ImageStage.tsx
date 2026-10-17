import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { Minus, Plus, RotateCcw } from "lucide-react";
import { asset, type MediaItem } from "../content/media";
import { zoomAt, panBy, type View } from "./zoom";
export function SafeImage({
  item,
  className = "",
  ...props
}: {
  item: MediaItem;
  className?: string;
} & React.ImgHTMLAttributes<HTMLImageElement>) {
  return (
    <img
      {...props}
      className={className}
      src={asset(item.src)}
      alt={item.alt}
      draggable={false}
      onError={(e) => {
        const el = e.currentTarget;
        if (!el.dataset.fallback) {
          el.dataset.fallback = "true";
          el.alt = "Ảnh tư liệu hiện không tải được";
          el.src = asset("media/placeholder.svg");
        }
      }}
    />
  );
}
export function ImageStage({ item }: { item: MediaItem }) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const [view, setView] = useState<View>({ scale: 1, x: 0, y: 0 });
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [idle, setIdle] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const points = useRef(new Map<number, { x: number; y: number }>());
  const activate = () => {
    setIdle(false);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setIdle(true), 4000);
  };
  useEffect(() => {
    activate();
    return () => clearTimeout(timer.current);
  }, []);
  const box = () => ({
    w: ref.current!.clientWidth,
    h: ref.current!.clientHeight,
  });
  const local = (x: number, y: number) => {
    const r = ref.current!.getBoundingClientRect();
    return {
      x: ((x - r.left) * ref.current!.clientWidth) / r.width,
      y: ((y - r.top) * ref.current!.clientHeight) / r.height,
    };
  };
  const zoom = (f: number) => {
    activate();
    const b = box();
    setView((v) => zoomAt(v, f, b.w / 2, b.h / 2, b));
  };
  const reset = () => {
    setView({ scale: 1, x: 0, y: 0 });
    setTilt({ x: 0, y: 0 });
    activate();
  };
  useEffect(() => {
    const el = ref.current!;
    const wheel = (e: WheelEvent) => {
      e.preventDefault();
      activate();
      const p = local(e.clientX, e.clientY);
      setView((v) => zoomAt(v, Math.exp(-e.deltaY * 0.002), p.x, p.y, box()));
    };
    el.addEventListener("wheel", wheel, { passive: false });
    return () => el.removeEventListener("wheel", wheel);
  }, []);
  return (
    <div className="image-stage-wrap">
      <div
        className="image-stage"
        ref={ref}
        tabIndex={0}
        aria-label={`${item.alt}. Lăn chuột hoặc +/− để phóng to; 0 để đặt lại`}
        onDoubleClick={reset}
        onKeyDown={(e) => {
          if (["+", "=", "-", "0"].includes(e.key)) {
            e.preventDefault();
            e.stopPropagation();
            if (e.key === "0") reset();
            else zoom(e.key === "-" ? 0.8 : 1.25);
          }
        }}
        onPointerDown={(e) => {
          activate();
          ref.current!.setPointerCapture(e.pointerId);
          points.current.set(e.pointerId, local(e.clientX, e.clientY));
        }}
        onPointerMove={(e) => {
          const p = local(e.clientX, e.clientY),
            old = points.current.get(e.pointerId);
          if (old) {
            activate();
            if (points.current.size === 2) {
              const other = [...points.current.entries()].find(
                ([id]) => id !== e.pointerId,
              )![1];
              const a = Math.hypot(old.x - other.x, old.y - other.y),
                b = Math.hypot(p.x - other.x, p.y - other.y);
              if (a > 0)
                setView((v) =>
                  zoomAt(
                    v,
                    b / a,
                    (p.x + other.x) / 2,
                    (p.y + other.y) / 2,
                    box(),
                  ),
                );
            } else setView((v) => panBy(v, p.x - old.x, p.y - old.y, box()));
            points.current.set(e.pointerId, p);
          } else if (!reduced) {
            activate();
            const b = box();
            setTilt({ x: -(p.y / b.h - 0.5) * 8, y: (p.x / b.w - 0.5) * 8 });
          }
        }}
        onPointerUp={(e) => points.current.delete(e.pointerId)}
        onPointerCancel={(e) => points.current.delete(e.pointerId)}
        onPointerLeave={() => setTilt({ x: 0, y: 0 })}
      >
        <div
          className="zoom-transform"
          style={{
            transform: `translate3d(${view.x}px,${view.y}px,0) scale(${view.scale})`,
          }}
        >
          <SafeImage
            item={item}
            className={idle && !reduced && view.scale === 1 ? "ken-burns" : ""}
            style={{
              transform:
                view.scale === 1 && !idle && !reduced
                  ? `perspective(1600px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale(1.035)`
                  : undefined,
            }}
          />
        </div>
      </div>
      <div className="image-controls">
        <span>{Math.round(view.scale * 100)}%</span>
        <button
          className="icon-button"
          aria-label="Thu nhỏ ảnh"
          onClick={() => zoom(0.8)}
        >
          <Minus />
        </button>
        <button
          className="icon-button"
          aria-label="Phóng to ảnh"
          onClick={() => zoom(1.25)}
        >
          <Plus />
        </button>
        <button
          className="icon-button"
          aria-label="Đặt lại ảnh"
          onClick={reset}
        >
          <RotateCcw />
        </button>
        <span>Kéo để di chuyển · Nhấp đúp để đặt lại</span>
      </div>
      <p className="media-credit">
        {item.credit} · {item.license} ·{" "}
        <a href={item.sourceUrl} target="_blank" rel="noreferrer">
          Trang ảnh gốc
        </a>
      </p>
    </div>
  );
}
