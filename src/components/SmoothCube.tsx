import { useRef, useState, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useCubeStore } from "../state/cubeStore";
import { Cubie } from "./parts/Cubie";

interface AnimationData {
  axis: "x" | "y" | "z";
  direction: 1 | -1;
  layer: number;
  startTime: number;
  rotatingCubieIds: Set<string>;
}

export function SmoothCube() {
  const groupRef = useRef<THREE.Group>(null);
  const rotatingGroupRef = useRef<THREE.Group>(null);
  
  const cubies = useCubeStore((s) => s.cubies);
  const active = useCubeStore((s) => s.activeRotation);
  const commit = useCubeStore((s) => s.commitActiveRotation);
  
  const [currentAnimation, setCurrentAnimation] = useState<AnimationData | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Track when active rotation starts
  useEffect(() => {
    if (active && !currentAnimation && !isTransitioning) {
      const axisIndex = active.axis === "x" ? 0 : active.axis === "y" ? 1 : 2;
      const rotatingIds = new Set(
        cubies
          .filter((c) => c.position[axisIndex] === active.layer)
          .map((c) => c.id)
      );
      
      setCurrentAnimation({
        axis: active.axis,
        direction: active.direction,
        layer: active.layer,
        startTime: performance.now(),
        rotatingCubieIds: rotatingIds
      });
    }
  }, [active, currentAnimation, isTransitioning, cubies]);

  // Handle animation with useFrame
  useFrame(() => {
    if (!currentAnimation || !rotatingGroupRef.current) return;

    const elapsed = performance.now() - currentAnimation.startTime;
    const duration = 500;
    const progress = Math.min(elapsed / duration, 1);

    // Smooth easing
    const eased = progress < 0.5
      ? 4 * progress * progress * progress
      : 1 - Math.pow(-2 * progress + 2, 3) / 2;

    const angle = eased * currentAnimation.direction * (Math.PI / 2);

    // Apply rotation
    rotatingGroupRef.current.rotation.set(0, 0, 0);
    if (currentAnimation.axis === "x") {
      rotatingGroupRef.current.rotation.x = angle;
    } else if (currentAnimation.axis === "y") {
      rotatingGroupRef.current.rotation.y = angle;
    } else {
      rotatingGroupRef.current.rotation.z = angle;
    }

    // Animation complete
    if (progress >= 1) {
      setIsTransitioning(true);
      
      // Keep the exact final rotation for one more frame
      const finalAngle = currentAnimation.direction * (Math.PI / 2);
      rotatingGroupRef.current.rotation.set(0, 0, 0);
      if (currentAnimation.axis === "x") {
        rotatingGroupRef.current.rotation.x = finalAngle;
      } else if (currentAnimation.axis === "y") {
        rotatingGroupRef.current.rotation.y = finalAngle;
      } else {
        rotatingGroupRef.current.rotation.z = finalAngle;
      }

      // Schedule state update
      requestAnimationFrame(() => {
        commit();
        // Clean up after commit
        requestAnimationFrame(() => {
          setCurrentAnimation(null);
          setIsTransitioning(false);
          if (rotatingGroupRef.current) {
            rotatingGroupRef.current.rotation.set(0, 0, 0);
          }
        });
      });
    }
  });

  // Render logic
  if (!currentAnimation) {
    // No animation - render all cubies normally
    return (
      <group ref={groupRef}>
        {cubies.map((cubie) => (
          <Cubie key={cubie.id} data={cubie} />
        ))}
      </group>
    );
  }

  // During animation - separate cubies
  const staticCubies = cubies.filter(c => !currentAnimation.rotatingCubieIds.has(c.id));
  const rotatingCubies = cubies.filter(c => currentAnimation.rotatingCubieIds.has(c.id));

  return (
    <group ref={groupRef}>
      {/* Static cubies */}
      {staticCubies.map((cubie) => (
        <Cubie key={`s-${cubie.id}`} data={cubie} />
      ))}
      
      {/* Animated cubies */}
      <group ref={rotatingGroupRef}>
        {rotatingCubies.map((cubie) => (
          <Cubie key={`r-${cubie.id}`} data={cubie} />
        ))}
      </group>
    </group>
  );
}