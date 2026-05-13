// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://ascendsystems.ai',

  // Static output — Cloudflare Pages serves the `dist/` folder directly.
  // The existing React SPA (admin/portal) is built separately by Vite into
  // `dist/admin/` and `dist/portal/` and routed by `public/_routes.json`.
  output: 'static',

  integrations: [
    react(),
    sitemap({
      // Don't include admin/portal/proposal pages — these are private apps.
      filter: (page) =>
        !page.includes('/admin') &&
        !page.includes('/portal') &&
        !page.includes('/proposals'),
    }),
  ],

  vite: {
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        '@': '/src',
      },
    },
  },

  // We do NOT want Astro to scan src/pages for the React admin/portal pages.
  // Astro pages live as .astro files — any .tsx in src/pages stays as React
  // SPA content imported by the legacy Vite build.
  // (Astro only picks up .astro/.md/.mdx as routes by default.)

  build: {
    // Inline small assets, output to dist
    inlineStylesheets: 'auto',
  },

  // Trailing slashes — match Cloudflare Pages default behavior
  trailingSlash: 'ignore',
});
