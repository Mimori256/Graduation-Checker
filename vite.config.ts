import { visualizer } from "rollup-plugin-visualizer";
import { defineConfig } from "vite";

import preact from "@preact/preset-vite";

// https://vitejs.dev/config/
export default defineConfig({
  base: "https://mimori256.github.io/Graduation-Checker/",
  plugins: [preact()],
  build: {
    rollupOptions: {
      plugins: [visualizer()],
    },

    outDir: "dist",
    minify: "esbuild",
  },
});
