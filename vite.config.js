import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  base: './',
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        portfolio: resolve(__dirname, 'portfolio.html'),
        brand: resolve(__dirname, 'brand-builder.html'),
        vox: resolve(__dirname, 'vox.html'),
        watz: resolve(__dirname, 'watz-dinner.html'),
        archGenUi: resolve(__dirname, 'arch-gen-ui/index.html'),
        wavesync: resolve(__dirname, 'wavesync.html'),
        slimeNexus: resolve(__dirname, 'slime-nexus/index.html'),
        watzV2: resolve(__dirname, 'watz-v2.html'),
        what2eat: resolve(__dirname, 'what2eat/index.html'),
        privacy: resolve(__dirname, 'privacy.html'),
        wavio: resolve(__dirname, 'wavio.html'),
        hunger: resolve(__dirname, 'hunger.html'),
        'fried-brains': resolve(__dirname, 'fried-brains.html'),
        'burn-1': resolve(__dirname, 'burn-1.html'),
        'command-center': resolve(__dirname, 'command-center.html'),
        nle: resolve(__dirname, 'nle-standalone.html'),
        pa: resolve(__dirname, 'pa-standalone.html'),
      },
    },
  },
})
