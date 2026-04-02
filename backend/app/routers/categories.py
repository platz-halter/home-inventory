from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas.category import Category, CategoryCreate
from app import crud

router = APIRouter(prefix="/api/categories", tags=["categories"])


@router.get("/", response_model=list[Category])
def list_categories(db: Session = Depends(get_db)):
    return crud.category.get_categories


@router.post("/", response_model=Category, status_code=201)
def create_category(category: CategoryCreate, db: Session = Depends(get_db)):
    return crud.category.create_category(db, category)


@router.delete("/{category_id}", response_model=Category)
def delete_category(category_id: int, db: Session = Depends(get_db)):
    db_category = crud.category.delete_category(db, category_id)
    if not db_category:
        raise HTTPException(status_code=404, detail="Category not found")
    return db_category
