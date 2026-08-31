import { defineConfig } from 'vite';

export default defineConfig({
  // 使用相对路径，方便 Electron 以 file:// 方式加载构建产物
  root: 'src',
  base: './',
  build: {
    outDir: '../dist',
    emptyOutDir: true,
    chunkSizeWarningLimit: 4096,
  },
  server: {
    port: 5173,
    strictPort: false,
  },
});
