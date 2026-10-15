import { describe, it, expect } from "vitest";
import { slides } from "../src/content/slides";
import { sources } from "../src/content/sources";
import { media } from "../src/content/media";
import { readFileSync, existsSync } from "node:fs";
import JSZip from "jszip";
describe("DOCX content", () => {
  it("has exactly 20 ordered slides and six sources", () => {
    expect(slides.map((s) => s.id)).toEqual(
      Array.from({ length: 20 }, (_, i) => String(i + 1).padStart(2, "0")),
    );
    expect(sources).toHaveLength(6);
  });
  it("preserves every original speaker note and every visible source paragraph", async () => {
    const zip = await JSZip.loadAsync(
      readFileSync("Noi_dung_Chu_de_7_da_bien_tap.docx"),
    );
    const xml = await zip.file("word/document.xml")!.async("string");
    const doc = new DOMParser().parseFromString(xml, "application/xml");
    const ps = [...doc.getElementsByTagName("w:p")].map((p) =>
      [...p.getElementsByTagName("w:t")]
        .map((t) => t.textContent)
        .join("")
        .normalize("NFC"),
    );
    for (let i = 0; i < 20; i++) {
      const start = ps.findIndex((p) => p.startsWith(slides[i].id + ". "));
      const end =
        i === 19
          ? ps.indexOf("Thông tin nguồn để nhóm gắn vào web")
          : ps.findIndex((p) => p.startsWith(slides[i + 1].id + ". "));
      const block = ps.slice(start, end);
      const split = block.indexOf("Ghi chú và lời thuyết trình");
      expect(slides[i].notes).toBe(block.slice(split + 1).join("\n"));
      const visible = block.slice(2, split);
      if (slides[i].concepts)
        expect(
          slides[i].concepts!.map((c) => `${c.term}: ${c.definition}`),
        ).toEqual(visible);
      else if (i !== 18 && i !== 0) expect(slides[i].points).toEqual(visible);
    }
  });
  it("validates notes, source references, dated statistics and NFC", () => {
    const ids = new Set(sources.map((s) => s.id));
    for (const s of slides) {
      expect(s.notes.trim()).not.toBe("");
      s.sourceIds.forEach((id) => expect(ids.has(id)).toBe(true));
      if (s.stats) expect(s.asOf).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    }
    expect(JSON.stringify(slides)).toBe(
      JSON.stringify(slides).normalize("NFC"),
    );
  });
  it("enforces the editorial exclusions", () => {
    for (const s of slides) {
      const visible = [
        s.title,
        ...s.points,
        ...(s.concepts || []).flatMap((c) => [c.term, c.definition]),
      ].join("\n");
      for (const bad of ["2.161", "3.227", "luôn không có mâu thuẫn"])
        expect(visible).not.toContain(bad);
    }
  });
  it("keeps five quiz answers hidden in structured data", () => {
    expect(slides[18].quiz!.map((q) => q.answer)).toEqual([
      "A",
      "B",
      "B",
      "A",
      "A",
    ]);
    expect(slides[18].points).toEqual([]);
  });
  it("all media have local files, credit and license; MP4 and captions exist", () => {
    for (const m of media) {
      expect(existsSync(`public/${m.src}`)).toBe(true);
      expect(m.alt).not.toBe("");
      expect(m.credit).not.toBe("");
      expect(m.license).toBe("CC0 1.0");
    }
    expect(existsSync("public/media/mo-dau.mp4")).toBe(true);
    expect(readFileSync("public/media/mo-dau.vtt", "utf8")).toMatch(/^WEBVTT/);
  });
});
