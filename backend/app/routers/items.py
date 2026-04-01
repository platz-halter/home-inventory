from os import stat
from fastapi import APIRouter, HTTPException, Depends, Query
from sqlalchemy.orm import Session
from typing import Optional

from app.database import get_db
from app.schemas.item import Item, ItemCreate, ItemUpdate, ItemList
from app import crud

router = APIRouter(prefix="/api/items", tags=["items"])


@router.get("/", response_model=ItemList)
def list_items(
    skip: int = Query(default=0, ge=0),
    limit: int = Query(default=50, ge=1, le=200),
    search: Optional[str] = Query(default=None),
    category_id: Optional[int] = Query(default=None),
    tag_id: Optional[int] = Query(default=None),
    room_id: Optional[int] = Query(default=None),
    db: Session = Depends(get_db),
):
    items, total = crud.item.get_items(
        db,
        skip=skip,
        limit=limit,
        search=search,
        category_id=category_id,
        tag_id=tag_id,
        room_id=room_id,
    )
    return ItemList(items=items, total=total, skip=skip, limit=limit)


@router.get("/{item_id}", response_model=Item)
def get_item(item_id: int, db: Session = Depends(get_db)):
    db_item = crud.item.get_item(db, item_id)

    if not db_item:
        raise HTTPException(status_code=404, detail="Item not found")
    return db_item


@router.post("/", response_model=Item, status_code=201)
def create_item(item: ItemCreate, db: Session = Depends(get_db)):
    return crud.item.create_item(db, item)


@router.patch("/{item_id}", response_model=Item)
def update_item(item_id: int, item: ItemUpdate, db: Session = Depends(get_db)):
    db_item = crud.item.update_item(db, item_id, item)
    if not db_item:
        raise HTTPException(status_code=404, detail="Item not found")
    return db_item


@router.delete("/item_id", response_model=Item)
def delete_item(item_id: int, db: Session = Depends(get_db)):
    db_item = crud.item.delete_item(db, item_id)

    if not db_item:
        raise HTTPException(status_code=404, detail="Item not found")
    return db_item


@router.post("/{item_id}/clone", response_model=Item, status_code=201)
def clone_item(item_id: int, db: Session = Depends(get_db)):
    db_item = crud.item.clone_item(db, item_id)

    if not db_item:
        raise HTTPException(status_code=404, detail="Item not found")
    return db_item


@router.delete("/bulk/delete", response_model=dict)
def bulk_delete(item_ids: list[int], db: Session = Depends(get_db)):
    count = crud.item.bulk_delete_items(db, item_ids)
    return {"deleted": count}
