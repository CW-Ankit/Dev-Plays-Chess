# Architecture Vision: Chessdotcom Clone

## Overview
This project is transitioning into a modern, scalable monorepo architecture to support full-scale chess platform features. The goal is to separate concerns between the core game logic, user interface, and backend services.

## Monorepo Structure (npm Workspaces)
We use `npm workspaces` to manage multiple packages within a single repository:

- **`apps/web`**: The current monolithic web application (Express + EJS + Socket.io). This will eventually serve as our legacy hub or be refactored into a specialized API/Frontend.
- **`apps/mobile` (Planned)**: Future mobile application using React Native or Flutter.
- **`packages/chess-engine` (Planned)**: A dedicated package for move validation, PGN/FEN parsing, and AI integration (wrapping Stockfish).
- **`packages/ui-components` (Planned)**: Shared UI components (Tailwind CSS/React) for use across web and potential admin dashboards.
- **`packages/shared-types` (Planned)**: Shared TypeScript interfaces for API responses and Socket events.

## Tech Stack Expansion
To reach Chess.com's level of sophistication:
1. **Frontend**: Migrate from EJS to a modern library (React/Next.js).
2. **Backend**: Move towards microservices or a cleaner modular monolith using NestJS or similar for complex features like Clubs and Tournaments.
3. **Real-time**: Enhance Socket.io for matchmaking and live game updates.
4. **Storage**: Redis for matchmaking queues and game state caching; MongoDB for persistent history and user data.
5. **AI**: WebAssembly versions of Stockfish for client-side analysis.
