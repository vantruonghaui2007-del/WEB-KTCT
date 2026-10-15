import { chromium } from "@playwright/test";
const browser = await chromium.launch({
  executablePath: "/usr/bin/chromium",
  args: ["--no-sandbox"],
});
const page = await browser.newPage({
  viewport: { width: 1024, height: 768 },
  reducedMotion: "reduce",
});
await page.goto("http://localhost:5173/");
const problems = [];
for (let n = 1; n <= 20; n++) {
  await page.evaluate((n) => (location.hash = `#/${n}/99`), n);
  await page
    .locator(`article.slide[data-slide="${String(n).padStart(2, "0")}"]`)
    .waitFor();
  await page.waitForTimeout(100);
  const v = await page.evaluate(() => {
    const slide = document.querySelector("article.slide");
    const footer = slide.querySelector(".slide-footer").getBoundingClientRect();
    return [
      ...slide.querySelectorAll(
        ".point,.stat-context,.map-node,.member-note,.prompt-note,.quiz-answer,.caution-note,.concept-grid,.gallery",
      ),
    ]
      .filter(
        (el) =>
          getComputedStyle(el).opacity !== "0" &&
          el.getBoundingClientRect().bottom > footer.top - 3,
      )
      .map((el) => ({
        class: el.className,
        bottom: el.getBoundingClientRect().bottom,
        footer: footer.top,
      }));
  });
  if (v.length) problems.push({ slide: n, issues: v });
  await page.screenshot({ path: `/tmp/ktct-full-${n}.png` });
}
console.log(JSON.stringify(problems));
await browser.close();
