# Feature Testing Document

<!-- this doc contains the info on how the feature are working vs how they should work -->

<!-- template

## 1. Feature : {Feature Name}

### Purpose: 

### Impact:

### Current Frontend Flow: 

### Current Backend Flow:

### Known Issues:

### Ideal Behaviour:

 -->

# 1. Module : Institute

## 1.1. Feature : Onboard Students

### Purpose: 
- To ensure every student enrolled in an academic institute is properly registered into the system.

### Impact:
- Enables accurate tracking of the number of students in specific domains/fields.
- Forms the base dataset for placement lifecycle, employment verification, and future analytics.

### Current Frontend Flow: 
- college admin logs into the system
- Navigates to: **/institute/onboard**.
- Fill out the form and clicks submit
- Submitted data will be convered to payload
- Payload will be sent to backend **instituteAPI.onboardStudent(payload)**

### Current Backend Flow:
- Endpoint tirggered: **POST: /institute/onboard_students**
- Payload is validated by `CandidateCreate` schema
- Service locig creates entries in:
  - `users` table
  - `candidates` table
- Returns one of the following
  - **Success →** Candidate onboarded
  - **Error →** Validation Failure

### Known Issues:
- Only one student can be onboarded at a time 
- No institute level studetn count check
- No bulk upload functionality

### Ideal Behaviour:
- institutes should be able to **upload an Excel/CSV file** to onboard multiple stutents in a batch
- System should:
  - Validate each row
  - Accept valid entries
  - Reject faulty rows with proper error messages


## 1.2. Feature : Institute Profile

### Purpose: 
- To allow institute admins to view their basic institute information and some student related insights

### Impact:
- Provides quick visibility into student distribution, placements and dispute patterns.
- Helps institutes evaluate their performance and identify improvement areas.

### Current Frontend Flow: 
- college admin logs into the system 
- They will land on Profile page
- system will read the `institute_id` from local storage (stored during login)
- Sent it to the backend **instituteAPI.instituteProfile(institute_id)** 
  - {backend flow}
- Frontend will get relevant data from backend 
- populate the data on screen
  - institute basic details
  - student records
  - dispute summary

### Current Backend Flow:
- Endpoint triggred **GET: /institute/view_profile?institute_id=${id}**
- Service logic will fetched following data:
  - **Basic details** from `institutes` table
  - **Student employment details** from [`candidates`, `users`, `companies`, `employees`] tables
  - **Dispute details** from `disputes` table
- Data is structured and returned as single consolidated payload

### Known Issues:
- UI is minimal and mostly text-based
- No Charts and visualization components

### Ideal Behaviour:
- system should be able to generated some graphs to easily identify statistics 
- Add KPIs (total students, active employees, dispute cases)


## 1.3. Feature : Candidate List (enrolled in certain institute)

### Purpose: 
- To maintain a centralized record of all students who are enrolled in or have graduated from a particular institute.
- To create a reliable database of student identity and academic information tied to the institute

### Impact:
- Helps institutes maintain accurate alumni records.
- Forms the basis for placement analytics, outcome tracking and institutional reporting
- Enables institutes to verify student history for compliance or audit purposes.

### Current Frontend Flow: 
- college admin logs into the system
- Navigates to: **/institute/candidates**.
- System will read the `institute_id` from localStorage(stored during login)
- Sent it to the backend **instituteAPI.getCandidateList(institute_id)** 
  - {backend flow}
- Frontend will get relevant data from backend
- Populate it on Screen using reusable components

### Current Backend Flow:
- Endpoint triggred **GET: /institute/candidate_list?institute_id=${id}**
- Service logic will fetched data from following tables
  - `users`
  - `institutes`
  - `candidates` 
- This data will be returned as payload

### Known Issues:
- some data coulums might be missing from table

### Ideal Behaviour:
- system should provide proper insites from the data


# 2. Module : Candidate

## 2.1. Feature : Candidate Profile

### Purpose: 
- To give candidates a centralized view of their academic, employment and dispute related records

### Impact:
- Helps candidates understand their official employment timeline.
- Reduces likelihood of fake experience, discrepancies or unethical employment practices
- Forms the foundation for verification workflows

### Current Frontend Flow: 
- candidate logs into the system 
- They will land on Profile page
- system will read the `user_id` from local storage (stored during login)
- Sent it to the backend **candidateAPI.getProfile(user_id)** 
  - {backend flow}
- Frontend will get relevant data from backend 
- populate the data on screen
  - candidate basic details
  - academic details
  - employment history
  - dispute summary

### Current Backend Flow:
- Endpoint triggred **GET: /candidates/view_profile?user_id=${id}**
- Service logic will fetched following data:
  - **Basic details** from `users` table
  - **Academic details** from [`candidates` & `institutes`] tables
  - **Student employment history** from [`employees`, `companies`, `employee_history`] tables
  - **Dispute details** from `disputes` table
- Data is structured and returned as single consolidated payload

### Known Issues:
- Basic UI

### Ideal Behaviour:
- Add KPIs (YOE, current employment status & some other statistics)


## 2.2. Feature : Candidate Confirms Joining Date or Exit Date

### Purpose: 
- To allow candidates to officially confirm their employment dates, ensuring the company-reported date matches the candidate-reported dates.
- To prevent companies from misreporting dates, which can be used to manipulate experience timelines.

### Impact:
- Increases transparency in employment history
- Ensures both parties (candidate & company) agree on proper employment dates
- Detects fraudlent or incorrect reporting early

### Current Frontend Flow: 
- Candidate logs into the system
- Navigate to **/candidate/joining_confirm** or **/candidate/exit_confirm**
- Fill out the form and clicks submit
- Submitted data will be convered to payload
- Payload will be sent to backend **candidateAPI.joiningConfirm(payload)** or **candidateAPI.exitConfirm(payload)**

### Current Backend Flow:
- Endpoint tirggered: **POST: /candidates/joining_confirm** or **POST: /candidates/exit_confirm**
- Payload is validated by `EmpDatesConfirmation` schema
- Service locig creates/update entries in:
  - `employee_history` table (update)
  - `disputes` table (create on failed response)
- Returns one of the following
  - **Success →** Employment joining confirmed
  - **Error →** Creates a dispute

### Known Issues:
- No validations
  - multiple confirmations of the same date
  - confirming if record already exists or is closed
- Basic UI
- No visible info on what company claimed VS what candidate is reporting.

### Ideal Behaviour:
- Add validations
- improve the logic for disputes


# 3. Module : Company

## 3.1. Feature : Company Profile

### Purpose: 
- To provide companies a consolidated overview of their basic information, current employees, and dispute history

### Impact:
- Help companies track their hiring and exit patterns
- Supports compliance, audit & workforce planning

### Current Frontend Flow: 
- Company admin logs into the system 
- They will land on Profile page
- system will read the `company_id` from local storage (stored during login)
- Sent it to the backend **companyProfile.companyProfile(company_id)** 
  - {backend flow}
- Frontend will get relevant data from backend 
- populate the data on screen
  - Company's basic details
  - employee list (only 3-5)
  - dispute summary

### Current Backend Flow:
- Endpoint triggred **GET: /company/view_profile?company_id=${id}**
- Service logic will fetched following data:
  - **Basic details** from `companies` table
  - **Employees details** from [`users`, `employees` & `employee_history`] tables
  - **Dispute details** from `disputes` table
- Data is structured and returned as single consolidated payload

### Known Issues:
- No graphs and visual insights
- Basic UI

### Ideal Behaviour:
- should have KPIs (total employees, exit rate / attrition rate, dispute frequency)
- should have some graphs to showcase importent statistics (Hiring trends over time, exit trends) 

## 3.2. Feature : Company Onboards Employee

### Purpose: 
- To create a verified and legally traceable record of a new employee joining a specific company
- Ensures that the employee-company association is explicitly registered in the system.

### Impact:
- Confirms that employee officially a part of company
- Builds a transparent employment history for both employee and employer
- Prevents false job claims or fake experience certificates
- Strengthen the integrity of the employment ecosystem

### Current Frontend Flow: 
- company admin logs into the system
- Navigates to: **/company/onboard**.
- Fill out the form and clicks submit
- Submitted data will be convered to payload
- Payload will be sent to backend **companyAPI.onboardEmployee(payload)**

### Current Backend Flow:
- Endpoint tirggered: **POST: /company/onboard_employee**
- Payload is validated by `EmployeeCreate` schema
- Service locig creates entries in:
  - `employees` table
  - `employee_history` table
- Returns one of the following
  - **Success →** Employee onboarded
  - **Error →** Validation Failure (refer console)

### Known Issues:
- can onboard only one employee at a time
- company manually have to enter details
- No duplicate detection

### Ideal Behaviour:
- company should be able to upload excel with multiple employees details
- system should validate each row, onboard valid entries and highlight errors
- once the job post modules is implemented, the shortlisted candidates should have button/functionality to directly onborded under company name

## 3.3. Feature : Employee Leaves Comapny

### Purpose: 
- To officially record and verify that an employee has left a company.
- Establishes a transparent exit process that companies must follow
- Create traceable employment history for both parties (employee & company)

### Impact:
- Reduce enethical practices during employee exit
- Ensures both company and employee have a mutually acknowladged exit date.
- Helps regulatory bodies detect suspicious patterns in employment exits

### Current Frontend Flow: 
- company admin logs into the system
- Navigates to: **/company/employee_exit**.
- Fill out the form and clicks submit
- Submitted data will be convered to payload
- Payload will be sent to backend **companyAPI.employeeExits(payload)**

### Current Backend Flow:
- Endpoint tirggered: **POST: /company/employee_exit**
- Payload is validated by `EmployeeCreate` schema
- Service locig Updates entries in:
  - `employee_history` table
- Returns one of the following
  - **Success →** Employee exit initiated
  - **Error →** Validation Failure (refer console)

### Known Issues:
- only one employee can leave at a time
- manual data entry
- no validations

### Ideal Behaviour:
- employee list should have feature to directly initiate exit process for perticular employee
- company should be able to initiate bulk exits

## 3.4. Feature : Employee List (worked for perticular company)

### Purpose: 
- To provide a complete record of all employees who have been associated with a specific company
- Maintains history and current employment info

### Impact:
- helps companies track past and present employees
- Supports audit trails, compliance checks and workforce analytics

### Current Frontend Flow:
- Company admin logs into the system
- Navigates to: **/company/employees**.
- System will read the `company_id` from localStorage(stored during login)
- Sent it to the backend **companyAPI.employeeList(company_id)** 
  - {backend flow}
- Frontend will get relevant data from backend
- Populate it on Screen using reusable components 

### Current Backend Flow:
- Endpoint triggred **GET: /company/employee_lisr?company_id=${id}**
- Service logic will fetched data from following tables
  - `users`
  - `company`
  - `employees` 
  - `employee_history`
- This data will be returned as payload

### Known Issues:
- Table shows only basic view (no advanced filters)
- UI is minimal and lacks actionable controls
- No employee quick actions (eg. exit initiation)

### Ideal Behaviour:
- Table should support advanced features:
  - initiate exit button on each row
  - multi select for bulk actions
  - advanced filters 
- should highlight employees with disputes