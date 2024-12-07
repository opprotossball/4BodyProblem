from fastapi import FastAPI
from routers import auth, websockets, astronomy
from fastapi.routing import APIRouter


app = FastAPI()
router = APIRouter(prefix="/api/v1")
router.include_router(auth.router, prefix="/auth", tags=["auth"])
app.include_router(astronomy.router, prefix="/astronomy", tags=["astronomy"])
router.include_router(websockets.router, tags=["websocket"])
app.include_router(router)