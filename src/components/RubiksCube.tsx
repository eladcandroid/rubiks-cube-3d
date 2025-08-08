import { useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment, Center } from "@react-three/drei";
import * as THREE from "three";
import { useCubeStore } from "../state/cubeStore";
import { PerfectCube } from "./PerfectCube";

function MoveOrchestrator() {
  const active = useCubeStore((s) => s.activeRotation);
  const queue = useCubeStore((s) => s.moveQueue);
  const startNext = useCubeStore((s) => s.startNextMove);
  
  useEffect(() => {
    if (!active && queue.length > 0) {
      // Small delay between moves for clarity
      const timer = setTimeout(() => startNext(), 100);
      return () => clearTimeout(timer);
    }
  }, [active, queue.length, startNext]);
  
  return null;
}

export function RubiksCubeScene() {
  return (
    <Canvas 
      camera={{ position: [6, 6, 6], fov: 45 }} 
      shadows="soft"
      gl={{ 
        antialias: true,
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.0
      }}
    >
      <color attach="background" args={["#0f0f1a"]} />
      <fog attach="fog" args={["#0f0f1a", 12, 30]} />
      
      {/* Lighting setup */}
      <ambientLight intensity={0.5} />
      <hemisphereLight 
        intensity={0.6} 
        color="#ffffff"
        groundColor="#444455" 
      />
      
      <directionalLight
        position={[5, 10, 5]}
        intensity={1.0}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-near={0.1}
        shadow-camera-far={25}
        shadow-camera-left={-6}
        shadow-camera-right={6}
        shadow-camera-top={6}
        shadow-camera-bottom={-6}
      />
      
      <pointLight 
        position={[-5, 5, -5]} 
        intensity={0.4}
        color="#5588ff"
      />
      
      <pointLight 
        position={[5, 2, -5]} 
        intensity={0.2}
        color="#ff8855"
      />
      
      <Environment preset="sunset" background={false} />
      
      <Center>
        <PerfectCube />
        {/* Add a subtle platform shadow */}
        <mesh 
          rotation={[-Math.PI / 2, 0, 0]} 
          position={[0, -2, 0]}
          receiveShadow
        >
          <planeGeometry args={[10, 10]} />
          <shadowMaterial opacity={0.3} />
        </mesh>
      </Center>
      
      <OrbitControls 
        enablePan={false} 
        maxPolarAngle={Math.PI * 0.85}
        minDistance={5}
        maxDistance={15}
        autoRotate={false}
        enableDamping
        dampingFactor={0.05}
      />
      
      <MoveOrchestrator />
    </Canvas>
  );
}