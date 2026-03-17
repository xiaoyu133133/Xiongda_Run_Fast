import { AgentMessage, NetworkStats, Robot } from '../types';

export const initialRobots: Robot[] = [
  {
    id: 'dog-001',
    type: 'dog',
    status: 'patrol',
    position: { x: -4, y: 0, z: -3 },
    battery: 92,
    temperature: 36,
    sensors: { thermal: 48, video: 88 }
  },
  {
    id: 'bee-swarm-01',
    type: 'bee',
    status: 'sampling',
    position: { x: 2, y: 0, z: -6 },
    battery: 84,
    temperature: 32,
    sensors: { gas: 0.2, video: 64 }
  },
  {
    id: 'bear-001',
    type: 'bear',
    status: 'rescue',
    position: { x: 4, y: 0, z: 1 },
    battery: 75,
    temperature: 40,
    sensors: { thermal: 62, video: 78 }
  },
  {
    id: 'drone-001',
    type: 'drone',
    status: 'idle',
    position: { x: -1, y: 0, z: 5 },
    battery: 88,
    temperature: 30,
    sensors: { video: 72 }
  }
];

const now = new Date();

export const initialMessages: AgentMessage[] = [
  {
    id: 'm1',
    agentName: '环境感知',
    content: '发现东北方向火势升级，温度上升 12°C。建议部署 2 辆机器狗继续侦查。',
    avatarColor: '#f59e0b',
    timestamp: now.toLocaleTimeString(),
    reasoning: '基于热成像数据与风向分析，火线可能在 3 分钟内扩展。'
  },
  {
    id: 'm2',
    agentName: '路径规划',
    content: '已计算两条安全通道，推荐引导云梯车绕过东侧烟雾区。',
    avatarColor: '#22c55e',
    timestamp: now.toLocaleTimeString(),
    reasoning: '考虑地形和障碍物后，东侧通道最短且风险低。'
  },
  {
    id: 'm3',
    agentName: '风险评估',
    content: '当前空气中可燃气体浓度 0.13，存在局部爆燃风险。',
    avatarColor: '#f43f5e',
    timestamp: now.toLocaleTimeString()
  },
  {
    id: 'm4',
    agentName: '物资调度',
    content: '可调度 1 台水炮车和 2 套呼吸器，预计 4 分钟到达前线。',
    avatarColor: '#3b82f6',
    timestamp: now.toLocaleTimeString(),
    reasoning: '基于当前资源与道路拥堵程度做出预测。'
  }
];

export const initialNetworkHistory: NetworkStats[] = [
  { latency: 32, bandwidth: 48, slices: { control: 20, video: 62, sensor: 18 }, time: '10:00' },
  { latency: 28, bandwidth: 52, slices: { control: 24, video: 60, sensor: 16 }, time: '10:01' },
  { latency: 35, bandwidth: 54, slices: { control: 22, video: 58, sensor: 20 }, time: '10:02' },
  { latency: 31, bandwidth: 50, slices: { control: 26, video: 56, sensor: 18 }, time: '10:03' },
  { latency: 29, bandwidth: 57, slices: { control: 25, video: 60, sensor: 15 }, time: '10:04' }
];

const agentTemplates = [
  {
    agentName: '环境感知',
    avatarColor: '#f59e0b',
    content: '热成像警报：西侧温度高于 68°C，建议立即疏散附近人员。',
    reasoning: '热源聚类分析与历史比对显示本次火情仍在扩散。'
  },
  {
    agentName: '路径规划',
    avatarColor: '#22c55e',
    content: '已生成避障路径，机器人熊可沿东北走廊移动。',
    reasoning: '考虑地形、高温区域与实时障碍检测结果。'
  },
  {
    agentName: '风险评估',
    avatarColor: '#f43f5e',
    content: '检测到 16% CO，火险指数提升，建议打开通风并继续监测。'
  },
  {
    agentName: '物资调度',
    avatarColor: '#3b82f6',
    content: '调度建议：蜂群 drone-001 前往 X 点进行快速勘测。',
    reasoning: '基于当前无人机电量与目标距离评估。'
  }
];

export function randomAgentMessage(): AgentMessage {
  const pick = agentTemplates[Math.floor(Math.random() * agentTemplates.length)];
  return {
    id: `m-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    agentName: pick.agentName,
    avatarColor: pick.avatarColor,
    content: pick.content,
    timestamp: new Date().toLocaleTimeString(),
    reasoning: pick.reasoning
  };
}
