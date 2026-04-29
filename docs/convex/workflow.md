# Dev Workflow

## Local Development
- Use `npx convex dev` to sync functions and types.
- The `convex/` folder is the source of truth for backend logic.
- Types are automatically updated in `convex/_generated`.

## Deployment
- `npx convex deploy` pushes code to the production deployment.
- Production has separate data from dev deployments.
