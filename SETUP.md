# Setup Guide

Local development setup for the Workforce Regulatory System.

---

## Prerequisites

Before you start, make sure you have these installed:

| Tool | Version | Notes |
|---|---|---|
| Python | 3.11+ | [python.org](https://python.org) |
| Node.js | 24+ | [nodejs.org](https://nodejs.org) |
| MySQL | 8.0+ | [mysql.com](https://dev.mysql.com/downloads/) / I'm using Workbench for local and aiven for deplyment |
| Git | any | |

---

## 1. Clone the repository

```bash
git clone https://github.com/koliashwin/workforce-regulatory-system.git
cd workforce-regulatory-system
```

---

## 2. Database setup

### Create the database

```sql
CREATE DATABASE workforce_regulatory_system;      -- this name could be anything just make sure to pass the same in relevent .env
USE workforce_regulatory_system;
```

### Run the schema script

The single SQL file at `Software Development Docs/regulatory system DB script.sql` creates all tables and runs all migrations in the correct order. Run it once:

```bash
mysql -u your_username -p workforce_regulatory_system < "Software Development Docs/regulatory system DB script.sql"
```

Or paste the contents directly into MySQL Workbench and execute.

### Seed roles

```sql
INSERT INTO roles (role, role_code) VALUES
  ('candidate', 100),
  ('institute', 200),
  ('company',   300),
  ('admin',     400);
```

---

## 3. Backend setup

### Create and activate virtual environment

```bash
cd Backend
python -m venv venv

# Windows
venv\Scripts\activate

# Mac / Linux
source venv/bin/activate
```

### Install dependencies

```bash
pip install -r requirements.txt
```

### Create the `.env` file

Create a file named `.env` inside the `Backend/` folder:

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=your_mysql_username
DB_PASS=your_mysql_password
DB_NAME=workforce_regulatory_system

JWT_SECRET_KEY=your-secret-key-minimum-32-chars

FRONTEND_URL=http://localhost:5173
```

**Generating a secure JWT secret key:**
```bash
python -c "import secrets; print(secrets.token_hex(32))"
```

### Create a superadmin account

```bash
cd Backend
python scripts/create_admin.py
```

This will prompt you for name, email, and password. The admin account lets you access `/admin` endpoint on frontend

### Start the backend

```bash
cd Backend
uvicorn main:app --reload
```

Backend runs at `http://localhost:8000`

API documentation (auto-generated): `http://localhost:8000/docs`

---

## 4. Frontend setup

### Install dependencies

```bash
cd Frontend
npm install
```

### Create the `.env` file

Create a file named `.env` inside the `Frontend/` folder:

```env
VITE_BACKEND_URL=http://localhost:8000
```

### Start the frontend

```bash
cd Frontend
npm run dev
```

Frontend runs at `http://localhost:5173`

---

## 5. Verify everything is working

Open `http://localhost:5173` — you should see the landing page with live platform stats loading from the backend.

If stats don't load, check:
1. Backend is running at `http://localhost:8000`
2. `VITE_BACKEND_URL` in `Frontend/.env` is correct
3. `FRONTEND_URL` in `Backend/.env` matches your frontend URL (CORS)

---

## 6. Running the full demo flow

To test the complete lifecycle end-to-end, you need accounts for each role.

**Step 1 — Register an institute** at `/register/institute`

**Step 2 — Log in as the institute** and enroll a student (creates their candidate account)
- Default password for all created accounts: `Abced@12345`

**Step 3 — Register a company** at `/register/company` (use any CIN from `Backend/dummy DB/MCA companies.json` to get a verified status)

**Step 4 — Log in as the company** and initiate joining for the student's email

**Step 5 — Log in as the candidate** and confirm the joining date
- Enter the same date → proceeds to documents
- Enter a different date → dispute auto-raised

**Step 6 — Complete document checklist** as the candidate

**Step 7 — Log in as admin** (account you created in step 3 of setup) and view disputes

---

## Project structure

```
workforce-regulatory-system/
├── Backend/
│   ├── API Docs/           # API payload and response documentation
│   ├── config/             # Database connection (db.py)
│   ├── dev_logs/           # Development timeline and backend workflow
│   ├── dummy DB/           # Local MCA companies dataset (JSON dummy)
│   ├── routes/             # FastAPI endpoint definitions
│   ├── schema/             # Pydantic models for request validation
│   ├── scripts/            # Utility scripts (create_admin.py)
│   ├── services/           # Core business logic
│   ├── utils/              # JWT, auth dependency, password hashing
│   ├── main.py             # FastAPI app entry point
│   └── requirements.txt
│
├── Frontend/
│   ├── Devlogs/            # Development timeline and frontend workflow
│   └── src/
│       ├── api/            # Axios client and API modules per role
│       ├── components/     # Reusable UI components
│       ├── context/        # AuthContext (login state)
│       ├── layout/         # DashboardLayout, PublicLayout
│       ├── pages/          # Feature pages per role
│       ├── routes/         # AppRouter, ProtectedRoute
│       └── theme/          # MUI theme and design tokens
│
└── Software Development Docs/
    ├── regulatory system DB script.sql    # Full DB schema + migrations
    ├── Workflow Details.md                # Initial System design plan
    └── Application Testing/
        └── Feature_Testing_v0.0.2.md      # Feature-by-feature test documentation
```

---

## Deployment

The live version is deployed on:
- **Frontend:** Vercel — [workforce-regulatory-system.vercel.app](https://workforce-regulatory-system.vercel.app)
- **Backend:** Render — [workforce-regulatory-system-backend.onrender.com](https://workforce-regulatory-system-backend.onrender.com)
- **Database:** Aiven (MySQL)

For your own deployment, add all `.env` variables as environment variables in your hosting platform. The `FRONTEND_URL` on the backend must match your deployed frontend URL exactly (CORS).

> **Note:** The Render free tier spins down after inactivity. The first request after a cold start may take 30–60 seconds. This is a hosting limitation, not a bug.

---

## Common issues

**`RuntimeError: JWT_SECRET_KEY environment variable is not set`**
→ Your `Backend/.env` file is missing or `JWT_SECRET_KEY` is empty. Check the file exists and has no spaces around `=`.

**CORS error in browser**
→ `FRONTEND_URL` in `Backend/.env` does not match the URL your frontend is running on. They must match exactly including the protocol (`http://`).

**Blank page after login**
→ The `/unauthorized` route is not yet implemented. If you see a blank page, check the browser URL — if it says `/unauthorized`, you're hitting a role mismatch in the route guard.

**DB Script executeion issues**
→ check the table names and rename them as lowercase letters. some db tools are case sensitive and throw error while table creations.