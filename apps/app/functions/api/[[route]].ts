/*
import app from '../../../api/src/index'
import {createAuth} from "../../../api/src/lib/auth";
import { handle } from 'hono/cloudflare-pages'

app.on(["POST", "GET"], "/api/auth/!*", async (c) => {
    if (!c.env || !c.env.BETTER_AUTH_SECRET) {
        console.error("Critical: Environment variables are missing!");
        return c.json({ error: "Server environment not configured" }, 500);
    }

    const auth = createAuth(c.env);
    return auth.handler(c.req.raw);
});

export const onRequest = handle(app)*/

export const onRequest = () => new Response("I am Alive!");