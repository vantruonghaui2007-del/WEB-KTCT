import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  alpha: number;
  baseAlpha: number;
  color: string;
}

export function AmbientBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    // Skip in JSDOM / non-browser test environment
    if (typeof window === "undefined" || navigator.userAgent?.includes("jsdom"))
      return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    let ctx: CanvasRenderingContext2D | null = null;
    try {
      ctx = canvas.getContext("2d");
    } catch {
      return;
    }
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = 1920);
    let height = (canvas.height = 1080);

    const colors = [
      "rgba(212, 175, 87, ", // Gold
      "rgba(230, 57, 70, ", // Cinnabar
      "rgba(245, 238, 223, ", // Soft cream
    ];

    const particleCount = 42;
    const particles: Particle[] = [];

    for (let i = 0; i < particleCount; i++) {
      const baseAlpha = 0.15 + Math.random() * 0.45;
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.22,
        vy: -0.15 - Math.random() * 0.28,
        radius: 0.8 + Math.random() * 2.2,
        alpha: baseAlpha,
        baseAlpha,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }

    let mouseX = width / 2;
    let mouseY = height / 2;

    const handlePointerMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const scaleX = width / rect.width;
      const scaleY = height / rect.height;
      mouseX = (e.clientX - rect.left) * scaleX;
      mouseY = (e.clientY - rect.top) * scaleY;
    };

    window.addEventListener("pointermove", handlePointerMove, {
      passive: true,
    });

    let t = 0;
    const render = () => {
      t += 0.02;
      ctx.clearRect(0, 0, width, height);

      // Render subtle drifting particles
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;

        // Wrap around borders
        if (p.y < -10) {
          p.y = height + 10;
          p.x = Math.random() * width;
        }
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;

        // Subtle shimmer
        p.alpha = p.baseAlpha + Math.sin(t + p.x * 0.01) * 0.15;

        // Mouse gentle push
        const dx = p.x - mouseX;
        const dy = p.y - mouseY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 140 && dist > 0) {
          const force = (140 - dist) / 140;
          p.x += (dx / dist) * force * 1.2;
          p.y += (dy / dist) * force * 1.2;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `${p.color}${Math.max(0, Math.min(1, p.alpha))})`;
        ctx.shadowColor =
          p.color === colors[0]
            ? "rgba(212, 175, 87, 0.4)"
            : "rgba(230, 57, 70, 0.3)";
        ctx.shadowBlur = p.radius * 3;
        ctx.fill();
      }

      ctx.shadowBlur = 0;
      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("pointermove", handlePointerMove);
    };
  }, []);

  return (
    <div className="ambient-particles-wrap" aria-hidden="true">
      <div className="ambient-mesh-glow top-right-gold" />
      <div className="ambient-mesh-glow bottom-left-red" />
      <div className="ambient-mesh-glow center-soft" />
      <canvas ref={canvasRef} className="ambient-particles-canvas" />
    </div>
  );
}
