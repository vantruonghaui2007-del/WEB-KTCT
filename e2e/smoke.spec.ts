import { test, expect, type Page } from "@playwright/test";
import JSZip from "jszip";
import { readFile } from "node:fs/promises";
const go = async (page: Page, slide: number, step = 0) => {
  await page.evaluate((hash) => {
    location.hash = hash;
  }, `#/${slide}/${step}`);
  await expect(page.locator("article.slide").first()).toHaveAttribute(
    "data-slide",
    String(slide).padStart(2, "0"),
  );
  await page.waitForTimeout(300);
};
test("clicker traverses the whole deck, handles Home and overview", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("/");
  await expect(
    page.getByRole("heading", {
      name: "Chủ đề 7: Đặc điểm của tôn giáo ở Việt Nam",
    }),
  ).toBeVisible();
  for (let i = 0; i < 130; i++) await page.keyboard.press("PageDown");
  await expect(page).toHaveURL(/#\/20\/3$/);
  await page.keyboard.press("Home");
  await expect(page).toHaveURL(/#\/1\/0$/);
  await page.keyboard.press("o");
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toHaveCount(0);
  expect(errors).toEqual([]);
});
test("all slide layouts fit projector viewports and all images decode", async ({
  page,
}) => {
  await page.goto("/");
  await page.emulateMedia({ reducedMotion: "reduce" });
  for (const viewport of [
    { width: 1024, height: 768 },
    { width: 1366, height: 768 },
  ]) {
    await page.setViewportSize(viewport);
    for (let n = 1; n <= 20; n++) {
      await go(page, n, n === 19 ? 9 : 99);
      const result = await page.evaluate(() => {
        const slide = document.querySelector("article.slide")!;
        const footer = slide
          .querySelector(".slide-footer")!
          .getBoundingClientRect();
        const points = [
          ...slide.querySelectorAll(
            ".point,.stat-context,.map-node,.member-note,.prompt-note,.quiz-answer,.caution-note,.concept-grid,.gallery",
          ),
        ].filter((el) => getComputedStyle(el).opacity !== "0");
        return {
          scroll:
            document.documentElement.scrollHeight > innerHeight ||
            document.documentElement.scrollWidth > innerWidth,
          badImages: [...slide.querySelectorAll("img")]
            .filter(
              (i) => !i.complete || i.naturalWidth === 0 || i.dataset.fallback,
            )
            .map((i) => i.alt),
          overlaps: points
            .filter((el) => el.getBoundingClientRect().bottom > footer.top - 3)
            .map((el) => ({
              class: el.className,
              bottom: el.getBoundingClientRect().bottom,
              footer: footer.top,
            })),
        };
      });
      expect(result, `slide ${n}, ${viewport.width}`).toEqual({
        scroll: false,
        badImages: [],
        overlaps: [],
      });
    }
  }
});
test("video loads, plays, seeks and reaches its end without media errors", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByRole("button", { name: /Xem mở đầu/ }).click();
  const video = page.locator("video");
  await expect(video).toBeVisible();
  await video.evaluate(async (v: HTMLVideoElement) => {
    await v.play();
  });
  await expect
    .poll(() => video.evaluate((v: HTMLVideoElement) => v.currentTime))
    .toBeGreaterThan(0.2);
  await expect
    .poll(() => video.evaluate((v: HTMLVideoElement) => v.duration))
    .toBeCloseTo(48, 0);
  await video.evaluate((v: HTMLVideoElement) => {
    v.currentTime = 47.3;
  });
  await expect
    .poll(() => video.evaluate((v: HTMLVideoElement) => v.ended))
    .toBe(true);
  expect(await video.evaluate((v: HTMLVideoElement) => v.error)).toBeNull();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toHaveCount(0);
});
test("interactive gallery zoom and reset; image fallback is local", async ({
  page,
}) => {
  await page.goto("/#/6/3");
  await page
    .getByRole("button", { name: "Xem minh họa Phật giáo", exact: true })
    .click();
  await page.getByRole("button", { name: "Phóng to ảnh", exact: true }).click();
  await expect(page.getByText("125%", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Đặt lại ảnh", exact: true }).click();
  await expect(page.getByText("100%", { exact: true })).toBeVisible();
  await page.locator(".image-stage").focus();
  await page.keyboard.press("+");
  await expect(page.getByText("125%", { exact: true })).toBeVisible();
  await page.keyboard.press("0");
  await expect(page.getByText("100%", { exact: true })).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page).toHaveURL(/#\/6\/3$/);
});
test("flip cards, feature links, keyboard sorting and quiz reveal", async ({
  page,
}) => {
  await page.goto("/#/4/0");
  const card = page.getByRole("button", { name: "Tín ngưỡng: xem định nghĩa" });
  await card.focus();
  await page.keyboard.press("Space");
  await expect(
    page.getByRole("button", { name: "Tín ngưỡng: ẩn định nghĩa" }),
  ).toHaveAttribute("aria-pressed", "true");
  await expect(page).toHaveURL(/#\/4\/0$/);
  await go(page, 5, 5);
  await page.locator(".map-node").nth(2).click();
  await expect(page).toHaveURL(/#\/10\/0$/);
  await go(page, 3, 2);
  for (const [name, key] of [
    ["Chùa", "1"],
    ["Nhà thờ", "1"],
    ["Thánh thất", "1"],
    ["Thánh đường", "1"],
    ["Bàn thờ tổ tiên", "2"],
    ["Đình", "2"],
    ["Đền", "2"],
  ]) {
    await page.getByRole("button", { name, exact: true }).focus();
    await page.keyboard.press(key);
  }
  await expect(page.getByText("Đã phân loại đủ 7 hình ảnh")).toBeVisible();
  await go(page, 19, 0);
  await page.keyboard.press("1");
  await expect(page.getByRole("button", { name: "A. Có." })).toHaveAttribute(
    "aria-pressed",
    "true",
  );
  await expect(page.getByText("Phân biệt tôn giáo và tổ chức.")).toHaveCount(0);
  await page.keyboard.press("PageDown");
  await expect(page.getByText("Phân biệt tôn giáo và tổ chức.")).toBeVisible();
});
test("presenter opens late, synchronizes bidirectionally and survives reload", async ({
  page,
}) => {
  await page.goto("/#/7/2");
  const popup = page.waitForEvent("popup");
  await page.keyboard.press("p");
  const presenter = await popup;
  await expect(
    presenter.getByText("Đã đồng bộ cửa sổ trình chiếu"),
  ).toBeVisible();
  await expect(presenter).toHaveURL(/#\/7\/2$/);
  await presenter.keyboard.press("PageDown");
  await expect(page).toHaveURL(/#\/7\/3$/);
  await presenter.reload();
  await expect(presenter).toHaveURL(/#\/7\/3$/);
  await page.keyboard.press("PageDown");
  await expect(presenter).toHaveURL(/#\/8\/0$/);
  const target = presenter.getByRole("spinbutton", {
    name: "Số phút mục tiêu",
  });
  await target.focus();
  await presenter.keyboard.press("ArrowRight");
  await expect(page).toHaveURL(/#\/8\/0$/);
  await presenter.getByRole("button", { name: "Bắt đầu đồng hồ" }).click();
  await expect
    .poll(() => presenter.locator(".presenter-timer strong").textContent())
    .not.toBe("00:00");
  await presenter.close();
});
test("tools toggle, annotation stays on its slide and clear erases it", async ({
  page,
}) => {
  await page.goto("/#/8/3");
  await page.keyboard.press("l");
  await expect(page.locator(".tool-laser")).toBeVisible();
  await page.keyboard.press("l");
  await expect(page.locator(".tool-none")).toBeVisible();
  await page.keyboard.press("d");
  await page.mouse.move(400, 350);
  await page.mouse.down();
  await page.mouse.move(580, 450, { steps: 12 });
  await page.mouse.up();
  const pixels = () =>
    page.locator("canvas").evaluate((c: HTMLCanvasElement) =>
      c
        .getContext("2d")!
        .getImageData(0, 0, c.width, c.height)
        .data.some((v, i) => i % 4 === 3 && v > 0),
    );
  expect(await pixels()).toBe(true);
  await go(page, 9, 3);
  expect(await pixels()).toBe(false);
  await go(page, 8, 3);
  expect(await pixels()).toBe(true);
  await page.keyboard.press("c");
  expect(await pixels()).toBe(false);
  await page.keyboard.press("Escape");
  await page.keyboard.press("b");
  await expect(page.locator(".blackout")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.locator(".blackout")).toHaveCount(0);
  await page.keyboard.press("z");
  await page.mouse.move(600, 300);
  await expect(page.locator(".magnifier")).toBeVisible();
  await page.keyboard.press("Escape");
});
test("PowerPoint download contains 20 slides, notes, local pictures and Vietnamese", async ({
  page,
}) => {
  await page.goto("/");
  const waiting = page.waitForEvent("download");
  await page.keyboard.press("e");
  const dl = await waiting;
  expect(dl.suggestedFilename()).toBe("Nhom7_Chu_de_7_Ton_giao_VN.pptx");
  const zip = await JSZip.loadAsync(await readFile((await dl.path())!));
  expect(
    Object.keys(zip.files).filter((n) =>
      /^ppt\/slides\/slide\d+\.xml$/.test(n),
    ),
  ).toHaveLength(20);
  expect(
    Object.keys(zip.files).filter((n) =>
      /^ppt\/notesSlides\/notesSlide\d+\.xml$/.test(n),
    ),
  ).toHaveLength(20);
  expect(
    Object.keys(zip.files).filter((n) => /^ppt\/media\/.+\.png$/.test(n))
      .length,
  ).toBeGreaterThan(0);
  expect(await zip.file("ppt/slides/slide1.xml")!.async("string")).toContain(
    "Đặc điểm của tôn giáo ở Việt Nam",
  );
  expect(
    await zip.file("ppt/slides/slide19.xml")!.async("string"),
  ).not.toContain("Đáp án");
  expect(
    await zip.file("ppt/notesSlides/notesSlide19.xml")!.async("string"),
  ).toContain("Đáp án A");
});
test("offline reload retains font, images, video and export; no external requests", async ({
  page,
  context,
}) => {
  const external: string[] = [];
  page.on("request", (r) => {
    if (
      !r.url().startsWith("http://127.0.0.1:4173") &&
      !r.url().startsWith("blob:") &&
      !r.url().startsWith("data:")
    )
      external.push(r.url());
  });
  await page.goto("/");
  await page.waitForFunction(() => navigator.serviceWorker.controller !== null);
  await context.setOffline(true);
  await page.reload();
  await expect(
    page.getByRole("heading", {
      name: "Chủ đề 7: Đặc điểm của tôn giáo ở Việt Nam",
    }),
  ).toBeVisible();
  await expect
    .poll(() =>
      page
        .locator(".hero-image-frame img")
        .evaluate((i: HTMLImageElement) => i.naturalWidth),
    )
    .toBeGreaterThan(0);
  await page.getByRole("button", { name: /Xem mở đầu/ }).click();
  const video = page.locator("video");
  await video.evaluate(async (v: HTMLVideoElement) => {
    await v.play();
  });
  await expect
    .poll(() => video.evaluate((v: HTMLVideoElement) => v.currentTime))
    .toBeGreaterThan(0.1);
  await page.keyboard.press("Escape");
  const dl = page.waitForEvent("download");
  await page.keyboard.press("e");
  expect((await dl).suggestedFilename()).toMatch(/\.pptx$/);
  expect(external).toEqual([]);
});
test("camera permission rejection has a usable fallback", async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator.mediaDevices, "getUserMedia", {
      value: () =>
        Promise.reject(new DOMException("Denied", "NotAllowedError")),
    });
  });
  await page.goto("/");
  await page.keyboard.press("g");
  await page.getByRole("button", { name: "Bật camera", exact: true }).click();
  await expect(page.getByText(/Chưa được cấp quyền camera/)).toBeVisible();
  await page.keyboard.press("g");
  await expect(page.locator(".gesture-panel")).toHaveCount(0);
  await page.keyboard.press("PageDown");
  await expect(page).toHaveURL(/#\/1\/1$/);
});
test("local camera model initializes offline and releases its video tracks", async ({
  page,
  context,
}) => {
  test.setTimeout(60000);
  await context.grantPermissions(["camera"]);
  const external: string[] = [];
  page.on("request", (r) => {
    if (
      !r.url().startsWith("http://127.0.0.1:4173") &&
      !r.url().startsWith("blob:") &&
      !r.url().startsWith("data:")
    )
      external.push(r.url());
  });
  await page.goto("/");
  await page.waitForFunction(() => navigator.serviceWorker.controller !== null);
  await context.setOffline(true);
  await page.keyboard.press("g");
  await page.getByRole("button", { name: "Bật camera", exact: true }).click();
  await expect(page.getByText("Đưa bàn tay vào khung hình")).toBeVisible({
    timeout: 45000,
  });
  const handle = await page
    .locator(".gesture-panel video")
    .evaluateHandle((v: HTMLVideoElement) => v.srcObject as MediaStream);
  expect(
    await handle.evaluate((s: MediaStream) =>
      s.getTracks().every((t) => t.readyState === "live"),
    ),
  ).toBe(true);
  await page.keyboard.press("g");
  expect(
    await handle.evaluate((s: MediaStream) =>
      s.getTracks().every((t) => t.readyState === "ended"),
    ),
  ).toBe(true);
  expect(external).toEqual([]);
});
