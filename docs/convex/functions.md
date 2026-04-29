# Functions Overview

Functions are the core of the Convex backend, written in JS/TS and exposed as APIs.

## Function Types
| Feature | Queries | Mutations | Actions |
| :--- | :--- | :--- | :--- |
| DB Access | Yes | Yes | No (use `runQuery`/`runMutation`) |
| Transactional | Yes | Yes | No |
| Cached | Yes | No | No |
| Real-time | Yes | No | No |
| External APIs | No | No | Yes (`fetch`) |

## Query Functions
- **Purpose:** Read data, check auth, business logic.
- **Determinism:** Must be deterministic. No `fetch` or non-seeded randomness.
- **Cachability:** Automatically cached and reactive.
- **Naming:** Based on file path and export name (e.g., `convex/foo.ts` export `bar` $\rightarrow$ `api.foo.bar`).

## Mutation Functions
- **Purpose:** Write data, update state.
- **Transactional:** Atomic commits. If an error is thrown, all writes in that mutation are rolled back.
- **Determinism:** Must be deterministic.

## Action Functions
- **Purpose:** Third-party API calls (OpenAI, Stripe, etc.).
- **Runtime:** Default Convex runtime or Node.js (via `"use node"` directive).
- **DB Interaction:** Indirectly via `ctx.runQuery` and `ctx.runMutation`.
- **Non-Deterministic:** Allowed to perform side-effects and network requests.
- **Anti-Pattern:** Calling actions directly from the client is often an anti-pattern; prefer calling a mutation that schedules an action.
