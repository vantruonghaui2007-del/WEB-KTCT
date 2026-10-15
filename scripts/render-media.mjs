import { chromium } from "@playwright/test";
import { readdirSync, readFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { resolve } from "node:path";
const browser = await chromium.launch({
  executablePath: "/usr/bin/chromium",
  headless: true,
  args: ["--no-sandbox"],
});
const page = await browser.newPage({
  viewport: { width: 1200, height: 900 },
  deviceScaleFactor: 1,
});
for (const name of readdirSync("public/media").filter((n) =>
  n.endsWith(".svg"),
)) {
  await page.setContent(
    "<style>body{margin:0}</style>" +
      readFileSync(resolve("public/media", name), "utf8"),
  );
  await page.screenshot({ path: `/tmp/ktct-${name.replace(".svg", ".png")}` });
}
for (const size of [192, 512]) {
  await page.setViewportSize({ width: size, height: size });
  await page.setContent(readFileSync(resolve("public/icons/icon.svg"), "utf8"));
  await page.addStyleTag({
    content: `svg {width:${size}px;height:${size}px} body {margin:0}`,
  });
  await page.screenshot({ path: `public/icons/icon-${size}.png` });
}
await browser.close();

execFileSync(
  "python3",
  [
    "-c",
    `from PIL import Image
from pathlib import Path
Path("public/media/export").mkdir(exist_ok=True)
for svg in Path("public/media").glob("*.svg"):
    image=Image.open(Path("/tmp")/("ktct-"+svg.stem+".png"))
    image.save(svg.with_suffix(".webp"),quality=85)
    image.resize((800,600)).save(Path("public/media/export")/(svg.stem+".png"))
`,
  ],
  { stdio: "inherit" },
);
