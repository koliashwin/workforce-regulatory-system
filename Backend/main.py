from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.router import main_router
import os

app = FastAPI(title="Scam Regulatory System - Backend")

origins = [
    os.getenv('FRONTEND_URL')
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*'],
)

app.include_router(main_router)

@app.get('/')
def root():
    return {'message':'Backend running succesfully'+os.getenv('FRONTEND_URL')+os.getenv('DB_HOST')}