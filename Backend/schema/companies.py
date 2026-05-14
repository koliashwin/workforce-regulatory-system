from pydantic import BaseModel

class CompanyCreate(BaseModel):
    # company info
    user_name: str
    name: str
    cin: str
    address: str
    contact_no: str
    email: str
    # verification_status: str

class CompanyResponse(BaseModel):
    company_id: int
    cin: str
    name: str
    address: str
    contact_no: str
    email: str
    verification_status: str