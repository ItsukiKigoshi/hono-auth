```txt
bun install
bun dev
```

```txt
bun deploy
```

[For generating/synchronizing types based on your Worker configuration run](https://developers.cloudflare.com/workers/wrangler/commands/#types):

```txt
bun cf-typegen
```

Pass the `CloudflareBindings` as generics when instantiation `Hono`:

```ts
// src/index.ts
const app = new Hono<{ Bindings: CloudflareBindings }>()
```


# Done
```bash
# bun create hono@latest hono-auth
# create-hono version 0.19.4
# ✔ Using target directory … hono-auth
# ✔ Which template do you want to use? cloudflare-workers+vite
# ✔ Do you want to install project dependencies? Yes
# ✔ Which package manager do you want to use? bun
# ✔ Cloning the template
# ✔ Installing project dependencies
# 🎉 Copied project files
# Get started with: cd hono-auth
cd hono-auth
bun add react react-dom hono better-auth @better-auth/passkey resend drizzle-orm
bun add -D drizzle-kit @types/node @types/react @types/react-dom @vitejs/plugin-react vite @hono/vite-dev-server @libsql/client
bun x wrangler types
```

```ts
// hono-auth/src/lib/auth-generation.ts
import { getAuth } from "./auth-server";

export const auth = getAuth({} as D1Database);
```

```bash
bun x auth@latest generate --config src/lib/auth-generation.ts --output src/db/auth-schema.ts
```

```bash
bun x wrangler d1 create hono-auth-db
bun x wrangler d1 execute hono-auth-db --local --command "SELECT 1;" # This dummy command creates D1 Database locally
```

```bash
bun x drizzle-kit generate
bun x wrangler d1 migrations apply hono_auth_db --local
```