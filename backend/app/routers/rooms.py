from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import delete, exists
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas.room import Room, RoomCreate
from app import crud

router = APIRouter(prefix="/api/rooms", tags=["rooms"])


@router.get("/", response_model=list[Room])
def list_rooms(db: Session = Depends(get_db)):
    return crud.room.get_rooms(db)


@router.post("/", response_model=Room, status_code=201)
def create_room(room: RoomCreate, db: Session = Depends(get_db)):
    existing = crud.room.get_room_by_name(db, room.name)

    if existing:
        raise HTTPException(status_code=400, detail="Room already exists")
    return crud.room.create_room(db, room)


@router.delete("/{room_id}", response_model=Room)
def delete_room(room_id: int, db: Session = Depends(get_db)):
    db_room = crud.room.delete_room(db, room_id)

    if not db_room:
        raise HTTPException(status_code=404, detail="Room not found")
    return db_room
