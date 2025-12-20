from fastapi import FastAPI,HTTPException, Depends, WebSocket, WebSocketDisconnect
import firebase_admin
from firebase_admin import credentials
from firebase_admin import auth
from pydantic import BaseModel, EmailStr
from jose import jwt
from fastapi.responses import HTMLResponse
from routes.rooms import router as rooms_router
from routes.ws_chat import router as ws_router
from routes.auth import router as auth_router
from db import db
from settings import settings

app = FastAPI()
app.include_router(rooms_router)
app.include_router(ws_router)
app.include_router(auth_router)
print(app.routes)

from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)