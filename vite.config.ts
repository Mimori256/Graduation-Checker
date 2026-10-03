import { visualizer } from "rollup-plugin-visualizer";
import { defineConfig, lazyPlugins } from "vite-plus";

import preact from "@preact/preset-vite";

// https://vite.dev/config/
export default defineConfig({
  fmt: {},
  lint: {
    jsPlugins: [{ name: "vite-plus", specifier: "vite-plus/oxlint-plugin" }],
    rules: { "vite-plus/prefer-vite-plus-imports": "error" },
    options: { typeAware: true, typeCheck: true },
  },
  staged: {
    "*.{js,jsx,ts,tsx,cjs,mjs,cts,mts,json,jsonc,css}": "vp check --fix",
  },
  base: "https://mimori256.github.io/Graduation-Checker/",
  plugins: lazyPlugins(() => [preact()]),
  build: {
    rolldownOptions: {
      plugins: [visualizer()],
    },

    outDir: "dist",
  },
});
