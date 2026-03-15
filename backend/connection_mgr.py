from fastapi import WebSocket
from typing import List

class ConnectionManager:
    def __init__(self):
        # 存放所有已连接的 WebSocket 客户端
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        # 接受连接并将其加入池中
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        # 客户端断开时移出池子
        self.active_connections.remove(websocket)

    async def broadcast_json(self, message: dict):
        # 将结构化的 JSON 数据广播给所有连接的客户端
        for connection in self.active_connections:
            try:
                await connection.send_json(message)
            except Exception as e:
                print(f"发送消息失败: {e}")

# 实例化一个全局的连接管理器
manager = ConnectionManager()