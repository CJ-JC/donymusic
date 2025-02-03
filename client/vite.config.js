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
        manualChunks: {
          // Vendors
          "vendor-react": ["react", "react-dom", "react-router-dom"],
          "vendor-ui": ["@material-tailwind/react", "@heroicons/react"],
          "vendor-utils": ["axios", "dompurify"],

          // App features
          "feature-admin": [
            "./src/pages/admin/Admin.jsx",
            "./src/pages/admin/course/Create-course.jsx",
            "./src/pages/admin/course/Edit-course.jsx",
          ],
          "feature-auth": [
            "./src/pages/auth/Sign-in.jsx",
            "./src/pages/auth/Sign-up.jsx",
            "./src/pages/auth/Forgot-password.jsx",
          ],
          "feature-courses": [
            "./src/pages/courses.jsx",
            "./src/components/Course-detail.jsx",
            "./src/dashboard/CoursePlayer.jsx",
          ],
          "feature-masterclass": [
            "./src/components/Masterclass.jsx",
            "./src/components/Masterclass-detail.jsx",
          ],
        },
        assetFileNames: (assetInfo) => {
          let extType = assetInfo.name.split(".").at(1);
          if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(extType)) {
            extType = "img";
          }
          return `assets/${extType}/[name]-[hash][extname]`;
        },
        chunkFileNames: "assets/js/[name]-[hash].js",
        entryFileNames: "assets/js/[name]-[hash].js",
      },
    },
    sourcemap: false,
    minify: "terser",
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
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
