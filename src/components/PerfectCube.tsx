import { useRef, useState, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useCubeStore } from "../state/cubeStore";
import { Cubie } from "./parts/Cubie";

export function PerfectCube() {
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
  } | null>(null);

  // Start animation
  useEffect(() => {
    if (active && !animationState) {
      const axisIndex = active.axis === "x" ? 0 : active.axis === "y" ? 1 : 2;
      const rotatingIds = new Set(
        cubies
          .filter((c) => c.position[axisIndex] === active.layer)
          .map((c) => c.id)
      );
      
      setAnimationState({
        axis: active.axis,
        direction: active.direction,
        layer: active.layer,
        startTime: performance.now(),
        rotatingCubieIds: rotatingIds,
        isCommitted: false
      });
    }
  }, [active, animationState, cubies]);

  useFrame(() => {
    if (!animationState || !rotatingGroupRef.current) return;

    const elapsed = performance.now() - animationState.startTime;
    const duration = 500;
    const progress = Math.min(elapsed / duration, 1);

    // Apply easing
    const eased = progress < 0.5
      ? 4 * progress * progress * progress
      : 1 - Math.pow(-2 * progress + 2, 3) / 2;

    // CRITICAL FIX: Stop the animation BEFORE reaching 100%
    // This prevents the one-frame flash by never showing the final rotated position
    // with the old cube state data
    const maxProgress = 0.98; // Stop at 98% instead of 100%
    const clampedProgress = Math.min(eased, maxProgress);
    
    const angle = clampedProgress * animationState.direction * (Math.PI / 2);

    // Apply rotation
    if (animationState.axis === "x") {
      rotatingGroupRef.current.rotation.x = angle;
    } else if (animationState.axis === "y") {
      rotatingGroupRef.current.rotation.y = angle;
    } else {
      rotatingGroupRef.current.rotation.z = angle;
    }

    // When we reach the time for completion (but visual is at 98%)
    if (progress >= 1 && !animationState.isCommitted) {
      // Mark as committed to prevent double-commit
      setAnimationState(prev => prev ? { ...prev, isCommitted: true } : null);
      
      // Commit the state FIRST
      commit();
      
      // Then immediately clean up the animation
      // The new cube state will appear exactly where the 98% rotation was
      setTimeout(() => {
        if (rotatingGroupRef.current) {
          rotatingGroupRef.current.rotation.set(0, 0, 0);
        }
        setAnimationState(null);
      }, 0);
    }
  });

  // Render logic
  if (!animationState) {
    // No animation - render all cubies normally
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