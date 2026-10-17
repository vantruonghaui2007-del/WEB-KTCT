import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem("nhom7-guide-seen", "1");
    localStorage.removeItem("nhom7-theme");
  });
  await page.emulateMedia({ reducedMotion: "reduce" });
});

test("class picker accepts a roster, draws without repeats and does not change the quiz beneath it", async ({
  page,
}, testInfo) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/#/19/0");
  await page.keyboard.press("r");
  await page
    .getByLabel("Mỗi người một dòng")
    .fill("Nguyễn An\nTrần Bình\nLê Chi");
  await page.getByRole("button", { name: "Dùng danh sách" }).click();
  await page.getByRole("button", { name: "Âm thanh bật" }).click();
  const names: string[] = [];
  for (let i = 0; i < 3; i++) {
    await page.locator(".picker-spin").click();
    await expect(page.locator(".picker-stage")).toHaveClass(/has-winner/);
    names.push((await page.locator(".picker-name").innerText()).trim());
    if (i === 0)
      await page.screenshot({
        path: testInfo.outputPath("picker-desktop.png"),
      });
  }
  expect(new Set(names).size).toBe(3);
  expect(names.sort()).toEqual(["Lê Chi", "Nguyễn An", "Trần Bình"]);
  await expect(page.locator(".picker-spin")).toBeDisabled();
  await expect(page).toHaveURL(/#\/19\/0$/);
  await page.keyboard.press("Escape");
  await expect(page.locator(".quiz-options [aria-pressed=true]")).toHaveCount(
    0,
  );
  await page.reload();
  await page.keyboard.press("r");
  await expect(page.locator(".picker-spin")).toBeDisabled();
  await page.getByRole("button", { name: "Vòng mới" }).click();
  await expect(page.locator(".picker-spin")).toBeEnabled();
  await page.locator(".picker-spin").focus();
  await page.keyboard.press("Space");
  await expect(page.locator(".picker-stage")).toHaveClass(/has-winner/);
  expect(errors).toEqual([]);
});

test("CSV import and random picker continue offline", async ({
  page,
  context,
}) => {
  await page.goto("/");
  await page.waitForFunction(() => navigator.serviceWorker.controller !== null);
  await page.keyboard.press("r");
  await page.getByLabel("Nhập tệp danh sách lớp").setInputFiles({
    name: "lop.csv",
    mimeType: "text/csv",
    buffer: Buffer.from("STT,Họ và tên,Lớp\n1,Nguyễn An,A1"),
  });
  await expect(page.getByLabel("Mỗi người một dòng")).toHaveValue("Nguyễn An");
  await page.getByRole("button", { name: "Dùng danh sách" }).click();
  await context.setOffline(true);
  await page.reload();
  await page.keyboard.press("r");
  await page.locator(".picker-spin").click();
  await expect(page.locator(".picker-stage")).toHaveClass(/has-winner/);
  await expect(page.locator(".picker-name")).toHaveText("Nguyễn An");
  await context.setOffline(false);
});

test("member names remain legible in both themes and picker fits a phone", async ({
  page,
}, testInfo) => {
  await page.goto("/#/2/1");
  for (const theme of ["dark", "light"]) {
    if (theme === "light") {
      await page.keyboard.press("t");
      await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
    } else {
      await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
    }
    await expect(page.locator(".member-list b")).toHaveCount(11);
    const contrast = await page.locator(".member-panel").evaluate((panel) => {
      const rgb = (color: string) =>
        (color.match(/[\d.]+/g) ?? []).slice(0, 3).map(Number);
      const css = getComputedStyle(panel);
      const foreground = rgb(getComputedStyle(panel.querySelector("b")!).color);
      const base = rgb(
        css.getPropertyValue("--paper").trim().startsWith("#")
          ? (() => {
              const hex = css.getPropertyValue("--paper").trim().slice(1);
              return `rgb(${[0, 2, 4].map((i) => parseInt(hex.slice(i, i + 2), 16)).join(",")})`;
            })()
          : css.backgroundColor,
      );
      const colors = css.backgroundImage.match(/rgba?\([^)]+\)/g) ?? [
        css.backgroundColor,
      ];
      const lum = (color: number[]) =>
        color
          .map((v) => v / 255)
          .map((v) => (v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4))
          .reduce((s, v, i) => s + v * [0.2126, 0.7152, 0.0722][i], 0);
      return Math.min(
        ...colors.map((c) => {
          const alpha = c.startsWith("rgba")
            ? Number(c.match(/[\d.]+/g)!.at(-1))
            : 1;
          const background = rgb(c).map(
            (v, i) => v * alpha + base[i] * (1 - alpha),
          );
          const a = lum(foreground),
            b = lum(background);
          return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
        }),
      );
    });
    expect(contrast).toBeGreaterThan(4.5);
    await page.screenshot({
      path: testInfo.outputPath(`members-${theme}.png`),
    });
  }
  await page.setViewportSize({ width: 390, height: 844 });
  await page.keyboard.press("r");
  await expect(page.getByRole("dialog")).toBeVisible();
  const bounds = await page.getByRole("dialog").boundingBox();
  expect(bounds!.width).toBeLessThanOrEqual(390);
  await expect(page.getByLabel("Mỗi người một dòng")).toBeVisible();
  await page.screenshot({ path: testInfo.outputPath("picker-mobile.png") });
});
