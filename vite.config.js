import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { viteSingleFile } from 'vite-plugin-singlefile';

// `npm run build`        → dist/          computer version (keyboard)
//                          dist/mobile/   phone version (touch), shares dist/assets/video
// `npm run build:single` → dist-single/   one index.html (auto-detects device) + assets/
export default defineConfig(({ mode }) => ({
  base: './',
  plugins: [react(), ...(mode === 'single' ? [viteSingleFile()] : [])],
  publicDir: mode === 'mobile' ? false : 'public', // phone build reuses the videos in dist/
  build: {
    outDir: mode === 'single' ? 'dist-single' : mode === 'mobile' ? 'dist/mobile' : 'dist',
    emptyOutDir: mode !== 'mobile',
    // single mode inlines the fonts too, so the page is one HTML file + videos
    assetsInlineLimit: mode === 'single' ? 1024 * 1024 : 0,
  },
}));
