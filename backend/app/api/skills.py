from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from .. import schemas, crud, db

router = APIRouter(prefix="/skills", tags=["skills"])

@router.get("/", response_model=list[schemas.Skill])
def list_skills(db_session: Session = Depends(db.get_db)):
    return crud.list_skills(db_session)

@router.post("/", response_model=schemas.Skill)
def create_skill(skill: schemas.SkillCreate, db_session: Session = Depends(db.get_db)):
    return crud.create_skill(db_session, skill)

@router.get("/{skill_id}", response_model=schemas.Skill)
def get_skill(skill_id: int, db_session: Session = Depends(db.get_db)):
    skill = crud.get_skill(db_session, skill_id)
    if not skill:
        raise HTTPException(status_code=404, detail="Skill not found")
    return skill
