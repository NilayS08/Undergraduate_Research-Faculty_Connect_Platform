from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

# Auth
class LoginRequest(BaseModel):
    email: str
    password: str

class LoginResponse(BaseModel):
    role: str
    user_id: int
    name: str
    email: str

class SkillBase(BaseModel):
    skill_id: Optional[int]
    skill_name: str
    category: Optional[str]

class SkillCreate(SkillBase):
    pass

class Skill(SkillBase):
    class Config:
        orm_mode = True

# Student
class StudentBase(BaseModel):
    first_name: str
    last_name: str
    major: Optional[str]
    gpa: Optional[float]
    year_level: Optional[int]
    research_interests: Optional[str]
    email: str

class StudentCreate(StudentBase):
    student_id: Optional[int]

class Student(StudentBase):
    student_id: int
    skills: List[Skill] = []
    class Config:
        from_attributes = True

# Faculty
class FacultyBase(BaseModel):
    first_name: str
    last_name: str
    department: Optional[str]
    research_areas: Optional[str]
    email: str

class FacultyCreate(FacultyBase):
    faculty_id: Optional[int]

class Faculty(FacultyBase):
    faculty_id: int
    class Config:
        orm_mode = True

# Project
class ProjectBase(BaseModel):
    title: str
    description: str
    status: Optional[str] = "Recruiting"
    max_students: Optional[int] = 5
    faculty_id: int

class ProjectCreate(ProjectBase):
    pass

class Project(ProjectBase):
    project_id: int
    skills: List[Skill] = []
    class Config:
        orm_mode = True

# Application
class ApplicationBase(BaseModel):
    status: Optional[str] = "Pending"
    cover_letter: Optional[str] = None
    student_id: int
    project_id: int

class ApplicationCreate(ApplicationBase):
    pass

class Application(ApplicationBase):
    application_id: int
    class Config:
        orm_mode = True
