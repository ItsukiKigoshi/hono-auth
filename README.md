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
bun add better-auth @better-auth/passkey drizzle-orm resend
bun add -D drizzle-kit
```