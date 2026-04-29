# Authentication & Security

## Authentication Flow
Convex uses JWT-based authentication.
- **Identity:** Accessed via `ctx.auth.getUserIdentity()`.
- **Config:** Defined in `convex/auth.config.ts` with provider domains and application IDs.

## Authorization (Access Control)
Convex does not use RLS. Authorization is handled in the function logic:
1. Call `ctx.auth.getUserIdentity()`.
2. If `null`, throw `Unauthorized` error.
3. Verify the user has permission to access the specific resource (e.g., `doc.userId === identity.subject`).

## Internal Functions
- Defined via `internalQuery`, `internalMutation`, or `internalAction`.
- Not accessible from the client.
- Called via the `internal` object (e.g., `ctx.runMutation(internal.api.func)`).
- Use these for sensitive logic or "helper" functions used by public functions.
