from fastapi import APIRouter, HTTPException, Depends
from schema.employees import EmpDatesConfirmation, EmployeeResponse
from services.candidates import confirm_joining, confirm_exit, view_candidate_profile
from services.dipsutes import view_all_disputes
from utils.auth_dependency import get_current_user

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
def view_profile(user=Depends(get_current_user)):
    user_id = user["user_id"]
    result = view_candidate_profile(user_id)

    if not result['success']:
        raise HTTPException(status_code=400, detail=result['error'])
    
    return result['data']

@router.get('/disputes_list')
def dispute_list():
    result = view_all_disputes()

    if not result['success']:
        raise HTTPException(status_code=400, detail=result['error'])
    
    return result['data']