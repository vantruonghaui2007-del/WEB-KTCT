export interface HandSample {
  t: number;
  x: number;
}
export function detectSwipe(
  samples: HandSample[],
  cfg?: {
    minDx?: number;
    maxMs?: number;
    cooldownMs?: number;
    lastFireAt?: number;
  },
): "next" | "prev" | null {
  if (samples.length < 2) return null;
  const b = samples.at(-1)!;
  if (
    cfg?.lastFireAt !== undefined &&
    b.t - cfg.lastFireAt < (cfg.cooldownMs ?? 1000)
  )
    return null;
  const s = samples.filter((p) => b.t - p.t <= (cfg?.maxMs ?? 600));
  if (s.length < 2) return null;
  const dx = b.x - s[0].x;
  if (Math.abs(dx) < (cfg?.minDx ?? 0.25)) return null;
  return dx > 0 ? "next" : "prev";
}
