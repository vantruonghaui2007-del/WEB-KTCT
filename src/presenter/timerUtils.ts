export function formatClock(ms: number) {
  const s = Math.floor(Math.abs(ms) / 1000);
  return `${ms < 0 ? "-" : ""}${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
}
export function paceStatus(
  elapsed: number,
  target: number,
  slide: number,
  total: number,
): "ahead" | "on-track" | "behind" {
  const delta = elapsed / Math.max(1, target) - slide / total;
  return delta > 0.1 ? "behind" : delta < -0.1 ? "ahead" : "on-track";
}
