# DevPlaysChess

DevPlaysChess is a production-focused monorepo built with Turborepo and pnpm.

## Technology Stack

- Web: Next.js (`apps/web`)
- Mobile: Expo (`apps/mobile`)
- Backend: Convex (`packages/backend`)
- Authentication: Better Auth (Convex adapter)
- Payments: Dodo Payments (Better Auth plugin)

## Repository Structure

```text
apps/
  web/                # Next.js web app
  mobile/             # Expo mobile app
packages/
  backend/            # Convex backend and Better Auth component wiring
  ui/                 # Shared tokens/utilities
docs/
  features/           # Feature implementation notes
```

## Prerequisites

- Node.js 20+
- pnpm 10+
- Convex account/project
- (Optional) Dodo Payments account for billing flows
- (Optional) Expo account for mobile production builds

## Environment Variables

The repository provides templates in all required locations:

- Root reference: `/.env.example`
- Web: `apps/web/.env.example`
- Mobile: `apps/mobile/.env.example`
- Backend: `packages/backend/.env.example`

### Required Variables by Surface

#### Web (`apps/web/.env.local`)

- `NEXT_PUBLIC_CONVEX_URL`
- `NEXT_PUBLIC_CONVEX_SITE_URL`
- `SITE_URL`
- `BETTER_AUTH_SECRET`

Optional for payment flows:

- `DODO_PAYMENTS_API_KEY`
- `DODO_ENVIRONMENT`
- `DODO_DEFAULT_PRODUCT_ID`
- `DODO_PAYMENTS_WEBHOOK_SECRET`

#### Mobile (`apps/mobile/.env`)

- `EXPO_PUBLIC_CONVEX_URL`
- `EXPO_PUBLIC_CONVEX_SITE_URL`

#### Backend (Convex deployment environment)

Set using Convex CLI (not via local file):

- `BETTER_AUTH_SECRET`
- `SITE_URL`
- `DODO_PAYMENTS_API_KEY` (optional)
- `DODO_ENVIRONMENT` (optional)
- `DODO_DEFAULT_PRODUCT_ID` (optional)
- `DODO_PAYMENTS_WEBHOOK_SECRET` (optional)

## How to Get Variable Values

### 1) Convex Values

1. Create or link a Convex project.
2. Start backend once:

```bash
pnpm --filter @devplays-chess/backend dev
```

3. Copy the deployment URL from Convex output/dashboard.
4. Use that URL for:
   - `NEXT_PUBLIC_CONVEX_URL`
   - `EXPO_PUBLIC_CONVEX_URL`

### 2) Site URL Values

- Local development:
  - `NEXT_PUBLIC_CONVEX_SITE_URL=http://localhost:3000`
  - `SITE_URL=http://localhost:3000`
  - `EXPO_PUBLIC_CONVEX_SITE_URL=http://localhost:3000`
- Production:
  - Set all site URLs to your public web domain.

### 3) Better Auth Secret

Generate a secure random secret (minimum 32+ characters) and set:

- `BETTER_AUTH_SECRET`

### 4) Dodo Payments Values (Optional)

From Dodo dashboard/API credentials:

- `DODO_PAYMENTS_API_KEY`
- `DODO_DEFAULT_PRODUCT_ID`
- `DODO_PAYMENTS_WEBHOOK_SECRET`
- `DODO_ENVIRONMENT` (`test_mode` or `live_mode`)

## Development Setup (Step-by-Step)

### Step 1: Install Dependencies

```bash
pnpm install
```

### Step 2: Create Local Env Files

```bash
cp apps/web/.env.example apps/web/.env.local
cp apps/mobile/.env.example apps/mobile/.env
```

Populate values as described above.

### Step 3: Configure Convex Environment

```bash
pnpm --filter @devplays-chess/backend exec convex env set BETTER_AUTH_SECRET <your_secret>
pnpm --filter @devplays-chess/backend exec convex env set SITE_URL http://localhost:3000
```

Optional Dodo values:

```bash
pnpm --filter @devplays-chess/backend exec convex env set DODO_PAYMENTS_API_KEY <your_key>
pnpm --filter @devplays-chess/backend exec convex env set DODO_ENVIRONMENT test_mode
pnpm --filter @devplays-chess/backend exec convex env set DODO_DEFAULT_PRODUCT_ID <product_id>
pnpm --filter @devplays-chess/backend exec convex env set DODO_PAYMENTS_WEBHOOK_SECRET <webhook_secret>
```

### Step 4: Generate Better Auth Schema (if needed)

```bash
pnpm --filter @devplays-chess/backend auth:generate
```

### Step 5: Run Development

```bash
pnpm dev
```

## Production Setup (Step-by-Step)

### 1) Deploy Backend (Convex)

```bash
pnpm --filter @devplays-chess/backend deploy
```

Set production Convex env values with production URLs and secrets before deployment.

### 2) Deploy Web (Vercel)

Set Vercel project root to `apps/web` and configure:

- `NEXT_PUBLIC_CONVEX_URL`
- `NEXT_PUBLIC_CONVEX_SITE_URL`
- `SITE_URL`
- `BETTER_AUTH_SECRET` (if used by web runtime path)
- Optional Dodo values if checkout route is used in web runtime

### 3) Configure Dodo Webhook (If Enabled)

Webhook endpoint:

```text
https://<your-domain>/api/auth/dodopayments/webhooks
```

### 4) Mobile Production (Expo/EAS)

Set:

- `EXPO_PUBLIC_CONVEX_URL`
- `EXPO_PUBLIC_CONVEX_SITE_URL`

Then build/distribute with EAS.

## Common Commands

```bash
pnpm dev
pnpm build
pnpm lint
pnpm typecheck
pnpm format:check
pnpm test
```

## Additional Operational Guides

- Deployment details: `DEPLOYMENT.md`
- Feature change logs: `docs/features/`
