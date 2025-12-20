from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class Room(BaseModel):
    id: str
    name: str
    createdAt: Optional[datetime] 
    members: List[str]

class RoomsResponse(BaseModel):
    success: bool
    rooms: List[Room]


class Message(BaseModel):
    id: str
    senderId : str
    text: str
    createdAt: Optional[datetime] 


class MessagesReponse(BaseModel):
    success: bool
    messages: List[Message]