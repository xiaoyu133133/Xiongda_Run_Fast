import { create } from 'zustand';
import { AgentMessage, AppState, Command, NetworkStats, Robot } from '../types';

export const useAppStore = create<AppState>((set, get) => ({
  robots: [],
  messages: [],
  commands: [],
  networkHistory: [],
  selectedRobotId: null,
  
  // 初始化时为空，等 WebSocket 连接成功后会挂载真实的发送函数
  sendWsMessage: undefined, 

  addAgentMessage: (msg: AgentMessage) => {
    set((state) => ({
      messages: [...state.messages, msg].slice(-80)
    }));
  },
  addCommand: (cmd: Command) => {
    set((state) => ({ commands: [...state.commands, cmd] }));
  },
  updateRobot: (id: string, patch: Partial<Robot>) => {
    set((state) => ({
      robots: state.robots.map((r) => (r.id === id ? { ...r, ...patch } : r))
    }));
  },
  updateNetworkStats: (next: NetworkStats) => {
    set((state) => ({
      networkHistory: [...state.networkHistory, next].slice(-5) // 图表保留最近 5 个点
    }));
  },
  setSelectedRobotId: (id: string | null) => set({ selectedRobotId: id })
}));