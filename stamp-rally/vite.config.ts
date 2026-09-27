import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
// Plain HTTP locally: a public HTTPS tunnel (cloudflared) sits in front of
// this for phone testing, so the dev server itself doesn't need TLS.
export default defineConfig(({ command, mode }) => {
  // import.meta.env.VITE_* is inlined by Vite/esbuild at BUILD time — it can never be
  // changed at runtime. The app works fully standalone (localStorage only) without this
  // env var, so a missing value is not an error — just note it in the build log in case
  // Google Sheets sync was actually intended for this build.
  if (command === 'build') {
    const env = loadEnv(mode, process.cwd(), 'VITE_')
    if (!env.VITE_SHEET_WEBHOOK_URL) {
      console.warn(
        '\nℹ️  [build] VITE_SHEET_WEBHOOK_URL is not set for this build.\n' +
          '    The app will work fully standalone (registration / stamps / prize exchange all\n' +
          '    saved to localStorage only); nothing will be sent to Google Sheets.\n' +
          '    If Sheets sync was intended for this deployment, set the env var and rebuild.\n' +
          '    See README-sheet-sync.md.\n',
      )
    }
  }

  return {
    base: './',
    plugins: [react(), tailwindcss()],
    server: {
      host: true,
      // allows access through the trycloudflare.com tunnel hostname used for phone testing
      allowedHosts: true,
    },
  }
})
