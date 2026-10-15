import { it, expect } from "vitest";
import { slides } from "../src/content/slides";
import {
  next,
  prev,
  parseHash,
  toHash,
  fragmentCount,
} from "../src/deck/useDeck";
import { computeStageScale } from "../src/deck/stageScale";
import { zoomAt, panBy } from "../src/media/zoom";
import { lawStatus, todayVN, dataAgeLabel } from "../src/legal/status";
import { formatClock, paceStatus } from "../src/presenter/timerUtils";
import { InkStore, toStageCoords } from "../src/tools/ink";
import { detectSwipe } from "../src/gesture/swipe";
import { quizView } from "../src/widgets/quizState";
it("advances fragments, transitions slides and clamps ends", () => {
  expect(next({ slide: 0, step: 0 }, slides)).toEqual({ slide: 0, step: 1 });
  expect(next({ slide: 0, step: 3 }, slides)).toEqual({ slide: 1, step: 0 });
  expect(prev({ slide: 1, step: 0 }, slides)).toEqual({ slide: 0, step: 3 });
  expect(prev({ slide: 0, step: 0 }, slides)).toEqual({ slide: 0, step: 0 });
  expect(next({ slide: 19, step: 3 }, slides)).toEqual({ slide: 19, step: 3 });
  expect(fragmentCount(slides[18])).toBe(9);
});
it("parses, clamps and round trips hash positions", () => {
  expect(parseHash("#/7/2", slides)).toEqual({ slide: 6, step: 2 });
  expect(parseHash("#/99", slides)).toEqual({ slide: 19, step: 0 });
  expect(parseHash("#abc", slides)).toEqual({ slide: 0, step: 0 });
  expect(parseHash("#/0/999", slides)).toEqual({ slide: 0, step: 3 });
  for (let i = 0; i < 20; i++)
    expect(parseHash(toHash({ slide: i, step: 0 }), slides)).toEqual({
      slide: i,
      step: 0,
    });
});
it("letterboxes projector sizes with correct coordinates", () => {
  expect(computeStageScale(1920, 1080)).toEqual({
    scale: 1,
    offsetX: 0,
    offsetY: 0,
  });
  expect(computeStageScale(1024, 768)).toEqual({
    scale: 1024 / 1920,
    offsetX: 0,
    offsetY: 96,
  });
  expect(computeStageScale(1366, 768).scale).toBeCloseTo(768 / 1080, 5);
  expect(computeStageScale(2560, 1080)).toEqual({
    scale: 1,
    offsetX: 320,
    offsetY: 0,
  });
  expect(
    toStageCoords(512, 96, { scale: 0.5, offsetX: 0, offsetY: 96 }),
  ).toEqual({ x: 1024, y: 0 });
});
it("zooms at the cursor and clamps pan without empty borders", () => {
  const box = { w: 1000, h: 500 };
  const v = zoomAt({ scale: 1, x: 0, y: 0 }, 2, 250, 125, box);
  expect(v.scale).toBe(2);
  expect((250 - v.x) / v.scale).toBeCloseTo(250);
  expect((125 - v.y) / v.scale).toBeCloseTo(125);
  expect(zoomAt(v, 10, 0, 0, box).scale).toBe(4);
  expect(zoomAt(v, 0.1, 0, 0, box)).toEqual({ scale: 1, x: 0, y: 0 });
  expect(panBy({ scale: 1, x: 0, y: 0 }, 300, 0, box)).toEqual({
    scale: 1,
    x: 0,
    y: 0,
  });
  expect(panBy(v, -5000, 0, box).x).toBe(-1000);
});
it("handles the law date in Vietnam, including the midnight boundary", () => {
  expect(lawStatus(new Date("2026-10-15T03:00:00Z"))).toEqual({
    phase: "pending",
    daysLeft: 78,
  });
  expect(lawStatus(new Date("2026-12-31T16:30:00Z")).phase).toBe("pending");
  expect(lawStatus(new Date("2026-12-31T17:00:00Z"))).toEqual({
    phase: "in-force",
  });
  expect(todayVN(new Date("2026-12-31T17:00:00Z"))).toBe("2027-01-01");
  expect(dataAgeLabel("2025-08-15", new Date("2026-10-15T03:00:00Z"))).toBe(
    "Số liệu công bố 15/08/2025 · cách đây 14 tháng",
  );
});
it("formats countdowns and assesses pace", () => {
  expect(formatClock(425000)).toBe("07:05");
  expect(formatClock(-90000)).toBe("-01:30");
  expect(paceStatus(450000, 900000, 10, 20)).toBe("on-track");
  expect(paceStatus(700000, 900000, 5, 20)).toBe("behind");
  expect(paceStatus(100000, 900000, 15, 20)).toBe("ahead");
});
it("keeps annotations isolated by slide", () => {
  const ink = new InkStore();
  const s = {
    color: "red",
    points: [
      { x: 1, y: 2 },
      { x: 3, y: 4 },
    ],
  };
  ink.add("07", s);
  ink.add("08", s);
  ink.clear("07");
  expect(ink.get("07")).toEqual([]);
  expect(ink.get("08")).toEqual([s]);
});
it("quiz reveal is driven only by deck steps", () => {
  expect(quizView(0, 5)).toEqual({ index: 0, revealed: false });
  expect(quizView(3, 5)).toEqual({ index: 1, revealed: true });
  expect(quizView(9, 5)).toEqual({ index: 4, revealed: true });
});
it("recognizes hand swipes with the specified direction and cooldown", () => {
  const s = (p: number[][]) => p.map(([t, x]) => ({ t, x }));
  expect(
    detectSwipe(
      s([
        [0, 0.3],
        [200, 0.45],
        [400, 0.62],
      ]),
    ),
  ).toBe("next");
  expect(
    detectSwipe(
      s([
        [0, 0.7],
        [300, 0.4],
      ]),
    ),
  ).toBe("prev");
  expect(
    detectSwipe(
      s([
        [0, 0.3],
        [900, 0.7],
      ]),
    ),
  ).toBeNull();
  expect(
    detectSwipe(
      s([
        [0, 0.4],
        [200, 0.5],
      ]),
    ),
  ).toBeNull();
  expect(
    detectSwipe(
      s([
        [1000, 0.3],
        [1300, 0.7],
      ]),
      { lastFireAt: 500 },
    ),
  ).toBeNull();
});
