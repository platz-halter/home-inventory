from sqlalchemy.orm import Session
from app.models.room import Room
from app.schemas.room import RoomCreate


def get_rooms(db: Session) -> list[Room]:
    return db.query(Room).order_by(Room.name).all()


def get_room(db: Session, room_id: int) -> Room | None:
    return db.query(Room).filter(Room.id == room_id).first()


def get_room_by_name(db: Session, name: str) -> Room | None:
    return db.query(Room).filter(Room.name == name).first()


def create_room(db: Session, room: RoomCreate) -> Room | None:
    db_room = Room(name=room.name)

    db.add(db_room)
    db.commit()
    db.refresh(db_room)  # Reload DB -> get generated ID
    return db_room


def delete_room(db: Session, room_id: int) -> Room | None:
    db_room = get_room(db, room_id)

    if db_room:
        db.delete(db_room)
        db.commit()
    return db_room
