import { betterAuth } from "better-auth";
import { magicLink } from "better-auth/plugins";
import { passkey } from "@better-auth/passkey";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { drizzle } from "drizzle-orm/d1";
import { Resend } from "resend";
import * as schema from "../db/auth-schema";

export const createAuth = (env: Env) => {
    return betterAuth({
        database: drizzleAdapter(
            drizzle(env.hono_auth_db, { schema }), {
                provider: "sqlite",
                schema: schema,
            }
        ),
        secret: env.BETTER_AUTH_SECRET,
        advanced: {
            defaultCookieAttributes: {
                sameSite: "none",
                secure: true,
                partitioned: true
            }
        },
        plugins: [
            passkey({
                rpID: new URL(env.APP_URL).hostname,
                rpName: "Hono Auth",
            }),
            magicLink({
                sendMagicLink: async ({ email, url }) => {
                    const resend = new Resend(env.RESEND_API_KEY);
                    const { error } = await resend.emails.send({
                        from: "Resend <onboarding@resend.dev>",
                        to: [email],
                        subject: "Login Link [hono_better_auth]",
                        html: `<p>Click the Link below to Login：</p><a href="${url}">${url}</a>`,
                    });

                    if (error) {
                        console.error("Failed to Send Magic Link:", error);
                        throw new Error("Failed to Send Email ﾐｱﾈﾖ;");
                    }
                },
            }),
        ],
        baseURL: env.API_URL ?
            `${env.API_URL}/api/auth` :
            "http://localhost:8787/api/auth",
        trustedOrigins: [env.APP_URL, "http://localhost:5173"],
    });
};