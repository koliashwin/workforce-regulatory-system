from fastapi import APIRouter, HTTPException
from services.institutes import view_institute_profile, all_institutes_list
from services.companies import view_company_profile
from services.admin import all_company_list
from services.dipsutes import view_all_disputes
from services.public import overall_states, _safe_company, _safe_institute

router = APIRouter(prefix='/public', tags=['public'])



# ── Platform-wide stats ───────────────────────────────────────────────────────
@router.get("/stats")
def platform_stats():
    result = overall_states()

    if not result['success']:
        raise HTTPException(status_code=400, detail=result['error'])
    
    return result['data']


# ── Public institute endpoints ────────────────────────────────────────────────
@router.get("/institute_list")
def public_institute_list():
    result = all_institutes_list()
    if not result["success"]:
        raise HTTPException(status_code=500, detail=result["error"])
    # Return only non-sensitive fields
    safe = [
        {
            "institute_id":       i.get("institute_id"),
            "name":               i.get("name"),
            "address":            i.get("address"),
            "verification_status": i.get("verification_status"),
        }
        for i in result["data"]
    ]
    return safe


@router.get("/institute/{institute_id}")
def public_institute_profile(institute_id: int):
    result = view_institute_profile(institute_id)
    if not result["success"]:
        raise HTTPException(status_code=404, detail=result["error"])
    return _safe_institute(result["data"])


# ── Public company endpoints ──────────────────────────────────────────────────
@router.get("/company_list")
def public_company_list():
    result = all_company_list()
    if not result["success"]:
        raise HTTPException(status_code=500, detail=result["error"])
    safe = [
        {
            "company_id":         c.get("company_id"),
            "name":               c.get("name"),
            "cin":                c.get("cin"),
            "address":            c.get("address"),
            "verification_status": c.get("verification_status"),
        }
        for c in result["data"]
    ]
    return safe


@router.get("/company/{company_id}")
def public_company_profile(company_id: int):
    result = view_company_profile(company_id)
    if not result["success"]:
        raise HTTPException(status_code=404, detail=result["error"])
    return _safe_company(result["data"])
