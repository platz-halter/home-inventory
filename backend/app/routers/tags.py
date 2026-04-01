from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from starlette.types import HTTPExceptionHandler
from app.database import get_db
from app.schemas.tag import Tag, TagCreate
from app import crud

router = APIRouter(prefix="/api/tags", tags=["tags"])


@router.get("/", response_model=list[Tag])
def list_tags(db: Session = Depends(get_db)):
    return crud.tag.get_tags(db)


@router.post("/", response_model=Tag, status_code=201)
def create_tag(tag: TagCreate, db: Session = Depends(get_db)):
    return crud.tag.create_tag(db, tag)


@router.delete("/{tag_id}", response_model=Tag)
def delete_tag(tag_id: int, db: Session = Depends(get_db)):
    db_tag = crud.tag.delete_tag(db, tag_id)
    if not db_tag:
        raise HTTPException(status_code=404, detail="Tag not found")
    return db_tag
