from datetime import date
from pydantic import BaseModel

class EmployeeCreate(BaseModel):
    # employee info
    company_id: int
    company_cin: str
    user_email: str
    designation: str

    # employee history info
    joining_date: date
    exit_date: date | None
    status: str

class EmployeeResponse(BaseModel):
    # user info
    # user_id: int
    user_name: str
    user_contact: str
    user_email: str

    # company info
    # company_id: int
    cin: str
    company_name: str

    # employee info
    emp_designation: str
    joining_date: date
    exit_date: date | None 
    employment_status: str

class EmpDatesConfirmation(BaseModel):
    company_id: int
    user_id: int
    date: date