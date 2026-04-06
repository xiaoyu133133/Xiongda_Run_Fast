import { ApartmentOutlined, GlobalOutlined, RobotOutlined, UserOutlined } from '@ant-design/icons';
import { initialNetworkHistory } from './mock/mockData';
import { useAppStore } from './store/useStore';
import AgentChat from './components/AgentChat';
import CommandCenter from './components/CommandCenter';
import Dashboard from './components/Dashboard';
import RobotStatus from './components/RobotStatus';
import ThreeScene from './components/ThreeScene';
import SystemLog from './components/SystemLog';
import { useRealData } from './hooks/useRealData'; 

function App() {
  // 启动全双工 WebSocket 通信
  useRealData(); 

  const robots = useAppStore((state) => state.robots);
  const networkHistory = useAppStore((state) => state.networkHistory);
  const latestNet = networkHistory[networkHistory.length - 1] || initialNetworkHistory[0];

  const totalRobots = robots.length;
  const onlineRobots = robots.filter(r => r.status !== 'error' && r.status !== 'maintenance').length;

  return (
    <div className="fixed inset-0 overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 p-3 text-white flex flex-col">
      
      {/* 🌟 顶部 Header */}
      <header className="shrink-0 mb-3 rounded-2xl border border-slate-700 bg-slate-900/80 p-3 shadow-xl z-10">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-indigo-500/10 p-2 text-indigo-400">
              <GlobalOutlined style={{ fontSize: '20px' }} />
            </div>
            <div>
              <div className="text-sm text-slate-300">智蜂-灵犬-劲熊</div>
              <div className="text-2xl font-bold tracking-tight">基于多智能体协同的5G应急指挥系统</div>
            </div>
          </div>
          
          <div className="flex flex-wrap items-center gap-2">
            <HeaderBadge icon={RobotOutlined} label="当前设备数" value={`${totalRobots}台`} color="slate" />
            <HeaderBadge icon={UserOutlined} label="在线设备" value={`${onlineRobots}/${totalRobots}`} color="emerald" />
            <HeaderBadge icon={ApartmentOutlined} label="5G 低时延切片" value="已启用" color="indigo" />
            <HeaderStatusBadge label="5G 网络" status="正常" />
          </div>
        </div>
      </header>

      {/* 🌟 核心内容区 */}
      <div className="flex-grow grid grid-cols-12 gap-3 min-h-0">
        
        {/* ✅ 修改1：左侧栏。彻底移除 xl: 前缀，强制锁定 col-span-3 (占比25%) */}
        <div className="col-span-3 flex flex-col gap-3 min-h-0">
          <div className="h-[55%] shrink-0 rounded-2xl overflow-hidden border border-slate-700 bg-slate-900/80 relative">
            <ThreeScene />
          </div>
          <div className="flex-grow min-h-0 relative">
            {/* 使用 absolute inset-0 解决高度塌陷 */}
            <div className="absolute inset-0">
              <SystemLog />
            </div>
          </div>
        </div>

        {/* ✅ 修改2：中间栏。强制锁定 col-span-6 (占比50%) */}
        <div className="col-span-6 flex flex-col gap-3 min-h-0">
          <div className="flex-grow min-h-0 relative">
            <div className="absolute inset-0">
              <AgentChat />
            </div>
          </div>
          <div className="shrink-0">
            <CommandCenter />
          </div>
        </div>

        {/* ✅ 修改3：右侧栏。强制锁定 col-span-3 (占比25%) */}
        <div className="col-span-3 flex flex-col gap-3 min-h-0">
          <div className="shrink-0 w-full">
            <RobotStatus />
          </div>
          <div className="flex-grow min-h-0 relative w-full">
            {/* 使用 absolute inset-0 彻底解决右侧 Dashboard (ECharts) 的黑屏问题 */}
            <div className="absolute inset-0">
              <Dashboard />
            </div>
          </div>
        </div>
        
      </div>
    </div>
  );
}

// ----------------- 子组件区域 -----------------

interface HeaderBadgeProps {
  icon: React.ElementType;
  label: string;
  value: string;
  color: string;
}

function HeaderBadge({ icon: Icon, label, value, color }: HeaderBadgeProps) {
  const colors: Record<string, string> = {
    slate: 'bg-slate-700 border-slate-600',
    emerald: 'bg-emerald-950 border-emerald-700 text-emerald-300',
    indigo: 'bg-indigo-950 border-indigo-700 text-indigo-200'
  };
  return (
    <div className={`flex items-center gap-2 rounded-xl border px-3 py-1.5 ${colors[color] || colors.slate}`}>
      <Icon className="text-lg" />
      <div className="text-left">
        <div className="text-[10px] text-slate-300 opacity-80">{label}</div>
        <div className="text-sm font-semibold leading-tight">{value}</div>
      </div>
    </div>
  );
}

function HeaderStatusBadge({ label, status }: { label: string; status: string }) {
  return (
    <div className="flex items-center gap-2 rounded-xl border border-emerald-700 bg-emerald-950 px-3 py-1.5 text-emerald-300">
      <div className="relative flex h-2.5 w-2.5">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
      </div>
      <div className="text-left">
        <div className="text-[10px] text-slate-300 opacity-80">{label}</div>
        <div className="text-sm font-semibold leading-tight">{status}</div>
      </div>
    </div>
  );
}

export default App;