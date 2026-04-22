import { defineConfig } from "tsup";

export default defineConfig({
  entry: { flowlift: "src/index.ts" },
  format: ["iife"],
  globalName: "FlowLift",
  target: "es2017",
  minify: true,
  sourcemap: false,
  outDir: "dist",
  outExtension: () => ({ js: ".min.js" }),
});
