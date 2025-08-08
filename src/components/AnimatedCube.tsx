import React, { useRef, useState, useEffect } from "react";
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
    isAnimating: boolean;
    progress: number;
    axis: "x" | "y" | "z";
    direction: 1 | -1;
    layer: number;
    startTime: number;
  } | null>(null);

  // Start animation when active rotation changes
  useEffect(() => {
    if (active && !animationState) {
      setAnimationState({
        isAnimating: true,
        progress: 0,
        axis: active.axis,
        direction: active.direction,
        layer: active.layer,
        startTime: Date.now()
      });
    }
  }, [active, animationState]);

  // Animate on each frame
  useFrame(() => {
    if (!animationState || !animationState.isAnimating || !rotatingGroupRef.current) {
      return;
    }

    const elapsed = Date.now() - animationState.startTime;
    const duration = 500; // 500ms animation
    let progress = Math.min(elapsed / duration, 1);
    
    // Apply easing function (ease-in-out cubic)
    const easedProgress = progress < 0.5
      ? 4 * progress * progress * progress
      : 1 - Math.pow(-2 * progress + 2, 3) / 2;

    const angle = easedProgress * animationState.direction * (Math.PI / 2);
    
    // Apply rotation based on axis
    if (animationState.axis === "x") {
      rotatingGroupRef.current.rotation.x = angle;
    } else if (animationState.axis === "y") {
      rotatingGroupRef.current.rotation.y = angle;
    } else {
      rotatingGroupRef.current.rotation.z = angle;
    }

    // Check if animation is complete
    if (progress >= 1) {
      commit();
      setAnimationState(null);
      // Reset rotation for next animation
      if (rotatingGroupRef.current) {
        rotatingGroupRef.current.rotation.set(0, 0, 0);
      }
    }
  });

  // Determine which cubies are rotating - memoize with stable reference
  const { rotatingCubies, staticCubies } = React.useMemo(() => {
    if (!animationState) {
      return { rotatingCubies: [], staticCubies: cubies };
    }
    
    const axisIndex = animationState.axis === "x" ? 0 : animationState.axis === "y" ? 1 : 2;
    const rotating: typeof cubies = [];
    const static_: typeof cubies = [];
    
    cubies.forEach(c => {
      if (c.position[axisIndex] === animationState.layer) {
        rotating.push(c);
      } else {
        static_.push(c);
      }
    });
    
    return { rotatingCubies: rotating, staticCubies: static_ };
  }, [cubies, animationState?.axis, animationState?.layer]);

  return (
    <group ref={groupRef}>
      {/* Static cubies */}
      {staticCubies.map((cubie) => (
        <Cubie key={cubie.id} data={cubie} />
      ))}
      
      {/* Rotating cubies */}
      <group ref={rotatingGroupRef}>
        {animationState && rotatingCubies.map((cubie) => (
          <Cubie key={cubie.id} data={cubie} />
        ))}
      </group>
    </group>
  );
}