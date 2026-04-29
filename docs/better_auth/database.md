# Better Auth Database

## Core Schema
Better Auth requires four primary tables:
- **User**: Identity and profile info.
- **Session**: Active session tokens and metadata.
- **Account**: Linking users to providers (OAuth/Credentials).
- **Verification**: Tokens for email verification/password resets.

## Extending the Schema
You can add custom fields to `user` or `session` tables using `additionalFields`.

```ts
user: {
  additionalFields: {
    role: {
      type: "string",
      input: false, // Prevent users from setting this during signup
      defaultValue: "user",
    },
  },
}
```
Fields set to `input: false` must be managed by the server (e.g., via database hooks or admin actions).

## ID Generation
Configured via `advanced.database.generateId`:
- `false`: Let the database handle IDs (e.g., serial/uuid).
- `"serial"`: Auto-incrementing numeric IDs.
- `"uuid"`: UUID strings.
- **Custom Function:** `(options) => { ... }` for mixed ID types per model.

## Database Hooks
Custom logic executed during entity lifecycles.
- **Before Hooks:** Can modify data or abort the operation (return `false` or throw `APIError`).
- **After Hooks:** Perform side-effects (e.g., creating a Stripe customer) after a successful write.

## Secondary Storage
Offload high-frequency data (sessions, rate limits) to a KV store like Redis.
- **Implementation:** Provide an object with `get`, `set`, and `delete` methods.
- **Session Storage:** By default, secondary storage is used for sessions. Use `session.storeSessionInDatabase: true` to override this.
