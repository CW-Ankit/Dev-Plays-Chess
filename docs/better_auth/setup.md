# Better Auth Setup Guide

Better Auth is a framework-agnostic, universal authentication and authorization framework for TypeScript.

## Quick Start

### 1. Environment Variables
Set the following in your `.env` file:
- `BETTER_AUTH_SECRET`: A high-entropy string (at least 32 chars). Generate via `openssl rand -base64 32`.
- `BETTER_AUTH_URL`: The base URL of your application (e.g., `http://localhost:3000`).

### 2. Instance Configuration
Create an `auth.ts` file (usually in `lib/` or `utils/`):
```ts
import { betterAuth } from "better-auth";

export const auth = betterAuth({
    database: { /* DB config or Adapter */ },
    emailAndPassword: { enabled: true },
    socialProviders: {
        github: {
            clientId: process.env.GITHUB_CLIENT_ID!,
            clientSecret: process.env.GITHUB_CLIENT_SECRET!,
        },
    },
});
```

### 3. Database Schema
Use the CLI to manage your schema:
- **Generate schema:** `npx auth@latest generate` (creates SQL or ORM schema).
- **Apply migration:** `npx auth@latest migrate` (Kysely adapter only).

### 4. Route Handler (Next.js App Router)
Create `/app/api/auth/[...all]/route.ts`:
```ts
import { auth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";

export const { POST, GET } = toNextJsHandler(auth);
```

### 5. Client Instance
Create a client file (e.g., `lib/auth-client.ts`):
```ts
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
    baseURL: process.env.NEXT_PUBLIC_APP_URL // optional if on same domain
});
```
