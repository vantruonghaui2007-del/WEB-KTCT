export interface HandSample {
  t: number;
  x: number;
  y?: number;
}
export const SWIPE_PROFILES = {
  steady: { label: "Chắc chắn", minDx: 0.21, cooldownMs: 950 },
  balanced: { label: "Cân bằng", minDx: 0.15, cooldownMs: 750 },
  sensitive: { label: "Nhạy", minDx: 0.1, cooldownMs: 650 },
} as const;
export type Sensitivity = keyof typeof SWIPE_PROFILES;
export function detectSwipe(
  samples: HandSample[],
  cfg?: {
    minDx?: number;
    maxMs?: number;
    cooldownMs?: number;
    lastFireAt?: number;
  },
): "next" | "prev" | null {
  if (samples.length < 3) return null;
  const b = samples.at(-1)!;
  if (
    cfg?.lastFireAt !== undefined &&
    b.t - cfg.lastFireAt < (cfg.cooldownMs ?? 750)
  )
    return null;
  const s = samples.filter((p) => b.t - p.t <= (cfg?.maxMs ?? 700));
  if (s.length < 3 || b.t - s[0].t < 100) return null;
  // Reject jumps after missing frames and movement that mostly doubles back.
  if (s.some((p, i) => i > 0 && (p.t <= s[i - 1].t || p.t - s[i - 1].t > 250)))
    return null;
  const dx = b.x - s[0].x;
  const dy = (b.y ?? 0) - (s[0].y ?? 0);
  const travel = s
    .slice(1)
    .reduce((sum, p, i) => sum + Math.abs(p.x - s[i].x), 0);
  if (
    Math.abs(dx) < (cfg?.minDx ?? 0.15) ||
    Math.abs(dy) > Math.abs(dx) * 0.65 ||
    Math.abs(dx) < travel * 0.78
  )
    return null;
  return dx > 0 ? "next" : "prev";
}
