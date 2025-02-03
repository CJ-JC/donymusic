import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ["dompurify"],
  },
  build: {
    chunkSizeWarningLimit: 1500,
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Modules de node_modules
          if (id.includes("node_modules")) {
            if (id.includes("react")) {
              return "vendor-react";
            }
            if (id.includes("@material-tailwind")) {
              return "vendor-material";
            }
            if (id.includes("axios") || id.includes("query")) {
              return "vendor-data";
            }
            return "vendor-others";
          }

          // Modules de l'application
          if (id.includes("/src/pages/admin/")) {
            return "admin";
          }
          if (id.includes("/src/pages/auth/")) {
            return "auth";
          }
          if (id.includes("/src/components/")) {
            return "components";
          }
          if (id.includes("/src/widgets/")) {
            return "widgets";
          }
          if (id.includes("/src/pages/")) {
            return "pages";
          }
        },
      },
    },
  },
  resolve: {
    alias: [{ find: "@", replacement: "/src" }],
    extensions: [".js", ".jsx", ".json"],
  },
  server: {
    proxy: {
      "/api": {
        target: "https://donymusic-server.vercel.app",
        changeOrigin: true,
      },
    },
  },
});
