from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from .. import schemas, crud, db

router = APIRouter(prefix="/students", tags=["students"])

@router.post("/", response_model=schemas.Student)
def create_student(student: schemas.StudentCreate, db_session: Session = Depends(db.get_db)):
    return crud.create_student(db_session, student)

@router.get("/", response_model=list[schemas.Student])
def list_students(skip: int=0, limit: int=50, db_session: Session = Depends(db.get_db)):
    return crud.list_students(db_session, skip, limit)

@router.get("/{student_id}", response_model=schemas.Student)
def get_student(student_id: int, db_session: Session = Depends(db.get_db)):
    student = crud.get_student(db_session, student_id)
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    return student

@router.put("/{student_id}", response_model=schemas.Student)
def update_student(student_id: int, payload: dict, db_session: Session = Depends(db.get_db)):
    student = crud.update_student(db_session, student_id, payload)
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    return student
