import { describe, it, expect } from "vitest";
import { existsSync, readFileSync } from "node:fs";
import { slides } from "../src/content/slides";
import { sources } from "../src/content/sources";
import { media } from "../src/content/media";

describe("presentation content", () => {
  it("keeps exactly twenty ordered slides and all referenced sources", () => {
    expect(slides.map((slide) => slide.id)).toEqual(
      Array.from({ length: 20 }, (_, i) => String(i + 1).padStart(2, "0")),
    );
    const sourceIds = new Set(sources.map((source) => source.id));
    expect(sources).toHaveLength(9);
    for (const slide of slides) {
      expect(slide.notes.trim()).not.toBe("");
      slide.sourceIds.forEach((id) => expect(sourceIds.has(id)).toBe(true));
    }
    expect(JSON.stringify(slides)).toBe(
      JSON.stringify(slides).normalize("NFC"),
    );
  });

  it("centers five required characteristics and keeps each one in its own section", () => {
    const featureSlides = slides.filter((slide) =>
      slide.section.startsWith("dac-diem-"),
    );
    expect(featureSlides.length).toBeGreaterThanOrEqual(10);
    for (let n = 1; n <= 5; n++) {
      const sectionSlides = slides.filter(
        (slide) => slide.section === `dac-diem-${n}`,
      );
      expect(sectionSlides.length).toBeGreaterThan(0);
      expect(sectionSlides.some((slide) => slide.notes.length > 250)).toBe(
        true,
      );
    }
    expect(slides[4].points).toHaveLength(5);
    expect(slides[9].notes).toContain("tốt đời, đẹp đạo");
    expect(slides[13].notes).toContain("tôn giáo nội sinh");
  });

  it("uses the required seven-question quiz with four options and the supplied answer key", () => {
    const quiz = slides[18].quiz!;
    expect(quiz).toHaveLength(7);
    expect(quiz.map((question) => question.answer)).toEqual([
      "B",
      "B",
      "C",
      "A",
      "D",
      "B",
      "C",
    ]);
    for (const question of quiz) {
      expect(question.options.map((option) => option.key)).toEqual([
        "A",
        "B",
        "C",
        "D",
      ]);
      expect(question.explanation.trim()).not.toBe("");
    }
    expect(quiz[2].explanation).toContain(
      "không có nghĩa mọi giai đoạn lịch sử",
    );
    expect(slides[18].points).toEqual([]);
  });

  it("uses verified local photographs and records attribution, license and source", () => {
    const credits = readFileSync("public/media/CREDITS.md", "utf8");
    for (const item of media) {
      expect(existsSync(`public/${item.src}`), item.id).toBe(true);
      expect(existsSync(`public/media/export/${item.id}.jpg`), item.id).toBe(
        true,
      );
      expect(item.alt).not.toBe("");
      expect(item.credit).not.toBe("");
      expect(item.license).not.toBe("");
      expect(item.sourceUrl).toMatch(/^https:\/\/commons\.wikimedia\.org\//);
      expect(credits).toContain(item.sourceUrl);
    }
    expect(existsSync("public/media/video-poster.webp")).toBe(true);
    expect(existsSync("public/media/mo-dau.mp4")).toBe(false);
    expect(existsSync("public/media/mo-dau.vtt")).toBe(false);
    expect(credits).toContain(
      "không phải ảnh Đại lễ Vesak Liên Hợp Quốc năm 2025",
    );
  });

  it("uses a dated, single-source statistical snapshot and current law references", () => {
    expect(slides[6].asOf).toBe("2025-08-15");
    expect(slides[6].sourceIds).toContain("vnplus-thong-ke-2025");
    expect(slides[16].sourceIds).toContain("luat-hien-hanh");
    expect(slides[16].sourceIds).toContain("luat-2026");
    expect(slides[16].notes).toContain("1/1/2027");
  });
});
