from fastapi import APIRouter, HTTPException
from schema.companies import CompanyCreate, CompanyResponse
from schema.employees import EmployeeCreate, EmployeeResponse
from services.companies import register_company, all_company_list, verify_company, onboard_employee, exit_employee, all_employee_list


router = APIRouter(prefix='/company', tags=['company'])

@router.post('/register')
def create_company(company: CompanyCreate):
    result = register_company(company)
    
    if not result['success']:
        raise HTTPException(status_code=400, detail=result['error'])
    
    return {'message': 'Company Created Successfully'}

@router.get('/company_list', response_model=list[CompanyResponse])
def company_list():
    result = all_company_list()

    if not result['success']:
        raise HTTPException(status_code=400, detail=result['error'])
    
    return result['data']

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
def employee_list():
    result = all_employee_list()

    if not result['success']:
        raise HTTPException(status_code=400, detail=result['error'])
    
    return result['data']