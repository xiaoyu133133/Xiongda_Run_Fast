import { useEffect, useRef } from 'react';
import { useAppStore } from '../store/useStore';

export default function SystemLog() {
  const messages = useAppStore((state) => state.messages);
  const logs = messages.filter(m => m.agentName === 'System' || m.agentName === '边缘视觉');
  const scrollContainerRef = useRef<HTMLDivElement>(null); // ✅ 修复点：改用容器的 ref

  useEffect(() => {
    // ✅ 修复点：直接控制当前容器的滚动条，绝不影响外部网页
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <div className="flex h-full flex-col rounded-2xl border border-slate-700 bg-slate-900/90 p-3 shadow-lg">
      <div className="mb-2 text-sm font-semibold text-slate-300 flex justify-between items-center shrink-0">
        <span>📡 现场实时日志 (Edge Logs)</span>
        <span className="flex h-2 w-2 relative">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
        </span>
      </div>
      
      {/* ✅ 修复点：把 ref 绑到滚动容器上，并加上 min-h-0 防止其无限撑大父容器 */}
      <div 
        ref={scrollContainerRef}
        className="flex-grow overflow-y-auto space-y-1 font-mono text-[11px] pr-1 custom-scrollbar min-h-0"
      >
        {logs.length === 0 && <div className="text-slate-600">等待节点接入...</div>}
        {logs.map((log) => (
          <div key={log.id} className="border-l-2 pl-2" style={{ borderColor: log.avatarColor }}>
            <span className="text-slate-500">[{log.timestamp}]</span>{' '}
            <span style={{ color: log.avatarColor }}>[{log.agentName}]</span>{' '}
            <span className="text-slate-300">{log.content}</span>
          </div>
        ))}
      </div>
    </div>
  );
}