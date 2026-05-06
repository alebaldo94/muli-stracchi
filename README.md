# Muli Stracchi — Cycling Association Platform

Rapid prototype for a cycling association management platform. Backend-first, API-driven, modular architecture.

---

## Overview

- Member management for a cycling association
- External event integration via the [Al Passo](https://alpasso.it) platform API
- Cycling kilometer tracking (manual input + Strava)
- Personalized event suggestions based on user profile
- Scalable toward a full cycling ecosystem

---

## System Architecture

```
[ Al Passo System ]
       ↓  Events API
[ Events Integration Layer ]
       ↓
[ Core Backend ]
  ├── Users / Roles
  ├── KM Tracking
  ├── Strava Integration
  └── Suggestion Engine
       ↓
[ Future Frontend / Dashboard ]
```

---

## Tech Stack

| Layer     | Choice                            |
|-----------|-----------------------------------|
| Backend   | Node.js (NestJS) or Laravel       |
| Database  | PostgreSQL                        |
| Frontend  | React / Vue (future)              |
| Auth      | JWT + OAuth 2.0 (Strava)          |

---

## Modules

### Al Passo Integration

Consumes events from the Al Passo REST API:

```
GET /api/events
GET /api/events/{id}
GET /api/events?category=...&date_from=...
```

### KM Tracking

Each member accumulates kilometers from two sources:

- **Manual entry** — user submits a ride manually
- **Strava import** — OAuth 2.0 flow, then `GET /api/v3/athlete/activities`

Strava webhook strategy recommended over polling for real-time sync.

### Suggestion Engine (prototype)

```
score = 0
if (user.interests ∩ event.tags)           score += 5
if (user.city === event.location)          score += 3
if (user.km_level matches event.difficulty) score += 4
```

Endpoint: `GET /api/users/{id}/suggested-events`

---

## Repository Structure

```
muli-stracchi/
├── backend/
│   ├── modules/
│   │   ├── users/
│   │   ├── events/
│   │   ├── km/
│   │   ├── strava/
│   │   └── suggestions/
│   ├── utils/
│   ├── config/
│   ├── app.js
│   └── server.js
│
├── docs/               ← Obsidian Vault (see below)
│   ├── architecture.md
│   ├── api.md
│   ├── database.md
│   └── roadmap.md
│
└── README.md
```

---

## Obsidian Vault (`/docs`)

La cartella `docs/` è un vault Obsidian per tutta la documentazione tecnica del progetto.

**Come collegarlo:**

1. Apri Obsidian
2. `Open folder as vault` → seleziona `docs/` dentro questa repo
3. Il vault è già nel repository, quindi è versionato insieme al codice

In questo modo la documentazione (architettura, API, roadmap) è sempre allineata al codice e committata insieme ad esso. Nessun tool esterno richiesto.

> Per chi clona il repo: clonare e aprire `docs/` come vault è sufficiente.

---

## Roadmap

| Phase | Goal |
|-------|------|
| 1 — Prototype | User system, Al Passo integration, manual KM |
| 2 — Enhancement | Strava auto-import, suggestion engine |
| 3 — Platform | Leaderboards, gamification, analytics |

---

## Privacy & Compliance

- OAuth consent required for Strava
- GDPR-compliant user data management
- JWT / API key authentication
- Data deletion and export features

---

## Future Features

- Monthly km leaderboard
- Badge and achievement system
- User levels (beginner / intermediate / advanced)
- GPX import, Garmin ecosystem integration
- Mobile app
