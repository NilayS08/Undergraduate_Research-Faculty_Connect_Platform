from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from .. import schemas, crud, db

router = APIRouter(prefix="/faculty", tags=["faculty"])

@router.get("/", response_model=list[schemas.Faculty])
def list_faculty(skip: int=0, limit: int=50, db_session: Session = Depends(db.get_db)):
    return crud.list_faculty(db_session, skip, limit)

@router.get("/{faculty_id}", response_model=schemas.Faculty)
def get_faculty(faculty_id: int, db_session: Session = Depends(db.get_db)):
    faculty = crud.get_faculty(db_session, faculty_id)
    if not faculty:
        raise HTTPException(status_code=404, detail="Faculty not found")
    return faculty

@router.post("/", response_model=schemas.Faculty)
def create_faculty(faculty: schemas.FacultyCreate, db_session: Session = Depends(db.get_db)):
    return crud.create_faculty(db_session, faculty)

@router.put("/{faculty_id}", response_model=schemas.Faculty)
def update_faculty(faculty_id: int, payload: dict, db_session: Session = Depends(db.get_db)):
    faculty = crud.update_faculty(db_session, faculty_id, payload)
    if not faculty:
        raise HTTPException(status_code=404, detail="Faculty not found")
    return faculty
