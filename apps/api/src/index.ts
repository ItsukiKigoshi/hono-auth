import { Hono } from "hono";
import { createAuth } from "./lib/auth";
import { cors } from "hono/cors";


const app = new Hono < { Bindings: Env } > ();

app.get('/', (c) => {
    return c.text('Hello Hono!')
})

app.use(
    "/api/auth/*",
    cors({
        origin: (origin) => origin,
        credentials: true,
        allowMethods: ["GET", "POST", "OPTIONS", "PATCH", "DELETE"],
        allowHeaders: ["Content-Type", "Authorization"],
    })
);

app.on(["POST", "GET"], "/api/auth/*", (c) => {
    const auth = createAuth(c.env);
    return auth.handler(c.req.raw);
});

export default app;