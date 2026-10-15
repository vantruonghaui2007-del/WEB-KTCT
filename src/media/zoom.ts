export interface View {
  scale: number;
  x: number;
  y: number;
}
export const MIN_SCALE = 1,
  MAX_SCALE = 4;
const clamp = (v: View, b: { w: number; h: number }): View => ({
  ...v,
  x: Math.max(b.w * (1 - v.scale), Math.min(0, v.x)),
  y: Math.max(b.h * (1 - v.scale), Math.min(0, v.y)),
});
export function zoomAt(
  v: View,
  f: number,
  cx: number,
  cy: number,
  b: { w: number; h: number },
): View {
  const scale = Math.max(MIN_SCALE, Math.min(MAX_SCALE, v.scale * f));
  const r = scale / v.scale;
  return clamp({ scale, x: cx - (cx - v.x) * r, y: cy - (cy - v.y) * r }, b);
}
export function panBy(
  v: View,
  dx: number,
  dy: number,
  b: { w: number; h: number },
) {
  return clamp({ ...v, x: v.x + dx, y: v.y + dy }, b);
}
