# API Payloads & Responses

<!-- this file will contain API Payloads and Responces along with the mistakes I found in the curretn API version-->

<!-- template

- ## `request_type: /endpoint`
  - ### purpose :
    - purpose of the end point
  - ### payload :
    ```json
    {
        "key1": "data 1",
        "key2": "data 2"
        ...
    }
    ```
  - ### Success Response:
    ```json
    {
        "key1": "data 1",
        "key2": "data 2"
        ...
    }
    ```
  - ### Error Response:
    ```json
    {
        "key1": "data 1",
        "key2": "data 2"
        ...
    }
    ```
  - ### Notes:
    - notes if any
  #


-->

# 1. Auth
- ## `POST: /auth/login`
  - ### purpose :
    - Authenticate any user (candidate / institute / company / admin). Returns JWT.
  - ### payload :
    ```json
    {
        "email": "ashwin@mail.com",
        "password": "Abced@12345"
    }
    ```
  - ### Success Response:
    ```json
    {
        "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjo0NSwicm9sZSI6ImNhbmRpZGF0ZSIsInJvbGVfY29kZSI6MTAwLCJlbWFpbCI6ImRldkBnbWFpbC5jb20iLCJleHAiOjE3Nzk1NTM1Nzl9.CEGOyVCBKwvf_cd8Dg0GZ-a1RHj8G3YX5traTC3Ie38",
        "token_type": "bearer",
        "token_data": {
            "user_id": 45,
            "role": "candidate",
            "role_code": 100,
            "email": "dev@gmail.com"
        }
    }
    ```
  - ### Error Response:
    ```json
    {
        "detail": "Invalide User Credentials"
    }
    ```
  - ### Notes:
    - notes if any
##

# 2. Institute

- ## `POST: /institute/onboard_students`
  - ### purpose :
    - Enroll a new student and create their platform account
  - ### payload :
    ```json
    {
        "email": "aaditi@mail.com",
        "name": "Aaditi Sharma",
        "contact_no": "9876543210",
        "dob": "2001-06-15",
        "institute_id": 10,
        "course": "B.Tech CSE",
        "passout_year": 2024,
        "skills": "Python, React, SQL"
    }
    ```
  - ### Success Response:
    ```json
    {
        "message": "Candidate Created Successfully."
    }
    ```
  - ### Error Response (duplicate email):
    ```json
    {
        "detail": "1062 (23000): Duplicate entry 'aaditi@mail.com' for key 'user.email'"
        }
    ```
  - ### Notes:
    - notes if any
##

- ## `GET: /institute/candidate_list`
  - ### purpose :
    - List of all candidates enrolled in the logged-in institute.
  - ### Success Response:
    ```json
    [
        {
            "user_id": 54,
            "role_code": 100,
            "user_name": "Manasi More",
            "user_email": "manasi@gmail.com",
            "candidate_id": 23,
            "course": "Bsc IT",
            "passout_year": 2023,
            "skills": "SQL, Database",
            "institute_id": 10,
            "institute_name": "N M Institute of Technology",
            "institute_email": "admin@nm.com"
        },
        {
            "user_id": 58,
            "role_code": 100,
            "user_name": "Aaditi Sharma",
            "user_email": "aaditi@gmail.com",
            "candidate_id": 24,
            "course": "B.Tech CSE",
            "passout_year": 2023,
            "skills": "Python, React",
            "institute_id": 10,
            "institute_name": "N M Institute of Technology",
            "institute_email": "admin@nm.com"
        },
        {
            "user_id": 59,
            "role_code": 100,
            "user_name": "Rohan Mehta",
            "user_email": "rohan@gmail.com",
            "candidate_id": 25,
            "course": "MBA Finance",
            "passout_year": 2022,
            "skills": "Finance, Excel",
            "institute_id": 10,
            "institute_name": "N M Institute of Technology",
            "institute_email": "admin@nm.com"
        }
    ]
    ```
  - ### Notes:
    - notes if any
##

- ## `GET: /institute/view_profile`
  - ### purpose :
    - full institute profile for logged-in institute. `institute_id` read from JWT
  - ### Success Response:
    ```json
    {
        "institute_info": {
            "institute_id": 10,
            "institute_code": 9654128,
            "user_id": 53,
            "name": "N M Institute of Technology",
            "address": "201, green tower, opp railway station",
            "contact_no": "9968123501",
            "email": "admin@nm.com",
            "verification_status": "Unknown"
        },
        "institute_students": [
            {
            "user_id": 54,
            "candidate_id": 23,
            "emp_id": 17,
            "company_id": 12,
            "student_name": "Manasi More",
            "student_contact": "9656321475",
            "course": "Bsc IT",
            "passout_year": 2023,
            "skills": "SQL, Database",
            "future_plan": "employment",
            "company_name": "BluePeak PRIVATE LIMITED",
            "designation": "SQL Developer"
            },
            {
            "user_id": 58,
            "candidate_id": 24,
            "emp_id": null,
            "company_id": null,
            "student_name": "Aaditi Sharma",
            "student_contact": "9876543210",
            "course": "B.Tech CSE",
            "passout_year": 2023,
            "skills": "Python, React",
            "future_plan": "employment",
            "company_name": null,
            "designation": null
            },
            {
            "user_id": 59,
            "candidate_id": 25,
            "emp_id": null,
            "company_id": null,
            "student_name": "Rohan Mehta",
            "student_contact": "9123456780",
            "course": "MBA Finance",
            "passout_year": 2022,
            "skills": "Finance, Excel",
            "future_plan": "employment",
            "company_name": null,
            "designation": null
            }
        ],
        "dispute_history": []
    }
    ```
  - ### Notes:
    - notes if any
##


# 3. Company

- ## `POST: /company/verify_company`
  - ### purpose :
    - Verify existing company's CIN form inside the dashboard, for the companies with "Unknown" Status
  - ### payload :
    ```json
    {
        "user_name": "string",
        "name": "string",
        "cin": "L16484TN1992PTC203527",
        "address": "string",
        "contact_no": "string",
        "email": "string"
    }
    ```
  - ### Success Response:
    ```json
    {
        "success": true,
        "verified": true,
        "details": {
            "CIN": "L16484TN1992PTC203527",
            "Company Name": "SkyLark LIMITED",
            "ROC Name": "ROC Bangalore",
            "Registration Number": 245819,
            "Date of Incorporation": "17-06-1991",
            "Email Id": "skylark@company.com",
            "Registered Address": "137, Tower, Tech Park, Pune, India",
            "Category": "Company limited by shares",
            "Subcategory": "Government company",
            "Class": "Public",
            "Active compliance": "INACTIVE Non-Compliant",
            "Status": "Active"
        }
    }
    ```
  - ### Notes:
    - only `cin` is used, other fields are there in the schema but ignored by service.
##

- ## `GET: /company/employee_list`
  - ### purpose :
    - list of all employees for logged-in company.
  - ### Success Response:
    ```json
    [
        {
            "user_name": "Manasi Sharma",
            "user_email": "manasi@gmail.com",
            "user_contact": "9656321475",
            "company_name": "BluePeak PRIVATE LIMITED",
            "cin": "U71539DL1998PTC37095",
            "emp_designation": "SQL Developer",
            "joining_date": "2025-01-01",
            "exit_date": "2025-03-01",
            "employment_status": "exit date mismatch"
        },
        ...
    ]
    ```
  - ### Notes:
    - notes if any
##

- ## `GET: /company/view_profile`
  - ### purpose :
    - full company profile for logged-in company. `company_id` is read form JWT
  - ### Success Response:
    ```json
    {
        "company_info": {
            "company_id": 12,
            "cin": "U71539DL1998PTC37095",
            "user_id": 55,
            "name": "BluePeak PRIVATE LIMITED",
            "address": "691, Floor, Tech Park, Chennai, India",
            "contact_no": "8854123658",
            "email": "support@bluepeak.com",
            "verification_status": "Registered"
        },
        "company_employees": [
            {
            "user_id": 54,
            "emp_id": 17,
            "history_id": 17,
            "employee_name": "Manasi Sharma",
            "employee_email": "manasi@gmail.com",
            "employee_contact": "9656321475",
            "designation": "SQL Developer",
            "joining_date": "2025-01-01",
            "exit_date": "2025-03-01",
            "employee_status": "exit date mismatch"
            }
        ],
        "dispute_history": [
            {
            "dispute_id": 8,
            "raised_by_type": "candidate",
            "raised_by_id": 54,
            "raised_against_type": "company",
            "raised_against_id": 12,
            "topic": "Exit date mismatch",
            "description": "Candidate submitted exit date: 2026-05-16. Company submitted: 2025-03-01.",
            "status": "pending",
            "created_on": "2026-05-16T11:21:50",
            "updated_on": "2026-05-16T11:21:50"
            }
        ]
    }
    ```
  - ### Notes:
    - notes if any
##

- ## `POST: /company/joining_initiate`
  - ### purpose :
    - 1st step of joining flow. company sets the official joining date for candidate
  - ### payload :
    ```json
    {
        "user_email": "ashwin@mail.com",
        "designation": "Backend Developer",
        "joining_date": "2023-12-04"
    }
    ```
  - ### Success Response:
    ```json
    {
        "success": true,
        "emp_id": 21,
        "history_id": 21
    }
    ```
  - ### Error Response (duplicate onboarding):
    ```json
    {
        "detail": "This candidate is already onboarded at your company"
    }
    ```
  - ### Error Response (candidate not exist in system)
    ```json
    {
        "detail": "Candidate not found with that email"
    }
    ```
  - ### Notes:
    - notes if any
##

- ## `POST: /company/exit_initiate`
  - ### purpose :
    - 1st Step in exit flow. company sets the official last working day.
  - ### payload :
    ```json
    {
        "user_email": "ashwin@mail.com",
        "exit_date": "2024-06-05"
    }
    ```
  - ### Success Response:
    ```json
    {
        "success": true,
        "message": "Exit initiated. Candidate must confirm their exit date."
    }
    ```
  - ### Error Response (joining incomplete):
    ```json
    {
        "detail": "Cannot initiate exit — joining not completed. Status: 'joining confirmed'"
    }
    ```
  - ### Notes:
    - notes if any
##

# 4. Candidate [role: candidate | auth required]

- ## `GET: /candidates/view_profile`
  - ### purpose :
    - Shows the profile for logged-in candidate. `user_id` is read form JWT. so payload is not requierd
  - ### Success Response:
    ```json
    {
        "personal_info": {
            "name": "Danny Roy",
            "email": "Danny@gmail.com",
            "contact_no": "9963200147",
            "dob": "2001-01-20"
        },
        "acdemic_info": [
            {
            "candidate_id": 22,
            "course": "M. Tech",
            "passout_year": 2025,
            "skills": "SQL, ML, Power Bi",
            "institute_name": "Baka Institute of Technology",
            "institute_email": "admin@bit.com",
            "institute_contact": "9012124736",
            "institue_legal_status": "Unknown",
            "future_plan": "employment"
            }
        ],
        "employment_history": [
            {
            "emp_id": 15,
            "company_id": 8,
            "name": "rudra",
            "cin": "UL12547896541232",
            "joining_date": "2025-05-01",
            "exit_date": null,
            "status": "joining initiated"
            }
        ],
        "dispute_history": [
            {
            "dispute_id": 6,
            "raised_by_type": "candidate",
            "raised_by_id": 49,
            "raised_against_type": "company",
            "raised_against_id": 8,
            "topic": "Joining date mismatch",
            "description": "Candidate submitted joining date: 2025-05-10. Company submitted: 2025-05-01.",
            "status": "resolved",
            "created_on": "2026-05-10T21:05:12",
            "updated_on": "2026-05-10T21:14:40"
            }
        ]
    }
    ```
  - ### Notes:
    - notes if any
##

- ## `GET: /candidates/disputes_list`
  - ### purpose :
    - display dusputes in the generated by or against candidate
  - ### Success Response:
    ```json
    [
        {
            "dispute_id": 8,
            "raised_by_type": "candidate",
            "raised_by_id": 54,
            "raised_against_type": "company",
            "raised_against_id": 12,
            "topic": "Exit date mismatch",
            "description": "Candidate submitted exit date: 2026-05-16. Company submitted: 2025-03-01.",
            "status": "pending",
            "created_on": "2026-05-16T11:21:50",
            "updated_on": "2026-05-16T11:21:50"
        },
        {
            "dispute_id": 7,
            "raised_by_type": "candidate",
            "raised_by_id": 45,
            "raised_against_type": "company",
            "raised_against_id": 10,
            "topic": "Joining documents incomplete",
            "description": "Candidate has not received: id_card_issued",
            "status": "pending",
            "created_on": "2026-05-11T13:07:13",
            "updated_on": "2026-05-11T13:07:13"
        },
        {
            "dispute_id": 6,
            "raised_by_type": "candidate",
            "raised_by_id": 49,
            "raised_against_type": "company",
            "raised_against_id": 8,
            "topic": "Joining date mismatch",
            "description": "Candidate submitted joining date: 2025-05-10. Company submitted: 2025-05-01.",
            "status": "resolved",
            "created_on": "2026-05-10T21:05:12",
            "updated_on": "2026-05-10T21:14:40"
        },
        ...
    ]
    ```
  - ### Notes:
    - for now there's no filter on this endpoint it showing all the disputes in the system
##

- ## `POST: /candidates/joining_confirm`
  - ### purpose :
    - 2nd Step in the joining flow. Candidate submit their version of the joining date. system compares with company's date
  - ### payload :
    ```json
    {
        "company_id": 1,
        "joining_date": "2023-12-04"
    }
    ```
  - ### Success Response:
    ```json
    {
        "success": true,
        "message": "Joining date confirmed. Please complete document verification."
    }
    ```
  - ### Mismatch Response (dispute auto raised):
    ```json
    {
        "success": false,
        "error": "Joining date does not match company records. A dispute has been raised.",
        "company_date": "2023-12-19",
        "your_date": "2023-12-04",
        "dispute_id": 5
    }
    ```
  - ### Error Response (wrong status):
    ```json
    {
        "detail": "Cannot confirm joining — current status is 'joining confirmed'"
    }
    ```
  - ### Notes:
    - notes if any
##

- ## `POST: /candidates/joining_documents`
  - ### purpose :
    - 3rd step of joining flow. candidate submints the checklist of joining documents. Missing reveived document tirgger a dispute
  - ### payload :
    ```json
    {
        "company_id": 1,
        "offer_letter": true,
        "appointment_letter": true,
        "salary_breakdown": true,
        "nda_agreement": false,
        "id_card_issued": true,
        "aadhaar_submitted": true,
        "pan_submitted": true,
        "form_11_submitted": true,
        "bank_details_submitted": true,
        "photos_submitted": true,
        "education_docs_submitted": true,
        "prev_exp_docs_submitted": false,
        "notes": "NDA not provided yet"
    }
    ```
  - ### Success Response:
    ```json
    {
        "success": true,
        "message": "Joining process complete. All documents verified."
    }
    ```
  - ### Missing docs Response:
    ```json
    {
        "success": false,
        "error": "Some documents are missing. A dispute has been raised.",
        "missing_documents": ["nda_agreement"],
        "dispute_id": 6
    }
    ```
  - ### Notes:
    - notes if any
##

- ## `POST: /candidates/exit_confirm`
  - ### purpose :
    - 2nd step of exit flow. candidate submits their version of the exit date
  - ### payload :
    ```json
    {
        "company_id": 1,
        "exit_date": "2024-06-05"
    }
    ```
  - ### Success Response:
    ```json
    {
        "success": true,
        "message": "Exit date confirmed. Please verify your exit documents."
    }
    ```
  - ### Error Response (date mismatch):
    ```json
    {
        "success": false,
        "error": "Exit date does not match company records. A dispute has been raised.",
        "company_date": "2024-06-10",
        "your_date": "2024-06-05",
        "dispute_id": 7
    }
    ```
  - ### Notes:
    - notes if any
##

- ## `POST: /candidates/exit_documents`
  - ### purpose :
    - 3rd step of the exit flow. candidate submits exit documents checklist. missing recieved document(legal entitlements) triggers a dispute
  - ### payload :
    ```json
    {
        "company_id": 1,
        "experience_letter": true,
        "relieving_letter": true,
        "fnf_settlement": false,
        "salary_slip_last3": true,
        "pf_contribution_letter": true,
        "no_dues_certificate": true,
        "form_16": true,
        "resignation_email": true,
        "company_id_returned": true,
        "company_assets_returned": true,
        "nda_compliance": true,
        "notes": "F&F pending from accounts team"
    }
    ```
  - ### Success Response:
    ```json
    {
        "success": true,
        "message": "Exit process complete. Employment record is now fully verified."
    }
    ```
  - ### Error Response (missing docs):
    ```json
    {
        "success": false,
        "error": "Some exit documents are missing. A dispute has been raised.",
        "missing_documents": ["fnf_settlement"],
        "dispute_id": 8
    }
    ```
  - ### Notes:
    - notes if any
##

# 5. Admin
- ## `GET: /admin/candidate_list`
  - ### purpose :
    - list all the candidates on the platform
  - ### Success Response :
    ```json
    [
        {
            "user_id": 49,
            "role_code": 100,
            "user_name": "Danny Roy",
            "user_email": "Danny@gmail.com",
            "candidate_id": 22,
            "course": "M. Tech",
            "passout_year": 2025,
            "skills": "SQL, ML, Power Bi",
            "institute_id": 9,
            "institute_name": "Baka Institute of Technology",
            "institute_email": "admin@bit.com"
        },
        {
            "user_id": 54,
            "role_code": 100,
            "user_name": "Manasi More",
            "user_email": "manasi@gmail.com",
            "candidate_id": 23,
            "course": "Bsc IT",
            "passout_year": 2023,
            "skills": "SQL, Database",
            "institute_id": 10,
            "institute_name": "N M Institute of Technology",
            "institute_email": "admin@nm.com"
        },
        ...
    ]
    ```
  - ### Notes:
    - for now its just a placeholder endpoint with no filterations and other admin operations
##

- ## `GET: /admin/institute_list`
  - ### purpose :
    - list all the institutes on platform
  - ### Success Response:
    ```json
    [
        {
            "institute_id": 9,
            "institute_code": 5874123,
            "user_id": 42,
            "name": "Baka Institute of Technology",
            "address": "Block 4, near Jambo king",
            "contact_no": "9012124736",
            "email": "admin@bit.com",
            "verification_status": "Unknown"
        },
        {
            "institute_id": 10,
            "institute_code": 9654128,
            "user_id": 53,
            "name": "N M Institute of Technology",
            "address": "201, green tower, opp railway station",
            "contact_no": "9968123501",
            "email": "admin@nm.com",
            "verification_status": "Unknown"
        },
        ...
    ]
    ```
  - ### Notes:
    - for now its just a placeholder endpoint with no filterations and other admin operations
##

- ## `GET: /admin/employee_list`
  - ### purpose :
    - list all the employees on the platform
  - ### Success Response:
    ```json
    [
        {
            "user_name": "John Doe",
            "user_contact": "9899652107",
            "user_email": "john@gmail.com",
            "cin": "U30431MH2022PLC214570",
            "company_name": "8848 Digital",
            "emp_designation": "ERPNext Developer",
            "joining_date": "2026-01-05",
            "exit_date": "2026-03-31",
            "employment_status": "exit completed"
        },
        {
            "user_name": "Elon Must",
            "user_contact": "8874213650",
            "user_email": "elon@gmail.com",
            "cin": "UL12547896541232",
            "company_name": "rudra",
            "emp_designation": "Assistent Director",
            "joining_date": "2010-01-01",
            "exit_date": null,
            "employment_status": "joining completed"
        },
    ]
    ```
  - ### Notes:
    - for now its just a placeholder endpoint with no filterations and other admin operations
##

- ## `GET: /admin/company_list`
  - ### purpose :
    - lists all the companies on the platform
  - ### Success Response:
    ```json
    [
        {
            "company_id": 11,
            "cin": "L61599RJ2005PLC189112",
            "name": "DataLynx Limited",
            "address": "525, Tower, Tech Park, Pune, India",
            "contact_no": "9852001720",
            "email": "admin@datalynx.com",
            "verification_status": "Unknown"
        },
        {
            "company_id": 12,
            "cin": "U71539DL1998PTC37095",
            "name": "BluePeak PRIVATE LIMITED",
            "address": "691, Floor, Tech Park, Chennai, India",
            "contact_no": "8854123658",
            "email": "support@bluepeak.com",
            "verification_status": "Registered"
        },
        {
            "company_id": 13,
            "cin": "L16484TN1992PTC203527",
            "name": "SkyLark LIMITED",
            "address": "137, Tower, Tech Park, Pune, India",
            "contact_no": "8221034750",
            "email": "support@skylark.com",
            "verification_status": "Registered"
        },
        ...
    ]
    ```
  - ### Notes:
    - for now its just a placeholder endpoint with no filterations and other admin operations
##

- ## `GET: /admin/disputes_list`
  - ### purpose :
    - lists all the disputes on platform
  - ### Success Response:
    ```json
    [
        {
            "dispute_id": 8,
            "raised_by_type": "candidate",
            "raised_by_id": 54,
            "raised_against_type": "company",
            "raised_against_id": 12,
            "topic": "Exit date mismatch",
            "description": "Candidate submitted exit date: 2026-05-16. Company submitted: 2025-03-01.",
            "status": "pending",
            "created_on": "2026-05-16T11:21:50",
            "updated_on": "2026-05-16T11:21:50"
        },
        {
            "dispute_id": 7,
            "raised_by_type": "candidate",
            "raised_by_id": 45,
            "raised_against_type": "company",
            "raised_against_id": 10,
            "topic": "Joining documents incomplete",
            "description": "Candidate has not received: id_card_issued",
            "status": "pending",
            "created_on": "2026-05-11T13:07:13",
            "updated_on": "2026-05-11T13:07:13"
        },
        ...
    ]
    ```
  - ### Notes:
    - for now its just a placeholder endpoint with no filterations and other admin operations
##

- ## `PUT: /admin/disputes/{dispute_id}`
  - ### purpose :
    - admin resolves, rejects or marks a dispute under review
  - ### payload :
    ```json
    {
        "status": "resolved",
        "resolution_note": "Both parties submitted matching dates on review. Company record accepted."
    }
    ```
  - ### Success Response:
    ```json
    {
        "success": true,
        "message": "Dispute updated to 'resolved'"
    }
    ```
  - ### Error Response:
    ```json
    {
        "detail": "Invalid status. Must be one of: ['pending', 'under review', 'resolved', 'rejected']"
    }
    ```
  - ### Notes:
    - notes if any
##

# 6. Public Endpoints [No auth required]

- ## `GET: /public/stats`
  - ### purpose :
    - Platform-wide Aggregated states of landing page
  - ### Success Response:
    ```json
    {
        "verified_companies": 3,
        "institutes": 10,
        "candidates": 24,
        "disputes_total": 8,
        "disputes_resolved": 1,
        "safe_joinings": 0
    }
    ```
##

- ## `GET: /public/institute_list`
  - ### purpose :
    - Lists all institutes/colleges with public filed only
  - ### Success Response:
    ```json
    [
        {
            "institute_id": 3,
            "name": "Greenfield Institute of Technology",
            "address": "Sector 12, Kharghar, Navi Mumbai",
            "verification_status": "Unknown"
        },
        {
            "institute_id": 4,
            "name": "Riverview College of Engineering",
            "address": "MG Road, Baner, Pune",
            "verification_status": "Unknown"
        },
        ...
    ]
    ```
##

- ## `GET: /public/institute/{institute_id}`
  - ### purpose :
    - public institute profile. this represents placement stats and dispute summary. only general fields
  - ### payload :
    ```json
    {
        "institute_id": "10"
    }
    ```
  - ### Success Response:
    ```json
    {
        "institute_info": {
            "institute_id": 10,
            "name": "N M Institute of Technology",
            "address": "201, green tower, opp railway station",
            "verification_status": "Unknown"
        },
        "students": [
            {
            "student_name": "Manasi More",
            "course": "Bsc IT",
            "passout_year": 2023,
            "company_name": "BluePeak PRIVATE LIMITED",
            "designation": "SQL Developer"
            },
            {
            "student_name": "Aaditi Sharma",
            "course": "B.Tech CSE",
            "passout_year": 2023,
            "company_name": null,
            "designation": null
            },
            {
            "student_name": "Rohan Mehta",
            "course": "MBA Finance",
            "passout_year": 2022,
            "company_name": null,
            "designation": null
            }
        ],
        "placement_stats": {
            "total": 3,
            "placed": 1,
            "placement_rate": 33.3,
            "by_course": [
            {
                "course": "Bsc IT",
                "count": 1
            },
            {
                "course": "B.Tech CSE",
                "count": 1
            },
            {
                "course": "MBA Finance",
                "count": 1
            }
            ]
        },
        "dispute_summary": {
            "total": 0,
            "pending": 0,
            "resolved": 0,
            "under_review": 0
        }
    }
    ```
  - ### Error Response (non exitsing institute_id):
    ```json
    {
    "detail": "Company not found"
    }
    ```
  - ### Notes:
    - need to update error message
##

- ## `GET: /public/company_list`
  - ### purpose :
    - List all the companies on the platform with public fields only
  - ### Success Response:
    ```json
    [
        {
            "company_id": 1,
            "name": "TechNova CONSULTANCY SERVICES PRIVATE LIMITED",
            "cin": "U62481UP2012PLC444424",
            "address": "310, Floor, Eureka Tower, Bangalore, India",
            "verification_status": "Registered"
        },
        {
            "company_id": 2,
            "name": "NeoGen INFOTECH PRIVATE LIMITED",
            "cin": "U39431MH2022PLC635155",
            "address": "168, Tower, Tech Park, Delhi, India",
            "verification_status": "Unknown"
        },
        ...
    ]
    ```
##

- ## `GET: /public/company/{company_id}`
  - ### purpose :
    - purpose of the end point
  - ### payload :
    ```json
    {
        "company_id": 1,
    }
    ```
  - ### Success Response:
    ```json
    {
        "company_info": {
            "company_id": 1,
            "name": "TechNova CONSULTANCY SERVICES PRIVATE LIMITED",
            "cin": "U62481UP2012PLC444424",
            "address": "310, Floor, Eureka Tower, Bangalore, India",
            "verification_status": "Registered"
        },
        "employee_count": 7,
        "active_employees": 6,
        "dispute_summary": {
            "total": 2,
            "pending": 2,
            "resolved": 0,
            "under_review": 0
        }
    }
    ```
  - ### Error Response (non existing company_id):
    ```json
    {
        "detail": "Company not found"
    }
    ```
  - ### Notes:
    - notes if any
##

- ## `POST: /public/register/comapny`
  - ### purpose :
    - register a new company. CIN is verified against MCA dateset during registration and based on that verification_status is set automatically.
  - ### payload :
    ```json
    {
        "user_name": "Rahul Mehta",
        "name": "SkyLark LIMITED",
        "cin": "L16484TN1992PTC203587",
        "address": "137, Tower, Tech Park, Pune",
        "contact_no": "8547621458",
        "email": "skylark@company.com"
    }
    ```
  - ### Success Response:
    ```json
    {
        "message": "Company registered successfully. Please login with your email.",
        "company_id": 16
    }
    ```
  - ### Error Response (duplicate key (cin or email)):
    ```json
    {
        "detail": "1062 (23000): Duplicate entry 'L16484TN1992PTC203527' for key 'companies.cin'"
    }
    ```
  - ### Notes:
    - notes if any
##

- ## `POST: /public/register/institute`
  - ### purpose :
    - register new institute or college
  - ### Success Response:
    ```json
    {
        "message": "Institute registered successfully. Please login with your email.",
        "institute_id": 11
    }
    ```
  - ### Error Response (duplicate institute_code or email):
    ```json
    {
        "detail": "1062 (23000): Duplicate entry 'admin@sut.edu.in' for key 'users.email'"
    }
    ```
  - ### Notes:
    - for now this endpoint uses the same pydantic schema as company register
    - in cin (institute_code) its only accepting integer values
##

- ## `POST: /public/verify/company`
  - ### purpose :
    - purpose of the end point
  - ### payload :
    ```json
    {
        "cin": "L16484TN1992PTC203527"
    }
    ```
  - ### Success Response:
    ```json
    {
        "success": true,
        "verified": true,
        "details": {
            "CIN": "L16484TN1992PTC203527",
            "Company Name": "SkyLark LIMITED",
            "ROC Name": "ROC Bangalore",
            "Registration Number": 245819,
            "Date of Incorporation": "17-06-1991",
            "Email Id": "skylark@company.com",
            "Registered Address": "137, Tower, Tech Park, Pune, India",
            "Category": "Company limited by shares",
            "Subcategory": "Government company",
            "Class": "Public",
            "Active compliance": "INACTIVE Non-Compliant",
            "Status": "Active"
        }
    }
    ```
  - ### Error Response (cin not found):
    ```json
    {
        "success": true,
        "verified": false,
        "details": null
    }
    ```
  - ### Notes:
    - for now I'm using dummy MCA dataset
##

# 7. Notifications

- ## `GET: /notifications`
  - ### purpose :
    - fetch the latest notifications for logged-in user
  - ### Success Response:
    ```json
    [
        {
            "notification_id": 6,
            "type": "DISPUTE_RAISED",
            "title": "Dispute raised — exit date mismatch",
            "message": "Your exit date (2026-05-16) doesn't match the company's record (2025-03-01). Dispute #8 has been raised.",
            "is_read": 0,
            "created_on": "2026-05-16 11:21:50"
        },
        {
            "notification_id": 5,
            "type": "EXIT_INITIATED",
            "title": "Your exit has been initiated",
            "message": "Your employer has set your last working day as 2025-03-01. Please confirm your exit date.",
            "is_read": 1,
            "created_on": "2026-05-16 11:20:32"
        },
        ...
    ]
    ```
  - ### Notes:
    - notes if any
##

- ## `GET: /notifications/unread_count`
  - ### purpose :
    - unread count for bell icon on frontend. polled every 30 seconds
  - ### Success Response:
    ```json
    {
        "count": 1
    }
    ```
  - ### Notes:
    - notes if any
##

- ## `GET: /notifications/mark_all_read`
  - ### purpose :
    - Mark all notifications as read for the logged-in user.
  - ### Success Response:
    ```json
    {
        "message": "All notifications marked as read"
    }
    ```
  - ### Notes:
    - notes if any
##

- ## `GET: /notifications/{notification_id}/read`
  - ### purpose :
    - Mark a single notification as read.
  - ### Success Response:
    ```json
    {
        "message": "Notification marked as read"
    }
    ```
  - ### Notes:
    - notes if any
##

#