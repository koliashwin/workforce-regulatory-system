from pydantic import BaseModel

class CompanyCreate(BaseModel):
    # company info
    name: str
    address: str
    contact_no: str
    email: str
    verification_status: str

class CompanyResponse(BaseModel):
    company_id: int
    name: str
    address: str
    contact_no: str
    email: str
    verification_status: str