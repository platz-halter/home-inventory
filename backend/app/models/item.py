from typing import Optional
from sqlalchemy import Integer, String, Text, Float, ForeignKey, Table, Column
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database import Base

item_tags = Table(
    "item_tags",
    Base.metadata,
    Column("item_id", Integer, ForeignKey("items.id"), primary_key=True),
    Column("tag_id", Integer, ForeignKey("tags.id"), primary_key=True),
)

item_categories = Table(
    "item_categories",
    Base.metadata,
    Column("item_id", Integer, ForeignKey("items.id"), primary_key=True),
    Column("category_id", Integer, ForeignKey("categories.id"), primary_key=True),
)


class Item(Base):
    __tablename__ = "items"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)

    # Optional[int] instead of int | None — SQLAlchemy handles this reliably
    room_id: Mapped[Optional[int]] = mapped_column(
        Integer, ForeignKey("rooms.id"), nullable=True
    )

    shelf: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    level_or_drawer: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    comments: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    fill_level: Mapped[Optional[float]] = mapped_column(Float, nullable=True)

    room: Mapped[Optional["Room"]] = relationship("Room", back_populates="items")

    names: Mapped[list["ItemName"]] = relationship(
        "ItemName", back_populates="item", cascade="all, delete-orphan"
    )

    tags: Mapped[list["Tag"]] = relationship(
        "Tag", secondary=item_tags, back_populates="items"
    )

    categories: Mapped[list["Category"]] = relationship(
        "Category", secondary=item_categories, back_populates="items"
    )


class ItemName(Base):
    __tablename__ = "item_names"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    item_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("items.id"), nullable=False, index=True
    )
    name: Mapped[str] = mapped_column(String(200), nullable=False)
    is_primary: Mapped[bool] = mapped_column(default=False)

    item: Mapped["Item"] = relationship("Item", back_populates="names")
