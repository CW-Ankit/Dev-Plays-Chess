Real-time chess matchmaking platform. This project is structured as a monorepo using pnpm workspaces.

## Project structure

```text
.
├── apps/
│   └── web/            # Main Express application (Express + EJS + Sockets)
│   └── mobile/         # React Native + Expo + NativeWind app
├── packages/           # Shared libraries and configurations
├── Docs/               # Project planning and architecture documents
├── pnpm-workspace.yaml # pnpm configuration
├── package.json        # Root workspace configuration
└── README.md
```

## Configuration

Required runtime configuration is environment-driven:

- `MONGO_URI` or `MONGODB_URI`: MongoDB connection string.
- `JWT_SECRET`: Secret used to sign and verify auth tokens.

Optional:

- `PORT` or `SERVER_PORT` (default `3000`)
- `MONGO_DB_NAME` or `MONGODB_DB_NAME` (default `chessdotcom_clone`)
- `NODE_ENV` (default `development`)

## Security notes

- Auth cookies are `HttpOnly`, `SameSite=Lax`, and `Secure` in production.
- JWT payload carries only session claims required by HTTP routes and sockets.
- Passwords are stored as salted `scrypt` hashes.
