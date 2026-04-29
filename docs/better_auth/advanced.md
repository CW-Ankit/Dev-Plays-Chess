# Better Auth Advanced Configuration

## Hooks
Allow customization of endpoint behavior without creating full plugins.
- **Before Hooks:** Modify requests, pre-validate data, or return early (using `ctx.json` or `ctx.redirect`).
- **After Hooks:** Modify responses or trigger background tasks.
- **`ctx` Object:** Provides access to `path`, `body`, `headers`, `query`, and `context` (which includes the `secret`, `password` hasher, and `internalAdapter`).

## Plugins
Extend functionality by defining a `BetterAuthPlugin`.
- **Server Plugins:** Can add `endpoints`, `schema` extensions, `hooks`, `middlewares`, and `rateLimit` rules.
- **Client Plugins:** Provide a TypeScript interface for server endpoints and can add custom actions via `getActions` or reactive state via `getAtoms` (nanostores).
- **Middleware:** Target specific paths to run logic before the endpoint handler.

## Rate Limiting
Built-in protection against abuse.
- **Default:** 100 requests / 60 seconds (Production).
- **Custom Rules:** Define stricter limits for sensitive paths (e.g., `/sign-in/email`).
- **Storage:** Can be `memory` (default), `database`, or `secondary-storage`.
- **IP Detection:** Configure `advanced.ipAddress.ipAddressHeaders` for proxies (e.g., `cf-connecting-ip`).
- **IPv6:** Supports subnet-based limiting (`ipv6Subnet: 64`).

## Cookies & Browser Compatibility
- **Safari ITP:** Third-party cookies are blocked. If the API and Frontend are on different domains, use a **Reverse Proxy** or a **Shared Parent Domain**.
- **Cross-Subdomain:** Enable `advanced.crossSubDomainCookies` and set the `domain` to the root (e.g., `example.com`).
- **Secure Cookies:** Forced in production; can be forced always via `advanced.useSecureCookies: true`.
