# 智蜂-灵犬-劲熊：基于多智能体协同的5G应急指挥系统（前端演示原型）

## 项目概述
纯前端 React + TypeScript + Vite 演示原型，模拟火灾救援场景多智能体协同、机器人巡检、5G网络监控与操作员指令。

## 技术栈
- React 18 + TypeScript + Vite
- Zustand 状态管理
- Three.js + @react-three/fiber + @react-three/drei 3D 可视化
- ECharts + echarts-for-react 图表
- TailwindCSS UI 样式
- @ant-design/icons 图标

## 目录结构
```
index.html
package.json
tailwind.config.js
vite.config.ts
src/
  main.tsx
  App.tsx
  types.ts
  store/useStore.ts
  hooks/useMockData.ts
  mock/mockData.ts
  components/
    AgentChat.tsx
    CommandCenter.tsx
    ThreeScene.tsx
    RobotStatus.tsx
    Dashboard.tsx
  styles/index.css
```

## 运行步骤
1. 安装依赖：`npm install`
2. 启动项目：`npm run dev`
3. 在浏览器打开 `http://localhost:5173`

## 核心功能
- 三栏布局：AgentChat + 3D 场景 + CommandCenter + 机器人状态 + 仪表盘
- 模拟数据：定时器自动刷新机器人定位、电量、网络与智能体消息
- 主对话：操作员指令输入、发送并存储
- 3D 机器人：多种几何体 + 悬浮标签 + OrbitControls
- 仪表盘：电量柱状图 + 网络状态折线图

> 注意：当前为纯前端演示，无真实后端。

