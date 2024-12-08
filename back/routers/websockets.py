from fastapi import FastAPI, WebSocket, WebSocketDisconnect, HTTPException
from schemas import InitiateWebSocketResponse
from fastapi import APIRouter, HTTPException, Depends
import os
from dotenv import load_dotenv
from time import sleep

load_dotenv()
planet = os.getenv("PLANET")
interplanetary_ip = os.getenv("INTERPLANETARY_IP")

frontend_ws_connections = {}
interplanetary_ws = None

router = APIRouter()

@router.post("/local-ws", response_model=InitiateWebSocketResponse)
async def open_websocket(user_id: str):
    if user_id in frontend_ws_connections:
        raise HTTPException(status_code=400, detail="WebSocket already open for this user")
    return InitiateWebSocketResponse(websocket_url=f"ws://localhost:8000/api/v1/ws/{user_id}")

@router.post("/interplanetary-ws", response_model=InitiateWebSocketResponse)
async def open_websocket():
    return InitiateWebSocketResponse(websocket_url=f"ws://localhost:8000/api/v1/ws/interplanetary")

@router.websocket("/ws/{user_id}")
async def websocket_endpoint(websocket: WebSocket, user_id: str):
    """
    Handles WebSocket connections for a specific user.
    """
    await websocket.accept()
    frontend_ws_connections[user_id] = websocket
    try:
        while True:
            data = await websocket.receive_text()
            #await websocket.send_text(f"Received message: {data}")

    except WebSocketDisconnect:
        del frontend_ws_connections[user_id]
        print(f"WebSocket disconnected for user {user_id}")

@router.websocket("/ws/{user_id}")
async def interplanetary_websocket(websocket: WebSocket, user_id: str):
    await websocket.accept()
    frontend_ws_connections[user_id] = websocket
    try:
        while True:
            data = await websocket.receive_text()
            print(data)
            #await websocket.send_text(f"Received message: {data}")
    except WebSocketDisconnect:
        del frontend_ws_connections[user_id]
        print(f"WebSocket disconnected for user {user_id}")

def interplanetary_forward(message):
    interplanetary_ws.send_text(message)

async def interplanetary_connect():
    global interplanetary_ws
    try:
        # Connect to the other backend
        print(f"Connecting to {interplanetary_ip}")
        interplanetary_ws = WebSocket()
        await interplanetary_ws.connect(f"{interplanetary_ip}/api/v1/interplanetary-ws")
        print("Connected to interplanetary backend.")
    except Exception as e:
        print(f"Failed to connect to interplanetary backend: {e}")