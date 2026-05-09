from fastapi import APIRouter, Depends
from utils.auth_dependency import require_role

from .test_college_routes import router as test_college_router
from .institute_routes import router as institute_router
from .company_routes import router as company_router
from .candidate_routes import router as candidate_router
from .auth_routes import router as auth_router
from .admin_routes import router as admin_router
from .public_routes import router as public_router

main_router = APIRouter()
# main_router.include_router(test_college_router)
main_router.include_router(institute_router, dependencies=[Depends(require_role("institute"))])
main_router.include_router(company_router, dependencies=[Depends(require_role("company"))])
main_router.include_router(candidate_router, dependencies=[Depends(require_role("candidate"))])
main_router.include_router(auth_router)
main_router.include_router(admin_router, dependencies=[Depends(require_role("admin"))])
main_router.include_router(public_router)