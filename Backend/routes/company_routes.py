from fastapi import APIRouter, HTTPException
from schema.companies import CompanyCreate, CompanyResponse
from services.companies import register_company, all_company_list

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