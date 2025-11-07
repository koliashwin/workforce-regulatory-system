from fastapi import APIRouter, HTTPException
from schema.candidates import CandidateCreate, CandidateResponse
from services.candidates import clg_onboard_candidate, all_candidates_list

router = APIRouter(prefix='/institute', tags=['institute'])

@router.post('/onboard_students')
def create_candidate(candidate: CandidateCreate):
    result = clg_onboard_candidate(candidate)
    if not result['success']:
        raise HTTPException(status_code=400, detail=result['error'])
    return {'message': 'Candidate Created Successfully.'}

@router.get('/candidate_list', response_model=list[CandidateResponse])
def candidate_list():
    result = all_candidates_list()
    if not result['success']:
        raise HTTPException(status_code=400, detail=result['error'])
    return result['data']