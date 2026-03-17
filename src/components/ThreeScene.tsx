import { Canvas } from '@react-three/fiber';
import { Html, OrbitControls } from '@react-three/drei';
import { useMemo } from 'react';
import { useAppStore } from '../store/useStore';

const typeColor: Record<string, string> = {
  dog: 'orange',
  bee: 'yellow',
  bear: 'red',
  drone: 'blue'
};

export default function ThreeScene() {
  const robots = useAppStore((state) => state.robots);
  const selectedRobotId = useAppStore((state) => state.selectedRobotId);

  const beeClusters = useMemo(() => {
    const base = robots.find((r) => r.type === 'bee');
    if (!base) return [];
    return [
      [0.6, 0.2, 0],
      [-0.4, 0.5, 0.2],
      [0.2, -0.3, 0.6],
      [-0.5, -0.1, -0.4]
    ];
  }, [robots]);

  return (
    <div className="h-[420px] rounded-2xl border border-slate-700 bg-slate-900/80 p-2">
      <div className="mb-2 flex items-center justify-between px-2 text-xs text-slate-300">
        <span>3D 场景 (Three.js)</span>
        <span>可旋转/缩放</span>
      </div>
      <div className="h-[370px] w-full rounded-xl bg-slate-950">
        <Canvas camera={{ position: [10, 10, 10], fov: 45 }}>
          <ambientLight intensity={0.35} />
          <directionalLight position={[5, 10, 5]} intensity={1} />
          <gridHelper args={[20, 20, '#334155', '#334155']} />
          <axesHelper args={[4]} />
          <OrbitControls />
          {robots.map((robot) => {
            const position = [robot.position.x, robot.position.y + 0.5, robot.position.z] as [number, number, number];
            const highlight = robot.id === selectedRobotId;
            if (robot.type === 'dog') {
              return (
                <group key={robot.id} position={position}>
                  <mesh>
                    <boxGeometry args={[1, 1, 2]} />
                    <meshStandardMaterial color="orange" emissive={highlight ? '#f59e0b' : '#000000'} emissiveIntensity={highlight ? 0.4 : 0} />
                  </mesh>
                  <Html distanceFactor={8} position={[0, 1.2, 0]} center>
                    <div className="rounded-md bg-slate-900/80 px-2 py-1 text-xs text-white shadow-lg">
                      {robot.id} | {robot.battery}%
                    </div>
                  </Html>
                </group>
              );
            }
            if (robot.type === 'bee') {
              return (
                <group key={robot.id} position={position}>
                  {beeClusters.map((offset, idx) => (
                    <mesh key={idx} position={[offset[0], offset[1], offset[2]]}>
                      <sphereGeometry args={[0.45, 20, 20]} />
                      <meshStandardMaterial color="yellow" />
                    </mesh>
                  ))}
                  <Html distanceFactor={8} position={[0, 1.2, 0]} center>
                    <div className="rounded-md bg-slate-900/80 px-2 py-1 text-xs text-white shadow-lg">
                      {robot.id} | {robot.battery}%
                    </div>
                  </Html>
                </group>
              );
            }
            if (robot.type === 'bear') {
              return (
                <group key={robot.id} position={position}>
                  <mesh>
                    <cylinderGeometry args={[1, 1, 2, 20]} />
                    <meshStandardMaterial color="red" emissive={highlight ? '#f87171' : '#000000'} emissiveIntensity={highlight ? 0.4 : 0} />
                  </mesh>
                  <Html distanceFactor={8} position={[0, 1.3, 0]} center>
                    <div className="rounded-md bg-slate-900/80 px-2 py-1 text-xs text-white shadow-lg">
                      {robot.id} | {robot.battery}%
                    </div>
                  </Html>
                </group>
              );
            }
            return (
              <group key={robot.id} position={position}>
                <mesh>
                  <coneGeometry args={[1, 0.5, 20]} />
                  <meshStandardMaterial color="blue" />
                </mesh>
                <Html distanceFactor={8} position={[0, 0.9, 0]} center>
                  <div className="rounded-md bg-slate-900/80 px-2 py-1 text-xs text-white shadow-lg">
                    {robot.id} | {robot.battery}%
                  </div>
                </Html>
              </group>
            );
          })}
        </Canvas>
      </div>
    </div>
  );
}
