from fastapi import FastAPI, WebSocket, WebSocketDisconnect, HTTPException
from schemas import InitiateWebSocketResponse
from fastapi import APIRouter, HTTPException, Depends
import os
from dotenv import load_dotenv
from time import sleep
import websockets

frontend_ws_connections = {}

router = APIRouter()

@router.post("/local-ws", response_model=InitiateWebSocketResponse)
async def open_local_ws(user_id: str):
    if user_id in frontend_ws_connections:
        raise HTTPException(status_code=400, detail="WebSocket already open for this user")
    return InitiateWebSocketResponse(websocket_url=f"ws://localhost:8000/api/v1/ws/{user_id}")

# @router.post("/interplanetary-ws", response_model=InitiateWebSocketResponse)
# async def open_websocket():
#     return InitiateWebSocketResponse(websocket_url=f"ws://localhost:8000/api/v1/ws/interplanetary")

@router.websocket("/ws/{user_id}")
async def websocket_endpoint(websocket: WebSocket, user_id: str):
    await websocket.accept()
    frontend_ws_connections[user_id] = websocket
    try:
        while True:
            data = await websocket.receive_text()
            #await websocket.send_text(f"Received message: {data}")
    except WebSocketDisconnect:
        del frontend_ws_connections[user_id]
        print(f"WebSocket disconnected for user {user_id}")
