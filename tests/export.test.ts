import { it, expect, vi } from "vitest";
import JSZip from "jszip";
import { slides } from "../src/content/slides";
import { sources } from "../src/content/sources";
import { buildPptxModel } from "../src/export/pptxModel";
import { exportPptx } from "../src/export/exportPptx";
const now = new Date("2026-10-15T03:00:00Z");
it("builds 20 slides with sources, dates and private quiz answers", () => {
  const m = buildPptxModel(slides, sources, now);
  expect(m).toHaveLength(20);
  expect(m[6].footer).toBe("Nhóm 7 · Chủ đề 7 · 07/20");
  expect(m[6].bullets).toContain("Trên 27,7 triệu tín đồ");
  expect(m[6].bullets).toContain("Gần 30.000 cơ sở thờ tự");
  expect(m[6].bullets.at(-1)).toMatch(/^Số liệu công bố 15\/08\/2025/);
  expect(m[18].bullets.join(" ")).not.toMatch(/Đáp án/);
  expect(m[18].notes).toMatch(/Đáp án A/);
  m.forEach((s) => expect(s.sourceLine).toMatch(/^Nguồn: /));
  expect(m[16].bullets.at(-1)).toContain("chưa có hiệu lực");
});
it("writes a real PPTX with 20 note pages and Vietnamese text even when an image cannot load", async () => {
  const original = globalThis.fetch;
  globalThis.fetch = vi
    .fn()
    .mockRejectedValue(new Error("simulated unavailable image"));
  try {
    const blob = await exportPptx(slides, { now });
    const bytes = await new Promise<ArrayBuffer>((resolve, reject) => {
      const r = new FileReader();
      r.onload = () => resolve(r.result as ArrayBuffer);
      r.onerror = reject;
      r.readAsArrayBuffer(blob);
    });
    const zip = await JSZip.loadAsync(bytes);
    expect(
      Object.keys(zip.files).filter((f) =>
        /^ppt\/slides\/slide\d+\.xml$/.test(f),
      ),
    ).toHaveLength(20);
    expect(
      Object.keys(zip.files).filter((f) =>
        /^ppt\/notesSlides\/notesSlide\d+\.xml$/.test(f),
      ),
    ).toHaveLength(20);
    expect(await zip.file("ppt/slides/slide1.xml")!.async("string")).toContain(
      "Đặc điểm của tôn giáo ở Việt Nam",
    );
    expect(
      await zip.file("ppt/notesSlides/notesSlide19.xml")!.async("string"),
    ).toContain("Đáp án A");
  } finally {
    globalThis.fetch = original;
  }
}, 15000);
