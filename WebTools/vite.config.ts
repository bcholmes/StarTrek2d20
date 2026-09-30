import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const streamShim = fileURLToPath(new URL('./shims/stream.cjs', import.meta.url));
const stringDecoderShim = fileURLToPath(
  new URL('./shims/string-decoder.cjs', import.meta.url),
);

// Replaces the Create React App setup (react-scripts).
// Dev server stays on port 3000, production output stays in build/,
// and /api is proxied the same way the old "proxy" field did.
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      stream: streamShim,
      string_decoder: stringDecoderShim,
    },
  },
  optimizeDeps: {
    include: ['sax', 'xml-js'],
  },
  server: {
    port: 3000,
    open: true,
    proxy: {
      '/api': {
        target: 'https://sta.bcholmes.org',
        changeOrigin: true,
        secure: true,
      },
    },
  },
  preview: {
    port: 3000,
  },
  build: {
    outDir: 'build',
    emptyOutDir: true,
  },
  css: {
    preprocessorOptions: {
      scss: {
        loadPaths: ['node_modules'],
        silenceDeprecations: [
          'import',
          'global-builtin',
          'color-functions',
          'if-function',
        ],
      },
    },
  },
});
