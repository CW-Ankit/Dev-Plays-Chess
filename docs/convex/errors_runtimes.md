# Error Handling & Runtimes

## Error Types
- **Application Errors:** Logical failures. Use `throw new ConvexError("Message")`.
- **Developer Errors:** Bugs (e.g., null ID).
- **Limit Errors:** Reading/Writing too much data.
- **Internal Errors:** Platform issues (auto-retried).

## Client Handling
- **Queries:** Wrap components in React Error Boundaries.
- **Mutations:** Use `.catch()` or `try/catch` on the mutation call.

## Runtimes
- **Default:** V8-based, no cold starts, supports `fetch`.
- **Node.js:** Opt-in via `"use node"` at top of file. Required for libraries using `fs`, `crypto` (Node version), etc.
- **Bundling:** `esbuild` bundles `convex/` folder. Limit is 32MiB. Use `convex.json` $\rightarrow$ `node.externalPackages` for large Node libraries.
