import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ["dompurify"],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    extensions: [".js", ".jsx", ".json"],
  },
  build: {
    outDir: "dist",
    sourcemap: true,
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, "index.html"),
      },
    },
  },
  server: {
    port: 3000,
    proxy: {
      "/api": {
        target: "https://donymusic-server.vercel.app",
        changeOrigin: true,
      },
    },
  },
});
