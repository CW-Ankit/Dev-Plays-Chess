# Feature: Code Quality Tooling Upgrade (2026-04-29, App Version 16.0.0)

## Objective
Standardize repository-level code quality tooling to align with common industry practices using ESLint and Prettier, and improve script ergonomics for local development and CI checks.

## Implemented Changes

### 1. Repository-Level ESLint Configuration
Created `eslint.config.mjs` with the following:
- Flat config format for ESLint v9.
- JavaScript base rules from `@eslint/js`.
- TypeScript rules from `typescript-eslint`.
- React and React Hooks rule support.
- Prettier compatibility via `eslint-config-prettier`.
- Global ignore patterns for generated and build artifacts.

### 2. Repository-Level Prettier Configuration
Created:
- `.prettierrc.json` for formatting policy.
- `.prettierignore` to exclude generated/build/vendor files.

### 3. Improved Monorepo Scripts
Updated root `package.json` scripts:
- Added `lint:fix` for automatic lint fixes across workspace packages.
- Added `format` shortcut to run workspace formatting.
- Added `check` meta-script to run lint + typecheck + format:check.

### 4. Package-Level Script Standardization
Updated package scripts for:
- `apps/web`
- `apps/mobile`
- `packages/backend`

Added/standardized:
- `lint`
- `lint:fix`
- `format:check`
- `format:write`

### 5. Backend Auth Naming Standardization
Refactored helper naming in `packages/backend/convex/betterAuth/auth.ts`:
- `BuildDodoPlugins` -> `buildDodoPlugins`

This aligns with conventional camelCase function naming.

## Notes
- Existing type and lint issues outside this change set may still fail strict checks until the broader codebase is remediated.
- This update focuses on tooling foundation and script quality, not a full repository refactor.
