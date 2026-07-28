from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routes.auth import router as auth_router
from routes.rooms import router as rooms_router
from routes.ws_chat import router as ws_router

app = FastAPI()
app.include_router(rooms_router)
app.include_router(ws_router)
app.include_router(auth_router)

# Allowed origins
origins = [
    "http://localhost:3000",
    "https://chat-app-may-0038.vercel.app",

]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
