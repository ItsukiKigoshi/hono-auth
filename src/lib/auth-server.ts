import { betterAuth } from "better-auth";
import { magicLink } from "better-auth/plugins";
import { passkey } from "@better-auth/passkey";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { drizzle } from "drizzle-orm/d1";
import { Resend } from "resend";
import * as schema from "../db/auth-schema";

export const getAuth = (env: Env) => {  
  return betterAuth({
    database: drizzleAdapter(drizzle(env.hono_auth_db, { schema }), {
      provider: "sqlite",
      schema: schema,
    }),
    secret: env.BETTER_AUTH_SECRET,
    plugins: [
      passkey(),
      magicLink({
        sendMagicLink: async ({ email, url }) => {
          const resend = new Resend(env.RESEND_API_KEY);
          await resend.emails.send({
            from: "Auth <onboarding@resend.dev>",
            to: [email],
            subject: "Login to App",
            html: `<a href="${url}">Sign in here</a>`,
          });
        },
      }),
    ],
    baseURL: "https://hono-auth.itsukikigoshi.workers.dev",
    trustedOrigins: ["https://hono-auth.pages.dev"],
    cookie: {
      crossSite: true,
      sameSite: "none",
      secure: true,
    }
  });
};
