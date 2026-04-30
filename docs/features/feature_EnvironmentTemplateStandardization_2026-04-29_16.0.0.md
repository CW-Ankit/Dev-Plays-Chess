# Feature: Environment Template Standardization (2026-04-29, App Version 16.0.0)

## Objective

Provide complete, package-specific `.env.example` templates so the monorepo can be configured without missing runtime variables.

## Scope

Created or updated `.env.example` files in all required locations:

- Root: `.env.example`
- Web app: `apps/web/.env.example`
- Mobile app: `apps/mobile/.env.example`
- Backend: `packages/backend/.env.example`

## Variables Included

### Core Convex and Site Variables

- `NEXT_PUBLIC_CONVEX_URL`
- `NEXT_PUBLIC_CONVEX_SITE_URL`
- `SITE_URL`

### Better Auth Variables

- `BETTER_AUTH_SECRET`

### Dodo Payments Variables

- `DODO_PAYMENTS_API_KEY`
- `DODO_ENVIRONMENT`
- `DODO_DEFAULT_PRODUCT_ID`
- `DODO_PAYMENTS_WEBHOOK_SECRET`

### Expo Mobile Variables

- `EXPO_PUBLIC_CONVEX_URL`
- `EXPO_PUBLIC_CONVEX_SITE_URL`

## Implementation Notes

- Root file is a consolidated reference template for developers.
- Package-level files are tailored for direct local usage in each app/package context.
- Backend template includes Convex CLI guidance for setting deployment environment values.

## Outcome

Developers now have explicit environment templates for every runtime surface (web, mobile, backend), reducing setup ambiguity and preventing missing-variable runtime issues.
