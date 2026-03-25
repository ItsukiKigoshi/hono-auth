import { betterAuth } from "better-auth";
import { magicLink } from "better-auth/plugins";
import { passkey } from "@better-auth/passkey";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { drizzle } from "drizzle-orm/d1";
import { Resend } from "resend";
import * as schema from "../db/auth-schema";

export const createAuth = (env: Env) => {
    console.log("Database Binding:", !!env.hono_auth_db); // falseならDB紐付けミス
    console.log("Secret Exists:", !!env.BETTER_AUTH_SECRET); // falseなら環境変数ミス

    return betterAuth({
        database: drizzleAdapter(
            drizzle(env.hono_auth_db, { schema }), {
                provider: "sqlite",
                schema: schema,
            }
        ),
        secret: env.BETTER_AUTH_SECRET,
        cookie: {
            config: {
                sameSite: "lax",
                secure: true,
                httpOnly: true,
            }
        },
        plugins: [
            passkey({
                rpID: "hono-auth.pages.dev",
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
        baseURL: "https://hono-auth.pages.dev/api/auth",
        trustedOrigins: ["https://hono-auth.pages.dev","http://localhost:5173"],
    });
};