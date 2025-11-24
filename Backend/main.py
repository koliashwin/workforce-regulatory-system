from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.router import main_router

app = FastAPI(title="Scam Regulatory System - Backend")

origins = [
    "http://localhost:5173",
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
    return {'message':'Backend running succesfully'}