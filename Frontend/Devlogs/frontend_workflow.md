# Frontend Workflow

> This document reflects the current state of the frontend as of the latest version.

---

## Architecture Overview

```
src/
├── api/
│   ├── axiosClient.js          # base HTTP client — token attachment, 401 redirect
│   └── modules/
│       ├── authAPI.js
│       ├── candidateAPI.js
│       ├── companyAPI.js
│       ├── instituteAPI.js
│       ├── adminAPI.js
│       ├── publicAPI.js
│       └── notificationAPI.js
├── components/
│   ├── BulkUpload.jsx          # reusable bulk CSV/Excel upload component
│   ├── DataTable.jsx           # reusable data table
│   ├── DisputeCard.jsx         # dispute display with status and actions
│   ├── NotificationBell.jsx    # topbar bell icon with dropdown
│   ├── SectionHeader.jsx       # page headings
│   ├── StatCard.jsx            # KPI metric tile
│   └── StatusChip.jsx          # status badge with colour coding
├── context/
│   └── AuthContext.jsx         # user state + login/logout + localStorage persistence
├── layout/
│   ├── DashboardLayout.jsx     # sidebar + topbar (with NotificationBell) + Outlet
│   └── PublicLayout.jsx        # public navbar (with Get Started + Sign in) + Outlet
├── pages/
│   ├── auth/Login.jsx
│   ├── candidate/
│   │   ├── Home.jsx
│   │   ├── Profile.jsx
│   │   ├── JoiningConfirm.jsx
│   │   ├── ExitConfirm.jsx
│   │   └── DisputesList.jsx
│   ├── company/
│   │   ├── Home.jsx
│   │   ├── OnboardEmployee.jsx
│   │   ├── EmployeeExits.jsx
│   │   └── EmployeeList.jsx (or Profile.jsx)
│   ├── institute/
│   │   ├── Home.jsx
│   │   ├── OnboardStudent.jsx
│   │   └── CandidateList.jsx
│   ├── admin/
│   │   └── Home.jsx
│   └── public/
│       ├── LandingPage.jsx
│       ├── GetStarted.jsx
│       ├── RegisterCompany.jsx
│       ├── RegisterInstitute.jsx
│       ├── InstituteSearchPage.jsx
│       └── CompanySearchPage.jsx
├── routes/
│   ├── AppRouter.jsx
│   └── ProtectedRoute.jsx
├── theme/
│   └── theme.js                # MUI theme — tokens, component overrides
└── utils/
    └── decodeToken.js          # atob()-based JWT payload decoder
```

---

## Auth Flow

### `context/AuthContext.jsx`
Provides `user`, `login(userData)`, and `logout()` to all components.

- On mount — reads `localStorage.getItem('user')` and hydrates state. Enables persistent login across page refreshes.
- `login(userData)` — stores full token response in state and localStorage. Called from `Login.jsx` after successful API response.
- `logout()` — clears state and localStorage.

### `utils/decodeToken.js`
```js
export const decodeToken = (token) => {
    const base64Payload = token.split('.')[1];
    return JSON.parse(atob(base64Payload));
};
```
Used in `Login.jsx` to extract `role`, `user_id`, `email`, `role_code` from the JWT without a library. Frontend does not verify the signature — that's the backend's job.

### `Login.jsx`
1. Calls `authAPI.login({ email, password })`
2. Decodes `access_token` with `decodeToken()`
3. Calls `login({ access_token, token_type, role, user_id, email, role_code })`
4. `useEffect` watches `user.role` and redirects to the correct portal on login or page load

### `api/axiosClient.js`
- Reads `user.access_token` from localStorage on every request
- Attaches as `Authorization: Bearer <token>` header
- Response interceptor: on `401` → clears localStorage → redirects to `/login`

---

## Routing

### `routes/AppRouter.jsx`
Two top-level route groups:

**Public** — wrapped in `<PublicLayout />`:
```
/                    → LandingPage
/login               → Login
/institutes          → InstituteSearchPage
/companies           → CompanySearchPage
/get-started         → GetStarted (role picker)
/register/company    → RegisterCompany
/register/institute  → RegisterInstitute
```

**Protected** — wrapped in `<ProtectedRoute />` then `<DashboardLayout />`:
```
/candidate/*         → ProtectedRoute allowedRoles=['candidate']
/institute/*         → ProtectedRoute allowedRoles=['institute']
/company/*           → ProtectedRoute allowedRoles=['company']
/admin/*             → ProtectedRoute allowedRoles=['admin']
```

### `routes/ProtectedRoute.jsx`
- No user in context → redirect to `/login`
- User role not in `allowedRoles` → redirect to `/unauthorized`
- Otherwise → render `<Outlet />`

---

## API Layer

### `axiosClient.js`
Base client with `baseURL = VITE_BACKEND_URL`. Token attachment and 401 handling as described above.

### API modules — pattern
Each module is a plain object of named functions:
```js
const candidateAPI = {
    getProfile:        ()     => axiosClient.get('/candidates/view_profile'),
    joiningConfirm:    (data) => axiosClient.post('/candidates/joining_confirm', data),
    joiningDocuments:  (data) => axiosClient.post('/candidates/joining_documents', data),
    exitConfirm:       (data) => axiosClient.post('/candidates/exit_confirm', data),
    exitDocuments:     (data) => axiosClient.post('/candidates/exit_documents', data),
    disputeList:       ()     => axiosClient.get('/candidates/disputes_list'),
};
```
Note: `getProfile` takes no arguments — `user_id` comes from the token on the backend.

---

## Layouts

### `DashboardLayout.jsx`
- Permanent MUI `<Drawer>` sidebar — dark navy background, amber accents
- Sidebar items built from `menuItems[role]` — different nav per role
- `<AppBar>` topbar with:
  - Platform label (monospace)
  - `<NotificationBell />` component
  - Role icon + role name
- `<Outlet />` renders the active page

### `PublicLayout.jsx`
- `<AppBar>` with logo, nav links (Home, Institutes, Companies), search bar, Get Started button, Sign in button
- Search bar routes to `/institutes?q=...` or `/companies?q=...`
- `<Outlet />` renders public pages
- Footer with platform name

---

## Reusable Components

### `NotificationBell.jsx`
- Polls `GET /notifications/unread_count` every 30 seconds via `setInterval`
- Shows `<Badge>` with unread count on bell icon
- Bell turns amber and switches to `NotificationsActiveIcon` when unreads exist
- Click → `<Popper>` dropdown opens, fetches last 20 notifications
- Unread notifications have amber left border + amber dot
- Click individual notification → `markOneRead(id)` → updates locally
- "Mark all read" button → `markAllRead()` → clears all locally

### `BulkUpload.jsx`
Reusable component — configured differently per use case via props:
- `columns` — defines required CSV column keys and preview table columns
- `onUploadRow(row)` — async function called for each row. Throws on failure.
- `templateName` — filename for downloaded template
- `previewCols` — which column keys to show in preview
- `templateSample` — array of arrays for sample rows in the downloaded template
- `infoMessage` — context-specific alert shown above dropzone

**Flow:** File selected → SheetJS parses → validates required columns → shows preview table → user clicks "Upload All" → sends rows sequentially to `onUploadRow` → each row shows live status (Pending / uploading / Done / Failed) → progress bar tracks completion → "Retry Failed" re-sends only error rows.

### `StatusChip.jsx`
Maps status strings to MUI `<Chip>` colour and label. Covers all 10 lifecycle statuses, all dispute statuses, and verification statuses. Returns a gray "—" chip for unknown values rather than crashing.

### `StatCard.jsx`
KPI tile used on all dashboards. Props: `label`, `value`, `icon`, `accent` (left border colour), `sub` (secondary line).

### `DataTable.jsx`
Generic table. Props: `data`, `columns` (with `isStatus`, `mono` flags), `maxRows`, `emptyText`. `isStatus: true` columns auto-render `<StatusChip>`. `mono: true` renders in monospace for IDs and dates.

### `DisputeCard.jsx`
Displays a single dispute. Left border colour encodes status (amber=pending, teal=under review, green=resolved, red=rejected). Shows raised_by, raised_against, topic, description, date. Optional `onAction` prop renders admin resolve/reject buttons.

---

## Key Page Flows

### JoiningConfirm.jsx (Candidate)
Two-step stepper. Auto-detects current step on mount from profile status.

- Step 0 — Date confirmation form
  - Submits to `POST /candidates/joining_confirm`
  - On success → advances to Step 1
  - On mismatch → shows dispute warning with both dates
- Step 1 — Document checklist (joining documents)
  - RECEIVED docs: unchecked = missing = dispute raised
  - SUBMITTED docs: acknowledgement only, no dispute
  - Submits to `POST /candidates/joining_documents`
  - On success → `setActiveStep(2)` → complete screen
- `isComplete = activeStep === 2`
- `useEffect` on mount: fetches profile → if status `joining completed` → step 2; if `joining confirmed` → step 1 + restores `companyId`

ExitConfirm.jsx follows identical structure with exit-specific document list.

### OnboardStudent.jsx (Institute)
Two tabs:
- **Single** — standard form, calls `instituteAPI.onboardStudent()`
- **Bulk** — `<BulkUpload>` configured with `STUDENT_COLUMNS` and `uploadStudentRow` function

### OnboardEmployee.jsx / EmployeeExits.jsx (Company)
Same two-tab pattern as OnboardStudent. `<BulkUpload>` configured with respective columns and API calls.

### RegisterCompany.jsx (Public)
Three-step flow:
1. CIN entry → calls `publicAPI.verifyCin()` → if found, pre-fills company name and address from MCA data
2. Detail form → calls `publicAPI.registerCompany()` — backend verifies CIN internally and sets status
3. Success screen → "Go to Login"

If CIN not found in MCA, user still proceeds with a warning that account will be unverified.

---

## Theme

### `theme/theme.js`
MUI `createTheme` with custom design tokens (`tokens` exported separately for use in component `sx` props).

Key design decisions:
- Dark navy sidebar (`#0d1117`) — authority without aggression
- Amber accent (`#f59e0b`) — active, urgent, warm
- `Fraunces` serif for headings — editorial, trustworthy
- `DM Mono` for IDs, dates, codes — machine-readable data stands out
- Left-border colour pattern used on both `StatCard` and `DisputeCard` for status-at-a-glance

---

## Environment Variables

Required in `Frontend/.env`:
```
VITE_BACKEND_URL=https://your-backend-url.com
```

---

## Known Limitations (Prototype)

- Company ID is still a manual text input in `JoiningConfirm` and `ExitConfirm` — should be a dropdown populated from the candidate's employment history.
- No `/unauthorized` page exists — `ProtectedRoute` redirects there but the route is not defined.
- `console.log(backend_url)` still present in `axiosClient.js` — remove before production.
- No loading skeleton on initial dashboard load — pages show empty state briefly before data arrives.
