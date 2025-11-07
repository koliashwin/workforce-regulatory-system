from fastapi import APIRouter
from .test_college_routes import router as college_router
from .institute_routes import router as institute_router

main_router = APIRouter()
main_router.include_router(college_router)
main_router.include_router(institute_router)