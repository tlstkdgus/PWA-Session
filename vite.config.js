import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // PWA 플러그인 설정
    VitePWA({
      // Service Worker를 자동으로 업데이트
      registerType: "autoUpdate",

      // Manifest 파일 설정 (앱 정보)
      manifset: {
        name: "나의 첫 PWA",
        short_name: "첫PWA",
        description: "개발 모드로 만드는 PWA 메모 앱",
        start_url: "/",
        display: "standalone",
        background_color: "#ffffff",
        theme_color: "#4F46E5",
        orientation: "portrait",
        scope: "/",
        icons: [
          {
            src: "/pwa-192x192.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "any",
          },
          {
            src: "/pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any maskable",
          },
        ],
      },

      // Workbox 설정 (캐싱 전략)
      workbox: {
        // 캐싱할 파일 패턴
        globPatterns: ["**/*.{js,css,html,ico,png,svg}"],

        // 런타임 캐싱 설정
        runtimeCaching: [
          {
            // 이미지 캐싱 전략
            urlPattern: /^https:\/\/.*\.(png|jpg|jpeg|svg|gif|webp)$/,
            handler: "CacheFirst",
            options: {
              cacheName: "images-cache",
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 30 * 24 * 60 * 60, // 30일
              },
            },
          },
        ],
      },
    }),
  ],
});
