from fastapi import APIRouter, HTTPException, Depends
from schema.companies import CompanyCreate
from schema.lifecycle import JoiningInitiate, ExitInitiate
from services.lifecycle import initiate_joining, initiate_exit
from services.companies import register_company, verify_company, all_employee_list, view_company_profile
from utils.auth_dependency import get_current_user

router = APIRouter(prefix="/company", tags=["company"])


@router.post("/register")
def create_company(company: CompanyCreate):
    result = register_company(company)
    if not result["success"]:
        raise HTTPException(status_code=400, detail=result["error"])
    return {"message": "Company Created Successfully"}


@router.post("/verify_company")
def dummy_verification(company: CompanyCreate):
    result = verify_company(company.cin)
    if not result["success"]:
        raise HTTPException(status_code=400, detail=result["error"])
    return result


@router.get("/employee_list")
def employee_list(user=Depends(get_current_user)):
    result = all_employee_list(user["company_id"])
    if not result["success"]:
        raise HTTPException(status_code=400, detail=result["error"])
    return result["data"]


@router.get("/view_profile")
def view_profile(user=Depends(get_current_user)):
    result = view_company_profile(user["company_id"])
    if not result["success"]:
        raise HTTPException(status_code=400, detail=result["error"])
    return result["data"]


# ── Joining flow ──────────────────────────────────────────────

@router.post("/joining_initiate")
def joining_initiate(data: JoiningInitiate, user=Depends(get_current_user)):
    """Step 1: Company sets candidate joining date."""
    result = initiate_joining(data, user["company_id"])
    if not result["success"]:
        raise HTTPException(status_code=400, detail=result["error"])
    return result


# ── Exit flow ─────────────────────────────────────────────────

@router.post("/exit_initiate")
def exit_initiate(data: ExitInitiate, user=Depends(get_current_user)):
    """Step 1: Company sets employee exit date."""
    result = initiate_exit(data, user["company_id"])
    if not result["success"]:
        raise HTTPException(status_code=400, detail=result["error"])
    return result