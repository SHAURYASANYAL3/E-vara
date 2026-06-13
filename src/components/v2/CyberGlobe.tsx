import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial, Line } from "@react-three/drei";
import * as THREE from "three";

function randomSpherePoint(radius: number) {
  const theta = Math.random() * Math.PI * 2;
  const phi = Math.acos(2 * Math.random() - 1);
  return new THREE.Vector3(
    radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.sin(phi) * Math.sin(theta),
    radius * Math.cos(phi),
  );
}

function OrbitalRing({
  radius,
  dotCount,
}: {
  radius: number;
  dotCount: number;
}) {
  const ringPoints = useMemo(() => {
    const pts: THREE.Vector3[] = [];
    const segments = 80;
    for (let i = 0; i <= segments; i++) {
      const angle = (i / segments) * Math.PI * 2;
      pts.push(
        new THREE.Vector3(
          Math.cos(angle) * radius,
          0,
          Math.sin(angle) * radius,
        ),
      );
    }
    return pts;
  }, [radius]);

  const dotPositions = useMemo(() => {
    const positions = new Float32Array(dotCount * 3);
    for (let i = 0; i < dotCount; i++) {
      const angle = (i / dotCount) * Math.PI * 2;
      positions[i * 3] = Math.cos(angle) * radius;
      positions[i * 3 + 1] = 0;
      positions[i * 3 + 2] = Math.sin(angle) * radius;
    }
    return positions;
  }, [radius, dotCount]);

  return (
    <>
      <Line points={ringPoints} color="#007AFF" transparent opacity={0.2} />
      <Points positions={dotPositions} stride={3} frustumCulled={false}>
        <PointMaterial
          transparent
          color="#007AFF"
          size={0.035}
          sizeAttenuation
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          opacity={0.6}
        />
      </Points>
    </>
  );
}

function ConnectionArcs() {
  const arcs = useMemo(() => {
    const result: THREE.Vector3[][] = [];
    for (let i = 0; i < 6; i++) {
      const start = randomSpherePoint(1.5);
      const end = randomSpherePoint(1.5);
      const pts: THREE.Vector3[] = [];
      const steps = 40;
      for (let t = 0; t <= steps; t++) {
        const p = new THREE.Vector3().lerpVectors(start, end, t / steps);
        const height = Math.sin((t / steps) * Math.PI) * 0.5;
        p.normalize().multiplyScalar(1.5 + height);
        pts.push(p);
      }
      result.push(pts);
    }
    return result;
  }, []);

  return (
    <>
      {arcs.map((points, i) => (
        <Line
          key={i}
          points={points}
          color="#007AFF"
          transparent
          opacity={0.12}
        />
      ))}
    </>
  );
}

function ScanningRing() {
  const ref = useRef<THREE.Mesh>(null!);
  useFrame((state) => {
    const t = state.clock.elapsedTime * 0.3;
    ref.current.position.y = Math.sin(t) * 1.4;
    ref.current.material.opacity = 0.06 + Math.sin(t * 2 + 1) * 0.04;
  });

  return (
    <mesh ref={ref} rotation={[-Math.PI / 2, 0, 0]}>
      <ringGeometry args={[0.4, 2.0, 64]} />
      <meshBasicMaterial
        color="#007AFF"
        transparent
        opacity={0.08}
        side={THREE.DoubleSide}
        depthWrite={false}
      />
    </mesh>
  );
}

function GlobeParticles() {
  const globeRef = useRef<THREE.Group>(null!);
  const ring1Ref = useRef<THREE.Group>(null!);
  const ring2Ref = useRef<THREE.Group>(null!);

  const particles = useMemo(() => {
    const count = 3000;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      // eslint-disable-next-line react-hooks/purity
      const p = randomSpherePoint(1.5 + Math.random() * 0.3);
      positions[i * 3] = p.x;
      positions[i * 3 + 1] = p.y;
      positions[i * 3 + 2] = p.z;
    }
    return positions;
  }, []);

  useFrame((state, delta) => {
    globeRef.current.rotation.y += delta * 0.15;
    globeRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.1) * 0.1;
    ring1Ref.current.rotation.y += delta * 0.08;
    ring1Ref.current.rotation.x += delta * 0.03;
    ring2Ref.current.rotation.z += delta * 0.06;
    ring2Ref.current.rotation.x += delta * 0.02;
  });

  return (
    <group>
      <group ref={globeRef}>
        <Points positions={particles} stride={3} frustumCulled={false}>
          <PointMaterial
            transparent
            color="#007AFF"
            size={0.012}
            sizeAttenuation
            depthWrite={false}
            blending={THREE.AdditiveBlending}
            opacity={0.5}
          />
        </Points>
        <mesh>
          <sphereGeometry args={[1.48, 48, 48]} />
          <meshBasicMaterial color="#007AFF" transparent opacity={0.06} />
        </mesh>
        <ConnectionArcs />
      </group>
      <group ref={ring1Ref}>
        <OrbitalRing radius={1.85} dotCount={10} />
      </group>
      <group ref={ring2Ref}>
        <OrbitalRing radius={2.15} dotCount={14} />
      </group>
      <ScanningRing />
    </group>
  );
}

const CyberGlobe = () => {
  return (
    <div className="w-full h-[600px] lg:h-[800px] relative rounded-[28px] border border-primary/15 bg-secondary/20">
      <Canvas
        camera={{ position: [0, 0, 4], fov: 45 }}
        dpr={[1, 1.5]}
        performance={{ min: 0.5 }}
        gl={{ alpha: true }}
        style={{ background: "transparent" }}
      >
        <GlobeParticles />
      </Canvas>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_42%,hsl(var(--background))_100%)] pointer-events-none" />
      <div className="absolute -inset-x-10 bottom-0 h-24 bg-[radial-gradient(ellipse_at_center,hsl(var(--primary)/0.25)_0%,transparent_70%)] pointer-events-none" />
    </div>
  );
};

export default CyberGlobe;
