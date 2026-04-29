# React Quickstart

## Setup
1. `npm create vite@latest`
2. `npm install convex`
3. `npx convex dev`

## Basic Pattern
- Define a query in `convex/tasks.ts` using `query({...})`.
- Use `useQuery(api.tasks.get)` in a React component.
- Wrap the app in `<ConvexProvider client={convex}>`.
