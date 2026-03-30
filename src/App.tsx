import AgentChat from './components/AgentChat';
import CommandCenter from './components/CommandCenter';
import Dashboard from './components/Dashboard';
import RobotStatus from './components/RobotStatus';
import ThreeScene from './components/ThreeScene';
// 引入刚刚写好的真实数据 Hook，替换掉之前的 useMockData
import { useRealData } from './hooks/useRealData'; 

function App() {
  // 启动全双工 WebSocket 通信
  useRealData(); 

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 p-2 text-white">
      <div className="mx-auto max-w-7xl space-y-3">
        <header className="rounded-2xl border border-slate-700 bg-slate-900/80 p-3 shadow-xl">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <div className="text-sm text-slate-300">智蜂-灵犬-劲熊</div>
              <div className="text-2xl font-bold">基于多智能体协同的5G应急指挥系统</div>
            </div>
            <div className="rounded-full bg-indigo-500/20 px-3 py-2 text-xs text-indigo-200">后端联调测试中</div>
          </div>
        </header>

        <div className="grid grid-cols-12 gap-3">
          <div className="col-span-12 xl:col-span-3">
            <AgentChat />
          </div>
          <div className="col-span-12 xl:col-span-6 flex flex-col gap-3">
            <ThreeScene />
            <CommandCenter />
          </div>
          <div className="col-span-12 xl:col-span-3 space-y-3">
            <RobotStatus />
            <Dashboard />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;