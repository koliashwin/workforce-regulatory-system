from fastapi import APIRouter, HTTPException
from schema.candidates import CandidateCreate, CandidateResponse
from schema.companies import CompanyCreate
from services.institutes import view_institute_profile, register_institute, all_institutes_list, clg_onboard_candidate, all_candidates_list

router = APIRouter(prefix='/institute', tags=['institute'])

@router.post('/register')
def create_institute(institute: CompanyCreate):
    result = register_institute(institute)
    
    if not result['success']:
        raise HTTPException(status_code=400, detail=result['error'])
    
    return {'message': 'Institute Created Successfully'}

@router.get('/institute_list')
def institute_list():
    result = all_institutes_list()

    if not result['success']:
        raise HTTPException(status_code=400, detail=result['error'])
    
    return result['data']

@router.post('/onboard_students')
def create_candidate(candidate: CandidateCreate):
    result = clg_onboard_candidate(candidate)
    if not result['success']:
        raise HTTPException(status_code=400, detail=result['error'])
    return {'message': 'Candidate Created Successfully.'}

@router.get('/candidate_list', response_model=list[CandidateResponse])
def candidate_list(institute_id: int):
    result = all_candidates_list(institute_id)
    if not result['success']:
        raise HTTPException(status_code=400, detail=result['error'])
    return result['data']

@router.get('/view_profile')
def view_profile(institute_id: int):
    result = view_institute_profile(institute_id)

    if not result['success']:
        raise HTTPException(status_code=400, detail=result['error'])
    
    return result['data']