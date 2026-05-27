# Backend Workflow

> This document reflects the current state of the backend

---

## Architecture Overview

```
Request
  ↓
main.py  (FastAPI app + CORS )
  ↓
routes/router.py  (central router - applies role-based auth per router group)
  ↓
routes/*.py  (endpoint definitions - validate schema, call service)
  ↓
services/*.py  (core business logic - DB queries, dispute triggers, notifications)
  ↓
config/db.py  (MySQL connection)
```

**Pattern used throughout:** No ORM. Raw SQL via `mysql-connector-python`. Every service function opens its own connection, runs queries, commits or rolls back, then closes in `finally`.

---

## Authentication Layer

### How it works

Login returns a JWT. The frontend stores it in localStorage and sends it as `Authorization: Bearer <token>` on every request. The backend validates the token on protected routes.

### Key files

**`utils/jwt.py`**
- `create_token(data)` - encodes data like user_id, role, role_code, email into a JWT. Expiry: 9 hours.
- `decode_token(token)` - decodes and validates. Raises `401` on failure.
- `SECRET_KEY` loaded from `.env`. Raises `RuntimeError` on startup if missing.

**`utils/auth_dependency.py`**
- `get_current_user` - FastAPI dependency. Extracts and decodes the Bearer token. Returns decoded payload as dict.
- `require_role(*roles)` - factory that returns a dependency checking decoded role against allowed roles. Raises `403` on mismatch.

**`utils/password.py`**
- `hash_password(plain)` - bcrypt hash/encrypts password via `bcrypt` library directly.
- `verify_password(plain, hashed)` - verify password via bcrypt.

### Router-level auth

Auth is applied at the router level in `router.py`, not on individual endpoints:


```python
main_router.include_router(candidate_router,    dependencies=[Depends(require_role("candidate"))])                      # candidate endpoints
main_router.include_router(company_router,      dependencies=[Depends(require_role("company"))])                        # company endpoints
main_router.include_router(institute_router,    dependencies=[Depends(require_role("institute"))])                      # institute endpoints
main_router.include_router(admin_router,        dependencies=[Depends(require_role("admin"))])                          # admin endpoints
main_router.include_router(auth_router)            # public, no auth
main_router.include_router(public_router)          # public, no auth
main_router.include_router(notification_router, dependencies=[Depends(get_current_user)])                               # user specific notification per account
```

---

## Database Schema

### Tables

| Table | Purpose |
|---|---|
| `users` | All accounts :- candidates, companies, institutes, admins |
| `roles` | role_code → role name mapping (100=candidate, 200=institute, 300=company, 400=admin) |
| `candidates` | Academic details :- links to users and institutes |
| `institutes` | Institute accounts and details :- links to users |
| `companies` | Company accounts, CIN, verification status :- links to users |
| `employees` | Active employment link :- user_id + company_id + designation |
| `employee_history` | Full employment lifecycle per employment event |
| `joining_documents` | Joining document checklist submitted by candidate |
| `exit_documents` | Exit document checklist submitted by candidate |
| `disputes` | Auto-generated dispute records |
| `audit_logs` | Append-only event log for all system actions |
| `notifications` | In-app notification records per user |

### `employee_history` status lifecycle

The `status` column is the single source of truth for where an employment record is in its lifecycle:

```
joining initiated          ← company sets joining date
joining confirmed          ← candidate confirms date matches
joining date mismatch      ← candidate date ≠ company date → auto dispute raised
joining completed          ← candidate confirms all joining documents received
joining documents incomplete ← candidate reports missing joining docs → auto dispute raised

exit initiated             ← company sets exit date
exit confirmed             ← candidate confirms date matches
exit date mismatch         ← candidate date ≠ company date → auto dispute raised
exit completed             ← candidate confirms all exit documents received
exit documents incomplete  ← candidate reports missing exit docs → auto dispute raised
```

---

## Services

### `services/auth.py`
- `login_user(email, password)` - fetches user by email, verifies bcrypt password, creates JWT, returns token + decoded data.

### `services/lifecycle.py`
The core of the system. Handles the full employment lifecycle in 6 steps.

**Step 1 - `initiate_joining(data, company_id)`**
- Called by company.
- Resolves candidate by email. Prevents duplicate onboarding.
- Creates `employees` record + `employee_history` record.
- Status → `joining initiated`.
- Notifies candidate.

**Step 2 - `confirm_joining(data, user_id)`**
- Called by candidate.
- Compares `joining_date_candidate` vs `joining_date_company`.
- Match → status `joining confirmed`. Notifies both.
- Mismatch → status `joining date mismatch`. Calls `raise_dispute()`. Notifies both.

**Step 3 - `submit_joining_documents(data, user_id)`**
- Called by candidate.
- Saves joining document checklist to `joining_documents` table.
- Checks only received documents any unchecked = missing.
- All received → status `joining completed`. Notifies both.
- Any missing → status `joining documents incomplete`. Calls `raise_dispute()`. Notifies both.

**Step 4 - `initiate_exit(data, company_id)`**
- Called by company.
- Only works if current status is `joining completed`.
- Sets exit date. Status → `exit initiated`. Notifies candidate.

**Step 5 - `confirm_exit(data, user_id)`**
- Same pattern as Step 2 - date comparison, match/mismatch, dispute on mismatch.

**Step 6 - `submit_exit_documents(data, user_id)`**
- Same pattern as Step 3 - document checklist, dispute on missing received docs.

**`_get_company_user_id(cursor, company_id)`** - internal helper. Resolves which `user_id` owns a company, used to send notifications to the right account.

### `services/dipsutes.py`
- `check_duplicate_dispute(raised_by_id, raised_against_id, topic)` - returns True if identical pending dispute already exists. Called before every `raise_dispute()`.
- `raise_dispute(...)` - inserts into `disputes` table. Skips silently if duplicate.
- `update_dispute(dispute_id, status, resolution_note)` - admin-only. Updates status, writes resolution note.
- `view_all_disputes()` - returns all disputes ordered by date.

### `services/notifications.py`
- `notify(user_id, type, title, message)` - inserts one notification. Fails silently, never crashes the calling service.
- `get_notifications(user_id, limit)` - fetch last N notifications for a user.
- `get_unread_count(user_id)` - fast count query using the index.
- `mark_all_read(user_id)` - bulk update.
- `mark_one_read(notification_id, user_id)` - single update with ownership check.

### `services/audit.py`
- `log_action(action, performed_by, performed_by_id, target_type, target_id, description, metadata)` - appends to `audit_logs`. Fails silently.

### `services/candidates.py`
- `view_candidate_profile(user_id)` - fires 4 queries: personal info, academic info, employment history, disputes. Returns consolidated dict.

### `services/companies.py`
- `register_company(data)` - creates `users` + `companies` records. Runs CIN verification against MCA JSON during registration so the status is set correctly from the start.
- `verify_company(cin)` - standalone CIN check against dummy MCA dataset. Updates `verification_status` in DB.
- `view_company_profile(company_id)` - returns company info, employee list, disputes.
- `all_employee_list(company_id)` - returns employees for a specific company.

### `services/institutes.py`
- `register_institute(data)` - creates `users` + `institutes` records.
- `clg_onboard_candidate(data)` - creates `users` + `candidates` records. Called by institute.
- `view_institute_profile(institute_id)` - returns institute info, student list with placements, disputes.
- `all_candidates_list(institute_id)` - returns all candidates for a specific institute.

### `services/admin.py`
- `all_company_list()` - all companies.
- `all_institute_list()` - all institutes.
- `all_candidate_list()` - all candidates.

### `services/public.py`
- Sanitised versions of profile data. strips private fields (emails, user IDs, contact numbers) before returning to unauthenticated callers.
- `overall_states()` - aggregate counts for the landing page hero section.

---

## Routes

### `routes/auth_routes.py` - public
- `POST /auth/login` - calls `login_user()`, returns token + decoded payload.

### `routes/candidate_routes.py` - role: candidate
- `GET  /candidates/view_profile` - user_id from token, not query param.
- `GET  /candidates/disputes_list`
- `POST /candidates/joining_confirm`
- `POST /candidates/joining_documents`
- `POST /candidates/exit_confirm`
- `POST /candidates/exit_documents`

### `routes/company_routes.py` - role: company
- `GET  /company/view_profile`
- `GET  /company/employee_list`
- `POST /company/joining_initiate`
- `POST /company/exit_initiate`

### `routes/institute_routes.py` - role: institute
- `POST /institute/onboard_students`
- `GET  /institute/candidate_list`
- `GET  /institute/view_profile`

### `routes/admin_routes.py` - role: admin
- `GET  /admin/company_list`
- `GET  /admin/institute_list`
- `GET  /admin/candidate_list`
- `PUT  /admin/disputes/{dispute_id}` - resolve/reject/mark under review.

### `routes/notification_routes.py` - any authenticated role
- `GET  /notifications`
- `GET  /notifications/unread_count`
- `PUT  /notifications/mark_all_read`
- `PUT  /notifications/{id}/read`

### `routes/public_routes.py` - public, no auth
- `GET  /public/stats`
- `GET  /public/institute_list`
- `GET  /public/institute/{id}`
- `GET  /public/company_list`
- `GET  /public/company/{id}`
- `POST /public/register/company`
- `POST /public/register/institute`
- `POST /public/verify/company?cin=...`

---

## Schemas

### `schema/auth.py`
- `LoginRequest` - email, password.

### `schema/candidates.py`
- `CandidateCreate` - email, name, contact_no, dob, institute_id, course, passout_year, skills.
- `CandidateResponse` - subset of fields for list views.

### `schema/companies.py`
- `CompanyCreate` - user_name, name, cin, address, contact_no, email. No verification_status, its set by service.

### `schema/lifecycle.py`
- `JoiningInitiate` - user_email, joining_date, designation.
- `JoiningConfirm` - company_id, joining_date.
- `JoiningDocuments` - company_id + all document boolean fields + notes.
- `ExitInitiate` - user_email, exit_date.
- `ExitConfirm` - company_id, exit_date.
- `ExitDocuments` - company_id + all exit document boolean fields + notes.
- `DisputeUpdate` - status, resolution_note.

---

## Environment Variables

Required in `.env` at `Backend/`:

```
DB_HOST=
DB_PORT=3306
DB_USER=
DB_PASSWORD=
DB_NAME=
JWT_SECRET_KEY=
FRONTEND_URL=
```

`JWT_SECRET_KEY` - will raise `RuntimeError` on startup if missing or empty.

---

## Known Limitations (Prototype)

- Default password `Abced@12345` is hardcoded for all new accounts. No password reset flow exists yet.
- MCA verification uses a local JSON dataset (`dummy DB/MCA companies.json`), not a live API.
- No rate limiting on the login endpoint.
- No token refresh endpoint. 9-hour expiry means users get logged out mid-day in long sessions.
- DB uses direct connections per request, not a connection pool. Adequate for prototype load.
- exit documents and joining documents tables are temporary (not fully dynamic yet)
