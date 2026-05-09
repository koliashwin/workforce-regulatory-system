from fastapi import APIRouter, HTTPException
from schema.auth import LoginRequest, LoginResponse
from services.auth import login_user

router = APIRouter(prefix="/auth", tags=["auth"])

@router.post("/login")
def login(data: LoginRequest):
    result = login_user(data)

    if not result['success']:
        raise HTTPException(status_code=400, detail=result['error'])
    
    return result['data']