from enum import unique
from operator import index
from sqlalchemy import Integer, String, false, true
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database import Base


class Tag(Base):
    __tablename__ = "tags"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String(50), nullable=False, unique=True)

    # The relationship back to items — SQLAlchemy handles the join table
    items: Mapped[list["Item"]] = relationship(
        "Item",
        secondary="item_tags",  # name of the association table
        back_populates="tags",
    )
