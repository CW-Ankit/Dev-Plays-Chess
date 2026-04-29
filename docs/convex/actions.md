# Actions Deep Dive

## Implementation
Actions use the `action` constructor.
- **Context:** Use `ctx.runQuery` and `ctx.runMutation` for DB access.
- **External Calls:** Use `fetch` for API requests.

## Runtimes
- **Default:** Fast, no cold starts, browser-like API.
- **Node.js:** Use `"use node"` directive at the top of the file. Required for certain NPM packages.

## Best Practices
- **Avoid `runAction` chains:** Use TS helper functions instead.
- **Batching:** Avoid sequential `runMutation` calls; create one internal mutation that does all the work.
- **Error Handling:** Actions are not automatically retried; handle errors manually.
