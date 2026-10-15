import { chromium } from "@playwright/test";
const browser = await chromium.launch({
  executablePath: "/usr/bin/chromium",
  args: ["--no-sandbox"],
});
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
const errors = [];
page.on("pageerror", (e) => errors.push(e.message));
for (const [name, hash] of [
  ["hero", "1/0"],
  ["gallery", "6/3"],
  ["stats", "7/3"],
  ["concepts", "4/0"],
  ["quiz", "19/1"],
]) {
  await page.goto(`http://localhost:5173/#/${hash}`);
  await page.waitForTimeout(1400);
  await page.screenshot({ path: `/tmp/ktct-ui-${name}.png` });
}
console.log(JSON.stringify({ errors }));
await browser.close();
