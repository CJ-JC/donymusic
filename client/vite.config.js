import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  base: "/",
  optimizeDeps: {
    include: ["dompurify"],
  },
  resolve: {
    extensions: [".js", ".jsx", ".json"],
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            return id
              .toString()
              .split("node_modules/")[1]
              .split("/")[0]
              .toString();
          }
        },
      },
    },
  },
  // resolve: {
  //   extensions: [".js", ".jsx", ".json"],
  // },
  server: {
    proxy: {
      "/api": {
        // target: "https://donymusic-server.vercel.app",
        target: "http://localhost:8001",
        changeOrigin: true,
      },
    },
  },
});
