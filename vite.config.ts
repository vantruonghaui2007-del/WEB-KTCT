import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";
export default defineConfig({
  base: "./",
  plugins: [
    react(),
    VitePWA({
      registerType: "prompt",
      injectRegister: "auto",
      workbox: {
        globPatterns: [
          "**/*.{js,css,html,woff2,svg,png,webp,mp4,wasm,tflite,binarypb,data,vtt}",
        ],
        maximumFileSizeToCacheInBytes: 24 * 1024 * 1024,
        clientsClaim: true,
        skipWaiting: true,
        cleanupOutdatedCaches: true,
      },
      manifest: {
        name: "Nhóm 7 · Tôn giáo ở Việt Nam",
        short_name: "Nhóm 7",
        lang: "vi",
        description: "20 slide thuyết trình · Chủ nghĩa xã hội khoa học",
        theme_color: "#9e2a2b",
        background_color: "#f6f1e7",
        display: "fullscreen",
        icons: [
          { src: "icons/icon-192.png", sizes: "192x192", type: "image/png" },
          {
            src: "icons/icon-512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any",
          },
        ],
      },
    }),
  ],
  test: {
    environment: "jsdom",
    setupFiles: ["./tests/setup.ts"],
    include: ["tests/**/*.test.{ts,tsx}"],
  },
});
