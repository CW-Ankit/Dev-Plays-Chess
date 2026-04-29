# Feature: Authentication Connection Fix (2026-04-29, App Version 16.0.0)

## Context
The authentication pipeline in the Convex + Better Auth integration was not fully wired. The backend auth configuration imported Convex and Dodo plugin utilities, but plugin registration was not enabled in the active Better Auth options.

## Root Cause
`packages/backend/convex/betterAuth/auth.ts` had:
- `plugins: []` in the exported Better Auth options.
- Dodo plugin factory logic defined but never used.
- Convex plugin imported but never attached.

This prevented Better Auth from issuing and exchanging auth tokens through the Convex integration layer, causing session/auth connection failures between frontend and backend.

## Implemented Changes
### 1) Enabled Convex Better Auth plugin
Added the Convex plugin into Better Auth runtime options:
- `convex({ authConfig: AuthConfig })`

### 2) Enabled optional Dodo plugin wiring
Connected the existing Dodo plugin builder to Better Auth options:
- `...BuildDodoPlugins()`

This keeps Dodo disabled when required Dodo environment variables are absent, while enabling it automatically when configured.

### 3) Added trusted origin configuration
Added:
- `trustedOrigins: process.env.SITE_URL ? [process.env.SITE_URL] : undefined`

This ensures Better Auth has an explicit trusted origin tied to `SITE_URL`.

## Environment Variables Required for Auth Testing
To test authentication end-to-end, provide these values:
- `BETTER_AUTH_SECRET`
- `SITE_URL` (for local: `http://localhost:3000`)
- `NEXT_PUBLIC_CONVEX_URL`
- `NEXT_PUBLIC_CONVEX_SITE_URL`

Optional for Dodo flows:
- `DODO_PAYMENTS_API_KEY`
- `DODO_ENVIRONMENT` (`test_mode` or `live_mode`)
- `DODO_DEFAULT_PRODUCT_ID`
- `DODO_PAYMENTS_WEBHOOK_SECRET` (only if webhook handling is required)

## Validation Guidance
After setting env vars:
1. Register a new user via `/register`.
2. Confirm redirect to `/dashboard`.
3. Refresh the page and verify session persists.
4. Sign out and sign in again via `/login`.
5. If Dodo is configured, verify checkout/portal endpoints resolve.

## Notes
No frontend style changes were introduced. The existing UI flow remains intact; only backend auth wiring was corrected.
