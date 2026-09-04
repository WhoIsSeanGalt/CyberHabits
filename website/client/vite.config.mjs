import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue2';
import { fileURLToPath } from 'node:url';

// CyberHabits is a static alternative client. Runtime data and mutations go
// directly to Habitica's public API; no CyberHabits application server is used.
export default defineConfig({
  define: {
    'import.meta.env.DEBUG_ENABLED': 'false',
    'import.meta.env.TIME_TRAVEL_ENABLED': 'false',
  },
  resolve: {
    alias: [
      { find: '@', replacement: fileURLToPath(new URL('./src', import.meta.url)) },
      { find: '~', replacement: fileURLToPath(new URL('./node_modules', import.meta.url)) },
    ],
    extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.vue'],
    dedupe: ['moment', 'lodash', 'moment-recur'],
  },
  plugins: [vue()],
  optimizeDeps: {
    include: ['moment-recur'],
  },
  build: {
    commonjsOptions: {
      include: [/moment-recur/, /node_modules/],
    },
    rollupOptions: {
      output: {
        experimentalMinChunkSize: 20000,
      },
    },
  },
  base: '/',
  server: {
    headers: { 'Cache-Control': 'no-store' },
  },
});
