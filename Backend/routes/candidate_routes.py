from fastapi import APIRouter, HTTPException
from schema.employees import EmpDatesConfirmation, EmployeeResponse
from services.candidates import confirm_joining, confirm_exit, view_candidate_profile

router = APIRouter(prefix="/candidates", tags=['candidates'])

@router.post('/exit_confirm')
def employee_exit_confirmation(data: EmpDatesConfirmation):
    result = confirm_exit(data)
    
    if not result['success']:
        raise HTTPException(status_code=400, detail=result['error'])
    
    return {'message': 'Employee Exits safely'}

@router.post('/joining_confirm')
def employee_joining_confirmation(data: EmpDatesConfirmation):
    result = confirm_joining(data)
    
    if not result['success']:
        raise HTTPException(status_code=400, detail=result['error'])
    
    return {'message': 'Employee Joined safely'}

@router.get('/view_profile')
def view_profile(email: str):
    result = view_candidate_profile(email)

    if not result['success']:
        raise HTTPException(status_code=400, detail=result['error'])
    
    return result['data']