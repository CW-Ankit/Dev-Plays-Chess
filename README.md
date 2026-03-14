# Chessdotcom Clone

Real-time chess matchmaking platform built with Express, Socket.IO, and MongoDB (Mongoose).

## Core capabilities

- JWT-based authentication stored in an HTTP-only cookie.
- Real-time matchmaking with color-preference handling.
- Live board state synchronization and move validation.
- Persistent users and game history in MongoDB.

## Runtime architecture

1. `server.js` is the only process entrypoint.
2. `src/app.js` assembles Express + HTTP + Socket.IO.
3. `src/db/mongoose.js` initializes MongoDB connectivity.
4. REST controllers handle account/profile/history operations.
5. Socket handlers enforce auth and run game/match lifecycle events.

## Project structure

```text
.
├── server.js
├── src/
│   ├── app.js
│   ├── config/
│   │   ├── constants.js
│   │   └── runtime.js
│   ├── controllers/
│   ├── db/
│   ├── game/
│   ├── models/
│   ├── repositories/
│   ├── routes/
│   ├── services/
│   └── sockets/
├── public/
└── views/
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
