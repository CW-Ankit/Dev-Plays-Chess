# Feature: Convex Push Auth Adapter Fix (2026-04-29, App Version 16.0.0)

## Issue

Convex push failed during module analysis with the error:

`Failed to analyze auth.js: Uncaught TypeError: t is not a function`

The stack trace pointed to `@convex-dev/better-auth/src/client/create-api.ts` invoked from `convex/betterAuth/adapter.ts`.

## Root Cause

`createApi(...)` in `convex/betterAuth/adapter.ts` was receiving auth options that included runtime Better Auth plugins (Convex plugin and optional Dodo plugins).

Those runtime plugins are intended for auth server initialization and route handling, not for static adapter API generation inside Convex module analysis.

## Fix Implemented

1. Added `adapterOptions` in `convex/betterAuth/auth.ts`.
2. Derived `adapterOptions` from `authOptions` but explicitly set `plugins: []`.
3. Updated `convex/betterAuth/adapter.ts` to call:
   - `createApi(BetterAuthSchema, adapterOptions)`

## Why This Works

The adapter API creation path now receives only schema-compatible static options and no runtime plugin functions, avoiding plugin execution/shape assumptions during Convex push-time analysis.

## Expected Outcome

- Convex `start_push` should no longer fail with the `TypeError` in `create-api.ts`.
- Better Auth runtime behavior remains unchanged because server auth still uses full `authOptions` through `createAuthOptions(...)`.
