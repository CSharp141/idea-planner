"use client";

/// <reference types="@react-three/fiber" />

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useReducedMotion } from "framer-motion";
import * as THREE from "three";

function NavGlobe() {
  const meshRef = useRef<THREE.Mesh>(null);
  const reducedMotion = useReducedMotion();

  useFrame(() => {
    if (!meshRef.current || reducedMotion) return;
    // Slow axial spin, like an instrument navigation globe.
    meshRef.current.rotation.y += 0.0016;
  });

  // Meridians/parallels wireframe reads as a radar/navigation globe.
  return (
    <mesh ref={meshRef} scale={2.2} rotation={[0.35, 0, 0.1]}>
      <sphereGeometry args={[1, 24, 16]} />
      <meshBasicMaterial color="#2DD4BF" wireframe transparent opacity={0.18} />
    </mesh>
  );
}

export default function HeroCanvas() {
  return (
    <Canvas
      camera={{ position: [0, 0, 4], fov: 45 }}
      style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}
      aria-hidden="true"
      className="pointer-events-none"
    >
      <ambientLight intensity={0.3} />
      <pointLight position={[5, 5, 5]} intensity={0.8} color="#F5B53C" />
      <pointLight position={[-5, -5, -5]} intensity={0.4} color="#2DD4BF" />
      <NavGlobe />
    </Canvas>
  );
}
