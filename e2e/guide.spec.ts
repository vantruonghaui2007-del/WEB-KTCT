import { test, expect } from "@playwright/test";

test("first visit explains basic controls and blank-screen click advances", async ({
  page,
}) => {
  await page.goto("/");
  const dialog = page.getByRole("dialog", {
    name: "Sẵn sàng cho buổi thuyết trình",
  });
  await expect(dialog).toBeVisible();
  await expect(dialog).toContainText("nhấp vào khoảng trống");
  await expect(dialog).toContainText("Video VNA phát trực tuyến");
  await dialog.getByRole("button", { name: "Đóng" }).click();
  await expect(page.getByRole("dialog")).toHaveCount(0);
  expect(
    await page.evaluate(() => localStorage.getItem("nhom7-guide-seen")),
  ).toBe("1");
  await page.reload();
  await expect(page.getByRole("dialog")).toHaveCount(0);

  await page.locator(".hero-message").click();
  await expect(page).toHaveURL(/#\/1\/1$/);
  await expect(
    page.getByRole("button", {
      name: /tải file PowerPoint xuống để nhận xét/i,
    }),
  ).toHaveCount(1);
});
