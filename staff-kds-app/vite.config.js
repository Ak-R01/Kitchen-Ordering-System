import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // sockjs-client references the Node-style `global` object, which doesn't
  // exist in a browser. Vite doesn't polyfill this automatically (webpack did),
  // so we map it to globalThis ourselves.
  define: {
    global: 'globalThis',
  },
  server: {
    port: 5174,
  },
});