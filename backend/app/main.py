from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .db import engine, Base
from .api import projects, students, faculty, skills, applications, auth

# create tables (only for development)
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Undergrad Research Hub API")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(projects.router)
app.include_router(students.router)
app.include_router(faculty.router)
app.include_router(skills.router)
app.include_router(applications.router)