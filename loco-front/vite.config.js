import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": "/src",
    },
  },
  server: {
    proxy: {
      "/auth": {
        target: "http://localhost:8080",
        changeOrigin: true,
        secure: false,
      },
    },
  },
  define: {
    global: "window", // SockJS의 global 참조 문제 해결
  },
  optimizeDeps: {
    include: ["stompjs", "sockjs-client"], // ✅ stompjs와 sockjs-client 사전 로드
  },
});
