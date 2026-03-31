from sqlalchemy import Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database import Base


class Room(Base):
    __tablename__ = "rooms"

    # Declare columns

    # Mapped[int] tells SQLAlchemy the exact Python type
    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String(100), nullable=False, unique=True)

    items: Mapped[list["Item"]] = relationship("Item", back_populates="room")
