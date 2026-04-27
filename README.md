# DevPlaysChess

DevPlaysChess is a specialized platform engineered for developers to engage in competitive chess. Utilizing a monorepo architecture, the system treats chess matches as deployable instances, providing a seamless pipeline from instance provisioning to session termination, wrapped in a high-contrast, developer-centric interface.

## Core System Specifications

### Match Engine and Provisioning

- Real-time 1v1 Sessions: Low-latency state synchronization powered by Socket.io.
- Instance Provisioning: Automated FIFO queue that hosts matches based on availability and side-preference configurations.
- Server-Side Validation: All move operations are validated on the backend using chess.js to prevent state corruption and illegal moves.
- Automated Termination: Instant detection of checkmate, stalemate, and draw conditions.
- Session Rematch: Rapid redeployment functionality allowing developers to host a follow-up match immediately.

### Authentication and Identity Management

- Secure Access: JWT-based authentication implementing secure HTTP-only cookies for session persistence.
- Identity Profiles: Personalized developer accounts with display names and Elo rating metrics.
- Configuration Menu:
  - Preferred Side: Configure the instance to prioritize White, Black, or Random side assignment.
  - Visual Themes: Toggle between different board skins (Classic, Wood, Dark).
  - Profile Configuration: Ability to update identity metadata in real-time.

### Interface Design

- Developer Dashboard: A centralized command center to deploy matches, analyze metrics, and modify configurations.
- Optimized Layout: High-efficiency design optimized for desktop environments.
- Session Logs: Real-time PGN move stream for audit and analysis.
- Landing Page: A technical entry point detailing the system architecture and capabilities.

## Technical Stack

### Frontend

- Framework: React 19 (TypeScript)
- Build Tool: Vite
- Styling: Tailwind CSS
- Animations: Framer Motion
- Icons: Lucide React
- Board: react-chessboard

### Backend

- Runtime: Node.js (Express)
- Real-time: Socket.io
- Database: MongoDB and Mongoose
- Authentication: JSON Web Tokens (JWT)
- Logic: chess.js

### Architecture

- Monorepo: Managed via workspace structure:
  - apps/api: The backend server and socket orchestrator.
  - apps/web: The React-based frontend.
  - packages/chess-logic: Shared game logic shared across the stack.
  - packages/database: Shared database schemas.
  - packages/types: Shared TypeScript types and event constants.

## Local Development Setup

### Prerequisites

- Node.js (v18+)
- MongoDB (Local instance or MongoDB Atlas)

### Installation

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd dev-plays-chess
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Configure Environment Variables:
   Create a .env file in apps/api/:

   ```env
   PORT=3000
   MONGO_URI=mongodb://localhost:27017/chessgame
   JWT_SECRET=your_super_secret_key
   NODE_ENV=development
   ```

4. Execute Backend:

   ```bash
   cd apps/api
   npm run start
   ```

5. Execute Frontend:

   ```bash
   cd apps/web
   npm run dev
   ```

6. Access the application at <http://localhost:5173>.
