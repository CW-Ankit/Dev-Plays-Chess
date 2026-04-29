# Better Auth + Convex Integration

Integrating Better Auth with Convex involves setting up a Convex Component that manages the auth logic and a Next.js layer that proxies requests to the Convex backend.

## 1. Setup & Environment
- **Packages:** Install `better-auth` and `@convex-dev/better-auth`.
- **Convex Env Vars:** Set `BETTER_AUTH_SECRET` and `SITE_URL` (via `npx convex env set`).
- **Next.js Env Vars:** Set `NEXT_PUBLIC_CONVEX_URL`, `NEXT_PUBLIC_CONVEX_SITE_URL`, and `NEXT_PUBLIC_SITE_URL` in `.env.local`.

## 2. Convex Configuration
### Auth Provider
Create `convex/auth.config.ts` to register the Better Auth provider:
```ts
import { getAuthConfigProvider } from "@convex-dev/better-auth/auth-config";
import type { AuthConfig } from "convex/server";

export default { providers: [getAuthConfigProvider()] } satisfies AuthConfig;
```

### The Better Auth Component
1. **Define Component:** `convex/betterAuth/convex.config.ts` defines the component.
2. **Register Component:** Add `app.use(betterAuth)` to `convex/convex.config.ts`.
3. **Initialize Instance:** In `convex/betterAuth/auth.ts`, use `createClient` from `@convex-dev/better-auth` to link the component to Better Auth options.
4. **Generate Schema:** Run `npx auth generate --config ./convex/betterAuth/auth.ts --output ./convex/betterAuth/schema.ts`.
5. **Export API:** Create `convex/betterAuth/adapter.ts` using `createApi` to export standard DB methods (`create`, `findOne`, etc.).

## 3. Routing & Handlers
- **Convex Side:** In `convex/http.ts`, use `authComponent.registerRoutes(http, createAuth)` to mount the auth endpoints.
- **Next.js Side:** Create `app/api/auth/[...all]/route.ts` to proxy requests to Convex using the `handler` from `lib/auth-server.ts`.

## 4. Client & Provider Setup
### Client Instance
In `lib/auth-client.ts`, create the client with the `convexClient()` plugin:
```ts
import { convexClient } from "@convex-dev/better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({ plugins: [convexClient()] });
```

### Server Helpers
In `lib/auth-server.ts`, use `convexBetterAuthNextJs` to export utilities like `getToken`, `isAuthenticated`, and `fetchAuthMutation`.

### Provider
Wrap the app in `ConvexBetterAuthProvider` (from `@convex-dev/better-auth/react`) and pass the `initialToken` fetched in the Root Layout.

## 5. Usage Patterns

### In Convex Functions
Use `ctx.auth.getUserIdentity()` to access the authenticated user.

### In React Components
- **Auth Client:** Use `authClient.signIn.social(...)` for authentication.
- **Convex Hooks:** Use `useQuery(api.auth.getCurrentUser)` to fetch user data reactively.

### In Next.js Server Components
- **Protection:** Use `await isAuthenticated()` to guard pages.
- **Preloading:** Use `preloadAuthQuery(api.func)` in Server Components and `usePreloadedAuthQuery(payload)` in Client Components for fast, reactive initial loads.
