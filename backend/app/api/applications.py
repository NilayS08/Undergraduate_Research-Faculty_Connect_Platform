from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from .. import schemas, crud, db

router = APIRouter(prefix="/applications", tags=["applications"])

@router.post("/", response_model=schemas.Application)
def create_application(application: schemas.ApplicationCreate, db_session: Session = Depends(db.get_db)):
    return crud.create_application(db_session, application)

@router.get("/project/{project_id}", response_model=list[schemas.Application])
def get_applications_for_project(project_id: int, db_session: Session = Depends(db.get_db)):
    return crud.get_applications_for_project(db_session, project_id)

@router.put("/{application_id}/accept", response_model=schemas.Application)
def accept_application(application_id: int, db_session: Session = Depends(db.get_db)):
    application = crud.accept_application(db_session, application_id)
    if not application:
        raise HTTPException(status_code=404, detail="Application not found")
    return application

@router.put("/{application_id}/reject", response_model=schemas.Application)
def reject_application(application_id: int, db_session: Session = Depends(db.get_db)):
    application = crud.reject_application(db_session, application_id)
    if not application:
        raise HTTPException(status_code=404, detail="Application not found")
    return application
