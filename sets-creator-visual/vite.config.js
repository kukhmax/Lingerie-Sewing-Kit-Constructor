import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [vue()],
  server: {
    port: 5174,
    // w trybie dev zapytania /api trafiają do makiety serwera
    proxy: { '/api': 'http://localhost:8080' },
  },
});
