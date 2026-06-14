import React, { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Sphere } from "@react-three/drei";
import * as THREE from "three";

const GlobeMesh = () => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.1;
      groupRef.current.rotation.x = state.clock.elapsedTime * 0.05;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Core dark sphere */}
      <Sphere args={[2.2, 32, 32]}>
        <meshBasicMaterial color="#050505" />
      </Sphere>

      {/* Outer wireframe */}
      <Sphere args={[2.22, 32, 32]}>
        <meshBasicMaterial
          color="#007AFF"
          wireframe={true}
          transparent={true}
          opacity={0.3}
        />
      </Sphere>

      {/* Secondary wireframe offset */}
      <Sphere args={[2.3, 16, 16]}>
        <meshBasicMaterial
          color="#007AFF"
          wireframe={true}
          transparent={true}
          opacity={0.1}
        />
      </Sphere>
    </group>
  );
};

const CyberGlobe = () => {
  return (
    <div className="relative w-[500px] h-[500px] mx-auto flex items-center justify-center">
      <Canvas camera={{ position: [0, 0, 6], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <GlobeMesh />
      </Canvas>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#050505] pointer-events-none" />
    </div>
  );
};

export default CyberGlobe;
