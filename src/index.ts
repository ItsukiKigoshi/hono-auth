import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { getAuth } from './lib/auth-server'

const app = new Hono<{ Bindings: Env }>()

app.use('/api/*', cors({
  origin: 'https://hono-auth.pages.dev',
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}))

app.on(['POST', 'GET'], '/api/auth/**', (c) => {
  const auth = getAuth(c.env)
  return auth.handler(c.req.raw)
})

export default app