# Backend TODO List

<!-- Use this file to track features and goals for the backend -->

## Getting Started
- [x] Setup backend folder structure
- [x] Connect MySQL database
- [x] Create sample GET/POST APIs
#

## Prototype Features
- [x] Implement company verification (dummy: with cin)
- [x] Implement Company Registration (public)
- [x] Implement College Registration (public)
- [x] Implement College Onboarding Candidates
- [x] Implement Company onboarding Employees
- [x] Implement Candidate Join confirmation
- [x] Implement Employee Exits Company
- [x] Implement Candidate Exit confirmation
- [x] Implement Profile/dashboard details logic for every actor
- [x] Implement Dispute logic (basic dispute auto generation completed)
- [x] Implement Employment history tracker (basic employment data exist)
- [x] JWT authentication (login, token generation and validation)
- [x] bcrypt password encryption
- [x] router level role-based access perimission
- [x] Employment lifecycle: status system
  - [x] company initiates joining
  - [x] candidate confirms joining date (match/mismatch cases)
  - [x] candidate submits joining document checklist
  - [x] company initiates exit
  - [x] candidate confirms exit date (match/mismatch cases)
  - [x] candidate submits exit document checklist
- [x] Auto dispute generation on date mismatch
- [x] Auto dispute generation on doc checklist mismatch
- [x] duplicate dispute check
- [x] Audit logging on all key events
- [x] In-app notification
- [x] Bulk upload support (uses single-record endpoints for now)
#

## Know Gaps

- [ ] No password reset logic
- [ ] No tocken refresh logic
- [ ] dispute logic is not properly connected with other logics

## Planed features (future)
<!-- (Review or work on once all the protototype features are done) -->
- [ ] public pages anaytics to provide accurate placement and employee retention data
- [ ] email notifications
- [ ] connection pooling
- [ ] candidate and institute interation logic (mutual confirmation system similar to employment lifecycle flow)
- [ ] job postin module with traceble hiring and ghosting records