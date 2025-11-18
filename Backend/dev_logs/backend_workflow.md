# Backend Workflow

<!-- this file will contain the infomation/workflows of the implemented features -->

## Basic API workflow (no ORM approch)
- ### General Workflow :
  - **schema/** → **services/** → **routes/** → **main.py**

- ### Deatails:
  - create the Schemas for respective DB tables. its best to have 2 pydentic schemas for each model/table.
    - 1 for creating/updating data (eg. UserCreate)
    - 1 for retriving data (eg. UserResponse)
  - create the service as per requirment. it basicly a logic regarding how & what you want to store/retrive from DB
  - create endpoints into routes and call the required service functions under those endpoints
  - map the routes and call them from main.py file
#

## College Onboarding Candidates
- ### Workflow :
  - **schema/candidates.py** → **services/candidates.py** → **routes/institute_routes.py** → **routes/router.py** → **main.py**

- ### Details :
  - **schema/candidates.py :**
    - created 2 schema classes :
      - `CandidateCreate` : used for posting data into database
      - `CandidateResponse` : used for fetching specific data from database (a kind of validation layer)
  - **services/candidates.py :**
    - created 2 functions, they contain logic on how to post and retirve data:
      1. `clg_onboard_candidate(data)` : 
         - this function will post data into 2 database tables(**users, candidates**) with following steps:
           1. Fetch the reference key `institute_id` of the college from **institutes** table using institute_email (will update this to institure_code in future)
           2. insert the relevent data into the **users** table.
           3. get the id of the recently inserted data `user_id`.
           4. finally insert the remaining data into the **candidates** table along with `institute_id` and `user_id`
           5. basic error handling
        #
      2.  `all_candidates_list()` :
          - this function will fetch the list of all the candidates and their academic details from 3 tables (**users, candidates, institutes**) with following steps:
            1. fetch the candidates data from 3 tables (**users, candidates, institutes**) using join query
            2. store the retrived data into a variable `results`
            3. then retrun it
            4. basic error handling
        # 
  - **routes/institute_routes.py :**
    - created an APIrouter 
    - 2 endpoints : `@router.post('/onboard_students')` , `@router.get('/candidate_list', response_model=list[CandidateResponse])`
    - 2 functions for respective endpoints as follows
      1. `def create_candidate(candidate: CandidateCreate)` :
         - will recieve the payload from the user in the format defined in schema `CandidateCreate`
         - call the `clg_onboard_candidate(candidate)` function from **services/candidates.py**, pass the payload/data and store the data into database
         - basic HTTP exceptions handling
        #
      2. `def candidate_list()`:
         - call the `all_candidates_list()` function form **services/candidates.py** 
         - retrive the data and display it.
         - basic HTTP exceptions handling
       #
  - **routes/router.py:** 
    - include the institute routes into this file 
#

## Comapny Registration

- ### workflow :
  - **schema/companies.py → services/companies.py → routes/company_routes.py → routes/router.py**

- ### details:
  - **schema/companies.py**
    - created 2 schema classes :
      - `CompanyCreate` : used for posting data into database
      - `CompanyResponse` : used for fetching specific data from database (a kind of validation layer)
  - **services/companies.py**
    - created 2 functions, they contain logic on how to post and retirve data:
      - `register_company(data)` : this function posts data into 1 database table(**companies**) with following logic:
        1. insert the relevent data into table (**companies**) via query
        2. basic error handling
    # 
      - `all_company_list()` : this function will fetch the list of the companies from the 1 table(**companies**) with following logic:
        1. fetch the data from **companies** table with simple query
        2. store the retrived data into a variable `results`
        3. then retrun it
        4. basic error handling
    # 
  - **routes/company_routes.py**
    - created an APIRouter
    - 2 endpoints
      - `@router.post('/register')`
      - `@router.get('/company_list', response_model=list[CompanyResponse])`
    - 2 functions for respective endpoints, as follows:
      1. `def create_company(company: CompanyCreate)` :
         - will recieve the payload from the user in the format defined in schema `CompanyCreate`
         - call the `register_company(company)` function from **services/companies.py**, pass the payload/data and store the data into database
         - basic HTTP exceptions handling
      2. `def company_list()` :
         - call the `all_company_list()` function form **services/companies.py** 
         - retrive the data and display it
         - basic HTTP exceptions handling 
    #
  - **routes/router.py**
    - include the company routes into this file 
#

## Comapny Verification

- ### workflow :
  - **schema/companies.py → services/companies.py → routes/company_routes.py → routes/router.py**

- ### details:
  - **schema/companies.py** :
    - Same as **company registration** just added extra `cin` in both schemas
  - **services/companies.py** :
    - added one function with company verify logic:
      - `verify_company(cin: str)` : 
        - load the dummy companies dataset(**"MCA companies.json"**)
        - checke for the matching `cin` and it's **status** field in that file
        - if it met the criteria then update the **verification_status** field in **companies** table
        - return the results
        - basic error handling
    # 
  - **routes/company_routes.py** :
    - created 1 endpoints `@router.post('/verify_company')`
    - and 1 function as follows
      - `dummy_verification(company: CompanyCreate)` :
        - call the `verify_company(company.cin)` function form **services/companies.py** 
         - retrive the results and display it
         - basic HTTP exceptions handling 
    # 

## Company Onboarding Employee

- ### workflow :
  - **schema/employees.py → services/companies.py → routes/company_routes.py → routes/router.py**

- ### details:
  - **schema/employees.py** :
    - created 2 schema classes: 
      - `EmployeeCreate` to store data into DB
      - `EmployeeResponse` to retive data form DB tables
  - **services/companies.py** :
    - added 2 functions:
      - `onboard_employee(data)` : contains temperory logic on how to store data into database
      - `all_employee_list()` : contains temperory logic on what data should be fetched form DB 
    #
  - **routes/company_routes.py** :
    - added 2 endpoints :
      - `@router.post('/onboard_employee')`
      - `@router.get('/employee_list', response_model=list[EmployeeResponse])`
    - added 2 functions (working is same as earliar function form same file):
      - `def create_employee(employee: EmployeeCreate)`
      - `def employee_list()`

## Employee Exits Company

- ### workflow :
  - **schema/employees.py → services/companies.py → routes/company_routes.py → routes/router.py**

- ### details:
  - **schema/employees.py** :
    - used existing schema `EmployeeCreate`
  - **services/companies.py** :
    - added 1 function:
      - `exit_employee(data)` : contains the temporary logic on getting required reference keys and update the exit date in DB table (employee history)
    #
  - **routes/company_routes.py** :
    - added 1 endpoint : `@router.post('/employee_exit')`
    - added 1 function : `employ_exit(employee: EmployeeCreate)` (working is same as earliar function form same file)

## Employee Exit Confirmation

- ### workflow :
  - **schema/employees.py → services/candidates.py → routes/candidate_routes.py → routes/router.py**

- ### details:
  - **schema/employees.py** :
    - added new schema `EmpDatesConfirmation`
  - **services/candidates.py** :
    - added 2 functions:
      - `view_candidate_profile(user_email: str)`: contains temporary logic to disply info of single candidate
      - `confirm_exit(data)` : validates the exit_date in **employee_history** DB table and updates the status accordingly
    #
  - **routes/candidate_routes.py** :
      - added 2 endpoints :
        - `@router.post('/exit_confirm')`
        - `@router.get('/view_profile')`
      - added 2 functions : (working is same as explained in earliear workflows)
        - `def employee_exit_confirmation(data: EmpDatesConfirmation)`
        - `def view_profile(email: str)`
    # 
  - **routes/router.py**
      - included the router reference of **candidate_routes.py** in tihs file 


## Employee Joining Confirmation

- ### workflow :
  - **schema/employees.py → services/candidates.py → routes/candidate_routes.py → routes/router.py**

- ### details:
  - **schema/employees.py** :
    - used existing schema `EmpDatesConfirmation`
  - **services/candidates.py** :
    - added 1 functions:
      - `confirm_joining(data)` : validates the joining_date in **employee_history** DB table and updates the status accordingly
    #
  - **routes/candidate_routes.py** :
      - added 1 endpoints :
        - `@router.post('/joining_confirm')`
      - added 1 functions : (working is same as explained in earliear workflows)
        - `def employee_joining_confirmation(data: EmpDatesConfirmation)`
    # 

## Raise Disputes 

- ### workflow :
  - **services/disputes.py → services/candidates.py → routes/candidate_routes.py → routes/router.py**

- ### details:
  - **services/disputes.py** :
    - created 2 functions
      - `raise_dispute(raised_by_type: str, raised_by_id: int, raised_against_type: str, raised_against_id: int, topic: str)` : stores the data into **disputes** table in DB
      - `view_all_disputes()` : fetch the data from **disputes** table
  - **services/candidates.py** :
    - `raise_dispute` function is called automataticly when joining date and exit date don't match (refer functions `confirm_joining(data)`, `confirm_exit(data)`)
  - **routes/candidate_routes.py** :
    - added 1 endpoint : `@router.get('/disputes_list')`
    - this will call the `view_all_disputes()` form **dispute service** and display the results
#

## Notes:
  - This is Rough logic for now. known drawbacks/anomalities of the logic are as follows:
    - no proper roles for Actors (**candidate, employee, company, college**)
    - no proper Status update system for when employee onboards and exits (basic verion in place and working but it still need some work)
    - since there are no validations in place for `exit_confirm()` and `joinin_confirm()`. thous API can be called multiple time resulting in multiple `raise_dispute()` calls thus multiple entires of same dispute in database
