import { useEffect, useRef } from 'react';
import { useAppStore } from '../store/useStore';

export default function AgentChat() {
  const messages = useAppStore((state) => state.messages);
  const chats = messages.filter(m => m.agentName !== 'System' && m.agentName !== '边缘视觉');
  const scrollContainerRef = useRef<HTMLDivElement>(null); // ✅ 修复点

  useEffect(() => {
    // ✅ 修复点
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
    }
  }, [chats]);

  return (
    <div className="flex h-full flex-col rounded-2xl border border-slate-700 bg-slate-900/80 p-4 shadow-lg">
      <div className="mb-3 text-lg font-semibold text-white shrink-0">💬 多专家 AI 研讨室</div>
      
      {/* ✅ 修复点：绑定 ref，增加 min-h-0 */}
      <div 
        ref={scrollContainerRef}
        className="flex-grow overflow-y-auto space-y-4 pr-2 custom-scrollbar min-h-0"
      >
        {chats.length === 0 && <div className="text-center text-xs text-slate-500 mt-10">--- 等待推演任务 ---</div>}
        
        {chats.map((msg) => {
          const isHuman = msg.agentName === '人工指挥';
          return (
            <div key={msg.id} className={`flex flex-col ${isHuman ? 'items-end' : 'items-start'}`}>
              <span className="text-xs font-bold text-slate-400 mb-1 px-1">{msg.agentName}</span>
              <div 
                className={`px-4 py-2 text-sm max-w-[85%] ${
                  isHuman 
                  ? 'bg-indigo-600 text-white rounded-l-xl rounded-tr-xl' 
                  : 'bg-slate-700 border border-slate-600 text-slate-200 rounded-r-xl rounded-tl-xl'
                }`}
              >
                {msg.content}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}