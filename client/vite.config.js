import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ["dompurify"],
  },
  resolve: {
    alias: [{ find: "@", replacement: "/src" }],
  },
  // server: {
  //   proxy: {
  //     "/api": {
  //       target: "https://donymusic-server.vercel.app",
  //       changeOrigin: true,
  //     },
  //   },
  // },
});
