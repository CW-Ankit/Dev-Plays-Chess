# Feature Roadmap: Chessdotcom Clone

This roadmap outlines the features required to match the Chess.com experience.

## Phase 1: Core Gameplay & Matchmaking (Current Focus)
- [x] Real-time 1v1 play via Socket.io.
- [x] Basic matchmaking logic (Random pairings).
- [x] JWT Authentication.
- [ ] Elo Rating System calculation.
- [ ] Time controls (Blitz, Bullet, Rapid).

## Phase 2: Playing Options
- **Play vs Computer**: Integration with Stockfish.js for offline/online computer matches with varying difficulty levels.
- **Play vs Friends**: Private room generation and invite links.
- **Tournaments**: Swiss and Knockout tournament systems with automated scheduling.
- **Variants**: Chess960, 3-Check, King of the Hill.

## Phase 3: Learning & Puzzles
- **Puzzles**: Daily puzzles and puzzle rushes using a database of tactics.
- **Lessons**: Structured course content (JSON-based) with interactive boards.
- **Analysis Board**: Post-game analysis with Stockfish evaluations and "Great Move/Blunder" detection.

## Phase 4: Social & Community
- **Friends List**: Real-time status updates (Online/Playing/IDLE).
- **Clubs**: User-created communities with internal leaderboards and chat.
- **Global Chat**: Public channels and private messaging.
- **Profiles**: Enhanced statistics, achievements, and game archives.

## Phase 5: Premium Features & Performance
- **Live Streams**: Integration for showcasing top games.
- **Cheat Detection**: Simple behavioral analysis and move-time checking.
- **Localization**: Support for multiple languages.
- **PWA Support**: Offline play and mobile-home-screen installation.
