import { useEffect, useRef } from 'react';
import { useAppStore } from '../store/useStore';
import { initialRobots, initialNetworkHistory } from '../mock/mockData';

export function useRealData() {
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    // 1. 初始化基础状态
    useAppStore.setState({
      robots: initialRobots,
      networkHistory: initialNetworkHistory,
      selectedRobotId: initialRobots[0]?.id || null,
      messages: []
    });

    // 2. 建立与 FastAPI 后端的 WebSocket 连接
    const ws = new WebSocket('ws://127.0.0.1:8000/ws/frontend');
    wsRef.current = ws;

    ws.onopen = () => {
      console.log('✅ 成功连接到云端指挥中心');
      useAppStore.getState().addAgentMessage({
        id: Date.now().toString(),
        agentName: 'System',
        content: '5G指挥链路已接通，等待边缘节点接入...',
        timestamp: new Date().toLocaleTimeString(),
        avatarColor: '#10b981' // 绿色系统消息
      });
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      const store = useAppStore.getState();

      // 场景 A：收到所有设备的状态（心跳统计包）
      if (data.type === 'system_device_status') {
        const devices = data.payload.devices || [];
        let totalLatency = 0;

        devices.forEach((dev: any) => {
          store.updateRobot(dev.device_id, {
            battery: dev.battery_level || 100,
            status: dev.status === 'online' ? 'patrol' : 'low_battery'
          });
          totalLatency += (dev.latency_ms || 0);
        });

        // 更新右上角的 5G 延迟折线图
        if (devices.length > 0) {
          store.updateNetworkStats({
            latency: totalLatency / devices.length,
            bandwidth: 60 + Math.random() * 10, 
            slices: { control: 20, video: 60, sensor: 20 },
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second:'2-digit' })
          });
        }
      }

      // 场景 B：收到 AI 专家讨论 或 自己的打字消息
      else if (data.type === 'chat_message') {
        store.addAgentMessage({
          id: data.timestamp.toString(),
          agentName: data.payload.role,
          content: data.payload.content,
          timestamp: new Date(data.timestamp * 1000).toLocaleTimeString(),
          avatarColor: data.payload.role === '人工指挥' ? '#3b82f6' : '#f59e0b'
        });
      }

      // 场景 C：边缘视觉节点传来了目标坐标
      else if (data.type === 'edge_vision_objects') {
        const objs = data.payload.objects || [];
        store.addAgentMessage({
          id: data.timestamp.toString(),
          agentName: '边缘视觉',
          content: `终端 [${data.payload.device_id}] 捕获到 ${objs.length} 个目标参数。`,
          timestamp: new Date(data.timestamp * 1000).toLocaleTimeString(),
          avatarColor: '#8b5cf6' // 紫色视觉消息
        });
      }
    };

    ws.onclose = () => {
      console.log('❌ 后端连接已断开');
    };

    // 3. 将 WebSocket 发送方法挂载到 Store，供任何组件调用
    useAppStore.setState({
      sendWsMessage: (msg: any) => {
        if (wsRef.current?.readyState === WebSocket.OPEN) {
          wsRef.current.send(JSON.stringify(msg));
        } else {
          alert('云端连接已断开，无法发送指令！');
        }
      }
    });

    return () => {
      ws.close();
    };
  }, []);
}