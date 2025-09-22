import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    // 按要求将本地开发端口调整为 5176。
    port: 5176,
    host: '0.0.0.0'
  }
});
