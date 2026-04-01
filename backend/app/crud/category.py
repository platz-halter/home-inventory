from sqlalchemy.orm import Session
from app.models.category import Category
from app.schemas.category import CategoryCreate


def get_categories(db: Session) -> list[Category]:
    return db.query(Category).order_by(Category.name).all()


def get_category(db: Session, category_id: int) -> Category | None:
    return db.query(Category).filter(Category.id == category_id).first()


def create_category(db: Session, category: CategoryCreate) -> Category:
    db_category = Category(name=category.name)
    db.add(db_category)
    db.commit()
    db.refresh(db_category)
    return db_category


def delete_category(db: Session, category_id: int) -> Category | None:
    db_category = get_category(db, category_id)

    if db_category:
        db.delete(db_category)
        db.commit()
    return db_category
