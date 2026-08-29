import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
// Plain HTTP locally: a public HTTPS tunnel (cloudflared) sits in front of
// this for phone testing, so the dev server itself doesn't need TLS.
export default defineConfig({
  base: './',
  plugins: [react(), tailwindcss()],
  server: {
    host: true,
    // allows access through the trycloudflare.com tunnel hostname used for phone testing
    allowedHosts: true,
  },
})
