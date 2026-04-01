from sqlalchemy.orm import Session, joinedload

from app.models.item import Item, ItemName
from app.models.tag import Tag
from app.models.category import Category
from app.schemas.item import ItemCreate, ItemUpdate


"""
Base query that eagerly loads all relationships.
joinedload tells SQLAlchemy to fetch related objects in the same query
instead of making separate DB calls for each relationship.
Without this you'd get N+1 queries — one per item to load its tags etc.
"""


def _get_item_query(db: Session):
    return db.query(Item).options(
        joinedload(Item.names),
        joinedload(Item.room),
        joinedload(Item.tags),
        joinedload(Item.categories),
    )


def get_items(
    db: Session,
    skip: int = 0,
    limit: int = 50,
    search: str | None = None,
    category_id: int | None = None,
    tag_id: int | None = None,
    room_id: int | None = None,
) -> tuple[list[Item], int]:
    query = _get_item_query(db)

    if search:
        query = query.filter(Item.names.any(ItemName.name.ilike(f"%{search}%")))

    if category_id:
        query = query.filter(Item.categories.any(Category.id == category_id))
    if tag_id:
        query = query.filter(Item.tags.any(Tag.id == tag_id))

    if room_id:
        query = query.filter(Item.room_id == room_id)

    total = query.count()
    items = query.offset(skip).limit(limit).all()

    return items, total


def get_item(db: Session, item_id: int) -> Item | None:
    return _get_item_query(db).filter(Item.id == item_id).first()


def create_item(db: Session, item: ItemCreate) -> Item:
    db_item = Item(
        room_id=item.room_id,
        shelf=item.shelf,
        level_or_drawer=item.level_or_drawer,
        comments=item.comments,
        fill_level=item.fill_level,
    )

    db.add(db_item)
    db.flush()

    # Create ItemName rows
    for i, name in enumerate(item.names):
        db_name = ItemName(item_id=db_item.id, name=name, is_primary=(i == 0))
        db.add(db_name)

    # Attatch tags
    if item.tag_ids:
        tags = db.query(Tag).filter(Tag.id.in_(item.tag_ids)).all()
        db_item.tags = tags

    # Attatch categories
    if item.category_ids:
        categories = db.query(Category).filter(Category.id.in_(item.category_ids)).all()
        db_item.categories = categories

    db.commit()
    db.refresh(db_item)
    return db_item


def update_item(db: Session, item_id: int, item: ItemUpdate) -> Item | None:
    db_item = get_item(db, item_id)
    if not db_item:
        return None

    update_data = item.model_dump(exclude_unset=True)

    for field in ["room_id", "shelf", "level_or_drawer", "comments", "fill_level"]:
        if field in update_data:
            setattr(db_item, field, update_data[field])

    # Replace names if provided

    if item.names is not None:
        for name_obj in db_item.names:
            db.delete(name_obj)
        db.flush()

        for i, name in enumerate(item.names):
            db.add(ItemName(item_id=db_item.id, name=name, is_primary=(i == 0)))

    # Replace tags if provided
    if item.tag_ids is not None:
        db_item.tags = db.query(Tag).filter(Tag.id.in_(item.tag_ids)).all()

    # Replace categories if provided
    if item.category_ids is not None:
        db_item.categories = (
            db.query(Category).filter(Category.id.in_(item.category_ids)).all()
        )

    db.commit()
    db.refresh(db_item)
    return db_item


def clone_item(db: Session, item_id: int) -> Item | None:
    original = get_item(db, item_id)
    if not original:
        return None

    cloned = ItemCreate(
        room_id=original.room_id,
        shelf=original.shelf,
        level_or_drawer=original.level_or_drawer,
        comments=original.comments,
        fill_level=original.fill_level,
        names=[f"{n.name} (copy)" for n in original.names],
        tag_ids=[t.id for t in original.tags],
        category_ids=[c.id for c in original.categories],
    )

    return create_item(db, cloned)


def delete_item(db: Session, item_id: int) -> Item | None:
    db_item = get_item(db, item_id)

    if db_item:
        db.delete(db_item)
        db.commit()
    return db_item


def bulk_delete_items(db: Session, item_ids: list[int]) -> int:
    items = db.query(Item).filter(Item.id.in_(item_ids)).all()
    count = len(items)

    for item in items:
        db.delete(item)
    db.commit()
    return count
