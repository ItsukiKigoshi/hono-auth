import { defineConfig } from 'vite'
import devServer from '@hono/vite-dev-server'
import adapter from '@hono/vite-dev-server/cloudflare' // Cloudflareアダプターを追加
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
    react(),
    devServer({
      entry: 'src/index.ts',
      adapter,
    })
  ],
  build: {
    outDir: 'dist',
  }
})