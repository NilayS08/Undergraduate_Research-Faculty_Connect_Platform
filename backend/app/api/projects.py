from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from .. import schemas, crud, db

router = APIRouter(prefix="/projects", tags=["projects"])

@router.post("/", response_model=schemas.Project)
def create_project(project: schemas.ProjectCreate, db_session: Session = Depends(db.get_db)):
    try:
        return crud.create_project(db_session, project)
    except Exception as e:
        print(f"Error in create_project endpoint: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to create project: {str(e)}")

@router.get("/", response_model=list[schemas.Project])
def list_projects(skip: int=0, limit: int=50, db_session: Session = Depends(db.get_db)):
    return crud.list_projects(db_session, skip, limit)

@router.get("/{project_id}", response_model=schemas.Project)
def get_project(project_id: int, db_session: Session = Depends(db.get_db)):
    p = crud.get_project(db_session, project_id)
    if not p:
        raise HTTPException(status_code=404, detail="Project not found")
    return p

@router.put("/{project_id}", response_model=schemas.Project)
def update_project(project_id: int, payload: dict, db_session: Session = Depends(db.get_db)):
    p = crud.update_project(db_session, project_id, payload)
    if not p:
        raise HTTPException(status_code=404, detail="Project not found")
    return p
