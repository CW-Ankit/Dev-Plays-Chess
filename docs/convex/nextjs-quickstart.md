# Next.js Quickstart

## Setup
1. `npx create-next-app@latest`
2. `npm install convex`
3. `npx convex dev`

## Integration
- **Client Provider:** Create a `"use client"` `ConvexClientProvider.tsx`.
- **Layout:** Wrap the root layout children with the provider.
- **Page:** Use `useQuery` in client components.
