# Best Practices

## General Guidelines
- **Await all Promises:** Always await `ctx.db.patch`, `ctx.scheduler.runAfter`, etc.
- **Avoid `.filter` in Queries:** Use `.withIndex` for performance on large datasets.
- **Limit `.collect()`:** Only use it for small result sets; use pagination for large ones.
- **Redundant Indexes:** Avoid prefix-redundant indexes to save storage and write overhead.
- **Argument Validation:** Always use `v.object`, `v.string`, etc., for all public functions.
- **Access Control:** Always check `ctx.auth.getUserIdentity()` for public functions.
- **Internal Functions:** Use `internalQuery`, `internalMutation`, and `internalAction` for private logic.
- **Shared Logic:** Use plain TypeScript helper functions in a `model/` directory.
- **Sequential Calls:** Avoid sequential `ctx.runMutation` calls in actions; combine them into one mutation.
- **Explicit Table Names:** Always pass the table name to `ctx.db.get`, `ctx.db.patch`, etc.
- **Date.now() in Queries:** Do NOT use `Date.now()` in queries; use scheduled functions to update status fields.
