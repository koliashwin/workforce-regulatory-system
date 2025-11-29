# API Payloads & Responses

<!-- this file will contain API Payloads and Responces along with the mistakes I found in the curretn API version-->

<!-- template

## `request_type: /endpoint`
- ### purpose : 
  - description
- ### Payload :
```json
{# json payload}
```
- ### Ok Response :
```json
{# Response message}
```
- ### Ideal Payload :
```json
{# in case if API still nees some tweeks (optional)}
```
# -->

## 1. `POST: /institute/onboard_students` 

- ### purpose : 
  - to create new candidate in the system

- ### Payload :

```json
{
  "role_id": 100,
  "email": "ashwin1@mail.com",
  "password_hash": "string",
  "name": "Ashwin Koli",
  "contact_no": "9569876921",
  "dob": "1999-08-04",
  "created_on": "string",               # extra
  "updated_on": "string",               # extra
  "last_login": "string",               # extra
  "user_id": 0,                         # extra
  "institute_id": 0,                    # should be used insted of institute_email
  "course": "MCA",
  "passout_year": "2023-02-20",         # this should be year only
  "skills": "Java, Python, C++, SQL",
  "institute_name": "string",           # extra
  "institute_email": "clg1@mail.com",   # need to change in future update
  "institute_code": 0                   # extra
}
```

- ### Ok Response :

```json
{
  "message": "Candidate Created Successfully."
}
```

- ### Ideal Payload structure (not present yet):
```json
{
  "role_id": 100,
  "email": "ashwin1@mail.com",
  "password_hash": "string",
  "name": "Ashwin Koli",
  "contact_no": "9569876921",
  "dob": "1999-08-04",
  "institute_id": 1,
  "course": "MCA",
  "passout_year": "2023",
  "skills": "Java, Python, C++, SQL",
}
```
#


## 2. `GET: /institute/candidate_list`
- ### purpose : 
  - to veiw list of all candidates
- ### Ok Response :
```json
[
  {
    "user_id": 1,
    "role_id": 100,
    "user_name": "Ashwin Koli",
    "user_email": "ashwin1@mail.com",
    "candidate_id": 1,
    "course": "MCA",
    "skills": "Java, Python, C++, SQL",
    "institute_id": 1,
    "institute_name": "XYZ college 1",
    "institute_email": "clg1@mail.com"
  }
]
```
#


## 3. `POST: /company/register`
- ### purpose : 
  - to register company on platform
- ### Payload :
```json
{
  "name": "SkyLark LIMITED",
  "cin": "L16484TN1992PTC203527",
  "address": "137, Tower, Tech Park, Pune, India",
  "contact_no": "8547621458",
  "email": "skylark@company.com",
  "verification_status": "string"           # extra
}
```
- ### Ok Response :
```json
{
  "message": "Company Created Successfully"
}
```
- ### Ideal Payload :
```json
{
  "name": "SkyLark LIMITED",
  "cin": "L16484TN1992PTC203527",
  "address": "137, Tower, Tech Park, Pune, India",
  "contact_no": "8547621458",
  "email": "skylark@company.com",
}
```
#


## 4. `GET: /company/company_list`
- ### purpose : 
  - view details of all the companies
- ### Ok Response :
```json
[
  {
    "company_id": 1,
    "cin": "L16484TN1992PTC203527",
    "name": "SkyLark LIMITED",
    "address": "137, Tower, Tech Park, Pune, India",
    "contact_no": "8547621458",
    "email": "skylark@company.com",
    "verification_status": "Unknown"
  },
  {
    "company_id": 2,
    "cin": "U40572UP2018PLC453423",
    "name": "DataLynx SOLUTIONS LIMITED ",
    "address": "426, Tower, Cyber City, Delhi, India",
    "contact_no": "8547256485",
    "email": "datalynx@yahoo.com",
    "verification_status": "Unknown"
  }
]
```
#

## 5. `POST: /company/verify_company`
- ### purpose : 
  - verify the company via `cin` (Dummy version)
- ### Payload :
```json
{
  "name": "string",                     # extra
  "cin": "U40572UP2018PLC453423",
  "address": "string",                  # extra
  "contact_no": "string",               # extra
  "email": "string",                    # extra
  "verification_status": "string"       # extra
}
```
- ### varifed Response :
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
- ### not varifed Response :
```json
{
  "success": true,
  "verified": false,
  "details": null
}
```
- ### Ideal Payload :
```json
{
  "cin": "U40572UP2018PLC453423"
}
```
#

## 6. `POST: /comapny/onboard_employee`
- ### purpose : 
  - safely onboard the candidate in company
- ### Payload :
```json
{
  "company_cin": "L16484TN1992PTC203527",
  "user_email": "ashwin1@mail.com",     # this should be user_id
  "designation": "Backend Developer",
  "joining_date": "2023-12-04",
  "exit_date": "date",                  # extra
  "status": "string"                    # extra
}
```
- ### Ok Response :
```json
{
  "success": true,
  "user_id": 1,
  "compnay_id": 1,
  "emp_id": 1,
  "emp_history_id": 1
  # need one generic message. eg('Employee Onboarded')
}
```
- ### Ideal Payload :
```json
{
  "company_cin": "L16484TN1992PTC203527",
  "user_id": 1,
  "designation": "Backend Developer",
  "joining_date": "2023-12-04"
}
```
#

## 7. `POST: /candidates/joining_confirm`
- ### purpose : 
  - candidate confirms joining date
- ### Payload :
```json
{
  "company_id": 1,
  "user_id": 1,
  "date": "2023-11-19"
}
```
- ### Ok Response :
```json
{
  "message": "Employee Joined safely"
}
```
- ### Date Mismatch Response :
```json
{
  "detail": "Joining date didn't match"
  # current code auto generates a dispute entry in such cases
}
```
#

## 8. `GET: /comapny/employee_list`
- ### purpose : 
  - Get all employees list
- ### Ok Response :
```json
[
  {
    "user_name": "Ashwin Koli",
    "user_contact": "9569876921",
    "user_email": "ashwin1@mail.com",
    "cin": "L16484TN1992PTC203527",
    "company_name": "SkyLark LIMITED",
    "emp_designation": "Backend Developer",
    "joining_date": "2023-12-04",
    "exit_date": null,
    "employment_status": "Joined Safely"
  }
]
```
#

## 9. `POST: /company/employee_exit`
- ### purpose : 
  - Comapny updates the employee's exit date
- ### Payload :
```json
{
  "company_cin": "L16484TN1992PTC203527",
  "user_email": "ashwin1@mail.com",     # should be user_id
  "designation": "string",              # extra
  "joining_date": "date",               # extra
  "exit_date": "2024-06-05",
  "status": "string"                    # extra
}
```
- ### Ok Response :
```json
{
  "success": true,
  "message": "Exit date updated by company",
  "user_id": 1,
  "emp_id": 1,
  "compnay_id": 1,
  "emp_history_id": 0
}
```
- ### Ideal Payload :
```json
{
  "company_cin": "L16484TN1992PTC203527",
  "user_id": 1,
  "exit_date": "2024-06-05",
}
```
#

## 10. `POST: /candidates/exit_confirm`
- ### purpose : 
  - confirm the exit date from employee side
- ### Payload :
```json
{
  "company_id": 1,
  "user_id": 1,
  "date": "2024-06-05"
}
```
- ### Ok Response :
```json
{
  "message": "Employee Exits safely"
}
```
- ### Date Mismatch Response:
```json
{
  "detail": "Exit date didn't match"
  # current code will auto generate dispute for such cases
}
```
#

## 11. `GET: /candidates/dispute_list`
- ### purpose : 
  - fetch the list of all disputes
- ### Ok Response :
```json
[
  {
    "dispute_id": 1,
    "raised_by_type": "candidate",
    "raised_by_id": 1,
    "raised_against_type": "company",
    "raised_against_id": 1,
    "topic": "Joining Date mismatch",
    "description": null,
    "status": "pending",
    "created_on": "2025-11-19T12:36:30",
    "updated_on": "2025-11-19T12:36:30"
  },
  {
    "dispute_id": 2,
    "raised_by_type": "candidate",
    "raised_by_id": 1,
    "raised_against_type": "company",
    "raised_against_id": 1,
    "topic": "Exit Date mismatch",
    "description": null,
    "status": "pending",
    "created_on": "2025-11-19T12:55:57",
    "updated_on": "2025-11-19T12:55:57"
  },
  {
    "dispute_id": 3,
    "raised_by_type": "candidate",
    "raised_by_id": 5,
    "raised_against_type": "company",
    "raised_against_id": 1,
    "topic": "Joining Date mismatch",
    "description": null,
    "status": "pending",
    "created_on": "2025-11-26T21:15:22",
    "updated_on": "2025-11-26T21:15:22"
  }
]
```
#

## 12. `GET: /candidates/view_profile`
- ### purpose : 
  - fetch details of single candidate
- ### payload :
```json
{
    "user_id" : 1
}
```
- ### Ok Response :
```json
{
  "personal_info": {
    "name": "Ashwin Koli",
    "email": "ashwin1@mail.com",
    "contact_no": "9569876921",
    "dob": "1999-08-04"
  },
  "acdemic_info": [
    {
      "candidate_id": 1,
      "course": "MCA",
      "passout_year": "2023-02-20",
      "skills": "Java, Python, C++, SQL",
      "institute_name": "XYZ college 1",
      "institute_email": "clg1@mail.com",
      "institute_contact": "7845987456",
      "institue_legal_status": "Registered",
      "future_plan": "employment"
    }
  ],
  "employment_history": [
    {
      "emp_id": 1,
      "company_id": 1,
      "name": "SkyLark LIMITED",
      "cin": "L16484TN1992PTC203527",
      "joining_date": "2023-12-04",
      "exit_date": "2024-06-05",
      "status": "Safe Exit"
    }
  ],
  "dispute_history": [
    {
      "dispute_id": 2,
      "raised_by_type": "candidate",
      "raised_by_id": 1,
      "raised_against_type": "company",
      "raised_against_id": 1,
      "topic": "Exit Date mismatch",
      "description": null,
      "status": "pending",
      "created_on": "2025-11-19T12:55:57",
      "updated_on": "2025-11-19T12:55:57"
    },
    {
      "dispute_id": 1,
      "raised_by_type": "candidate",
      "raised_by_id": 1,
      "raised_against_type": "company",
      "raised_against_id": 1,
      "topic": "Joining Date mismatch",
      "description": null,
      "status": "pending",
      "created_on": "2025-11-19T12:36:30",
      "updated_on": "2025-11-19T12:36:30"
    }
  ]
}
```

#

## 13. `GET: /company/view_profile`
- ### purpose : 
  - fetch details of single company
- ### payload :
```json
{
    "company_id" : 1
}
```
- ### Ok Response :
```json
{
  "company_info": {
    "company_id": 1,
    "cin": "L16484TN1992PTC203527",
    "name": "SkyLark LIMITED",
    "address": "137, Tower, Tech Park, Pune, India",
    "contact_no": "8547621458",
    "email": "skylark@company.com",
    "verification_status": "Registered"
  },
  "company_employees": [
    {
      "user_id": 1,
      "emp_id": 1,
      "history_id": 1,
      "employee_name": "Ashwin Koli",
      "employee_email": "ashwin1@mail.com",
      "employee_contact": "9569876921",
      "designation": "Backend Developer",
      "joining_date": "2023-12-04",
      "exit_date": "2024-06-05",
      "employee_status": "Safe Exit"
    },
    {
      "user_id": 5,
      "emp_id": 2,
      "history_id": 2,
      "employee_name": "Test User 2",
      "employee_email": "test2@mail.com",
      "employee_contact": "8974582350",
      "designation": "UI/UX Developer",
      "joining_date": "2024-01-01",
      "exit_date": null,
      "employee_status": "Joined Safely"
    }
  ],
  "dispute_history": [
    {
      "dispute_id": 3,
      "raised_by_type": "candidate",
      "raised_by_id": 5,
      "raised_against_type": "company",
      "raised_against_id": 1,
      "topic": "Joining Date mismatch",
      "description": null,
      "status": "pending",
      "created_on": "2025-11-26T21:15:22",
      "updated_on": "2025-11-26T21:15:22"
    },
    {
      "dispute_id": 2,
      "raised_by_type": "candidate",
      "raised_by_id": 1,
      "raised_against_type": "company",
      "raised_against_id": 1,
      "topic": "Exit Date mismatch",
      "description": null,
      "status": "pending",
      "created_on": "2025-11-19T12:55:57",
      "updated_on": "2025-11-19T12:55:57"
    },
    {
      "dispute_id": 1,
      "raised_by_type": "candidate",
      "raised_by_id": 1,
      "raised_against_type": "company",
      "raised_against_id": 1,
      "topic": "Joining Date mismatch",
      "description": null,
      "status": "pending",
      "created_on": "2025-11-19T12:36:30",
      "updated_on": "2025-11-19T12:36:30"
    }
  ]
}

```

## 14. `GET: /institute/view_profile`
- ### purpose : 
  - fetch details of single institute
- ### payload :
```json
{
    "institute_id" : 1
}
```
- ### Ok Response :
```json
{
  "institute_info": {
    "institute_id": 1,
    "name": "XYZ college 1",
    "address": "PQ street, opp. AB mall",
    "contact_no": "7845987456",
    "email": "clg1@mail.com",
    "verification_status": "Registered"
  },
  "institute_students": [
    {
      "user_id": 1,
      "candidate_id": 1,
      "emp_id": 1,
      "company_id": 1,
      "student_name": "Ashwin Koli",
      "student_contact": "9569876921",
      "course": "MCA",
      "passout_year": "2023-02-20",
      "skills": "Java, Python, C++, SQL",
      "future_plan": "employment",
      "company_name": "SkyLark LIMITED",
      "designation": "Backend Developer"
    },
    {
      "user_id": 5,
      "candidate_id": 5,
      "emp_id": 2,
      "company_id": 1,
      "student_name": "Test User 2",
      "student_contact": "8974582350",
      "course": "B. Tech",
      "passout_year": "2022-02-02",
      "skills": "Javascipt, HTML/CSS",
      "future_plan": "employment",
      "company_name": "SkyLark LIMITED",
      "designation": "UI/UX Developer"
    },
    {
      "user_id": 4,
      "candidate_id": 4,
      "emp_id": 3,
      "company_id": 3,
      "student_name": "Test User",
      "student_contact": "8974587890",
      "course": "M. Tech",
      "passout_year": "2023-02-02",
      "skills": "Python, Django",
      "future_plan": "employment",
      "company_name": "NeoGen INFOTECH PRIVATE LIMITED",
      "designation": "UI Developer"
    }
  ],
  "dispute_history": []
}

```