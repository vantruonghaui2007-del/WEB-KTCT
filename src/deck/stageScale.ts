export function computeStageScale(vw: number, vh: number) {
  const scale = Math.min(vw / 1920, vh / 1080);
  return {
    scale,
    offsetX: (vw - 1920 * scale) / 2,
    offsetY: (vh - 1080 * scale) / 2,
  };
}
