import type { computeStageScale } from "../deck/stageScale";
export interface Stroke {
  color: string;
  points: { x: number; y: number }[];
}
export class InkStore {
  private strokes: Record<string, Stroke[]> = {};
  add(id: string, s: Stroke) {
    this.strokes[id] = [...(this.strokes[id] || []), s];
  }
  clear(id: string) {
    delete this.strokes[id];
  }
  get(id: string) {
    return this.strokes[id] || [];
  }
}
export function toStageCoords(
  x: number,
  y: number,
  s: ReturnType<typeof computeStageScale>,
) {
  return { x: (x - s.offsetX) / s.scale, y: (y - s.offsetY) / s.scale };
}
