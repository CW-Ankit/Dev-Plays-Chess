# The Zen of Convex

## Performance
- **Sync Engine:** Center the app around reactivity.
- **Fast Functions:** Queries and mutations should be < 100ms.
- **Sparing Actions:** Use actions only when network requests are required.
- **Client State:** Let Convex handle caching and consistency; avoid redundant local state.

## Architecture
- **Just Code:** Solve composition using TypeScript patterns.
- **Workflow Thinking:** Think of actions as workflows (Action $\rightarrow$ Mutation $\rightarrow$ Action).
- **Incremental Progress:** Record progress in the DB step-by-step for long-running actions.

## Development
- **Dashboard First:** Use the dashboard for logs and testing.
- **Community:** Leverage Stack and the Convex community for architectural patterns.
