# OCC and Atomicity

## Optimistic Concurrency Control (OCC)
Convex uses OCC to handle concurrent transactions. Instead of locking records (pessimistic locking), it treats a transaction as a declarative proposal.

### How it Works
1. **Read Set:** The transaction reads records and notes their versions.
2. **Proposal:** The transaction proposes writes based on those versions.
3. **Commit:** At the end, Convex checks if every version in the read set is still the latest.
4. **Conflict:** If any record was modified by another transaction in the meantime, the proposal fails (similar to a Git merge conflict).

## Determinism: The Solution to Conflicts
Because Convex functions are **deterministic**, the system can simply re-run a failed transaction from the beginning. Since the function has no side effects (like calling an external API), re-running it is safe and will eventually succeed once the data stabilizes.

## Serializability
Convex provides **true serializability**, the strictest isolation level. This means the results are guaranteed to be the same as if transactions were executed one after another, preventing anomalies found in "snapshot isolation."

## Summary for Developers
You can write mutations as if they always succeed and are always atomic. Convex handles the retries and consistency under the hood.
