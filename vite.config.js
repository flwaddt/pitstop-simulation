import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { viteSingleFile } from 'vite-plugin-singlefile';

// `npm run build`        → dist/ (index.html + JS/CSS + assets) for any static host
// `npm run build:single` → dist-single/ with JS and CSS inlined into index.html
//                          (videos stay as separate files next to it)
export default defineConfig(({ mode }) => ({
  base: './',
  plugins: [react(), ...(mode === 'single' ? [viteSingleFile()] : [])],
  build: {
    outDir: mode === 'single' ? 'dist-single' : 'dist',
    assetsInlineLimit: 0,
  },
}));
