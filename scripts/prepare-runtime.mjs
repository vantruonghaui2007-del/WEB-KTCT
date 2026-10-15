import { mkdirSync, copyFileSync, readdirSync } from "node:fs";
mkdirSync("public/gesture", { recursive: true });
for (const name of readdirSync("node_modules/@mediapipe/hands"))
  if (/\.(js|wasm|tflite|data|binarypb)$/.test(name))
    copyFileSync(
      `node_modules/@mediapipe/hands/${name}`,
      `public/gesture/${name}`,
    );
mkdirSync("public/fonts", { recursive: true });
for (const subset of ["latin", "vietnamese"])
  for (const weight of [400, 600, 800]) {
    const n = `be-vietnam-pro-${subset}-${weight}-normal.woff2`;
    copyFileSync(
      `node_modules/@fontsource/be-vietnam-pro/files/${n}`,
      `public/fonts/${n}`,
    );
  }
copyFileSync(
  "node_modules/@fontsource/be-vietnam-pro/LICENSE",
  "public/fonts/OFL.txt",
);
