import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Stałe nazwy plików (constructor.js / constructor.css): szablon sklepu nie musi
// znać hasha z nazwy pliku. Odświeżanie cache — parametrem ?v= w szablonie Blade.
export default defineConfig({
  plugins: [react()],
  base: './',
  build: {
    cssCodeSplit: false,
    rollupOptions: {
      output: {
        entryFileNames: 'constructor.js',
        chunkFileNames: 'constructor-[name].js',
        assetFileNames: 'constructor[extname]',
      },
    },
  },
});
