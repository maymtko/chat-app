from fastapi import WebSocket

# class ConnectionManager:
#     def __init__(self):
#         self.active_connections: list[WebSocket] = []

#     async def connect(self, websocket: WebSocket):
#         await websocket.accept()
#         self.active_connections.append(websocket)

#     def disconnect(self, websocket: WebSocket):
#         self.active_connections.remove(websocket)

#     async def broadcast(self, message: dict):
#         for connection in self.active_connections:
#             await connection.send_json(message)

class ConnectionManager:
    def __init__(self):
        self.rooms: dict[str, set[WebSocket]] = {}

    async def connect(self, room_id: str, websocket: WebSocket):
        if room_id not in self.rooms:
            self.rooms[room_id] = set()
        self.rooms[room_id].add(websocket)

    def disconnect(self, room_id: str, websocket: WebSocket):
        self.rooms.get(room_id, set()).discard(websocket)

    async def broadcast(self, room_id: str, message: dict):
        for ws in self.rooms.get(room_id, []):
            await ws.send_json(message)


manager = ConnectionManager()