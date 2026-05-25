# Workforce Regulatory System

> ***To create a system where the very existence of the platform becomes the greatest threat to scammers and fake professionals.***

**[🌐 Live Demo](https://workforce-regulatory-system.vercel.app)** &nbsp;·&nbsp; **[📖 Setup Guide](SETUP.md)** &nbsp;·&nbsp; **[📋 API Docs](Backend/API%20Docs/payloads_responses_v0.0.2.md)**

---

## Why this exists

During my own employment journey thus far, I repeatedly encountered fake job offers, manipulated employment dates and companies withholding documents during exit. There was no system to catch any of it.

I built this instead of giving up.

The Workforce Regulatory System is a tracable, verified record of every employment event. Every joining date and exit date is independently confirmed by both the employer and the employee. Mismatches automatically generate disputes. No actor can manipulate records after the fact and everything is publicly visible.

---

## What it does

### The core mechanism
When a company says a candidate exits on December 4th, and the candidate says they exit on December 19th — the system catches the gap automatically, raises a dispute, and notifies both parties. Neither party filed a complaint. The system did it.

That's the whole idea. Fraud lives in the gaps between what different actors claim. This system is trying to close those gaps.

### The employment lifecycle

Every employment event follows a status verified lifecycle:

```
Company sets joining date        → joining initiated
Candidate confirms date          → joining confirmed  (or date mismatch → dispute)
Candidate verifies documents     → joining completed  (or docs missing → dispute)

Company sets exit date           → exit initiated
Candidate confirms exit date     → exit confirmed     (or date mismatch → dispute)
Candidate verifies exit docs     → exit completed     (or docs missing → dispute)
```

Each status transition is permanent and timestamped. Nothing can be backdated.

### Three-actor verification

| Actor | What they do |
|---|---|
| **Institute** | Enrolls students, creates candidate accounts, tracks alumni placements |
| **Company** | Registers (verified via CIN), initiates joining and exit events |
| **Candidate** | Independently confirms dates, submits document checklists |
| **Admin** | Resolves disputes, platform-wide visibility |
| **Public** | Views verified placement and dispute stats — no login needed |

### Public transparency

Anyone — a recruiter, a journalist, a student — can visit the platform and see:
- Every institute's real placement rate and dispute history
- Every company's verification status and open disputes
- Platform-wide stats: verified companies, disputes resolved, safe joinings

No login. No paywall. Accountability is public by default.

---

## Features

**Employment lifecycle**
- Company-initiated joining with candidate date confirmation
- Auto dispute on joining or exit date mismatch
- Joining and exit document checklists with auto dispute on missing docs
- 10-status lifecycle system as single source of truth

**Authentication & security**
- JWT-based authentication (9-hour tokens)
- bcrypt password hashing
- Router-level role-based access control (candidate / institute / company / admin)

**Transparency**
- Public institute search with placement stats
- Public company search with dispute counts and verification status
- Live platform stats on landing page

**Notifications**
- In-app notification bell with unread count badge
- Notifications triggered on every lifecycle event
- 30-second polling, mark read individually or all at once

**Bulk operations**
- Bulk student enrollment via CSV/Excel upload
- Bulk employee onboarding via CSV/Excel upload
- Bulk exit processing via CSV/Excel upload
- Live row-by-row status during upload, retry failed rows

**Dispute system**
- Auto-generated — no manual filing needed
- Duplicate guard prevents repeated disputes
- Admin resolve/reject/under review flow
- Full dispute history per candidate, company, and institute

**Audit logging**
- Append-only audit log on every state-changing event
- Captures who did what, to what, and when

---

## Tech stack

**Backend**
- FastAPI (Python 3.11)
- MySQL via `mysql-connector-python`
- JWT via `python-jose`
- bcrypt via `bcrypt`
- Deployed on Render

**Frontend**
- React 18 + Vite
- Material UI (MUI v7)
- Axios with JWT interceptors
- SheetJS (xlsx) for bulk upload parsing
- Deployed on Vercel

**Database**
- MySQL 8.0
- Hosted on Aiven

---

## Architecture

```
Frontend (React + Vite + MUI)
    ↓  axios + Bearer token
Backend (FastAPI)
    ↓  router-level role auth
Services (business logic)
    ↓  raw SQL
Database (MySQL)
```

**Request flow:**
```
React page → axiosClient → FastAPI route → Service → SQL → Response → React page
```

**Lifecycle event flow:**
```
Service function
    → DB update (status change)
    → raise_dispute() if mismatch
    → notify() for relevant users
    → log_action() audit entry
```

---

## Project structure

```
workforce-regulatory-system/
├── Backend/
│   ├── API Docs/               # Payload and response documentation
│   ├── config/                 # DB connection
│   ├── dev_logs/               # Development timeline, backend workflow, todo list
│   ├── dummy DB/               # Local MCA companies dataset (JSON)
│   ├── routes/                 # FastAPI endpoint definitions
│   ├── schema/                 # Pydantic request models
│   ├── scripts/                # create_admin.py utility
│   ├── services/               # Core business logic
│   ├── utils/                  # JWT, auth dependency, password hashing
│   └── main.py
│
├── Frontend/
│   ├── Devlogs/                # Development timeline, frontend workflow, todo list
│   └── src/
│       ├── api/                # Axios client + per-role API modules
│       ├── components/         # Reusable UI (BulkUpload, StatusChip, DisputeCard, NotificationBell...)
│       ├── context/            # AuthContext
│       ├── layout/             # DashboardLayout, PublicLayout
│       ├── pages/              # Feature pages per role + public pages
│       ├── routes/             # AppRouter, ProtectedRoute
│       └── theme/              # MUI theme with design tokens
│
└── Software Development Docs/
    ├── regulatory system DB script.sql   # Full schema + all migrations
    ├── Workflow Details.md               # System design
    └── Application Testing/
        └── Feature_Testing_v0.0.2.md     # Feature-level test documentation
```

---

## Setup

See **[SETUP.md](SETUP.md)** for complete local development instructions including database setup, environment variables and running the full demo flow.

---

## Development timeline

| Period | Work |
|---|---|
| Oct 2025 | Rough Idea validation, research, rough DB design |
| Nov 2025 | Backend APIs from scratch, frontend connection, working POC |
| Dec 2025 | Login, profiles, admin module, end-to-end testing, documentation |
| May 2026 | Full redesign - JWT auth, lifecycle system, dispute engine, notifications, public pages, bulk upload, deployment |

Detailed logs: [Backend timeline](Backend/dev_logs/dev_timeline.md) · [Frontend timeline](Frontend/Devlogs/dev_timeline.md)

---

## Documentation

| Document | What it covers |
|---|---|
| [SETUP.md](SETUP.md) | Local setup, env vars, DB init, running the demo |
| [Backend Workflow](Backend/dev_logs/backend_workflow.md) | Services, routes, schemas, auth, DB schema |
| [Frontend Workflow](Frontend/Devlogs/frontend_workflow.md) | Components, routing, API layer, layouts |
| [API Docs](Backend/API%20Docs/payloads_responses_v0.0.2.md) | All endpoint payloads and responses |
| [Feature Testing v0.0.2](Software%20Development%20Docs/Application%20Testing/Feature_Testing_v0.0.2.md) | Feature-by-feature: purpose, current flow, known issues, ideal behaviour |
| [Workflow Details](Software%20Development%20Docs/Workflow%20Details.md) | Initial System design and actor interactions Plan |

---

## Prototype status

This is a working prototype, not a production system. Known gaps:

- Default password `Abced@12345` for all new accounts — no password reset flow yet
- MCA verification uses a local JSON dataset, not a live government API
- No rate limiting on the login endpoint
- `GET /candidates/disputes_list` returns all disputes, not filtered per user
- No token refresh endpoint

These are tracked in [Backend todo](Backend/dev_logs/todo_list.md) and [Frontend todo](Frontend/Devlogs/todo_list.md).

---

## About

Built by **Ashwin Koli** after personally experiencing fraudulent hiring practices and unethical exit processes during a job search.

> *My skills and experience may not be perfect yet, but I'm committed to building something honest.*
