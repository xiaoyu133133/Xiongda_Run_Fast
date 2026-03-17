import { useEffect, useRef } from 'react';
import { useAppStore } from '../store/useStore';

const statusColors: Record<string, string> = {
  '环境感知': 'bg-amber-400',
  '路径规划': 'bg-lime-400',
  '风险评估': 'bg-rose-400',
  '物资调度': 'bg-sky-400'
};

export default function AgentChat() {
  const messages = useAppStore((state) => state.messages);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (el) {
      el.scrollTop = el.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="flex flex-col h-full bg-slate-900 rounded-2xl border border-slate-700 p-3 shadow-xl">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <div className="text-sm text-slate-300">多智能体对话</div>
          <div className="text-lg font-semibold">Agent Chat</div>
        </div>
        <span className="rounded-full bg-emerald-500/20 px-2 py-1 text-xs text-emerald-300">模拟更新中</span>
      </div>
      <div ref={containerRef} className="flex-1 overflow-y-auto space-y-2 pr-1">
        {messages.map((msg) => (
          <div key={msg.id} className="rounded-xl border border-slate-700 bg-slate-800/80 p-2">
            <div className="flex items-center justify-between gap-2 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <span className={`inline-flex h-2.5 w-2.5 rounded-full ${statusColors[msg.agentName] ?? 'bg-violet-400'}`}></span>
                <span className="font-medium text-slate-200">{msg.agentName}</span>
              </div>
              <span>{msg.timestamp}</span>
            </div>
            <div className="mt-1 text-sm text-slate-100">{msg.content}</div>
            {msg.reasoning ? (
              <div className="mt-1 rounded-md bg-slate-700/50 p-2 text-xs text-slate-200">
                <div className="font-semibold text-slate-200">推理链：</div>
                <div>{msg.reasoning}</div>
              </div>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}
