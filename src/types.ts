export type RobotType = 'dog' | 'bee' | 'bear' | 'drone';
export type RobotStatus = 'patrol' | 'sampling' | 'rescue' | 'low_battery' | 'idle';

export interface Robot {
  id: string;
  type: RobotType;
  status: RobotStatus;
  position: { x: number; y: number; z: number };
  battery: number;
  temperature?: number;
  sensors: {
    gas?: number;
    video?: number;
    thermal?: number;
  };
  task?: string;
}

export interface AgentMessage {
  id: string;
  agentName: string;
  content: string;
  timestamp: string;
  avatarColor: string;
  reasoning?: string;
}

export interface Command {
  id: string;
  text: string;
  timestamp: string;
}

export interface NetworkStats {
  latency: number;
  bandwidth: number;
  slices: { control: number; video: number; sensor: number };
  time: string;
}

export interface AppState {
  robots: Robot[];
  messages: AgentMessage[];
  commands: Command[];
  networkHistory: NetworkStats[];
  selectedRobotId: string | null;
  addAgentMessage: (msg: AgentMessage) => void;
  addCommand: (cmd: Command) => void;
  updateRobot: (id: string, patch: Partial<Robot>) => void;
  updateNetworkStats: (next: NetworkStats) => void;
  setSelectedRobotId: (id: string | null) => void;
}
