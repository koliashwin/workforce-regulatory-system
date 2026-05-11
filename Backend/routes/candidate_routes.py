from fastapi import APIRouter, HTTPException, Depends
from schema.lifecycle import JoiningConfirm, JoiningDocuments, ExitConfirm, ExitDocuments
from services.lifecycle import confirm_joining, submit_joining_documents, confirm_exit, submit_exit_documents
from services.candidates import view_candidate_profile
from services.dipsutes import view_all_disputes
from utils.auth_dependency import get_current_user

router = APIRouter(prefix="/candidates", tags=["candidates"])


@router.get("/view_profile")
def view_profile(user=Depends(get_current_user)):
    result = view_candidate_profile(user["user_id"])
    if not result["success"]:
        raise HTTPException(status_code=400, detail=result["error"])
    return result["data"]


@router.get("/disputes_list")
def dispute_list():
    result = view_all_disputes()
    if not result["success"]:
        raise HTTPException(status_code=400, detail=result["error"])
    return result["data"]


# ── Joining flow ──────────────────────────────────────────────

@router.post("/joining_confirm")
def joining_confirm(data: JoiningConfirm, user=Depends(get_current_user)):
    """Step 2: Candidate confirms or disputes the company joining date."""
    result = confirm_joining(data, user["user_id"])
    if not result["success"]:
        # Return 200 with error details so frontend can show dispute info
        return result
    return result


@router.post("/joining_documents")
def joining_docs(data: JoiningDocuments, user=Depends(get_current_user)):
    """Step 3: Candidate submits joining document checklist."""
    result = submit_joining_documents(data, user["user_id"])
    return result


# ── Exit flow ─────────────────────────────────────────────────

@router.post("/exit_confirm")
def exit_confirm(data: ExitConfirm, user=Depends(get_current_user)):
    """Step 2: Candidate confirms or disputes the company exit date."""
    result = confirm_exit(data, user["user_id"])
    return result


@router.post("/exit_documents")
def exit_docs(data: ExitDocuments, user=Depends(get_current_user)):
    """Step 3: Candidate submits exit document checklist."""
    result = submit_exit_documents(data, user["user_id"])
    return result