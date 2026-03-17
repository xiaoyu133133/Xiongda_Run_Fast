from fastapi import WebSocket
from typing import List, Dict

class ConnectionManager:
    def __init__(self):
        # 1. 存放前端大屏客户端
        self.frontend_clients: List[WebSocket] = []
        # 2. 存放边缘设备 (字典格式: {"rescue_car_01": WebSocket对象})
        self.edge_devices: Dict[str, WebSocket] = {}
        # 3. 在内存中维护设备的最新状态 (用来存心跳包发来的延迟)
        self.device_states: Dict[str, dict] = {}

    # --- 前端大屏连接管理 ---
    async def connect_frontend(self, websocket: WebSocket):
        await websocket.accept()
        self.frontend_clients.append(websocket)

    def disconnect_frontend(self, websocket: WebSocket):
        if websocket in self.frontend_clients:
            self.frontend_clients.remove(websocket)

    async def broadcast_to_frontend(self, message: dict):
        """将消息广播给所有打开了网页大屏的人"""
        for connection in self.frontend_clients:
            try:
                await connection.send_json(message)
            except Exception as e:
                print(f"发送前端失败: {e}")

    # --- 边缘设备连接管理 ---
    async def connect_edge(self, websocket: WebSocket, device_id: str):
        await websocket.accept()
        self.edge_devices[device_id] = websocket
        # 初始化设备状态为在线
        self.device_states[device_id] = {"status": "online", "latency_ms": 0}
        print(f"🔌 边缘设备上线: {device_id}")

    def disconnect_edge(self, device_id: str):
        if device_id in self.edge_devices:
            del self.edge_devices[device_id]
        if device_id in self.device_states:
            self.device_states[device_id]["status"] = "offline" # 标记为掉线
        print(f"❌ 边缘设备掉线: {device_id}")

    def update_edge_state(self, device_id: str, payload: dict):
        """收到心跳包时，更新设备状态"""
        if device_id in self.device_states:
            self.device_states[device_id].update(payload)
            self.device_states[device_id]["status"] = "online"

# 实例化全局管理器
manager = ConnectionManager()