import { useRef, useState, useEffect, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useCubeStore } from "../state/cubeStore";
import { Cubie } from "./parts/Cubie";

export function DirectCube() {
  const groupRef = useRef<THREE.Group>(null);
  const cubies = useCubeStore((s) => s.cubies);
  const active = useCubeStore((s) => s.activeRotation);
  const commit = useCubeStore((s) => s.commitActiveRotation);
  
  const [rotationState, setRotationState] = useState<{
    axis: "x" | "y" | "z";
    direction: 1 | -1;
    layer: number;
    startTime: number;
    targetAngle: number;
    rotatingIds: string[];
  } | null>(null);

  // Start rotation
  useEffect(() => {
    if (active && !rotationState) {
      const axisIndex = active.axis === "x" ? 0 : active.axis === "y" ? 1 : 2;
      const rotatingIds = cubies
        .filter((c) => c.position[axisIndex] === active.layer)
        .map((c) => c.id);
      
      setRotationState({
        axis: active.axis,
        direction: active.direction,
        layer: active.layer,
        startTime: performance.now(),
        targetAngle: active.direction * (Math.PI / 2),
        rotatingIds
      });
    }
  }, [active, rotationState, cubies]);

  // Store original positions for rotation calculation
  const originalPositions = useMemo(() => {
    const positions: { [id: string]: THREE.Vector3 } = {};
    cubies.forEach(cubie => {
      positions[cubie.id] = new THREE.Vector3(
        cubie.position[0] * 1.06,
        cubie.position[1] * 1.06,
        cubie.position[2] * 1.06
      );
    });
    return positions;
  }, [cubies]);

  useFrame(() => {
    if (!rotationState || !groupRef.current) return;

    const elapsed = performance.now() - rotationState.startTime;
    const duration = 500;
    const rawProgress = Math.min(elapsed / duration, 1);

    // Smooth easing
    const progress = rawProgress < 0.5
      ? 4 * rawProgress * rawProgress * rawProgress
      : 1 - Math.pow(-2 * rawProgress + 2, 3) / 2;

    const currentAngle = progress * rotationState.targetAngle;

    // Find and rotate the specific cubies
    groupRef.current.children.forEach((child, index) => {
      const cubie = cubies[index];
      if (rotationState.rotatingIds.includes(cubie.id)) {
        const originalPos = originalPositions[cubie.id];
        
        // Create rotation matrix
        let rotMatrix: THREE.Matrix4;
        if (rotationState.axis === "x") {
          rotMatrix = new THREE.Matrix4().makeRotationX(currentAngle);
        } else if (rotationState.axis === "y") {
          rotMatrix = new THREE.Matrix4().makeRotationY(currentAngle);
        } else {
          rotMatrix = new THREE.Matrix4().makeRotationZ(currentAngle);
        }
        
        // Apply rotation to position
        const newPos = originalPos.clone().applyMatrix4(rotMatrix);
        child.position.copy(newPos);
        
        // Apply rotation to the cubie itself
        const object3d = child as THREE.Object3D;
        object3d.rotation.set(0, 0, 0);
        if (rotationState.axis === "x") {
          object3d.rotation.x = currentAngle;
        } else if (rotationState.axis === "y") {
          object3d.rotation.y = currentAngle;
        } else {
          object3d.rotation.z = currentAngle;
        }
      }
    });

    // Animation complete
    if (rawProgress >= 1) {
      // Reset rotations and positions
      groupRef.current.children.forEach((child, index) => {
        const cubie = cubies[index];
        if (rotationState.rotatingIds.includes(cubie.id)) {
          const originalPos = originalPositions[cubie.id];
          child.position.copy(originalPos);
          (child as THREE.Object3D).rotation.set(0, 0, 0);
        }
      });

      commit();
      setRotationState(null);
    }
  });

  return (
    <group ref={groupRef}>
      {cubies.map((cubie, index) => (
        <group
          key={cubie.id}
          position={[
            cubie.position[0] * 1.06,
            cubie.position[1] * 1.06,
            cubie.position[2] * 1.06
          ]}
        >
          <Cubie data={cubie} />
        </group>
      ))}
    </group>
  );
}