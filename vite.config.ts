import { defineConfig } from "vite";

export default defineConfig({
  root: "src",
  publicDir: "../public",
  build: {
    outDir: "../dist",
    emptyOutDir: true,
  },
  server: {
    proxy: {
      "/api": {
        target: "http://127.0.0.1:8787",
        changeOrigin: true,
      },
    },
  },
});
