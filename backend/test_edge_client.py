import asyncio
import websockets
import json
import time

async def simulate_edge_device():
    # 连接到你刚才写好的后端 edge 专属路由
    uri = "ws://127.0.0.1:8000/ws/edge/rescue_car_01"
    
    try:
        async with websockets.connect(uri) as websocket:
            print("🚗 模拟搜救车 (rescue_car_01) 已成功连接到指挥中心！")

            # 1. 异步任务：每隔 2 秒自动发一次心跳包
            async def send_heartbeat():
                while True:
                    hb_msg = {
                        "type": "edge_heartbeat",
                        "timestamp": time.time(),
                        "payload": {
                            "device_id": "rescue_car_01",
                            "latency_ms": 15, # 模拟 15ms 的 5G 极低延迟
                            "battery_level": 92
                        }
                    }
                    await websocket.send(json.dumps(hb_msg))
                    await asyncio.sleep(2) 

            # 把心跳任务挂到后台运行
            asyncio.create_task(send_heartbeat())

            # 2. 主循环：等待你手动触发视觉识别结果
            print("\n等待指令... (按下回车键发送模拟坐标，输入 q 退出)")
            while True:
                # 注意：标准的 asyncio 不建议用阻塞的 input，但这只是个简易测试脚本，无伤大雅
                cmd = await asyncio.to_thread(input, "") 
                if cmd.lower() == 'q':
                    break
                
                # 伪造的视觉组坐标数据
                vision_data = {
                    "type": "edge_vision_objects",
                    "timestamp": time.time(),
                    "payload": {
                        "device_id": "rescue_car_01",
                        "objects": [
                            {"class": "survivor_red", "x": 120, "y": 250},
                            {"class": "hazard_fire_yellow", "x": 130, "y": 240}
                        ]
                    }
                }
                await websocket.send(json.dumps(vision_data))
                print(f"📡 [已发送] 发现目标！坐标 X:120, Y:250。去网页大屏看看左侧监控区吧！\n")

    except ConnectionRefusedError:
        print("❌ 连接失败！请检查你的 FastAPI 后端 (main.py) 是否已经运行。")

if __name__ == "__main__":
    asyncio.run(simulate_edge_device())