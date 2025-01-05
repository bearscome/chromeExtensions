import { defineConfig } from 'vite';
import removeConsole from 'vite-plugin-remove-console';

export default defineConfig({
  build: {
    outDir: 'dist',
    plugins: [removeConsole()],
    rollupOptions: {
      input: {
        script: 'script.js',
        memo: 'memo.html',
      },
      output: {
        entryFileNames: '[name].js',
        chunkFileNames: '[name].js',
        assetFileNames: '[name].[ext]',
      },
    },
  },
});
