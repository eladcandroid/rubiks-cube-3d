import { useRef, useState, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useCubeStore } from "../state/cubeStore";
import { Cubie } from "./parts/Cubie";

export function UnifiedCube() {
  const cubies = useCubeStore((s) => s.cubies);
  const active = useCubeStore((s) => s.activeRotation);
  const commit = useCubeStore((s) => s.commitActiveRotation);
  
  const cubieRefs = useRef<{ [key: string]: THREE.Group }>({});
  const [animationData, setAnimationData] = useState<{
    axis: "x" | "y" | "z";
    direction: 1 | -1;
    layer: number;
    startTime: number;
    rotatingCubieIds: Set<string>;
  } | null>(null);

  // Start animation when active rotation changes
  useEffect(() => {
    if (active && !animationData) {
      const axisIndex = active.axis === "x" ? 0 : active.axis === "y" ? 1 : 2;
      const rotatingIds = new Set(
        cubies
          .filter((c) => c.position[axisIndex] === active.layer)
          .map((c) => c.id)
      );
      
      setAnimationData({
        axis: active.axis,
        direction: active.direction,
        layer: active.layer,
        startTime: performance.now(),
        rotatingCubieIds: rotatingIds,
      });
    }
  }, [active, animationData, cubies]);

  // Animation loop
  useFrame(() => {
    if (!animationData) return;

    const elapsed = performance.now() - animationData.startTime;
    const duration = 500;
    const progress = Math.min(elapsed / duration, 1);

    // Smooth easing
    const eased = progress < 0.5
      ? 4 * progress * progress * progress
      : 1 - Math.pow(-2 * progress + 2, 3) / 2;

    const angle = eased * animationData.direction * (Math.PI / 2);

    // Apply rotation directly to individual cubie refs
    animationData.rotatingCubieIds.forEach(cubieId => {
      const ref = cubieRefs.current[cubieId];
      if (ref) {
        // Reset rotation first
        ref.rotation.set(0, 0, 0);
        
        // Apply rotation around the cube's center
        const cubie = cubies.find(c => c.id === cubieId);
        if (cubie) {
          const pos = new THREE.Vector3(
            cubie.position[0] * 1.06,
            cubie.position[1] * 1.06,
            cubie.position[2] * 1.06
          );
          
          // Rotate around origin
          if (animationData.axis === "x") {
            const matrix = new THREE.Matrix4().makeRotationX(angle);
            pos.applyMatrix4(matrix);
            ref.rotation.x = angle;
          } else if (animationData.axis === "y") {
            const matrix = new THREE.Matrix4().makeRotationY(angle);
            pos.applyMatrix4(matrix);
            ref.rotation.y = angle;
          } else {
            const matrix = new THREE.Matrix4().makeRotationZ(angle);
            pos.applyMatrix4(matrix);
            ref.rotation.z = angle;
          }
          
          ref.position.copy(pos);
        }
      }
    });

    // Animation complete
    if (progress >= 1) {
      // Reset all rotations and positions
      animationData.rotatingCubieIds.forEach(cubieId => {
        const ref = cubieRefs.current[cubieId];
        if (ref) {
          ref.rotation.set(0, 0, 0);
          const cubie = cubies.find(c => c.id === cubieId);
          if (cubie) {
            ref.position.set(
              cubie.position[0] * 1.06,
              cubie.position[1] * 1.06,
              cubie.position[2] * 1.06
            );
          }
        }
      });

      commit();
      setAnimationData(null);
    }
  });

  return (
    <group>
      {cubies.map((cubie) => {
        const isRotating = animationData?.rotatingCubieIds.has(cubie.id);
        
        return (
          <group
            key={cubie.id}
            ref={(ref) => {
              if (ref) {
                cubieRefs.current[cubie.id] = ref;
                if (!isRotating) {
                  // Set static position
                  ref.position.set(
                    cubie.position[0] * 1.06,
                    cubie.position[1] * 1.06,
                    cubie.position[2] * 1.06
                  );
                  ref.rotation.set(0, 0, 0);
                }
              }
            }}
            position={!isRotating ? [
              cubie.position[0] * 1.06,
              cubie.position[1] * 1.06,
              cubie.position[2] * 1.06
            ] : undefined}
          >
            <Cubie data={cubie} />
          </group>
        );
      })}
    </group>
  );
}