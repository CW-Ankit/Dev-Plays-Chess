# Functions Deep Dive

Functions run on the backend and are the primary way to interact with the Convex database and external services.

## Function Types
| Feature | Queries | Mutations | Actions |
| :--- | :--- | :--- | :--- |
| DB Access | Yes | Yes | No (via `runQuery`/`runMutation`) |
| Transactional | Yes | Yes | No |
| Cached | Yes | No | No |
| Real-time | Yes | No | No |
| External APIs | No | No | Yes (`fetch`) |

## Queries
- **Purpose:** Read-only data retrieval, reactive subscriptions.
- **Determinism:** Must be deterministic (same args $\rightarrow$ same result). No `fetch` or non-seeded randomness.
- **Naming:** `convex/foo.ts` export `bar` $\rightarrow$ `api.foo.bar`.
- **Context:** `ctx.db` for reading, `ctx.auth` for identity.

## Mutations
- **Purpose:** Writing data, updating state.
- **Transactional:** Atomic. If a mutation throws, all changes in that transaction are rolled back.
- **Determinism:** Must be deterministic.

## Actions
- **Purpose:** Side-effects, external API calls (OpenAI, Stripe).
- **Runtime:** Default Convex runtime or Node.js (`"use node"` directive).
- **DB Access:** Indirectly via `ctx.runQuery` and `ctx.runMutation`.
- **Anti-Pattern:** Avoid calling actions directly from the client. Instead, call a mutation that schedules an action via `ctx.scheduler.runAfter`.

## HTTP Actions
- **Implementation:** Defined in `convex/http.ts` using `httpRouter`.
- **Routing:** `http.route({ path, method, handler })`.
- **URL:** Exposed at `https://<deployment>.convex.site`.
- **CORS:** Must manually handle `OPTIONS` pre-flight and `Access-Control-Allow-Origin` headers.
