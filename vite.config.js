import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// Detect if we are on Vercel or GitHub Pages
const isVercel = process.env.VERCEL === 'true';

export default defineConfig({
  base: isVercel ? '/' : '/arch-tool/',
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        gadget: resolve(__dirname, 'gadget-glob.html'),
        brand: resolve(__dirname, 'brand-builder.html'),
        vox: resolve(__dirname, 'vox.html'),
        watz: resolve(__dirname, 'watz-dinner.html'),
        slime: resolve(__dirname, 'slime-mobile-proto/index.html'),
        archGenUi: resolve(__dirname, 'arch-gen-ui/index.html'),
        wavesync: resolve(__dirname, 'wavesync.html'),
      },
    },
  },
})
