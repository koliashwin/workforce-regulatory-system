from pydantic import BaseModel

class LoginRequest(BaseModel):
    email: str
    password: str

class LoginResponse(BaseModel):
    role: str
    user_id: int
    company_id: int | None
    institute_id: int | None