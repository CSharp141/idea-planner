"use client";

/// <reference types="@react-three/fiber" />

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useReducedMotion } from "framer-motion";
import * as THREE from "three";

function IcosahedronMesh() {
  const meshRef = useRef<THREE.Mesh>(null);
  const reducedMotion = useReducedMotion();

  useFrame(() => {
    if (!meshRef.current || reducedMotion) return;
    meshRef.current.rotation.x += 0.002;
    meshRef.current.rotation.y += 0.003;
  });

  return (
    <mesh ref={meshRef} scale={2.2}>
      <icosahedronGeometry args={[1, 1]} />
      <meshBasicMaterial color="#4f46e5" wireframe transparent opacity={0.25} />
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
      <pointLight position={[5, 5, 5]} intensity={0.8} color="#6366f1" />
      <pointLight position={[-5, -5, -5]} intensity={0.4} color="#7c3aed" />
      <IcosahedronMesh />
    </Canvas>
  );
}
