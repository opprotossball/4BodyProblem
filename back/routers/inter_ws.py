from fastapi import FastAPI, WebSocket, WebSocketDisconnect, HTTPException
from schemas import InitiateWebSocketResponse
from fastapi import APIRouter, HTTPException, Depends
import os
from dotenv import load_dotenv
from time import sleep
import websockets

load_dotenv()
planet = os.getenv("PLANET")
interplanetary_ip = os.getenv("INTERPLANETARY_IP")

interplanetary_ws = None

router = APIRouter()

# @router.post("/inter-ws", response_model=InitiateWebSocketResponse)
# async def open_inter_ws():
#     return InitiateWebSocketResponse(websocket_url=f"ws://localhost:8000/api/v1/inter-ws")

@router.websocket("/inter-ws")
async def interplanetary_websocket(websocket: WebSocket):
    await websocket.accept()
    interplanetary_ws = websocket
    try:
        while True:
            data = await websocket.receive_text()
            print(f"interplanetary received: {data}")
            #await websocket.send_text(f"Received message: {data}")
    except WebSocketDisconnect:
        print(f"WebSocket disconnected")

def interplanetary_forward(message):
    interplanetary_ws.send_text(message)

@router.post("/interplanetary-connect")
async def interplanetary_connect():
    global interplanetary_ws
    try:
        # Connect to the other backend
        print(f"Connecting to ws://{interplanetary_ip}/api/v1/inter-ws")
        interplanetary_ws = await websockets.connect(f"ws://{interplanetary_ip}/api/v1/inter-ws")
        print("Connected to interplanetary backend.")
    except Exception as e:
        print(f"Failed to connect to interplanetary backend: {e}")
        