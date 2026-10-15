/// <reference types="vitest/config" />
import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';

const SITE_URL = (process.env.VITE_SITE_URL || 'https://green-gemstone-mining.vercel.app').replace(/\/+$/, '');

/** Fills %SITE_URL% in index.html and emits robots.txt + sitemap.xml for the configured domain. */
const siteFiles = (): Plugin => ({
  name: 'site-files',
  transformIndexHtml: (html) => html.replaceAll('%SITE_URL%', SITE_URL),
  generateBundle() {
    this.emitFile({ type: 'asset', fileName: 'robots.txt', source: `User-agent: *\nAllow: /\n\nSitemap: ${SITE_URL}/sitemap.xml\n` });
    this.emitFile({
      type: 'asset',
      fileName: 'sitemap.xml',
      source: `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url><loc>${SITE_URL}/</loc><lastmod>${new Date().toISOString().slice(0, 10)}</lastmod></url>\n</urlset>\n`,
    });
  },
});

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), siteFiles()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  build: {
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          supabase: ['@supabase/supabase-js'],
        },
      },
    },
  },
  test: {
    environment: 'node',
    include: ['src/**/*.test.{ts,tsx}'],
  },
});
