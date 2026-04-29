# Convex Components

Components are self-contained backend modules (functions, schemas, and data) that can be reused across apps.

## Core Concepts
- **Isolation:** Components have their own tables and cannot read the app's data unless explicitly provided.
- **Sandboxing:** They run in an isolated environment.
- **Transactional Integrity:** Calls to components are sub-transactions. If a component mutation fails, only its changes are rolled back unless the caller lets the error bubble up.

## Integration
### Installation
1. Install via npm.
2. Register in `convex/convex.config.ts`:
   ```ts
   const app = defineApp();
   app.use(componentName, { name: "myInstance" });
   export default app;
   ```
3. Access via the `components` object in `_generated/api`.

### Calling Component Functions
Since component functions are references, they must be called using the `run` methods:
- `ctx.runQuery(components.myInstance.func)`
- `ctx.runMutation(components.myInstance.func, args)`
- `ctx.runAction(components.myInstance.func, args)`

## Authoring Components
- **Structure:** A folder with `convex.config.ts`, `schema.ts`, and function files.
- **Function Visibility:** Only "public" functions are exposed to the parent app.
- **IDs:** All `Id<"tableName">` types from a component are converted to plain `string` when crossing the boundary to the app.
- **Auth:** `ctx.auth` is NOT available inside components. Authentication must be handled by the app, and the `userId` passed as an argument.
- **Environment Variables:** Components cannot access `process.env`. Pass config values as arguments.

## Advanced Patterns
- **Function Handles:** A component can be given a "handle" (a string representation of a function) to call back into the parent app.
- **Client Wrappers:** It is recommended to wrap component calls in a class or helper functions to provide a better DX and handle auth/env vars before calling the component.
