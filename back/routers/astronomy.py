from fastapi import FastAPI, WebSocket, WebSocketDisconnect, HTTPException
from schemas import InitiateWebSocketResponse
from fastapi import APIRouter, HTTPException, Depends
from schemas import LightTimeResponse
from skyfield.api import load

# Load the JPL ephemeris DE421 (covers 1900-2050).
planets = load('de421.bsp')
earth, mars = planets['earth'], planets['mars']



router = APIRouter()

@router.get("/lightTime", response_model=LightTimeResponse)
async def get_light_time():
    # Create a timescale and ask the current time.
    ts = load.timescale()
    t = ts.now()
    # position of Mars, viewed from Earth?
    astrometric = earth.at(t).observe(mars)
    ra, dec, distance = astrometric.radec()
    return LightTimeResponse(light_minutes=float(distance.light_seconds() / 60))
