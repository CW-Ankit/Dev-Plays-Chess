# Fast Tech Stack Usage Guide

## 1. Prerequisites
- Node.js 20+
- pnpm 10+
- Convex account
- Dodo Payments account

## 2. Install Dependencies
```bash
pnpm install
```

## 3. Environment Configuration
### Web (`apps/web/.env.local`)
```bash
NEXT_PUBLIC_CONVEX_URL=
NEXT_PUBLIC_CONVEX_SITE_URL=
DODO_DEFAULT_PRODUCT_ID=
```

### Mobile (`apps/mobile/.env`)
```bash
EXPO_PUBLIC_CONVEX_URL=
EXPO_PUBLIC_CONVEX_SITE_URL=
```

### Convex Server Environment
Set server-side secrets through Convex CLI or dashboard:

```bash
pnpm --filter @FastTechStack/backend dev
# In another terminal after convex project is linked:
pnpm --filter @FastTechStack/backend exec convex env set BETTER_AUTH_SECRET "<GeneratedSecret>"
pnpm --filter @FastTechStack/backend exec convex env set SITE_URL "http://localhost:3000"
pnpm --filter @FastTechStack/backend exec convex env set DODO_PAYMENTS_API_KEY "<DodoApiKey>"
pnpm --filter @FastTechStack/backend exec convex env set DODO_ENVIRONMENT "test_mode"
pnpm --filter @FastTechStack/backend exec convex env set DODO_DEFAULT_PRODUCT_ID "pdt_xxx"
pnpm --filter @FastTechStack/backend exec convex env set DODO_PAYMENTS_WEBHOOK_SECRET "<WebhookSecret>"
```

## 4. Run Development
```bash
pnpm dev
```

This runs all workspace `dev` tasks via Turborepo.

## 5. Convex + Better Auth Generation Workflow
After first Convex initialization:

```bash
pnpm --filter @FastTechStack/backend dev
pnpm --filter @FastTechStack/backend auth:generate
```

- Keep `convex dev` running during development to keep generated API types updated.

## 6. Better Auth Dodo Payments Flow
- Checkout and portal are integrated through Better Auth Dodo plugin.
- Web UI uses `authClient.dodopayments.checkoutSession` for hosted checkout creation.
- Web UI uses `authClient.dodopayments.customer.portal` for customer self-service.
- Webhooks are processed by Better Auth endpoint:
  - `/api/auth/dodopayments/webhooks`

## 7. Runtime Verification
### Web
- Open `/` and verify the "Stack Status" panel.
- Use "Start Dodo Checkout (Better Auth)".
- Use "Open Customer Portal".
- Open `/api/stack/status` and confirm JSON output.

### Mobile
- Open Expo app index screen.
- Confirm environment status cards show configured values.
- Use "Open Web Stack Status Endpoint" to validate endpoint accessibility.

## 8. Deployment
Use root `DEPLOYMENT.md` for production deployment steps on Vercel + Convex.
