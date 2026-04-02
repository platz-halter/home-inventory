from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import items, rooms, tags, categories, stats

app = FastAPI(title="Home Inventory API", version="0.1.0")

# CORS — browsers block requests from one address (localhost:3000)
# to another (localhost:8000) unless the backend explicitly allows it
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # frontend dev server
    allow_credentials=True,
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
