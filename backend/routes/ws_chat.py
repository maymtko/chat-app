from fastapi import APIRouter, WebSocket, WebSocketDisconnect,status
from db import db
from datetime import datetime
from routes.auth import verify_token
from ws.manager import manager

router = APIRouter()

@router.websocket("/ws/rooms/{room_id}")
async def chat_room(ws: WebSocket, room_id: str):
    # token = ws.query_params.get("token")
    await ws.accept()
    token = ws.cookies.get("access_token")
    if not token:
        await ws.close(code=status.WS_1008_POLICY_VIOLATION)
        return

    user_id = verify_token(token)
    print('user',user_id)
    if not user_id:
        await ws.close(code=status.WS_1008_POLICY_VIOLATION)
        return

    room_doc = db.collection("chatrooms").document(room_id).get()
    if not room_doc.exists or user_id not in room_doc.to_dict().get("members", []):
        await ws.close(code=1008)
        return

    # await manager.connect(ws)
    print('ws room_id',room_id)
    await manager.connect(room_id, ws) 
    
    try:
        while True:
            data = await ws.receive_json()
            text = data.get("text")

            message = {
                "senderId": user_id,
                "text": text,
                "createdAt":datetime.utcnow().isoformat(),
            }

            # save to Firestore
            db.collection("chatrooms") \
              .document(room_id) \
              .collection("messages") \
              .add(message)

            #broadcast
            await manager.broadcast(room_id,message)

    except WebSocketDisconnect:
        manager.disconnect(room_id,ws)
        print("WS disconnected", room_id)