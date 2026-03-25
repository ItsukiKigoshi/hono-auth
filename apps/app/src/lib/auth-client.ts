import { createAuthClient } from "better-auth/react";
import { magicLinkClient } from "better-auth/client/plugins";
import { passkeyClient } from "@better-auth/passkey/client"

export const authClient = createAuthClient({
    baseURL: `https://hono-auth.pages.dev/api/auth`,
    fetchOptions: {
        credentials: "include",
    },
    plugins: [
        magicLinkClient(),
        passkeyClient()
    ]
});