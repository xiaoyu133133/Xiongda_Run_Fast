import { useMemo } from 'react';
import { useAppStore } from '../store/useStore';

const statusColor: Record<string, string> = {
  patrol: 'text-emerald-300',
  sampling: 'text-cyan-300',
  rescue: 'text-amber-300',
  low_battery: 'text-rose-300',
  idle: 'text-slate-300'
};

const typeIcons: Record<string, string> = {
  dog: '🐕',
  bee: '🐝',
  bear: '🐻',
  drone: '🛸'
};

export default function RobotStatus() {
  const robots = useAppStore((state) => state.robots);
  const selectedId = useAppStore((state) => state.selectedRobotId);
  const setSelected = useAppStore((state) => state.setSelectedRobotId);

  const sorted = useMemo(() => [...robots].sort((a, b) => a.id.localeCompare(b.id)), [robots]);

  return (
    <div className="rounded-2xl border border-slate-700 bg-slate-900/80 p-3 shadow-xl">
      <div className="mb-2 flex items-center justify-between">
        <div>
          <div className="text-xs text-slate-300">机器人状态</div>
          <div className="text-lg font-semibold">Robot Status</div>
        </div>
        <span className="rounded-full bg-violet-500/20 px-2 py-1 text-xs text-violet-300">实时</span>
      </div>
      <div className="space-y-2">
        {sorted.map((robot) => (
          <button
            key={robot.id}
            onClick={() => setSelected(robot.id)}
            className={`w-full rounded-xl border px-2 py-2 text-left transition ${
              selectedId === robot.id ? 'border-indigo-400 bg-indigo-500/20' : 'border-slate-700 bg-slate-800/80 hover:border-slate-500'
            }`}
          >
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <span>{typeIcons[robot.type] ?? '🤖'}</span>
                <span className="font-semibold text-white">{robot.id}</span>
              </div>
              <span className={`text-xs ${statusColor[robot.status] ?? 'text-slate-300'}`}>{robot.status}</span>
            </div>
            <div className="mt-1 text-xs text-slate-300">
              电量: <span className="font-semibold text-lime-300">{robot.battery.toFixed(0)}%</span> · 位置: {robot.position.x.toFixed(1)},{robot.position.z.toFixed(1)}
            </div>
            {robot.temperature ? <div className="text-xs text-amber-300">温度: {robot.temperature}°C</div> : null}
          </button>
        ))}
      </div>
    </div>
  );
}
