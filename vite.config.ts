import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// This config builds the React SPA (admin + portal) for deployment to
// admin.ascendsystems.ai. The public marketing site is built separately
// by Astro into `dist/`. Keeping outputs in different dirs lets one repo
// drive two Cloudflare Pages projects.
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    outDir: 'dist-admin',
    emptyOutDir: true,
  },
});
