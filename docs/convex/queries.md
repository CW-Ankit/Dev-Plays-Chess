# Queries Deep Dive

## Implementation
Queries use the `query` constructor. 
- **Args:** Use `v` validators for type safety and runtime validation.
- **Context:** Use `ctx.db` for reading and `ctx.auth` for identity.

## Reactivity & Consistency
- **Caching:** Results are cached based on arguments.
- **Consistency:** All reads within a query are at the same logical timestamp.
- **Reactivity:** Clients subscribe to queries and are notified of changes automatically.

## Helpers
Use plain TS functions to split logic. Annotate with `QueryCtx` from `./_generated/server`.
