import React from 'react';
import ReactECharts from 'echarts-for-react';
import { useAppStore } from '../store/useStore';

const typeColors: Record<string, string> = {
  dog: '#f59e0b',
  bee: '#eab308',
  bear: '#ef4444',
  drone: '#3b82f6'
};

export default function Dashboard() {
  const robots = useAppStore((state) => state.robots);
  const networkHistory = useAppStore((state) => state.networkHistory);

  const batteryOption = React.useMemo(() => {
    return {
      tooltip: { trigger: 'axis' },
      xAxis: {
        type: 'category',
        data: robots.map((r) => r.id),
        axisLabel: { color: '#cbd5e1' }
      },
      yAxis: { type: 'value', max: 100, axisLabel: { color: '#cbd5e1' } },
      grid: { top: 20, left: 10, right: 10, bottom: 20 },
      series: [
        {
          type: 'bar',
          data: robots.map((r) => ({ value: r.battery, itemStyle: { color: typeColors[r.type] ?? '#fff' } })),
          emphasis: { itemStyle: { borderColor: '#ffffff', borderWidth: 1 } }
        }
      ]
    };
  }, [robots]);

  const networkOption = React.useMemo(() => {
    return {
      tooltip: { trigger: 'axis' },
      legend: { textStyle: { color: '#e2e8f0' } },
      xAxis: {
        type: 'category',
        data: networkHistory.map((item) => item.time),
        axisLabel: { color: '#cbd5e1' }
      },
      yAxis: {
        type: 'value',
        axisLabel: { color: '#cbd5e1' }
      },
      series: [
        {
          name: '时延(ms)',
          type: 'line',
          data: networkHistory.map((item) => Number(item.latency.toFixed(1))),
          smooth: true,
          lineStyle: { color: '#34d399' }
        },
        {
          name: '带宽占用(%)',
          type: 'line',
          data: networkHistory.map((item) => Number(item.bandwidth.toFixed(1))),
          smooth: true,
          lineStyle: { color: '#60a5fa' }
        }
      ]
    };
  }, [networkHistory]);

  return (
    <div className="space-y-2">
      <div className="rounded-2xl border border-slate-700 bg-slate-900/80 p-2 shadow-lg">
        <div className="mb-1 flex justify-between px-2 text-xs text-slate-300">
          <span>电量柱状图</span>
          <span className="text-green-300">按机器人类型着色</span>
        </div>
        <ReactECharts option={batteryOption} style={{ height: '220px', width: '100%' }} theme="dark" />
      </div>
      <div className="rounded-2xl border border-slate-700 bg-slate-900/80 p-2 shadow-lg">
        <div className="mb-1 flex justify-between px-2 text-xs text-slate-300">
          <span>网络状态折线图</span>
          <span className="text-cyan-300">实时 5G 状态</span>
        </div>
        <ReactECharts option={networkOption} style={{ height: '220px', width: '100%' }} theme="dark" />
      </div>
    </div>
  );
}
