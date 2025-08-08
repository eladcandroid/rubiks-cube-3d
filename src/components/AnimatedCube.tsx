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
  
  const [animationData, setAnimationData] = useState<{
    isAnimating: boolean;
    axis: "x" | "y" | "z";
    direction: 1 | -1;
    layer: number;
    startTime: number;
    rotatingCubieIds: Set<string>;
  } | null>(null);

  // Start animation when active rotation changes
  useEffect(() => {
    if (active && !animationData?.isAnimating) {
      const axisIndex = active.axis === "x" ? 0 : active.axis === "y" ? 1 : 2;
      const rotatingIds = new Set(
        cubies
          .filter((c) => c.position[axisIndex] === active.layer)
          .map((c) => c.id)
      );
      
      setAnimationData({
        isAnimating: true,
        axis: active.axis,
        direction: active.direction,
        layer: active.layer,
        startTime: Date.now(),
        rotatingCubieIds: rotatingIds
      });
    }
  }, [active, animationData?.isAnimating, cubies]);

  // Animate on each frame
  useFrame(() => {
    if (!animationData?.isAnimating || !rotatingGroupRef.current) {
      return;
    }

    const elapsed = Date.now() - animationData.startTime;
    const duration = 500; // 500ms animation
    let progress = Math.min(elapsed / duration, 1);
    
    // Apply easing function (ease-in-out cubic)
    const easedProgress = progress < 0.5
      ? 4 * progress * progress * progress
      : 1 - Math.pow(-2 * progress + 2, 3) / 2;

    const angle = easedProgress * animationData.direction * (Math.PI / 2);
    
    // Apply rotation based on axis
    if (animationData.axis === "x") {
      rotatingGroupRef.current.rotation.x = angle;
    } else if (animationData.axis === "y") {
      rotatingGroupRef.current.rotation.y = angle;
    } else {
      rotatingGroupRef.current.rotation.z = angle;
    }

    // Check if animation is complete
    if (progress >= 1) {
      // Reset rotation
      rotatingGroupRef.current.rotation.set(0, 0, 0);
      
      // Commit changes and stop animation
      commit();
      setAnimationData(null);
    }
  });

  // Render all cubies but separate rotating ones
  const renderCubies = () => {
    if (!animationData?.isAnimating) {
      // No animation - render all cubies normally
      return cubies.map((cubie) => (
        <Cubie key={cubie.id} data={cubie} />
      ));
    }

    // During animation - split cubies into two groups
    const staticCubies: typeof cubies = [];
    const rotatingCubies: typeof cubies = [];

    cubies.forEach((cubie) => {
      if (animationData.rotatingCubieIds.has(cubie.id)) {
        rotatingCubies.push(cubie);
      } else {
        staticCubies.push(cubie);
      }
    });

    return (
      <>
        {/* Static cubies */}
        {staticCubies.map((cubie) => (
          <Cubie key={cubie.id} data={cubie} />
        ))}
        
        {/* Rotating cubies in separate group */}
        <group 
          ref={rotatingGroupRef} 
          key={`rotating-${animationData.axis}-${animationData.layer}`}
        >
          {rotatingCubies.map((cubie) => (
            <Cubie key={`rotating-${cubie.id}`} data={cubie} />
          ))}
        </group>
      </>
    );
  };

  return (
    <group ref={groupRef}>
      {renderCubies()}
    </group>
  );
}