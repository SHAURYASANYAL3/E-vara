import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial, Sphere } from "@react-three/drei";
import * as THREE from "three";

function GlobeParticles() {
  const ref = useRef<THREE.Points>(null!);

  const particles = useMemo(() => {
    const positions = new Float32Array(2000 * 3);
    for (let i = 0; i < 2000; i++) {
      const theta = THREE.MathUtils.randFloatSpread(360);
      const phi = THREE.MathUtils.randFloatSpread(360);

      positions[i * 3] = 1.5 * Math.sin(theta) * Math.cos(phi);
      positions[i * 3 + 1] = 1.5 * Math.sin(theta) * Math.sin(phi);
      positions[i * 3 + 2] = 1.5 * Math.cos(theta);
    }
    return positions;
  }, []);

  useFrame((state, delta) => {
    ref.current.rotation.y += delta * 0.1;
    ref.current.rotation.x += delta * 0.05;
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={particles} stride={3} frustumCulled={false}>
        <PointMaterial
          transparent
          color="#007AFF"
          size={0.015}
          sizeAttenuation={true}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </Points>
      <Sphere args={[1.48, 64, 64]}>
        <meshBasicMaterial color="#000" transparent opacity={0.3} />
      </Sphere>
    </group>
  );
}

const CyberGlobe = () => {
  return (
    <div className="w-full h-[600px] lg:h-[800px] relative">
      <Canvas camera={{ position: [0, 0, 4], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <GlobeParticles />
      </Canvas>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-graphite-dark pointer-events-none" />
    </div>
  );
};

export default CyberGlobe;
