from fastapi import APIRouter, HTTPException, Depends
from schema.companies import CompanyCreate
from schema.employees import EmployeeCreate, EmployeeResponse
from services.companies import register_company, verify_company, onboard_employee, exit_employee, all_employee_list, view_company_profile
from utils.auth_dependency import get_current_user

router = APIRouter(prefix='/company', tags=['company'])

@router.post('/register')
def create_company(company: CompanyCreate):
    result = register_company(company)
    
    if not result['success']:
        raise HTTPException(status_code=400, detail=result['error'])
    
    return {'message': 'Company Created Successfully'}

@router.post('/verify_company')
def dummy_verification(company: CompanyCreate):
    result = verify_company(company.cin)

    if not result['success']:
        raise HTTPException(status_code=400, detail=result['error'])
    
    return result

@router.post('/onboard_employee')
def create_employee(employee: EmployeeCreate):
    result = onboard_employee(employee)

    if not result['success']:
        raise HTTPException(status_code=400, detail=result['error'])
    
    return result

@router.post('/employee_exit')
def employ_exit(employee: EmployeeCreate):
    result = exit_employee(employee)

    if not result['success']:
        raise HTTPException(status_code=400, detail=result['error'])
    
    return result

@router.get('/employee_list', response_model=list[EmployeeResponse])
def employee_list(user=Depends(get_current_user)):
    company_id = user["company_id"]
    result = all_employee_list(company_id)

    if not result['success']:
        raise HTTPException(status_code=400, detail=result['error'])
    
    return result['data']

@router.get('/view_profile')
def view_profile(user=Depends(get_current_user)):
    company_id = user["company_id"]
    result = view_company_profile(company_id)

    if not result['success']:
        raise HTTPException(status_code=400, detail=result['error'])
    
    return result['data']