import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      // 開発中もPWAの挙動を確認できるようにする
      devOptions: { enabled: true },
      manifest: {
        // TODO: 正式な名称・アイコンが決まったら差し替える（現在は仮）
        name: '市民祭りアプリ',
        short_name: '市民祭り',
        description: '市民祭りのデジタルパンフレット',
        start_url: '/',
        display: 'standalone',
        background_color: '#f4f4f1',
        theme_color: '#5b8dd6',
        icons: [
          {
            src: 'favicon.svg',
            sizes: 'any',
            type: 'image/svg+xml',
            purpose: 'any',
          },
        ],
      },
    }),
  ],
})
