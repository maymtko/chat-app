from fastapi import APIRouter, WebSocket, WebSocketDisconnect,status
from db import db
from datetime import datetime
from routes.auth import verify_token
from ws.manager import manager
from firebase_admin import auth
from datetime import datetime, timezone
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
    
    if not user_id:
        await ws.close(code=status.WS_1008_POLICY_VIOLATION)
        return

    firebase_user = auth.get_user(user_id)

    user_info = {
        "id": firebase_user.uid,
        "name": firebase_user.display_name or "Anonymous",
        "photo_url": firebase_user.photo_url or ""
    }

    room_doc = db.collection("chatrooms").document(room_id).get()
    if not room_doc.exists or user_id not in (room_doc.to_dict() or {}).get("members", []):
        await ws.close(code=1008)
        return

    # await manager.connect(ws)
    print('ws room_id',room_id)
    await manager.connect(room_id, ws,user_info) 
    
    try:
        while True:
            data = await ws.receive_json()
            # Check event type
            event_type = data.get("type")

            if event_type == "typing":
                typing_payload = {
                    "type": "typing",
                    "senderId": user_info["id"],
                    "username": user_info["name"],
                    "photoUrl": user_info["photo_url"],
                    "isTyping": data.get("isTyping", False)
                }
                await manager.broadcast(room_id, typing_payload)
                continue
            # Default behavior
            text = data.get("text")

            message = {
                "type": "message",
                "senderId": user_info["id"],
                "name": user_info["name"],
                "photoUrl": user_info["photo_url"],
                "text": text,
                "createdAt": datetime.now(timezone.utc).isoformat(),
            }
            #broadcast   
            await manager.broadcast(room_id,message)                             
            print("Broadcast complete")

            # save to Firestore
            db.collection("chatrooms") \
              .document(room_id) \
              .collection("messages") \
              .add(message)
            print("About to broadcast:", message)


    except WebSocketDisconnect:
        manager.disconnect(room_id,ws)
        print("WS disconnected", room_id)