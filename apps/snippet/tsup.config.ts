import { defineConfig } from "tsup";

export default defineConfig({
  entry: { nudgify: "src/index.ts" },
  format: ["iife"],
  globalName: "Nudgify",
  target: "es2017",
  minify: true,
  sourcemap: false,
  outDir: "dist",
  outExtension: () => ({ js: ".min.js" }),
});
