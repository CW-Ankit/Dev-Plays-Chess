# Authentication deep dive

## Overview
Convex uses JWT-based authentication. The backend validates tokens based on the configuration in `convex/auth.config.ts`.

## Identity in Functions
Access the current user via `await ctx.auth.getUserIdentity()`.
- **Returns:** `UserIdentity` object or `null`.
- **Key Fields:** `subject` (stable ID), `tokenIdentifier` (unique across providers), `issuer`.
- **Security:** Never use function arguments (like email) for authorization; always rely on `ctx.auth`.

## Auth Configuration (`auth.config.ts`)
Defines which identity providers are trusted.
- **OIDC Providers:** Require `domain` and `applicationID`.
- **Custom JWTs:** Use `type: "customJwt"` with `issuer`, `jwks`, and `algorithm`.

## User Storage Pattern
Since JWTs only contain identity, app-specific user data should be stored in a `users` table.
- **Pattern:** Use a mutation to "upsert" the user into the DB upon login.
- **Indexing:** Index by `tokenIdentifier` or `subject` for fast lookup.
- **Reference:** Use the stored `userId` as a foreign key in other tables.

## Client-Side Integration
- **Providers:** Wrap the app in a provider (e.g., `ConvexProviderWithAuth`).
- **State:** Use `useConvexAuth()` to check `isAuthenticated` and `isLoading`.
- **Helpers:** Use `<Authenticated>`, `<Unauthenticated>`, and `<AuthLoading>` for conditional rendering.
