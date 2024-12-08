from fastapi import FastAPI, WebSocket, WebSocketDisconnect, HTTPException
from schemas import InitiateWebSocketResponse
from fastapi import APIRouter, HTTPException, Depends
import os
from dotenv import load_dotenv
from time import sleep
import websockets
import json

from routers.inter_ws import send
from llm import predict_responses
import json

frontend_ws_connections = {}

router = APIRouter()

@router.post("/local-ws", response_model=InitiateWebSocketResponse)
async def open_local_ws(user_id: str):
    if user_id in frontend_ws_connections:
        raise HTTPException(status_code=400, detail="WebSocket already open for this user")
    return InitiateWebSocketResponse(websocket_url=f"ws://localhost:8000/api/v1/ws/{user_id}")

@router.websocket("/ws/{user_id}")
async def websocket_endpoint(websocket: WebSocket, user_id: str):
    await websocket.accept()
    frontend_ws_connections[user_id] = websocket
    try:
        while True:
            data = await websocket.receive_text()
            print(f"received local: {data}")
            await handle_local_message(json.loads(data))
    except WebSocketDisconnect:
        del frontend_ws_connections[user_id]
        print(f"WebSocket disconnected for user {user_id}")

async def send_to_all(message: str):
    # Iterate over all WebSocket connections
    for user_id, websocket in frontend_ws_connections.items():
        try:
            await websocket.send_text(message)
            print(f"Message sent to user {user_id}: {message}")
        except Exception as e:
            print(f"Failed to send message to user {user_id}: {e}")

async def handle_local_message(message):
    print("handling message")
    send(message)
    predictions = predict_responses(message["message"], 3)
    print(predictions)
    for pred in predictions:
        response = {
            "message": pred,
            "is_predicted": True
        }
        await send_to_all(json.dumps(response))