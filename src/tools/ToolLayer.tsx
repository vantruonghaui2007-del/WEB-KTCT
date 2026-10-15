import { useEffect, useRef } from "react";
import type { Slide } from "../content/types";
import type { Tool } from "./useTool";
import { InkStore, type Stroke } from "./ink";
import { SlideView } from "../deck/SlideView";
export function ToolLayer({
  tool,
  slide,
  step,
  clearToken,
  color,
}: {
  tool: Tool;
  slide: Slide;
  step: number;
  clearToken: number;
  color: string;
}) {
  const ref = useRef<HTMLDivElement>(null),
    canvas = useRef<HTMLCanvasElement>(null),
    lens = useRef<HTMLDivElement>(null),
    lensContent = useRef<HTMLDivElement>(null),
    laser = useRef<HTMLDivElement>(null);
  const trail = useRef<HTMLDivElement>(null),
    lastTrail = useRef(0);
  const ink = useRef(new InkStore());
  const active = useRef<Stroke | null>(null);
  const radius = useRef(180);
  const draw = (stroke: Stroke) => {
    const c = canvas.current!.getContext("2d")!;
    if (stroke.points.length < 2) return;
    c.strokeStyle = stroke.color;
    c.lineWidth = 5;
    c.lineJoin = "round";
    c.lineCap = "round";
    c.beginPath();
    stroke.points.forEach((p, i) =>
      i ? c.lineTo(p.x, p.y) : c.moveTo(p.x, p.y),
    );
    c.stroke();
  };
  const repaint = () => {
    canvas.current!.getContext("2d")!.clearRect(0, 0, 1920, 1080);
    ink.current.get(slide.id).forEach(draw);
  };
  useEffect(() => {
    active.current = null;
    repaint();
  }, [slide.id]);
  useEffect(() => {
    if (clearToken) {
      ink.current.clear(slide.id);
      repaint();
    }
  }, [clearToken]);
  useEffect(() => {
    active.current = null;
  }, [tool]);
  const coords = (e: React.PointerEvent) => {
    const r = ref.current!.getBoundingClientRect();
    return {
      x: ((e.clientX - r.left) * 1920) / r.width,
      y: ((e.clientY - r.top) * 1080) / r.height,
    };
  };
  const point = (x: number, y: number) => {
    if (
      tool === "laser" &&
      trail.current &&
      performance.now() - lastTrail.current > 25
    ) {
      const dot = document.createElement("i");
      dot.style.left = `${x - 6}px`;
      dot.style.top = `${y - 6}px`;
      trail.current.appendChild(dot);
      setTimeout(() => dot.remove(), 300);
      lastTrail.current = performance.now();
    }
    ref.current?.style.setProperty("--pointer-x", `${x}px`);
    ref.current?.style.setProperty("--pointer-y", `${y}px`);
    if (laser.current)
      laser.current.style.transform = `translate3d(${x}px,${y}px,0)`;
    if (lens.current) {
      lens.current.style.transform = `translate3d(${x - 170}px,${y - 170}px,0)`;
      lensContent.current!.style.transform = `translate(${170 - x * 2.5}px,${170 - y * 2.5}px) scale(2.5)`;
    }
  };
  return (
    <div
      ref={ref}
      className={`tool-layer tool-${tool}`}
      aria-hidden="true"
      style={{ pointerEvents: tool === "none" ? "none" : "auto" }}
      onPointerDown={(e) => {
        if (tool === "pen") {
          const p = coords(e);
          active.current = { color, points: [p] };
          e.currentTarget.setPointerCapture(e.pointerId);
        }
      }}
      onPointerMove={(e) => {
        const p = coords(e);
        point(p.x, p.y);
        if (tool === "pen" && active.current) {
          const last = active.current.points.at(-1)!;
          active.current.points.push(p);
          draw({ color: active.current.color, points: [last, p] });
        }
      }}
      onPointerUp={() => {
        if (active.current) {
          ink.current.add(slide.id, active.current);
          active.current = null;
        }
      }}
      onPointerCancel={() => {
        if (active.current) {
          ink.current.add(slide.id, active.current);
          active.current = null;
        }
      }}
      onWheel={(e) => {
        if (tool === "spotlight") {
          radius.current = Math.max(
            100,
            Math.min(400, radius.current - e.deltaY * 0.2),
          );
          ref.current!.style.setProperty(
            "--spot-radius",
            `${radius.current}px`,
          );
        }
      }}
    >
      <canvas ref={canvas} width={1920} height={1080} className="ink-canvas" />
      {tool === "laser" && (
        <>
          <div className="laser-trail" ref={trail} />
          <div ref={laser} className="laser-dot" />
        </>
      )}
      {tool === "spotlight" && <div className="spotlight-mask" />}
      {tool === "magnifier" && (
        <div className="magnifier" ref={lens}>
          <div ref={lensContent} className="magnifier-content" inert>
            <SlideView slide={slide} step={step} mode="thumb" />
          </div>
        </div>
      )}
      {tool === "blackout" && (
        <div className="blackout">
          <span>Màn đen</span>
        </div>
      )}
    </div>
  );
}
