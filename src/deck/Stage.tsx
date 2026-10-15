import { useEffect, useRef, useState, type ReactNode } from "react";
import { computeStageScale } from "./stageScale";
export { computeStageScale } from "./stageScale";
export function Stage({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ w: 1920, h: 1080 });
  useEffect(() => {
    const el = ref.current!;
    const ro = new ResizeObserver(([e]) =>
      setSize({ w: e.contentRect.width, h: e.contentRect.height }),
    );
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  const s = computeStageScale(size.w, size.h);
  return (
    <div ref={ref} className={`stage-viewport ${className}`}>
      <div
        className="stage"
        style={{
          transform: `translate(${s.offsetX}px,${s.offsetY}px) scale(${s.scale})`,
        }}
      >
        {children}
      </div>
    </div>
  );
}
