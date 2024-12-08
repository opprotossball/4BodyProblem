from fastapi import FastAPI, WebSocket, WebSocketDisconnect, HTTPException
from schemas import InitiateWebSocketResponse
from fastapi import APIRouter, HTTPException, Depends
import os
from dotenv import load_dotenv
from time import sleep
import websockets
import json
import asyncio 
from llm import predict_responses, choose_prediction
import json
from fastapi import FastAPI, WebSocket, WebSocketDisconnect, HTTPException
from schemas import InitiateWebSocketResponse
from fastapi import APIRouter, HTTPException, Depends
import os
from dotenv import load_dotenv
from time import sleep
import websockets
import json
from predictions import add_prediction, clear_predictions, get_predictions

load_dotenv()
planet = os.getenv("PLANET")
interplanetary_ip = os.getenv("INTERPLANETARY_IP")

interplanetary_ws = None

frontend_ws_connections = {}

router = APIRouter()

@router.post("/local-ws", response_model=InitiateWebSocketResponse)
async def open_local_ws(user_id: str):
    if user_id in frontend_ws_connections:
        raise HTTPException(status_code=400, detail="WebSocket already open for this user")
    if user_id == "MARS":
        return InitiateWebSocketResponse(websocket_url=f"ws://localhost:8000/api/v1/ws/{user_id}")
    else:
        return InitiateWebSocketResponse(websocket_url=f"ws://localhost:8001/api/v1/ws/{user_id}")

@router.websocket("/ws/{user_id}")
async def websocket_endpoint(websocket: WebSocket, user_id: str):
    await websocket.accept()
    frontend_ws_connections[user_id] = websocket
    try:
        while True:
            data = await websocket.receive_text()
            #if "is_predicted" in data 
            print(data, flush=True)
            print(type(data), flush=True)
            data = json.loads(data)
            if not data["is_predicted"]:
                await handle_local_message(data)
            else:
                await send(data)

    except WebSocketDisconnect:
        del frontend_ws_connections[user_id]
        print(f"WebSocket disconnected for user {user_id}")

async def send_to_all(message: str):
    print("Sending to all!", flush=True)
    # Iterate over all WebSocket connections
    for user_id, websocket in frontend_ws_connections.items():
        try:
            await websocket.send_text(message)
            print(f"Message sent to user {user_id}: {message}")
        except Exception as e:
            print(f"Failed to send message to user {user_id}: {e}")

async def handle_local_message(message):
    cached_prediction = choose_prediction(message, get_predictions())
    if cached_prediction is not None:
        res = {
            "message": cached_prediction["message"],
            "is_predicted": False
        }
        send_to_all(json.dumps(res))
    else:
        await send(message)
        predictions = predict_responses(message["message"], 3)
        for pred in predictions:
            response = {
                "message": pred,
                "is_predicted": True
            }
            await send_to_all(json.dumps(response))
    clear_predictions()

@router.websocket("/inter-ws")
async def interplanetary_websocket(websocket: WebSocket):
    await websocket.accept()
    try:
        while True:
            data = await websocket.receive_text()
            print(f"interplanetary received: {data}!!", flush=True)
            if not data["is_predicted"]:
                await send_to_all(data)
            else:
                add_prediction(data)
    except WebSocketDisconnect:
        print(f"WebSocket disconnected")

async def send(message):
    print("sending interplanetary message ...")
    await interplanetary_ws.send(json.dumps(message))

@router.post("/interplanetary-connect")
async def interplanetary_connect():
    global interplanetary_ws
    if interplanetary_ws is not None:
        print("Interplanetary-connect: already connected")
        return
    try:
        # Connect to the other backend
        print(f"Connecting to ws://{interplanetary_ip}/api/v1/inter-ws")
        interplanetary_ws = await websockets.connect(f"ws://{interplanetary_ip}/api/v1/inter-ws")
        print("Connected to interplanetary backend.")
    except Exception as e:
        print(f"Failed to connect to interplanetary backend: {e}")
        