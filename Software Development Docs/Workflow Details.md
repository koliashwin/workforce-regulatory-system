# Workflow design

## Actors
* **Company**
* **College**
* **Candidate**
* **Regulatory System**
* **GOVT Websites (mca.ac.in / similar)**
<!-- * other actors may included in future -->
# applicaton Features

## 1. Comapny Registration:
- **Company → Regulatory System :** Register
- **Regulatory System → GOVT Websites :** Verify Company
- **Govt Websites :** returns verification statust (sucees/fail)
- **[if Verified : Yes] :**
  - **Regulatory system → Company :** Profile created and verification Successful
  - **Regulatory system → Audit log :** verified profile created
- **[if Verified : No] :**
  - **Regulatory system → Company :** Profile created but verification failed
  - **Regulatory system → Audit log :** non-verified profile created

## 2. College Onboarding Candidates:
- **College → Regulatory System :** uploade/Submit the Candidates Data 
- **Regulatory System :** Creates the Candidates profiles (pending verification)
- **Regulatory System → Candidate :** Notification(email or similar): Your Profile has been created by College/Institute. Please Confirm.
- **Candidate → Regulatory System :** Identiy or details confirmation(Success/Fail)
- **[if Confirmaion : Yes] :**
  - **Regulatory System → Audit log :** new verified candidate onboarded
- **[if Confirmaion : No] :**
  - **Regulatory System → College :** Notify and request reattempt with correct data
  - **Regulatory System → Audit Log:** candidate verification failed

## 3. Candidate Joins Company:
- **Company → Regulatory System :** Updates the Joining Date of candidate
- **Candidate → Regulatory System :** updates Join Date (optional/self-confirmation)
- **Regulatory System :**
  - Comapare both dates
  - **if matched :** approve record, notify both sides
  - **if mismatched :** notify both with warning
- **Regulatory System → Audit log :** cadidate joins company

## 4. Candidate Exits Company:
- **Company → Regulatory System :** Updates the Exit Date of candidate
- **Candidate → Regulatory System :** updates Exit Date (optional/self-confirmation)
- **Regulatory System :**
  - Comapare both dates
  - **if matched :** approve record, notify both sides
  - **if mismatched :** notify both with warning
- **Regulatory System → Audit log :** cadidate leaves the company

## 5. Disputes / Flag Resolution:
- **Any Actor → Reguletory System :** Submit disputes (e.g. mismatched join/exit or unaothorized update)
- **Regulatory System :**
  - inform both parties
  - temporary mark the record as under review
- **Admin/Moderator :** Review Evidence (attachments, logs, ect)
- **Regulatory System :** Update Status (Resolved/Fraud Activity)
- **Regulatory System → Audit log :** final record of dispute resolution