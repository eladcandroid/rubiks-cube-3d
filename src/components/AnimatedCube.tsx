import { useRef, useState, useEffect, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useCubeStore } from "../state/cubeStore";
import { Cubie } from "./parts/Cubie";

export function AnimatedCube() {
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
  } | null>(null);

  // Start animation when active rotation changes
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
        startTime: Date.now(),
        rotatingCubieIds: rotatingIds,
      });
    } else if (!active && animationState) {
      // Active rotation cleared, clean up animation
      setAnimationState(null);
    }
  }, [active, animationState]);

  // Animation progress tracking
  const animationProgress = useMemo(() => {
    if (!animationState) return 0;
    const elapsed = Date.now() - animationState.startTime;
    return Math.min(elapsed / 500, 1); // 500ms duration
  }, [animationState]);

  // Animate on each frame
  useFrame(() => {
    if (!animationState || !rotatingGroupRef.current) {
      return;
    }

    const elapsed = Date.now() - animationState.startTime;
    const duration = 500;
    let progress = Math.min(elapsed / duration, 1);
    
    // Apply easing
    const easedProgress = progress < 0.5
      ? 4 * progress * progress * progress
      : 1 - Math.pow(-2 * progress + 2, 3) / 2;

    const angle = easedProgress * animationState.direction * (Math.PI / 2);
    
    // Apply rotation
    if (animationState.axis === "x") {
      rotatingGroupRef.current.rotation.x = angle;
    } else if (animationState.axis === "y") {
      rotatingGroupRef.current.rotation.y = angle;
    } else {
      rotatingGroupRef.current.rotation.z = angle;
    }

    // Check if animation is complete
    if (progress >= 1) {
      // Set final rotation exactly
      const finalAngle = animationState.direction * (Math.PI / 2);
      if (animationState.axis === "x") {
        rotatingGroupRef.current.rotation.x = finalAngle;
      } else if (animationState.axis === "y") {
        rotatingGroupRef.current.rotation.y = finalAngle;
      } else {
        rotatingGroupRef.current.rotation.z = finalAngle;
      }
      
      // Force one more render with the final rotation before committing
      setTimeout(() => {
        commit();
      }, 0);
    }
  });

  // Split cubies into static and rotating
  const { staticCubies, rotatingCubies } = useMemo(() => {
    if (!animationState) {
      return { staticCubies: cubies, rotatingCubies: [] };
    }
    
    const static_: typeof cubies = [];
    const rotating: typeof cubies = [];
    
    cubies.forEach(cubie => {
      if (animationState.rotatingCubieIds.has(cubie.id)) {
        rotating.push(cubie);
      } else {
        static_.push(cubie);
      }
    });
    
    return { staticCubies: static_, rotatingCubies: rotating };
  }, [cubies, animationState]);

  return (
    <group ref={groupRef}>
      {/* Static cubies */}
      {staticCubies.map((cubie) => (
        <Cubie key={cubie.id} data={cubie} />
      ))}
      
      {/* Rotating cubies - only render when animating */}
      {animationState && (
        <group ref={rotatingGroupRef}>
          {rotatingCubies.map((cubie) => (
            <Cubie key={cubie.id} data={cubie} />
          ))}
        </group>
      )}
    </group>
  );
}