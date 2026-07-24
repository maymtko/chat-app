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
        # self.rooms: dict[str, set[WebSocket]] = {}
        self.rooms: dict[str, list] = {}


    async def connect(self, room_id: str, websocket: WebSocket, user_info):
        if room_id not in self.rooms:
            self.rooms[room_id] = []
            # self.rooms[room_id] = set()
        # self.rooms[room_id].add(websocket)
        self.rooms[room_id].append({
            "ws": websocket,
            "user": user_info
        })

    def disconnect(self, room_id: str, websocket: WebSocket):
        if room_id in self.rooms:
            self.rooms[room_id] = [
                conn
                for conn in self.rooms[room_id]
                if conn["ws"] != websocket
            ]

        # self.rooms.get(room_id, set()).discard(websocket)

    async def broadcast(self, room_id: str, message: dict):
        # print(f"Connections in room {room_id}: {len(self.rooms.get(room_id, []))}")
        # for ws in self.rooms.get(room_id, []):
        #     print("Sending:", message)
        #     await ws.send_json(message)
        connections = self.rooms.get(room_id, [])

        print(f"Connections in room {room_id}: {len(connections)}")

        for conn in connections:
            print("Sending:", message)
            await conn["ws"].send_json(message)



manager = ConnectionManager()