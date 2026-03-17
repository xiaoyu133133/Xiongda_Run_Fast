import asyncio
import json
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from connection_mgr import manager

app = FastAPI(title="无人化精准搜救指挥中心 API")

# 跨域配置
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ==========================================
# 📺 路由 1: 前端大屏接入端
# ==========================================
@app.websocket("/ws/frontend")
async def frontend_endpoint(websocket: WebSocket):
    await manager.connect_frontend(websocket)
    try:
        while True:
            data = await websocket.receive_text()
            payload = json.loads(data)
            
            # 只有人类会从前端发消息 (优先级干预)
            if payload.get("type") == "chat_message":
                # 收到人类指令，原样广播给前端显示，并触发 AI 打断逻辑
                await manager.broadcast_to_frontend(payload)
                print(f"收到人类干预指令: {payload['payload']['content']}")
                
    except WebSocketDisconnect:
        manager.disconnect_frontend(websocket)


# ==========================================
# 👁️ 路由 2: 边缘视觉与传感器接入端 (重点！)
# ==========================================
@app.websocket("/ws/edge/{device_id}")
async def edge_endpoint(websocket: WebSocket, device_id: str):
    """
    边缘设备连接的接口。例如: ws://127.0.0.1:8000/ws/edge/rescue_car_01
    """
    await manager.connect_edge(websocket, device_id)
    try:
        while True:
            data = await websocket.receive_text()
            message = json.loads(data)
            msg_type = message.get("type")
            payload = message.get("payload", {})

            # 场景 A: 收到边缘心跳包
            if msg_type == "edge_heartbeat":
                # 更新内存中的延迟数据
                manager.update_edge_state(device_id, payload)
                print(f"💓 收到心跳 [{device_id}]: 延迟 {payload.get('latency_ms')}ms")

            # 场景 B: 收到视觉检测到的目标坐标
            elif msg_type == "edge_vision_objects":
                objects = payload.get("objects", [])
                print(f"👁️ 视觉捕获 [{device_id}]: 发现 {len(objects)} 个目标 -> {objects}")
                
                # 动作 1: 将视觉数据转发给前端大屏，用于雷达图或日志展示
                await manager.broadcast_to_frontend(message)
                
                # 动作 2: TODO -> 唤醒多智能体 AI 进行逻辑推理！
                # asyncio.create_task(trigger_ai_agents(objects))

            # 场景 C: 收到雷达扫描或温度数据
            elif msg_type in ["edge_radar_scan", "edge_temperature"]:
                print(f"📡 收到传感器数据 [{device_id}]: {msg_type}")
                # 同样转发给前端展示
                await manager.broadcast_to_frontend(message)

    except WebSocketDisconnect:
        manager.disconnect_edge(device_id)


# ==========================================
# ⏲️ 后台任务: 定期向前端推送系统设备状态
# ==========================================
@app.on_event("startup")
async def start_background_tasks():
    async def broadcast_system_status():
        while True:
            # 每隔 1 秒，把设备字典打包发给前端
            if manager.frontend_clients:
                status_msg = {
                    "type": "system_device_status",
                    "timestamp": 0, # 这里可以用 time.time()
                    "payload": {
                        "devices": [
                            {"device_id": k, **v} for k, v in manager.device_states.items()
                        ]
                    }
                }
                await manager.broadcast_to_frontend(status_msg)
            await asyncio.sleep(1)

    # 启动异步后台任务
    asyncio.create_task(broadcast_system_status())