# Mutations Deep Dive

## Implementation
Mutations use the `mutation` constructor.
- **Args:** Use `v` validators.
- **Context:** Use `ctx.db` for writes, `ctx.scheduler` for future functions.

## Transactions
- All writes in a mutation are committed together.
- Failures result in a complete rollback.
- Must be deterministic.
