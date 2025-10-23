from sqlalchemy.orm import Session
from . import models, schemas
from typing import List, Optional

# Students
def create_student(db: Session, student: schemas.StudentCreate):
    db_student = models.Student(**student.model_dump(exclude_unset=True))
    db.add(db_student)
    db.commit()
    db.refresh(db_student)
    return db_student

def get_student(db: Session, student_id: int):
    return db.query(models.Student).filter(models.Student.student_id == student_id).first()

def list_students(db: Session, skip: int=0, limit: int=100):
    return db.query(models.Student).offset(skip).limit(limit).all()

def update_student(db: Session, student_id: int, data: dict):
    db_student = db.query(models.Student).filter_by(student_id=student_id).first()
    if not db_student:
        return None
    for k, v in data.items():
        setattr(db_student, k, v)
    db.commit()
    db.refresh(db_student)
    return db_student

# Skills
def list_skills(db: Session):
    return db.query(models.Skill).all()

def create_skill(db: Session, skill: schemas.SkillCreate):
    s = models.Skill(**skill.model_dump())
    db.add(s)
    db.commit()
    db.refresh(s)
    return s

# Projects
def create_project(db: Session, project: schemas.ProjectCreate):
    project_data = project.model_dump(exclude_unset=True)
    # Don't require admin_id for now
    
    # Get the next available project_id
    max_id = db.query(models.ResearchProject.project_id).order_by(models.ResearchProject.project_id.desc()).first()
    next_id = (max_id[0] + 1) if max_id else 1
    project_data['project_id'] = next_id
    
    try:
        p = models.ResearchProject(**project_data)
        db.add(p)
        db.commit()
        db.refresh(p)
        return p
    except Exception as e:
        db.rollback()
        print(f"Error creating project: {e}")
        raise e

def get_project(db: Session, project_id: int):
    return db.query(models.ResearchProject).filter_by(project_id=project_id).first()

def update_project(db: Session, project_id: int, data: dict):
    p = db.query(models.ResearchProject).filter_by(project_id=project_id).first()
    if not p:
        return None
    for k, v in data.items():
        setattr(p, k, v)
    db.commit(); db.refresh(p)
    return p

def list_projects(db: Session, skip=0, limit=100):
    return db.query(models.ResearchProject).offset(skip).limit(limit).all()

# Faculty
def create_faculty(db: Session, faculty: schemas.FacultyCreate):
    db_faculty = models.Faculty(**faculty.dict(exclude_unset=True))
    db.add(db_faculty)
    db.commit()
    db.refresh(db_faculty)
    return db_faculty

def get_faculty(db: Session, faculty_id: int):
    return db.query(models.Faculty).filter(models.Faculty.faculty_id == faculty_id).first()

def list_faculty(db: Session, skip: int=0, limit: int=100):
    return db.query(models.Faculty).offset(skip).limit(limit).all()

def update_faculty(db: Session, faculty_id: int, data: dict):
    db_faculty = db.query(models.Faculty).filter_by(faculty_id=faculty_id).first()
    if not db_faculty:
        return None
    for k, v in data.items():
        setattr(db_faculty, k, v)
    db.commit()
    db.refresh(db_faculty)
    return db_faculty

# Skills
def get_skill(db: Session, skill_id: int):
    return db.query(models.Skill).filter(models.Skill.skill_id == skill_id).first()

# Applications
def create_application(db: Session, app_in: schemas.ApplicationCreate):
    app = models.Application(**app_in.dict())
    db.add(app)
    db.commit()
    db.refresh(app)
    return app

def get_applications_for_project(db: Session, project_id: int):
    return db.query(models.Application).filter_by(project_id=project_id).all()

def accept_application(db: Session, application_id: int):
    app = db.query(models.Application).filter_by(application_id=application_id).first()
    if not app:
        return None
    app.status = "Accepted"
    # add to project_members
    project = app.project
    student = app.student
    project.members.append(student)
    db.commit()
    db.refresh(app)
    return app

def reject_application(db: Session, application_id: int):
    app = db.query(models.Application).filter_by(application_id=application_id).first()
    if not app:
        return None
    app.status = "Rejected"
    db.commit()
    db.refresh(app)
    return app
