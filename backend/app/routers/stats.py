from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.database import get_db
from app.models.item import Item
from app.models.room import Room
from app.models.tag import Tag
from app.models.category import Category

router = APIRouter(prefix="/api/stats", tags=["stats"])


@router.get("/")
def get_stats(db: Session = Depends(get_db)):
    return {
        "total_items": db.query(func.count(Item.id)).scalar(),
        "total_rooms": db.query(func.count(Room.id)).scalar(),
        "total_tags": db.query(func.count(Tag.id)).scalar(),
        "total_categories": db.query(func.count(Category.id)).scalar(),
        # Items with no room assigned
        "unlocated_items": db.query(func.count(Item.id))
        .filter(Item.room_id == None)
        .scalar(),
        # Items with fill level below 25%
        "low_fill_items": db.query(func.count(Item.id))
        .filter(Item.fill_level < 0.25, Item.fill_level != None)
        .scalar(),
    }
