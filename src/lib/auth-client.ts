import { createAuthClient } from "better-auth/react";
import { passkeyClient } from "@better-auth/passkey/client";
import { magicLinkClient } from "better-auth/client/plugins";

export const authClient = createAuthClient({
  baseURL: "https://hono-auth.itsukikigoshi.workers.dev",
  plugins: [passkeyClient(), magicLinkClient()],
});
