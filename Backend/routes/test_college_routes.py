from fastapi import APIRouter, HTTPException
from schema.test_users import UserCreate, UserResponse
from services.test_candidates import create_candidate_clg, candidates_list

router = APIRouter(prefix='/colleges', tags=['Colleges'])

@router.post('/onboard')
def create_candidate(user: UserCreate):
    result = create_candidate_clg(user)
    if not result['success']:
        raise HTTPException(status_code=400, detail=result['error'])
    return {'message': 'Candidate created successfully'}

@router.get('/student_list', response_model=list[UserResponse])
def student_list():
    result = candidates_list()
    if not result['success']:
        raise HTTPException(status_code=404, detail=result['error'])
    return result['data']