import { Hono } from "hono";
import { createAuth } from "./lib/auth";
import { cors } from "hono/cors";


const app = new Hono < { Bindings: Env } > ();

app.get('/', (c) => {
    return c.text('Hello Hono!')
})

app.use(
    "/api/auth/*",
    async (c, next) => {
        const corsMiddleware = cors({
            origin: c.env.APP_URL,
            allowHeaders: ["Content-Type", "Authorization"],
            allowMethods: ["POST", "GET", "OPTIONS"],
            exposeHeaders: ["Content-Length"],
            maxAge: 600,
            credentials: true,
        });
        return corsMiddleware(c, next);
    }
);

app.on(["POST", "GET"], "/api/auth/*", (c) => {
    const auth = createAuth(c.env);
    return auth.handler(c.req.raw);
});
export default app;