from fastapi import APIRouter
from models.room import RoomsResponse, Room, Message, MessagesReponse
from db import db

router = APIRouter(prefix="/rooms", tags=["Rooms"])

@router.get("", response_model=RoomsResponse)
def rooms_list():
    docs = db.collection("chatrooms").get()
    rooms : list[Room] = []

    for doc in docs:
        room_data = doc.to_dict()
        if room_data is None:
            continue

        rooms.append(
            Room(
            id= doc.id,
            name= room_data.get("name", ""),
            members= room_data.get("members", []),
            createdAt= room_data.get("createdAt"),
            ))

    return RoomsResponse(
        success=True,
        rooms=rooms
    )

@router.get("/{room_id}/messages",response_model=MessagesReponse)
def messages(room_id:str):
    docs = db.collection("chatrooms").document(room_id).collection("messages").order_by("createdAt").stream()  
    messages_list : list[Message] = []

    for doc in docs:
        message_data = doc.to_dict()
        if message_data is None:
            continue

        messages_list.append(
            Message(
            id= doc.id,
            text= message_data.get("text", ""),
            senderId= message_data.get("senderId", ""),
            createdAt= message_data.get("createdAt"),
            ))

    return MessagesReponse(
        success=True,
        messages=messages_list
    )

