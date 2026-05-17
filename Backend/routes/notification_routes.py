# ── ADD TO: Backend/routes/ as notification_routes.py ────────────────────────
# Then register in router.py:
#   from .notification_routes import router as notification_router
#   main_router.include_router(notification_router, dependencies=[Depends(get_current_user)])

from fastapi import APIRouter, HTTPException, Depends
from services.notifications import (
    get_notifications, get_unread_count,
    mark_all_read, mark_one_read
)
from utils.auth_dependency import get_current_user

router = APIRouter(prefix="/notifications", tags=["notifications"])


@router.get("")
def fetch_notifications(limit: int = 20, user=Depends(get_current_user)):
    result = get_notifications(user["user_id"], limit)
    if not result["success"]:
        raise HTTPException(status_code=500, detail=result["error"])
    return result["data"]


@router.get("/unread_count")
def unread_count(user=Depends(get_current_user)):
    result = get_unread_count(user["user_id"])
    return {"count": result["count"]}


@router.put("/mark_all_read")
def mark_read_all(user=Depends(get_current_user)):
    result = mark_all_read(user["user_id"])
    if not result["success"]:
        raise HTTPException(status_code=500, detail=result["error"])
    return {"message": "All notifications marked as read"}


@router.put("/{notification_id}/read")
def mark_read_one(notification_id: int, user=Depends(get_current_user)):
    result = mark_one_read(notification_id, user["user_id"])
    if not result["success"]:
        raise HTTPException(status_code=500, detail=result["error"])
    return {"message": "Notification marked as read"}
