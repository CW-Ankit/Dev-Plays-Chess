# Project Blueprint: Dev Plays Chess

This document serves as the complete specification of the current application to ensure a seamless transition to the new tech stack (Next.js + Convex + Fast-Tech-Stack).

## 1. Visual Identity & Aesthetics

### Color Palette

- **Primary Background**: `#0e1116` (Deep dark charcoal/black)
- **Secondary Background**: `#161b22` (Dark grey-blue, used for cards, containers, and sidebars)
- **Borders & Dividers**: `#30363D` (Medium dark grey)
- **Accent Color**: `Emerald` (`#10b981` / `emerald-500`) - Used for buttons, active states, and branding.
- **Text**:
  - Primary: `#FFFFFF` (White)
  - Secondary/Muted: `#8B949E` (Grey-blue)
- **Game Board**:
  - Dark Squares: `#4b5563`
  - Light Squares: `#9ca3af`
  - Valid Move Indicator: `emerald-400/60` (Translucent emerald dots)
  - Selection Outline: `emerald-400/50` (Subtle emerald border)

### UI/UX Elements

- **Theme**: Modern, high-tech, "Dark Mode" only.
- **Styling**: Tailwind CSS.
- **Effects**:
  - Backdrop-blur (`backdrop-blur-sm` / `backdrop-blur-md`) for overlays.
  - Glassmorphism for modal-like elements.
  - Smooth transitions and animations via `framer-motion`.
  - Shadow glows for primary buttons (emerald shadow).
- **Custom Cursor**:
  - Default: High-precision dot with a lagging spring-animated outer ring.
  - Interactive: Ring expands when hovering over buttons/links.
  - Game Board: Custom cursor is hidden in favor of a native `cursor-crosshair` (plus sign).

---

## 2. Application Structure & Layout

### Landing Page

- **Hero Section**: Impactful headline, description, and a "Get Started" CTA leading to registration.
- **Feature Section**: Grid of cards highlighting the core value propositions (Real-time play, Matchmaking, Elo tracking).
- **Design**: Minimalist, high-contrast, dark theme.

### Authentication

- **Registration**: Form for Name, Email, and Password.
- **Login**: Form for Email and Password.
- **Persistence**: Secure session management (switching to Convex auth).

### Dashboard (Protected)

- **Layout**: Sidebar/Navigation menu for:
  - Game (Current active match)
  - Settings (User preferences)
  - Stats (Player performance)
  - Leaderboard (Global rankings)

### Settings Page

- **Profile**: Edit display name.
- **Game Preferences**:
  - Preferred Side: White / Black / Random.
  - Visual Theme: Classic Grey / Traditional Wood / Cyber Dark.

---

## 3. Core Game Logic & Mechanics

### The Chess Engine

- **Library**: `chess.js` (Logic) and `react-chessboard` (UI).
- **State**: Synchronized via FEN (Forsyth-Edwards Notation).
- **Movement**:
  - Click a piece $\rightarrow$ Select it $\rightarrow$ Show legal moves (dots).
  - Click target square $\rightarrow$ Execute move.
  - Clicking same piece $\rightarrow$ Deselect.
  - Clicking another of own pieces $\rightarrow$ Switch selection.
- **Validation**: Enforces turns; players can only move their own pieces on their turn.

### Real-time Synchronization

- **Transport**: Socket.io.
- **Events**:
  - `MOVE`: Sends move data to opponent and server.
  - `BOARD_STATE`: Broadcasts latest FEN to all players.
  - `GAME_OVER`: Triggers end-game screen with winner/draw result.
  - `OPPONENT_LEFT`: Handles disconnects and session termination.

### Matchmaking System

- **Queue**: Players join a waiting queue.
- **Pairing**:
  - Match players based on first-come, first-served.
  - Prevent a user from being matched with themselves.
  - Color Assignment: Logic resolves preferences (if both want White, one is randomized).
- **Flow**: `Join Queue` $\rightarrow$ `Searching Overlay` $\rightarrow$ `Match Found` $\rightarrow$ `Game Start`.

---

## 4. Data Model (To be migrated to Convex)

### User Profile

- `userId` (Unique ID)
- `name` (Display name)
- `email` (Unique)
- `theme` (Preference)
- `preferredColor` (White/Black/Random)
- `elo` (Numeric rating, default 1200)

### Game Record

- `gameId` (Unique ID)
- `players` (White userId, Black userId)
- `pgn` (Portable Game Notation)
- `finalFen` (Last board state)
- `result` (Winner/Draw)
- `reason` (Checkmate/Resignation/Time)
- `timestamp` (Creation date)

---

## 5. Technical Requirements for Rebuild

- **Frontend**: Next.js (App Router).
- **Backend/Database**: Convex (Real-time database and serverless functions).
- **Auth**: Better Auth (or Convex Auth).
- **State/Real-time**: Convex subscriptions (replacing Socket.io).
- **CSS**: Tailwind CSS.
- **UI Components**: Lucide-react (icons), Framer Motion (animations).
