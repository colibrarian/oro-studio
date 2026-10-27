import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "node:path";
import { BASE } from "./site.config.js";

export default defineConfig({
  plugins: [react()],
  base: BASE,
  build: {
    rollupOptions: {
      input: {
        et: resolve(__dirname, "index.html"),
        ru: resolve(__dirname, "ru/index.html"),
      },
    },
  },
});
