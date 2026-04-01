from pydantic import BaseModel, field_validator
from typing import Optional

from pydantic_core.core_schema import str_schema
from .room import Room
from .tag import Tag
from .category import Category


class ItemNameBase(BaseModel):
    name: str
    is_primary: bool = False


class ItemNameCreate(ItemNameBase):
    pass


class ItemName(ItemNameBase):
    id: int
    item_id: int
    model_config = {"from_attributes": True}


class ItemBase(BaseModel):
    room_id: Optional[int] = None
    shelf: Optional[str] = None
    level_or_drawer: Optional[str] = None
    comments: Optional[str] = None
    fill_level: Optional[float] = None

    # Validate if fill_level is in allowed range(0.0-1.0)

    @field_validator("fill_level")
    @classmethod
    def validate_fill_level(cls, v):
        if v is not None and not 0.0 <= v <= 1.0:
            raise ValueError("fill_level must be between 0.0 and 1.0")
        return v


class ItemCreate(ItemBase):
    names: list[str]
    tag_ids: list[int] = []
    category_ids: list[int] = []

    @field_validator("names")
    @classmethod
    def validate_names(cls, v):
        if not v:
            raise ValueError("At least one name is required")
        return v


class ItemUpdate(ItemBase):
    # Fields are optional because partial updates are allowed
    names: Optional[list[str]] = None
    tag_ids: Optional[list[int]] = None
    category_ids: Optional[list[int]] = None


class Item(ItemBase):
    id: int
    names: list[ItemName] = []
    room: Optional[Room] = None
    tags: list[Tag] = []
    categories: list[Category] = []

    model_config = {"from_attributes": True}


# Paginated list response
class ItemList(BaseModel):
    items: list[Item]
    total: int
    skip: int
    limit: int
