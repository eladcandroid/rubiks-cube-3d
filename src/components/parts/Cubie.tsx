import { useMemo } from "react";
import * as THREE from "three";
import { a } from "@react-spring/three";
import { RoundedBox } from "@react-three/drei";
import type { CubieData } from "../../state/cubeStore";

const FACE_SIZE = 0.85;
const GAP = 0.06;
const STICKER_DEPTH = 0.005; // Increased to prevent z-fighting
const CUBIE_SIZE = 0.97;
const BORDER_RADIUS = 0.08;

const blackMaterial = new THREE.MeshPhysicalMaterial({
  color: "#0a0a0a",
  metalness: 0.0,
  roughness: 0.9,
  clearcoat: 0.1,
  clearcoatRoughness: 0.8,
});

export function Cubie({ data }: { data: CubieData }) {
  const groupPos = useMemo(
    () =>
      new THREE.Vector3(
        data.position[0] * (1 + GAP),
        data.position[1] * (1 + GAP),
        data.position[2] * (1 + GAP)
      ),
    [data.position]
  );

  const quat = useMemo(
    () =>
      new THREE.Quaternion(
        data.orientation[0],
        data.orientation[1],
        data.orientation[2],
        data.orientation[3]
      ),
    [data.orientation]
  );

  const faces = useMemo(() => {
    const planes: Array<{
      position: [number, number, number];
      rotation: [number, number, number];
      color?: string;
    }> = [];
    const half = 0.5 + STICKER_DEPTH;
    // +X (Right face)
    planes.push({
      position: [half, 0, 0],
      rotation: [0, Math.PI / 2, 0],
      color: data.stickers.px,
    });
    // -X (Left face)
    planes.push({
      position: [-half, 0, 0],
      rotation: [0, -Math.PI / 2, 0],
      color: data.stickers.nx,
    });
    // +Y (Top face)
    planes.push({
      position: [0, half, 0],
      rotation: [-Math.PI / 2, 0, 0],
      color: data.stickers.py,
    });
    // -Y (Bottom face)
    planes.push({
      position: [0, -half, 0],
      rotation: [Math.PI / 2, 0, 0],
      color: data.stickers.ny,
    });
    // +Z (Front face)
    planes.push({
      position: [0, 0, half],
      rotation: [0, 0, 0],
      color: data.stickers.pz,
    });
    // -Z (Back face)
    planes.push({
      position: [0, 0, -half],
      rotation: [0, Math.PI, 0],
      color: data.stickers.nz,
    });
    return planes;
  }, [data.stickers]);

  return (
    <a.group position={groupPos} quaternion={quat}>
      <RoundedBox 
        args={[CUBIE_SIZE, CUBIE_SIZE, CUBIE_SIZE]} 
        radius={BORDER_RADIUS}
        smoothness={4}
        castShadow 
        receiveShadow
      >
        <primitive object={blackMaterial} attach="material" />
      </RoundedBox>
      {faces.map((f, i) => (
        <group
          key={i}
          position={f.position as any}
          rotation={f.rotation as any}
        >
          <mesh castShadow receiveShadow>
            <planeGeometry args={[FACE_SIZE, FACE_SIZE]} />
            <meshPhysicalMaterial
              color={f.color ?? "#0a0a0a"}
              metalness={0.0}
              roughness={0.4}
              clearcoat={0.3}
              clearcoatRoughness={0.3}
              reflectivity={0.05}
              side={THREE.FrontSide}
              transparent={false}
            />
          </mesh>
        </group>
      ))}
    </a.group>
  );
}
