# Error Handling

## Error Types
1. **Application Errors:** Logical failures (use `ConvexError`).
2. **Developer Errors:** Bugs (e.g., passing null to `db.get`).
3. **Read/Write Limits:** Scanning too much data (optimize with indexes).
4. **Internal Errors:** Convex platform issues (automatically retried).

## Handling Patterns
- **Queries:** Use React Error Boundaries.
- **Mutations:** Use `.catch()` or `try/catch` on the client.
- **Actions:** Must be handled manually (no auto-retry).

## ConvexError
Use `throw new ConvexError("Message")` to send structured data back to the client.
