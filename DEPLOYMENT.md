# Deployment Guide: DevPlaysChess

This document outlines the procedures for deploying the DevPlaysChess platform to a production environment.

## Architecture Overview

The application consists of two primary deployable units:

1. Backend (API and Sockets): A Node.js server requiring persistent WebSocket connections.
2. Frontend (Web): A static React application.

---

## 1. Backend Deployment

### Requirements

- Environment: A server capable of running Node.js (e.g., DigitalOcean Droplet, AWS EC2, Render, or Railway).
- Database: A MongoDB instance (MongoDB Atlas is recommended).

### Environment Variables

Configure the following variables in the production environment:

| Variable | Description | Example |
| :--- | :--- | :--- |
| PORT | Port the server listens on | 3000 |
| MONGO_URI | Connection string for MongoDB | mongodb+srv://user:pass@cluster.mongodb.net/chess |
| JWT_SECRET | Secret key for signing JWTs | a-very-long-random-string |
| NODE_ENV | Environment mode | production |

### Deployment Steps (Linux/VPS)

1. Clone and Install:

   ```bash
   git clone <repository-url>
   cd dev-plays-chess
   npm install
   ```

2. Process Management:
   Use PM2 to ensure the server remains operational and restarts upon failure.

   ```bash
   npm install -g pm2
   cd apps/api
   pm2 start server.js --name "chess-api"
   ```

3. Reverse Proxy (Nginx):
   Since Socket.io requires specific header handling for WebSocket upgrades, configure Nginx as follows:

   ```nginx
   server {
       listen 80;
       server_name api.yourdomain.com;

       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection "upgrade";
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

---

## 2. Frontend Deployment

### Requirements

- Environment: Any static site hosting provider (Vercel, Netlify, AWS S3, or GitHub Pages).

### Configuration

Before executing the build, ensure the SERVER_URL in apps/web/src/App.tsx points to the production API endpoint:

```typescript
const SERVER_URL = 'https://api.yourdomain.com';
```

### Deployment Steps

1. Build the Project:

   ```bash
   cd apps/web
   npm install
   npm run build
   ```

2. Deploy Distribution Folder:
   Upload the contents of the apps/web/dist folder to the static hosting provider.

---

## Production Considerations

### 1. CORS Configuration

In apps/api/src/app.js, ensure the CORS origin list contains the production frontend domain:

```javascript
app.use(cors({ 
    origin: ["https://yourdomain.com"], 
    credentials: true 
}));
```

### 2. Secure Cookies

In apps/api/src/services/sessionService.js, the Secure flag is automatically applied to cookies when NODE_ENV is set to production. HTTPS is mandatory for production environments, otherwise, cookies will be rejected by the browser.

### 3. MongoDB Indexing

Ensure that MongoDB collections have indices on publicId and email for the User collection to maintain optimal query performance.
