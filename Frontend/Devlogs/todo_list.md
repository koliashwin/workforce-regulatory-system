# Frontend TODO List

<!-- Use this file to track features and goals for the backend -->

## Getting Started
- [x] Setup Frontend folder structure
- [x] Install and test required libraries (react-router-dom, MUI, axios)
- [x] Created and test basic pages & components
#

## Prototype Features
- [x] Protected routes (Role-based access)
- [x] Frontend Forms 
  - [x] Candidate Onboarding (institute)
  - [x] Company Registration (company)
  - [x] Verify Company (company)
  - [x] Employee Onboarding (company)
  - [x] Employee Exit (company)
  - [x] Joining confirmation (candidate)
  - [x] Exit confirmation (candidate)
  - [x] joining doc checklist (candidate)
  - [x] exit doc checklist (candidate)
- [x] Frontend views
  - [x] Candidate List (institute)
  - [x] Candidate Profile (candidate)
  - [x] Company Profile
  - [x] Institute Profile
  - [x] Employee List (company)
  - [x] Company List (company) 
  - [x] Dispute List 
  - [x] admin dashboard
  - [x] public view for company stats
  - [x] public view for institute stats
- [x] API interation logic (basic)
- [x] Connect all Forms to backend
- [x] Connect all views to backend
- [x] Employee bulk onboarding
- [x] Candidate bulk onboarding
- [x] Presistant Login
- [x] JWT based authenticaton
- [x] basic landing page with sample data
- [x] resuable components for (table display, KPI display, status display)
#

## Testing
- [x] Test API communication between Froentend & Backend

## Known Gaps

- [ ] `/unautorized` page missing
- [ ] Company ID should be replaced with company name in `JoiningConfirm` and `ExitConfirm` flow
- [ ] some `console.log(...)` statements in the codebase (left for debugging purpose)


## Planed features (future)

- [ ] better analytic presentation on public pages (InstituteSearchPage and CompanySearchPage)
- [ ] forgot/reset password page
- [ ] filters on employee list
- [ ] email integration
- [ ] mobile responsive layout