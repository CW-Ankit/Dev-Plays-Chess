# Next.js Integration

Convex integrates with Next.js (primarily App Router) to provide both reactive client-side updates and non-reactive server-side data fetching.

## Client-Side Integration
- **Client:** Use `ConvexReactClient` and provide it via `ConvexProvider` (or provider-specific wrappers like `ConvexProviderWithAuth0`).
- **Hooks:** Use `useQuery`, `useMutation`, and `useAction` from `convex/react` for reactive UI.

## Server-Side Rendering (SSR)
Since the `ConvexReactClient` requires a browser connection for reactivity, server-side patterns differ:

### 1. Preloading (Reactive Hybrid)
Allows a page to load with data immediately while remaining reactive after hydration.
- **Server Component:** Use `preloadQuery(api.func, args)` from `convex/nextjs`. This returns a `Preloaded` payload.
- **Client Component:** Use `usePreloadedQuery(preloadedPayload)` from `convex/react`.

### 2. Direct Server Fetching (Non-Reactive)
Used in Server Components, Server Actions, or Route Handlers where reactivity is not needed.
- **Functions:** `fetchQuery`, `fetchMutation`, `fetchAction` from `convex/nextjs`.
- **Consistency Note:** These use the stateless `ConvexHTTPClient`. Avoid multiple `preloadQuery`/`fetchQuery` calls on a single page to prevent UI inconsistency.

## Server-Side Authentication
To make authenticated requests on the server:
1. Obtain a JWT from the auth provider (e.g., Clerk's `getToken()`).
2. Pass the token in the options object:
   ```ts
   const data = await fetchQuery(api.func, args, { token });
   ```

## Configuration
- **Deployment URL:** Must be set as `NEXT_PUBLIC_CONVEX_URL` in `.env.local` or passed explicitly in the options of `fetch`/`preload` functions.
