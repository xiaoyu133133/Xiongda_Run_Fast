import asyncio
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from connection_mgr import manager
import json

app = FastAPI(title="无人化精准搜救指挥中心 API")

@app.get("/")
async def root():
    return {"message": "搜救系统后端运行正常！请使用 WebSocket 连接 /ws/command_center"}

@app.websocket("/ws/command_center")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            #持续监听客户端发来的消息（接收 JSON 字符串）
            data = await websocket.receive_text()
            payload = json.loads(data)
            
            #消息路由中心
            
            #接收到边缘侧传来的视觉坐标数据
            if payload.get("type") == "vision_input":
                # 提取坐标
                x = payload.get("data").get("x")
                y = payload.get("data").get("y")
                
                # 广播给前端大屏的“左侧设备监控区”
                await manager.broadcast_json({
                    "type": "system_status",
                    "source": "Edge Vision",
                    "message": f"发现目标！坐标 X:{x}, Y:{y}"
                })
                
                #在这里触发 ai_agents.py 中的多智能体讨论流程
                
            #接收到前端大屏管理员的人工强制干预指令
            elif payload.get("type") == "admin_override":
                command = payload.get("command")
                
                #广播高优红字警告到前端中央大屏
                await manager.broadcast_json({
                    "type": "chat_msg",
                    "sender": "人类指挥官",
                    "text": f"强制干预：{command}",
                    "color": "red"
                })
                
                #打断所有正在思考的 AI 任务

            #默认聊天测试
            else:
                await manager.broadcast_json({
                    "type": "chat_msg",
                    "sender": "System",
                    "text": "收到未知类型的指令"
                })

    except WebSocketDisconnect:
        manager.disconnect(websocket)
        print("一个客户端断开了连接")