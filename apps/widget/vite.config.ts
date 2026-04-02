import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    lib: {
      entry: "src/main.tsx",
      name: "AriaWidget",
      fileName: "widget",
      formats: ["iife"],
    },
    rollupOptions: {
      external: [],
    },
    minify: "terser",
    cssMinify: true,
    outDir: "dist",
  },
  define: {
    "process.env.NODE_ENV": '"production"',
  },
});
