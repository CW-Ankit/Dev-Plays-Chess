# HTTP Actions

## Implementation
Defined in `convex/http.ts` using `httpRouter`.
- **Routes:** Use `http.route({ path, method, handler })`.
- **Handlers:** Use `httpAction` constructor.
- **URL:** Exposed at `https://<deployment>.convex.site`.

## Key Patterns
- **CORS:** Must manually add `Access-Control-Allow-Origin` headers for browser requests.
- **Pre-flight:** Handle `OPTIONS` requests to satisfy CORS.
- **Auth:** Pass JWTs in the `Authorization` header to access `ctx.auth.getUserIdentity()`.
