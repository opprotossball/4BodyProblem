from fastapi import FastAPI
from routers import auth, websockets, astronomy
from fastapi.routing import APIRouter

from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins
    allow_credentials=True,  # Allow credentials
    allow_methods=["*"],  # Allow all HTTP methods
    allow_headers=["*"],  # Allow all HTTP headers
)

router = APIRouter(prefix="/api/v1")
router.include_router(auth.router, prefix="/auth", tags=["auth"])
app.include_router(astronomy.router, prefix="/astronomy", tags=["astronomy"])
router.include_router(websockets.router, tags=["websocket"])
app.include_router(router)