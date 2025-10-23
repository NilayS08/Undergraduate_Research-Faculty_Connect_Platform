from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from .. import models, db, schemas

router = APIRouter(prefix="/auth", tags=["auth"])

@router.post("/login", response_model=schemas.LoginResponse)
def login_user(login_data: schemas.LoginRequest, db_session: Session = Depends(db.get_db)):
    email = login_data.email
    password = login_data.password

    if not email or not password:
        raise HTTPException(status_code=400, detail="Email and password required")

    # Try faculty first
    faculty = db_session.query(models.Faculty).filter(models.Faculty.email == email).first()
    if faculty and faculty.password == password:
        return {
            "role": "faculty",
            "user_id": faculty.faculty_id,
            "name": f"{faculty.first_name} {faculty.last_name}",
            "email": faculty.email
        }

    # Then try student
    student = db_session.query(models.Student).filter(models.Student.email == email).first()
    if student and student.password == password:
        return {
            "role": "student",
            "user_id": student.student_id,
            "name": f"{student.first_name} {student.last_name}",
            "email": student.email
        }

    raise HTTPException(status_code=401, detail="Invalid email or password")
