import { cloudflare } from '@cloudflare/vite-plugin'
import { defineConfig } from 'vite'
import devServer from '@hono/vite-dev-server'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
    cloudflare({ configPath: 'wrangler.jsonc' }),
    react(),
    devServer({
      entry: 'src/index.ts'
    })
  ],
})
