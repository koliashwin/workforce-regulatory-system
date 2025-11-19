# Backend TODO List

<!-- Use this file to track features and goals for the backend -->

## Getting Started
- [x] Setup backend folder structure
- [x] Connect MySQL database
- [x] Create sample GET/POST APIs
#

## Prototype Features
- [x] Implement company verification (dummy)
- [x] Implement Company Registration
- [x] Implement College Onboarding Candidates
- [x] Implement Company onboarding Employees
- [x] Implement Candidate Join confirmation
- [x] Implement Employee Exits Company
- [x] Implement Candidate Exit confirmation
- [ ] Implement Dispute logic
- [ ] Implement Employment history tracker
#

## Testing
- [x] API Testing
- [x] API Documentation for frontend reference (payloads & response)
- [x] Core Logic (basic, no validiations, main flow only)
- [ ] Core Logic (with validations & known edge cases)

## Important Notes (Streatched features/updates)
<!-- (Review or work on once all the protototype features are done) -->
- [ ] update proper role_id for following modules:
  - [ ] college Onboarding candidates, 
  - [ ] company onboarding employees, 
  - [ ] exit confirmation
- [ ] Have proper status and update properly with folowing modules:
  - [ ] company onboarding candidates, 
  - [ ] candidate join confimation, 
  - [ ] employee exits company, 
  - [ ] candidate exit confirmation
- [ ] verify every function which is called in any post request is using some unique or primery ids for posting and retriving data. if not do the nessery changes.