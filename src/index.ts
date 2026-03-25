import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { handle } from 'hono/cloudflare-pages';
import { getAuth } from './lib/auth-server';
import type { Bindings } from './lib/bindings';

const app = new Hono<{ Bindings: Bindings }>();

// CORS for API
app.use('/api/*', cors({
  origin: 'https://hono-auth.pages.dev',
  allowMethods: ['GET','POST','PUT','DELETE','OPTIONS'],
  allowHeaders: ['Content-Type','Authorization'],
  credentials: true,
}));

// BetterAuth handler
app.on(['POST','GET'], '/api/auth/**', (c) => {
  const auth = getAuth(c.env);
  return auth.handler(c.req.raw);
});

// SPA fallback
app.notFound(async (c) => {
  return c.env.ASSETS.fetch(new Request(new URL('/index.html', c.req.url)));
});

export const onRequest = handle(app);
export default app;