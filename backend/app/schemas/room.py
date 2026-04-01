from pydantic import BaseModel


class RoomBase(BaseModel):
    name: str


class RoomCreate(RoomBase):
    pass


class Room(RoomBase):
    id: int

    model_config = {"from_attributes": True}
    # Let Pydantic read SQLAlchemy model objects
