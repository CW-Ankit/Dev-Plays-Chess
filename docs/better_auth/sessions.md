# Better Auth Session Management

## Session Lifecycle
- **Expiration:** Default is 7 days. Configured via `session.expiresIn`.
- **Refresh:** Sessions are updated when `updateAge` is reached. Use `disableSessionRefresh: true` to stop this.
- **Freshness:** Some sensitive endpoints require a "fresh" session (created within `session.freshAge`).

## Session Caching
To reduce database load, use `session.cookieCache`.
- **Mechanism:** Stores session data in a signed/encrypted cookie.
- **Strategies:**
  - `compact` (Default): Smallest, signed, not encrypted.
  - `jwt`: Standard JWT, signed, not encrypted.
  - `jwe`: Fully encrypted, most secure, largest size.
- **Invalidation:** Revoked sessions may stay active until `maxAge` expires. Use `disableCookieCache: true` for sensitive operations.

## Stateless Sessions
If no database is configured, Better Auth enters stateless mode.
- **Logic:** Session data is stored entirely in encrypted cookies.
- **Refresh:** Enable `refreshCache: true` to allow automatic cookie refresh without a DB.
- **Invalidation:** Change `session.cookieCache.version` to invalidate all existing sessions.

## Session Operations
- **Revocation:** `authClient.revokeSession({ token })` or `revokeOtherSessions()`.
- **Updating:** `authClient.updateSession({ ... })` for custom additional fields.
- **Customizing Response:** Use the `customSession` plugin to inject extra data (like user roles) into the session object returned by `useSession`.
