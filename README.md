# Scame Regulatory System

## Inspiration:

> ***To create a system where the very existence of the system will becomes greatest threat to Scammers and Fake Professionals.***

## Overview :
This project is a functional prototype of an Employment Lifecycle & Verification System designed to prevent 
- fraudulent work experience claims
- fake certificates
- unethical hiring and exit practices

The system establishes a trusted record of a candidate’s journey:

**Institute Enrollment → Academic Record → Company Onboarding → Employment Timeline → Exit → Dispute Resolution**

By involving all actors (Institutes, Candidates & Companies) the system ensures that each employment event is verified and traceable.

This prototype demonstrates the complete technical workflow for such a platform, including data flow, role-based access, transparent timelines and automated dispute generation on mismatched dates.

## Key Features :

- **Institute**
  - Can keep track of their Alumni
  - Insights on their yearly performence (planned feature)
- **Candidate**
  - Verified & traceable Employment & Education History
- **Company**
  - Verified Onboarding and exit practices
  - Insights on Employee hiring patterns (planned feature)

## Tech-Stack :

**Backend**
- FastAPI (Python)
- MySQL

**Frontend**
- ReactJs (Vite)
- Material UI (MUI)
- Axios

## System Architecture

    Frontend (React + MUI)
        ↓ API Calls
    Backend (FastAPI Services)
        ↓ SQL Queries
    Database (PostgreSQL/MySQL)

## Example Data-Flow

    React Page
        → axiosClient
            → FastAPI Endpoint
                → Service Logic (Backend)
                    → SQL Query (Database)
                        → Response 
                            → FastAPI service
                                → React page (Update)

## Folder Struectrue

**Backend**

    Backend/            # root folder
    |---API Docs/       # API sample payload response
    |---config/         # DB connection settings
    |---dev_logs/       # dev timelin & backend workflow
    |---dummy DB/       # dummy MCA dataset
    |---routes/         # API endpoints definitions 
    |---schema/         # pydantic models
    |---services/       # core backend logic
    |---venv/           # virtual environment
    |---main.py         # entry point of backend

**Frontend**

    Frontend/               # root folder
    |---Devlogs/            # dev timeline & frontend workflow
    |---public/             
    |---src/                
    |   |---api/            # API wrappers & axios integration 
    |   |---assets/
    |   |---components/     # resuable UI Components
    |   |---context/        # Global state
    |   |---layout/         # common layouts
    |   |---pages/          # feature specific pages
    |   |---routes/         # routing configurations
    |   |---App.jsx
    |   |---main.jsx
    |---index.html
    |---package.json


## Feature Level Documentation

To maintain clarity between current prototype vs future ideal system, following documents files are maintained:
- [Feature Testing Document](/Software%20Development%20Docs/Application%20Testing/Feature_Testing_v0.0.1.md)
  - contains: 
    - Summary of each features
    - Purpose & impact
    - Current Vs ideal behaviour
- [Frontend Workflow](/Frontend/Devlogs/frontend_workflow.md)
  - contains:
    - How frontend components interact
    - Page → API → Page workflows
- [Backend Workflow](/Backend/dev_logs/backend_workflow.md)
  - contains:
    - Current backend logic flow
    - How services, routes & schemas work togather

## Timeline of the Project

- **Oct 2025 : Idea Validation & Early Analysis** 
  - Went public with the idea
  - Did initial research
  - Designed rough database structure and conceptual workflows
- **Nov 2025 : Building the Prototype**
  - shortlisted few core features
  - built a backend APIs from scratch
  - connected with frontend
  - Achieved working proof-of-concept (POC)
- **Dec 2025 : Polish, Refactor & Demo prep**
  - Refined core flows
  - Some code restructuring
  - Added resuable components and documents

---

**Detailed Development Logs :**
- [Frontend dev timeline](/Frontend/Devlogs/dev_timeline.md)
- [Backend dev timeline](/Backend/dev_logs/dev_timeline.md)


## About Developer (Ashwin Koli):

I’m just a regular person who got exhausted by repeated scam encounters and unethical hiring practices during my job search.
Instead of giving up, I turned those experiences into research material and started building a system that exposes the very behaviour that harmed me.

> ***My skills and experience may not be perfect yet, but I’m committed to building something honest***