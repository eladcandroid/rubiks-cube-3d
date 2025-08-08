import React, { useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment, Center } from "@react-three/drei";
import * as THREE from "three";
import { useCubeStore } from "../state/cubeStore";
import { AnimatedCube } from "./AnimatedCube";

function AnimatedLayer({ children, axis, direction }: { 
  children: React.ReactNode;
  axis: "x" | "y" | "z";
  direction: 1 | -1;
}) {
  const targetAngle = direction * (Math.PI / 2);
  
  const { rotation } = useSpring({
    from: { rotation: 0 },
    to: { rotation: targetAngle },
    config: {
      duration: 500, // 500ms for clear visibility
      easing: (t: number) => {
        // Custom easing for smooth acceleration and deceleration
        return t < 0.5 
          ? 4 * t * t * t 
          : 1 - Math.pow(-2 * t + 2, 3) / 2;
      }
    }
  });

  const rotationArray = axis === "x" 
    ? [rotation, 0, 0]
    : axis === "y"
    ? [0, rotation, 0]
    : [0, 0, rotation];

  return (
    <animated.group rotation={rotationArray as any}>
      {children}
    </animated.group>
  );
}

function CubeAssembly() {
  const cubies = useCubeStore((s) => s.cubies);
  const active = useCubeStore((s) => s.activeRotation);
  const commit = useCubeStore((s) => s.commitActiveRotation);
  
  // State to hold the current animation
  const [currentAnimation, setCurrentAnimation] = useState<{
    axis: "x" | "y" | "z";
    layer: number;
    direction: 1 | -1;
    cubieIds: Set<string>;
  } | null>(null);

  // When a new rotation starts, set up the animation
  useEffect(() => {
    if (active && !currentAnimation) {
      const axisIndex = active.axis === "x" ? 0 : active.axis === "y" ? 1 : 2;
      const rotatingCubieIds = new Set(
        cubies
          .filter((c) => c.position[axisIndex] === active.layer)
          .map((c) => c.id)
      );
      
      setCurrentAnimation({
        axis: active.axis,
        layer: active.layer,
        direction: active.direction,
        cubieIds: rotatingCubieIds
      });

      // Schedule the commit after animation completes
      setTimeout(() => {
        commit();
        setCurrentAnimation(null);
      }, 550); // Slightly longer than animation duration
    }
  }, [active, currentAnimation, cubies, commit]);

  // Separate cubies into rotating and static
  const { rotatingCubies, staticCubies } = useMemo(() => {
    if (!currentAnimation) {
      return { rotatingCubies: [], staticCubies: cubies };
    }
    
    const rotating = cubies.filter(c => currentAnimation.cubieIds.has(c.id));
    const static_ = cubies.filter(c => !currentAnimation.cubieIds.has(c.id));
    
    return { rotatingCubies: rotating, staticCubies: static_ };
  }, [cubies, currentAnimation]);

  return (
    <group>
      {/* Static cubies */}
      {staticCubies.map((cubie) => (
        <Cubie key={cubie.id} data={cubie} />
      ))}
      
      {/* Animated rotating layer */}
      {currentAnimation && (
        <AnimatedLayer 
          axis={currentAnimation.axis} 
          direction={currentAnimation.direction}
        >
          {rotatingCubies.map((cubie) => (
            <Cubie key={cubie.id} data={cubie} />
          ))}
        </AnimatedLayer>
      )}
    </group>
  );
}

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
        <AnimatedCube />
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