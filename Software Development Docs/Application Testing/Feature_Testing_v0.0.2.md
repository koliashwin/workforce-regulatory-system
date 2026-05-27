# Feature Testing Document - v0.0.2

> Updated to reflect the current system. Replaces v0.0.1 which predated the lifecycle system, JWT auth, notifications, and public pages.

---

# Module 1: Authentication

## 1.1 Login

### Purpose
Allow institute, company, candidate, and admin users to authenticate and access their role-specific portal.

### Current Frontend Flow
- User visits `/login`
- Enters email and password
- `authAPI.login()` called
- `decodeToken()` extracts role, user_id, email, role_code from JWT
- `login()` stores full user object in localStorage and context
- `useEffect` redirects to `/candidate`, `/company`, `/institute`, or `/admin` based on role

### Current Backend Flow
- `POST /auth/login`
- `LoginRequest` schema validates email and password
- `login_user()` fetches user by email, verifies bcrypt hash
- Creates JWT with user_id, role, role_code, email, expiry (9 hours)
- Returns `access_token`, `token_type`, `role`, `user_id`, decoded `token_data`

### Known Issues
- No rate limiting, unlimited login attempts
- No account lockout after failed attempts
- Token expiry is 9 hours with no refresh endpoint

### Ideal Behaviour
- Rate limit to 5 attempts per minute per IP
- Token refresh endpoint so users don't get logged out mid-session

---

# Module 2: Institute

## 2.1 Register Institute

### Purpose
Allow any institute to create an account on the platform and start enrolling students.

### Current Frontend Flow
- Visitor navigates to `/register/institute` (public, no login required)
- Fills name, AISHE code, contact, email, address
- `publicAPI.registerInstitute()` called
- Success screen shows login credentials

### Current Backend Flow
- `POST /public/register/institute`
- `register_institute()` creates `users` record (role_code=200) and `institutes` record
- Default password `Abced@12345` set

### Known Issues
- Default password shown in plain text on success screen
- No email sent to the registrant with their credentials

### Ideal Behaviour
- Generate random temporary password, send via email
- Force password change on first login

---

## 2.2 Enroll Students

### Purpose
Create verified candidate accounts linked to the institute. Forms the base dataset for the entire platform.

### Current Frontend Flow
- Institute admin at `/institute/onboard`
- Two tabs: Single student form | Bulk upload
- **Single:** form fields → `instituteAPI.onboardStudent()`
- **Bulk:** upload CSV/Excel → SheetJS parses → preview table → sequential upload → live status per row

### Current Backend Flow
- `POST /institute/onboard_students`
- `CandidateCreate` schema validates: email, name, contact_no, dob, institute_id, course, passout_year, skills
- `clg_onboard_candidate()` creates `users` record + `candidates` record
- `institute_id` read from JWT token, not request body

### Known Issues
- Default password `Abced@12345` for all students
- Duplicate email silently fails in bulk upload, shows as "Failed" row with error message from DB
- No candidate identity confirmation step after enrollment

### Ideal Behaviour
- Candidate should confirm their details after being enrolled
- Bulk upload should show a summary: X enrolled, Y failed, with reasons

---

## 2.3 Institute Profile & Dashboard

### Purpose
Give institute admins visibility into their alumni, placement outcomes and dispute history.

### Current Frontend Flow
- On login, institute lands on `/institute`
- `instituteAPI.instituteProfile()` calles user_id from token
- Dashboard shows: KPI stats (total alumni, placed count, placement rate, open disputes), alumni table, disputes panel, quick actions

### Current Backend Flow
- `GET /institute/view_profile`
- Returns institute info, student list (with employer names and designations), dispute summary

### Known Issues
- No charts, placement rate shown as number only
- Placement rate calculated as `placed/total` - "placed" means has a company_name in their record

### Ideal Behaviour
- Bar/line charts for placement trends over years
- Breakdown by course

---

# Module 3: Company

## 3.1 Register Company

### Purpose
Allow companies to create a verified account. CIN verification happens during registration.

### Current Frontend Flow
- Visitor at `/register/company` (public)
- Step 1: Enter CIN → `publicAPI.verifyCin()` → if found, pre-fills name and address from MCA data
- Step 2: Fill contact details → `publicAPI.registerCompany()`
- Step 3: Success screen

### Current Backend Flow
- `POST /public/register/company`
- `register_company()` runs CIN check against local MCA JSON during registration
- Sets `verification_status = 'Registered'` if CIN found and active, `'Unknown'` otherwise
- Creates `users` record (role_code=300) + `companies` record

### Known Issues
- MCA dataset is a local JSON file, not a live API
- Company with unrecognised CIN can still register (intentional, shows as Unverified)

### Ideal Behaviour
- Live MCA API integration

---

## 3.2 Onboard Employee (Joining - Step 1)

### Purpose
Company initiates the joining process by recording the official joining date.

### Current Frontend Flow
- Company admin at `/company/onboard`
- Two tabs: Single | Bulk upload
- Single form: user_email, designation, joining_date → `companyAPI.joiningInitiate()`
- Bulk: CSV with columns `user_email`, `designation`, `joining_date`

### Current Backend Flow
- `POST /company/joining_initiate`
- `initiate_joining()`:
  - Resolves user_id from email
  - Prevents duplicate onboarding
  - Creates `employees` + `employee_history` records
  - Status → `joining initiated`
  - Notifies candidate

### Known Issues
- Email must exactly match the candidate's registered email
- No validation that joining_date is not in the future

### Ideal Behaviour
- Autocomplete candidate email from enrolled candidates list

---

## 3.3 Employee Exit (Exit - Step 1)

### Purpose
Company initiates the exit process by recording the official last working day.

### Current Frontend Flow
- `/company/employee_exit`
- Two tabs: Single | Bulk upload
- Single form: user_email, exit_date → `companyAPI.exitInitiate()`

### Current Backend Flow
- `POST /company/exit_initiate`
- `initiate_exit()`:
  - Resolves user by email
  - Guards: status must be `joining completed` before exit can be initiated
  - Updates `employee_history`, sets status → `exit initiated`
  - Notifies candidate

### Known Issues
- If candidate's joining is incomplete (stuck on a mismatch), company cannot initiate exit until dispute is resolved

### Ideal Behaviour
- Employee list row should have direct "Initiate Exit" button

---

# Module 4: Candidate

## 4.1 Confirm Joining (Steps 2 & 3)

### Purpose
Candidate independently confirms their joining date and verifies receipt of onboarding documents.

### Current Frontend Flow
- `/candidate/joining_confirm`
- Two-step stepper. Auto-detects current step on mount from profile status.
- **Step 0 - Date confirmation:**
  - Candidate enters joining date + company ID
  - `candidateAPI.joiningConfirm()` called
  - Match → advances to Step 1
  - Mismatch → shows dispute warning with both dates
- **Step 1 - Document checklist:**
  - Two sections: received from company (dispute if unchecked) + submitted to company (acknowledgement only)
  - `candidateAPI.joiningDocuments()` called
  - All received checked → `setActiveStep(2)` → complete screen
  - Any missing → dispute warning with list of missing docs
- `isComplete = activeStep === 2`

### Current Backend Flow
- `POST /candidates/joining_confirm` → `confirm_joining()`
- `POST /candidates/joining_documents` → `submit_joining_documents()`
- Both read `user_id` from JWT token

### Known Issues
- Company ID is a manual text input, candidate must know their company's internal DB ID
- Step 1 requires company ID to still be in state, restored from profile on mount if page was refreshed

### Ideal Behaviour
- Company ID should be a dropdown populated from the candidate's employment history

---

## 4.2 Confirm Exit (Steps 2 & 3)

### Purpose
Candidate confirms exit date and verifies receipt of exit documents (experience letter, F&F, etc).

### Current Frontend Flow
- `/candidate/exit_confirm`
- Same two-step stepper pattern as JoiningConfirm
- Exit documents include legal entitlements, unchecked items raise a dispute against the company

### Current Backend Flow
- `POST /candidates/exit_confirm` → `confirm_exit()`
- `POST /candidates/exit_documents` → `submit_exit_documents()`

### Known Issues
- Same company ID issue as JoiningConfirm

---

## 4.3 Candidate Profile

### Purpose
Candidate's full verified employment and education timeline.

### Current Frontend Flow
- `/candidate/profile`
- Fetches `candidateAPI.getProfile()` - no arguments, user_id from token
- Shows: personal info, academic details, employment history with status chips, disputes

### Current Backend Flow
- `GET /candidates/view_profile`
- Fires 4 queries: personal info (users), academic info (candidates + institutes), employment history (employees + companies + employee_history), disputes

### Known Issues
- No years-of-experience calculation
- Employment history shows all records including incomplete joinings

---

## 4.4 Disputes List

### Purpose
Show candidate all disputes involving their account.

### Current Frontend Flow
- `/candidate/disputes`
- Filter chips by status (All / Pending / Under review / Resolved / Rejected)
- Explanation of how disputes work shown inline

### Current Backend Flow
- `GET /candidates/disputes_list`
- Returns all disputes. currently returns all platform disputes, not just the candidate's own (known issue)

### Known Issues
- `view_all_disputes()` returns all disputes, not filtered by the requesting user. any candidate can see all disputes

### Ideal Behaviour
- Filter disputes by `raised_by_id = user_id OR raised_against_id = user_id`

---

# Module 5: Admin

## 5.1 Admin Dashboard & Dispute Management

### Purpose
Platform-wide visibility and dispute resolution.

### Current Frontend Flow
- `/admin`
- KPI row: companies, institutes, candidates, open disputes
- Dispute management panel with filter chips and per-dispute resolve/reject/review buttons
- Entity tables: companies, institutes, candidates

### Current Backend Flow
- `GET /admin/company_list`, `GET /admin/institute_list`, `GET /admin/candidate_list`
- `PUT /admin/disputes/{id}` - status + resolution note

### Known Issues
- Dispute resolution note overwrites the original dispute description
- No audit trail shown for dispute status changes in the UI

### Ideal Behaviour
- Separate `resolution_note` column - preserve original dispute description
- Show dispute history log in the admin panel

---

# Module 6: Public Pages

## 6.1 Landing Page

### Purpose
Explain what the platform does, show live stats, link to registration and search.

### Current Frontend Flow
- `/` - no login required
- `publicAPI.getPlatformStats()` called on load
- Shows: live stats (verified companies, institutes, candidates, disputes resolved), problem statement, how-it-works flow, actor benefit cards, transparency CTAs

### Known Issues
- Stats show `-` if backend is cold (Render spin-up delay)

---

## 6.2 Institute Search

### Purpose
Public transparency. anyone can see an institute's placement rate and dispute history.

### Current Frontend Flow
- `/institutes` - search by name or location
- Click card → right-side drawer fetches `publicAPI.getInstituteProfile(id)`
- Shows: placement stats, breakdown by course, dispute summary, recent alumni

---

## 6.3 Company Search

### Purpose
Public transparency. anyone can see a company's verification status and dispute history.

### Current Frontend Flow
- `/companies` - search by name or CIN, filter by verified/unverified/has-disputes
- Click card → drawer fetches `publicAPI.getCompanyProfile(id)`
- Shows: workforce stats, dispute counts, warning alert if pending disputes exist

---

# Module 7: Notifications

## 7.1 In-App Notifications

### Purpose
Alert users when lifecycle events affect them, without requiring them to check the platform manually.

### Current Frontend Flow
- Bell icon in topbar polls unread count every 30 seconds
- Badge shows count, bell turns amber when unreads exist
- Click → dropdown shows last 20 notifications
- Click notification → marks it read
- "Mark all read" button clears everything

### Current Backend Flow
- `GET /notifications/unread_count` - fast index-backed count query
- `GET /notifications` - last N notifications for the requesting user
- `PUT /notifications/mark_all_read`, `PUT /notifications/{id}/read`

### Known Issues
- Polling every 30 seconds. notifications are not real-time
- No notification preferences. cannot mute specific event types

### Ideal Behaviour
- WebSocket connection for real-time delivery
- Notification preference settings per user
