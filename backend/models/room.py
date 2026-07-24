from datetime import datetime

from pydantic import BaseModel


class Room(BaseModel):
    id: str
    name: str
    createdAt: datetime | None 
    members: list[str]

class RoomsResponse(BaseModel):
    success: bool
    rooms: list[Room]


class Message(BaseModel):
    id: str
    senderId : str
    name: str
    photoUrl: str
    text: str
    createdAt: datetime | None 


class MessagesReponse(BaseModel):
    success: bool
    messages: list[Message]