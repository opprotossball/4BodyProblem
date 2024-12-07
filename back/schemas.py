from pydantic import BaseModel

class UserBase(BaseModel):
    username: str

class UserCreate(UserBase):
    password: str

class UserOut(UserBase):
    id: int

class Config:
    orm_mode = True

class Token(BaseModel):
    access_token: str
    token_type: str

class InitiateWebSocketResponse(BaseModel):
    websocket_url: str

class LightTimeResponse(BaseModel):
    light_minutes: int