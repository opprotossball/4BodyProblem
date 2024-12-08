from fastapi import FastAPI
from routers import auth, ws, astronomy
from fastapi.routing import APIRouter
from llm import test
from fastapi.middleware.cors import CORSMiddleware
import time 
import asyncio 

# Define the lifespan event handler
# async def lifespan(app: FastAPI):
#     print("Application is starting...")
#     await asyncio.sleep(5)  # Simulate delay
#     await websockets.interplanetary_connect()
#     yield  # Yield control back to FastAPI for the application runtime
#     print("Application is shutting down...")

#app = FastAPI(lifespan=lifespan)
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

router.include_router(ws.router, tags=["ws"])

app.include_router(router)
