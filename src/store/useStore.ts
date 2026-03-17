import { create } from 'zustand';
import { AgentMessage, AppState, Command, NetworkStats, Robot } from '../types';

export const useAppStore = create<AppState>((set, get) => ({
  robots: [],
  messages: [],
  commands: [],
  networkHistory: [],
  selectedRobotId: null,
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
      networkHistory: [...state.networkHistory, next].slice(-5)
    }));
  },
  setSelectedRobotId: (id: string | null) => set({ selectedRobotId: id })
}));
