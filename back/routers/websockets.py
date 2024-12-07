from fastapi import FastAPI, WebSocket, WebSocketDisconnect, HTTPException
from schemas import InitiateWebSocketResponse
from fastapi import APIRouter, HTTPException, Depends

router = APIRouter()

frontend_ws_connections = {}
backend_ws = None

@router.post("/local-ws", response_model=InitiateWebSocketResponse)
async def open_websocket(user_id: str):
    """
    REST endpoint to initiate a WebSocket.
    Returns the WebSocket URL for the client to connect.
    """
    if user_id in frontend_ws_connections:
        raise HTTPException(status_code=400, detail="WebSocket already open for this user")
    return InitiateWebSocketResponse(websocket_url=f"ws://localhost:8000/ws/{user_id}")

@router.post("/interplanetary-ws", response_model=InitiateWebSocketResponse)
async def open_websocket():
    """
    REST endpoint to initiate a WebSocket.
    Returns the WebSocket URL for the client to connect.
    """
    return InitiateWebSocketResponse(websocket_url=f"ws://localhost:8000/ws/interplanetary")

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
            await websocket.send_text(f"Received message: {data}")
    except WebSocketDisconnect:
        del frontend_ws_connections[user_id]
        print(f"WebSocket disconnected for user {user_id}")
