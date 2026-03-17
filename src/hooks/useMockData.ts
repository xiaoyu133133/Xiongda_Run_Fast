import { useEffect } from 'react';
import { useAppStore } from '../store/useStore';
import { initialMessages, initialNetworkHistory, initialRobots, randomAgentMessage } from '../mock/mockData';
import { NetworkStats, Robot } from '../types';

const clamp = (v: number, min: number, max: number) => Math.min(Math.max(v, min), max);

function randomOffset() {
  return (Math.random() - 0.5) * 0.8;
}

export function useMockData() {
  const setRobots = useAppStore((state) => state.robots);
  const addAgentMessage = useAppStore((state) => state.addAgentMessage);
  const updateRobot = useAppStore((state) => state.updateRobot);
  const updateNetworkStats = useAppStore((state) => state.updateNetworkStats);
  const setSelectedRobotId = useAppStore((state) => state.setSelectedRobotId);
  const setMessages = useAppStore((state) => state.messages);
  const setCommands = useAppStore((state) => state.commands);

  const setInit = useAppStore((state) => {
    // no-op, we just use store methods below
    return null;
  });

  useEffect(() => {
    // initialize store values
    useAppStore.setState({
      robots: initialRobots,
      messages: initialMessages,
      networkHistory: initialNetworkHistory,
      commands: [],
      selectedRobotId: initialRobots[0]?.id || null
    });

    const robotInterval = setInterval(() => {
      useAppStore.getState().robots.forEach((robot) => {
        const nextPos = {
          x: robot.position.x + randomOffset(),
          y: robot.position.y,
          z: robot.position.z + randomOffset()
        };
        const nextBattery = clamp(robot.battery - Math.random() * 1.2, 13, 100);
        useAppStore.getState().updateRobot(robot.id, {
          position: nextPos,
          battery: Number(nextBattery.toFixed(1)),
          status: nextBattery < 20 ? 'low_battery' : robot.status
        });
      });
    }, 2000);

    const agentInterval = setInterval(() => {
      addAgentMessage(randomAgentMessage());
    }, 5000);

    const networkInterval = setInterval(() => {
      const last = useAppStore.getState().networkHistory.slice(-1)[0];
      const next: NetworkStats = {
        latency: clamp((last?.latency ?? 30) + (Math.random() - 0.5) * 10, 18, 80),
        bandwidth: clamp((last?.bandwidth ?? 50) + (Math.random() - 0.5) * 8, 20, 100),
        slices: {
          control: clamp((last?.slices.control ?? 24) + (Math.random() - 0.5) * 6, 10, 40),
          video: clamp((last?.slices.video ?? 60) + (Math.random() - 0.5) * 8, 30, 70),
          sensor: clamp((last?.slices.sensor ?? 16) + (Math.random() - 0.5) * 5, 10, 35)
        },
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      updateNetworkStats(next);
    }, 3000);

    return () => {
      clearInterval(robotInterval);
      clearInterval(agentInterval);
      clearInterval(networkInterval);
      setSelectedRobotId(null);
    };
    // note: intentionally run once
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
