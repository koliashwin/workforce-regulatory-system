from datetime import date
from pydantic import BaseModel

class CandidateCreate(BaseModel):
    # personal info (users table)
    role_id: int
    email: str
    password_hash: str
    name: str
    contact_no: str
    dob: date
    created_on: str
    updated_on: str
    last_login: str

    # Academic info (candidates table)
    user_id: int
    institute_id: int
    course: str
    passout_year: date
    skills: str

    # College/Institute reference (institutes table)
    institute_name: str
    institute_email: str
    institute_code: int

class CandidateResponse(BaseModel):
    # personal info identifires
    user_id: int
    role_id: int
    user_name: str
    user_email: str

    # academic info identifires
    candidate_id: int
    course: str
    # passout_year: str
    skills: str

    # college/institure identifires
    institute_id: int
    institute_name: str
    institute_email: str