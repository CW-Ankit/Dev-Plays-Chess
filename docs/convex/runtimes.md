# Runtimes & Bundling

## Runtimes
- **Default:** V8-based, fast, no cold starts.
- **Node.js:** Full Node environment via `"use node"`.

## Bundling
- Uses `esbuild` to bundle the `convex/` folder.
- **Limit:** Bundle size must be < 32MiB.
- **External Packages:** Use `convex.json` $\rightarrow$ `node.externalPackages` to exclude large Node libraries from the bundle.
