import app from '../../api/src'
import { handle } from 'hono/cloudflare-pages'

export const onRequest = handle(app)