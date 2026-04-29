# Better Auth CLI & Internal Tools

## CLI Commands
Run these via `npx auth@latest <command>`:

| Command | Description | Key Options |
| :--- | :--- | :--- |
| `generate` | Generates ORM/SQL schema | `--output`, `--config` |
| `migrate` | Applies schema to DB (Kysely) | `--config` |
| `init` | Initializes a new project | `--framework`, `--database` |
| `info` | Diagnostic info for debugging | `--json` |
| `secret` | Generates a high-entropy secret | N/A |

## Key Architecture Notes
- **Framework Agnostic:** Works with any framework that provides standard `Request`/`Response` objects.
- **Data Ownership:** Users are stored in your own database, not a third-party service.
- **AsyncLocalStorage:** Used for context tracking. In Cloudflare Workers, requires `nodejs_compat` or `nodejs_als` flag in `wrangler.toml`.
- **Client-Server Boundary:** Client methods (e.g., `signIn.email`) should **never** be called from the server; use `auth.api` instead.
