from fastapi import FastAPI
from routes.router import main_router

app = FastAPI(title="Scam Regulatory System - Backend")

app.include_router(main_router)

@app.get('/')
def root():
    return {'message':'Backend running succesfully'}