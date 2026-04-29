# Feature: Readme Setup Guide (2026-04-29, App Version 16.0.0)

## Objective

Provide a complete step-by-step setup guide in `README.md` for both development and production usage.

## Changes Implemented

### 1. Expanded README Scope

Updated README to include:

- Architecture and stack overview.
- Prerequisites.
- Environment variable surfaces and required variables per app/package.

### 2. Added Variable Acquisition Guidance

Documented where each variable comes from:

- Convex deployment URL sourcing.
- Site URL conventions for local and production.
- Better Auth secret generation requirements.
- Dodo credentials and webhook secret sourcing.

### 3. Added Development Workflow

Documented sequential developer onboarding steps:

1. Dependency installation.
2. Local environment file creation.
3. Convex environment variable configuration.
4. Better Auth schema generation.
5. Local startup.

### 4. Added Production Workflow

Documented production deployment sequence:

1. Convex backend deployment.
2. Vercel web deployment and environment setup.
3. Dodo webhook configuration.
4. Expo/EAS mobile environment configuration and release.

### 5. Added Command Reference

Included a consolidated operational command block for day-to-day usage.

## Outcome

The repository now contains a complete startup and deployment guide in README, reducing setup ambiguity and improving developer onboarding velocity.
