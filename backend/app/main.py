from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from alembic.config import Config
from alembic import command
from app.routers import items, rooms, tags, categories, stats


def run_migrations():
    alembic_cfg = Config("alembic.ini")
    command.upgrade(alembic_cfg, "head")


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Runs on startup — before the app accepts requests
    run_migrations()
    yield
    # Runs on shutdown — after the app stops accepting requests
    # Nothing to clean up for now, but the structure is here


app = FastAPI(
    title="Home Inventory API",
    version="0.1.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(items.router)
app.include_router(rooms.router)
app.include_router(tags.router)
app.include_router(categories.router)
app.include_router(stats.router)


@app.get("/health")
def health_check():
    return {"status": "ok"}
