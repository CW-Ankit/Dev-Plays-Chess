# Implementation Plan: Monorepo Transition

## Step 1: Initial Scaffolding (COMPLETED)
- [x] Create `apps/` and `packages/` directories.
- [x] Configure `pnpm workspaces` (`pnpm-workspace.yaml`).
- [x] Move existing code to `apps/web`.

## Step 2: Shared Libraries (Next Steps)
- **`packages/chess-logic`**: Extract `chess.js` logic and custom validation into a shared package to ensure consistency between server and potential clients.
- **`packages/database`**: Move Mongoose models and database connection logic here to allow multiple microservices to access the same schema.

## Step 3: Frontend Modernization
- Initialize `apps/frontend` with Next.js.
- Build UI components in `packages/ui` using Tailwind CSS.
- Slowly migrate routes from `apps/web` (EJS) to `apps/frontend` (React).

## Step 4: Mobile Implementation & Matchmaking
- [x] Initial setup (React Native, Expo, NativeWind)
- [x] Chessboard component implementation (custom logic)
- [x] Socket.io integration & matchmaking for mobile
- [ ] UI Polish & Animations
- [ ] Game History & Stats

## Step 5: CI/CD Setup
- Configure GitHub Actions to run tests across all workspaces on every PR.
- Implement specialized build pipelines for each application.
