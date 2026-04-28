# Deployment Guide (Vercel + Convex + Expo)

## Overview
This monorepo deploys the web application to Vercel while using Convex as the shared backend for both web and mobile clients.

- Web: `apps/web` on Vercel.
- Backend: `packages/backend` deployed with Convex.
- Mobile: Expo application (`apps/mobile`) distributed through Expo/EAS builds.

## 1) Deploy Convex Backend

### Prerequisites
- Convex account and project created.
- Environment variables available:
  - `BETTER_AUTH_SECRET`
  - `SITE_URL` (set to your production web URL)
  - `DODO_PAYMENTS_API_KEY`
  - `DODO_ENVIRONMENT` (`test_mode` or `live_mode`)
  - `DODO_DEFAULT_PRODUCT_ID`
  - `DODO_PAYMENTS_WEBHOOK_SECRET`

### Commands
```bash
pnpm install
pnpm --filter @FastTechStack/backend dev
pnpm --filter @FastTechStack/backend auth:generate
pnpm --filter @FastTechStack/backend deploy
```

### Output Required for Clients
Capture these values after deployment:
- `CONVEX_DEPLOYMENT`
- `NEXT_PUBLIC_CONVEX_URL`
- Public site URL used by Better Auth plugin.

## 2) Deploy Web App to Vercel

### Vercel Project Settings
- Framework Preset: `Next.js`
- Root Directory: `apps/web`
- Install Command: `pnpm install`
- Build Command: `pnpm build`
- Output Directory: `.next`

### Required Environment Variables (Vercel)
```bash
NEXT_PUBLIC_CONVEX_URL=<Convex Production URL>
NEXT_PUBLIC_CONVEX_SITE_URL=https://<your-web-domain>
DODO_DEFAULT_PRODUCT_ID=<Dodo Product ID>
```

Better Auth and Dodo secret variables are server-side Convex environment values and should not be set in public web variables.

### Deploy
- Connect this repository to Vercel.
- Set root directory to `apps/web`.
- Add the environment variables above.
- Trigger deployment.

## 3) Configure Better Auth + Dodo Webhook
Create webhook endpoint in Dodo dashboard:

- Endpoint URL: `https://<your-domain>/api/auth/dodopayments/webhooks`
- Events: subscription/payment events required by your billing workflow.
- Copy generated secret into Convex as `DODO_PAYMENTS_WEBHOOK_SECRET`.

## 4) Configure Mobile App for Production
Vercel does not host native mobile binaries. Use Expo/EAS:

```bash
pnpm --filter @FastTechStack/mobile dev
```

Set production values in Expo environment:
- `EXPO_PUBLIC_CONVEX_URL`
- `EXPO_PUBLIC_CONVEX_SITE_URL`

Build and distribute through EAS for iOS/Android release channels.

## 5) Post-Deployment Verification Checklist

### Web Verification
1. Open deployed Vercel URL.
2. Confirm "Stack Status" card reports environment values as configured.
3. Trigger "Start Dodo Checkout (Better Auth)" and confirm redirect is attempted.
4. Trigger "Open Customer Portal" and confirm portal redirect.
5. Open `/api/stack/status` and verify JSON contains expected provider statuses.

### Mobile Verification
1. Run Expo app with production/staging env.
2. Confirm home screen shows Convex URL and site URL presence.
3. Use deep link button to open web stack status endpoint.

## 6) Rollback Strategy
- Vercel: rollback to previous deployment from dashboard.
- Convex: redeploy previous backend commit and restore env variables.
- Mobile: publish previous Expo update channel or previous EAS build.
