import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));


export default defineConfig({
  css: {
    postcss: "./postcss.config.js",
  },
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@component": path.resolve(__dirname, "./src/components"),
      "@page": path.resolve(__dirname, "./src/app/pages"),
    },
  },
});
