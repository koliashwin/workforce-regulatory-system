from fastapi import APIRouter, HTTPException
from schema.employees import EmployeeResponse
from schema.companies import CompanyResponse
from schema.candidates import CandidateResponse
from services.admin import all_employee_list, all_company_list, all_candidates_list, all_institute_list

router = APIRouter(prefix='/admin', tags=['admin'])

@router.get('/candidate_list', response_model=list[CandidateResponse])
def candidate_list():
    result = all_candidates_list()

    if not result['success']:
        raise HTTPException(status_code=400, detail=result['error'])
    
    return result['data']

@router.get('/institute_list')
def insititute_list():
    result = all_institute_list()

    if not result['success']:
        raise HTTPException(status_code=400, detail=result['error'])
    
    return result['data']

@router.get('/employee_list', response_model=list[EmployeeResponse])
def employee_list():
    result = all_employee_list()

    if not result['success']:
        raise HTTPException(status_code=400, detail=result['error'])
    
    return result['data']

@router.get('/company_list', response_model=list[CompanyResponse])
def company_list():
    result = all_company_list()

    if not result['success']:
        raise HTTPException(status_code=400, detail=result['error'])
    
    return result['data']