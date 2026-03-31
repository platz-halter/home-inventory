from operator import index
from sqlalchemy import Integer, String, Text, Float, ForeignKey, Table, Column, false
from sqlalchemy.orm import Mapped, MappedColumn, mapped_column, relationship
from app.database import Base

# Association tables
item_tags = Table(
    "item_tags",
    Base.metadata,
    Column("item_id", Integer, ForeignKey("items.id"), primary_key=True),
    Column("tag_id", Integer, ForeignKey("categories.id"), primary_key=True),
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

    room_id: Mapped[int | None] = mapped_column(
        Integer, ForeignKey("rooms.id"), nullable=True
    )

    shelf: Mapped[str | None] = mapped_column(String(100), nullable=True)
    level_or_drawer: Mapped[str | None] = mapped_column(String(100), nullable=True)

    comments: Mapped[str | None] = mapped_column(Text, nullable=True)

    # 0.0 empty 1.0 Full
    fill_level: Mapped[float | None] = mapped_column(Float)

    # Relationships
    room: Mapped[float | None] = relationship("Room", back_populates="items")

    names: Mapped[list["ItemName"]] = relationship(
        "ItemName",
        back_populates="item",
        cascade="all, delete-orphan",  # Deleting items also removes the linked names from the Names table
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
    is_primary: Mapped[bool] = mapped_column(default=false)

    item: Mapped["Item"] = relationship("Item", back_populates="names")
