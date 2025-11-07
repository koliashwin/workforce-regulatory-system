from fastapi import APIRouter
from .test_college_routes import router as test_college_router
from .institute_routes import router as institute_router
from .company_routes import router as company_router

main_router = APIRouter()
# main_router.include_router(test_college_router)
main_router.include_router(institute_router)
main_router.include_router(company_router)
