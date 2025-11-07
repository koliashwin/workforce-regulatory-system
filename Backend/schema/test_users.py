from pydantic import BaseModel

# test schema
class UserCreate(BaseModel):
    role_id: int
    email: str
    password_hash: str
    name: str
    contact_no: str
    dob: str
    created_on: str
    updated_on: str
    last_login: str

class UserResponse(BaseModel):
    user_id: int
    role_id: int
    email: str
    name: str