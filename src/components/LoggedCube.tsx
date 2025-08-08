import { useRef, useState, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useCubeStore } from "../state/cubeStore";
import { Cubie } from "./parts/Cubie";

// Logging utility
const log = (message: string, data?: any) => {
  const timestamp = performance.now().toFixed(1);
  console.log(`[${timestamp}ms] CUBE: ${message}`, data || '');
};

export function LoggedCube() {
  const groupRef = useRef<THREE.Group>(null);
  const rotatingGroupRef = useRef<THREE.Group>(null);
  
  const cubies = useCubeStore((s) => s.cubies);
  const active = useCubeStore((s) => s.activeRotation);
  const commit = useCubeStore((s) => s.commitActiveRotation);
  
  const [animationState, setAnimationState] = useState<{
    axis: "x" | "y" | "z";
    direction: 1 | -1;
    layer: number;
    startTime: number;
    rotatingCubieIds: Set<string>;
    isCommitted: boolean;
    frameCount: number;
  } | null>(null);

  // Log store state changes
  useEffect(() => {
    log(`Store active changed:`, active ? `${active.axis}-${active.layer}-${active.direction}` : 'null');
  }, [active]);

  // Start animation
  useEffect(() => {
    if (active && !animationState) {
      log('🟢 STARTING ANIMATION', { axis: active.axis, layer: active.layer, direction: active.direction });
      
      const axisIndex = active.axis === "x" ? 0 : active.axis === "y" ? 1 : 2;
      const rotatingIds = new Set(
        cubies
          .filter((c) => c.position[axisIndex] === active.layer)
          .map((c) => c.id)
      );
      
      log(`Found ${rotatingIds.size} rotating cubies:`, Array.from(rotatingIds));
      
      setAnimationState({
        axis: active.axis,
        direction: active.direction,
        layer: active.layer,
        startTime: performance.now(),
        rotatingCubieIds: rotatingIds,
        isCommitted: false,
        frameCount: 0
      });
    } else if (!active && animationState) {
      log('🔴 STORE CLEARED - Cleaning up animation state');
      setAnimationState(null);
    }
  }, [active, animationState, cubies]);

  useFrame(() => {
    if (!animationState || !rotatingGroupRef.current) return;

    const elapsed = performance.now() - animationState.startTime;
    const duration = 500;
    const progress = Math.min(elapsed / duration, 1);

    // Update frame count
    const frameCount = animationState.frameCount + 1;
    setAnimationState(prev => prev ? { ...prev, frameCount } : null);

    // Log every 10th frame or important moments
    if (frameCount % 10 === 0 || progress > 0.95) {
      log(`Frame ${frameCount}: progress=${progress.toFixed(3)}, elapsed=${elapsed.toFixed(1)}ms`);
    }

    // Apply easing
    const eased = progress < 0.5
      ? 4 * progress * progress * progress
      : 1 - Math.pow(-2 * progress + 2, 3) / 2;

    const angle = eased * animationState.direction * (Math.PI / 2);

    // Apply rotation
    if (animationState.axis === "x") {
      rotatingGroupRef.current.rotation.x = angle;
    } else if (animationState.axis === "y") {
      rotatingGroupRef.current.rotation.y = angle;
    } else {
      rotatingGroupRef.current.rotation.z = angle;
    }

    // Log rotation applied
    if (progress > 0.95) {
      log(`Applied rotation: ${animationState.axis}=${angle.toFixed(3)} (${(angle * 180 / Math.PI).toFixed(1)}°)`);
    }

    // Animation completion
    if (progress >= 1 && !animationState.isCommitted) {
      log('🟡 ANIMATION COMPLETE - About to commit');
      log('Cube state before commit:', {
        activeCubieCount: cubies.filter(c => animationState.rotatingCubieIds.has(c.id)).length,
        firstActiveCubie: cubies.find(c => animationState.rotatingCubieIds.has(c.id))
      });
      
      // Mark as committed
      setAnimationState(prev => prev ? { ...prev, isCommitted: true } : null);
      
      // Log the exact moment of commit
      log('🔵 CALLING COMMIT() NOW');
      commit();
      
      // Check state after commit
      setTimeout(() => {
        log('State after commit:', {
          storeActive: useCubeStore.getState().activeRotation,
          newCubieCount: useCubeStore.getState().cubies.length
        });
      }, 0);
      
      // Clean up animation
      setTimeout(() => {
        log('🟣 CLEANING UP ANIMATION');
        if (rotatingGroupRef.current) {
          rotatingGroupRef.current.rotation.set(0, 0, 0);
          log('Reset rotation group to (0,0,0)');
        }
        setAnimationState(null);
        log('🏁 ANIMATION STATE CLEARED');
      }, 0);
    }
  });

  // Log render decisions only when state changes
  const isAnimating = !!animationState;
  const renderStateChanged = useRef({ isAnimating: false, cubieCount: 0 });
  if (renderStateChanged.current.isAnimating !== isAnimating || renderStateChanged.current.cubieCount !== cubies.length) {
    log(`RENDER STATE CHANGE: isAnimating=${isAnimating}, cubieCount=${cubies.length}`, 
      isAnimating ? `rotating=${animationState!.rotatingCubieIds.size}` : ''
    );
    renderStateChanged.current = { isAnimating, cubieCount: cubies.length };
  }

  // Render logic
  if (!animationState) {
    return (
      <group ref={groupRef}>
        {cubies.map((cubie) => (
          <Cubie key={cubie.id} data={cubie} />
        ))}
      </group>
    );
  }

  // During animation - separate static and rotating cubies
  const staticCubies = cubies.filter(c => !animationState.rotatingCubieIds.has(c.id));
  const rotatingCubies = cubies.filter(c => animationState.rotatingCubieIds.has(c.id));

  return (
    <group ref={groupRef}>
      {/* Static cubies */}
      {staticCubies.map((cubie) => (
        <Cubie key={`static-${cubie.id}`} data={cubie} />
      ))}
      
      {/* Rotating cubies */}
      <group ref={rotatingGroupRef}>
        {rotatingCubies.map((cubie) => (
          <Cubie key={`rotating-${cubie.id}`} data={cubie} />
        ))}
      </group>
    </group>
  );
}