# Convex Overview

Convex is the open source, reactive database where queries are TypeScript code running right in the database.

## Core Concepts
- **Reactive Database:** Queries react to database changes.
- **Document-Relational:** JSON-like documents with relational IDs.
- **ACID Compliant:** Serializable isolation and optimistic concurrency control.

## Server Functions
- **Queries:** Pure functions, read-only, reactive.
- **Mutations:** Transactions, read/write, non-deterministic logic not allowed.
- **Actions:** Can make network requests (Node.js runtime), call queries/mutations.

## Client Libraries
- Client libraries keep the frontend synced via WebSockets.
- `useQuery` hook automatically updates components when dependencies change.
