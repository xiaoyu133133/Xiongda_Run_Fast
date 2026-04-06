import { useState, KeyboardEvent } from 'react';
import { SendOutlined } from '@ant-design/icons';
import { useAppStore } from '../store/useStore';

export default function CommandCenter() {
  const [text, setText] = useState('');
  // 从 Store 拿到真正的 WebSocket 发送函数
  const sendWsMessage = useAppStore((state) => state.sendWsMessage);
  const addCommand = useAppStore((state) => state.addCommand);

  const onSend = () => {
    const trimmed = text.trim();
    if (!trimmed) return;

    // 1. 组装符合后端协议的 JSON
    const payload = {
      type: "chat_message",
      timestamp: Date.now() / 1000,
      payload: {
        role: "人工指挥",
        content: trimmed,
        status: "finished"
      }
    };

    // 2. 发送给 Python 后端
    if (sendWsMessage) {
      sendWsMessage(payload);
    }

    // 3. 记录到本地的历史指令里 (可选)
    addCommand({ id: `${Date.now()}`, text: trimmed, timestamp: new Date().toLocaleTimeString() });
    
    setText('');
  };

  const onKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  return (
    <div className="mt-3 rounded-2xl border border-slate-700 bg-slate-900/80 p-3 shadow-lg">
      <div className="mb-2 flex items-center justify-between">
        <div>
          <div className="text-xs text-slate-300">主对话</div>
          <div className="text-lg font-semibold text-white">Command Center</div>
        </div>
        <div className="text-xs text-slate-400">输入操作员指令并发送</div>
      </div>
      <div className="flex gap-2">
        <textarea
          rows={3}
          className="w-full resize-none rounded-xl border border-slate-600 bg-slate-800 px-3 py-2 text-sm text-white outline-none focus:border-indigo-400"
          placeholder="请输入优先指令，Enter 发送给云端大模型..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={onKeyDown}
        />
        <button
          className="rounded-xl bg-indigo-600 px-3 py-2 text-white transition hover:bg-indigo-500"
          onClick={onSend}
          title="发送"
        >
          <SendOutlined />
        </button>
      </div>
    </div>
  );
}