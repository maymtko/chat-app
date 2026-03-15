from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.rooms import router as rooms_router
from routes.ws_chat import router as ws_router
from routes.auth import router as auth_router

app = FastAPI()
app.include_router(rooms_router)
app.include_router(ws_router)
app.include_router(auth_router)
print(app.routes)

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
