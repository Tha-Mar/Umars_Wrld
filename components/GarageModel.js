'use client';

import { useGLTF } from '@react-three/drei';

/*
 * GarageModel: pure environment renderer.
 *
 * Responsibilities:
 *   - Load and display the GLB scene geometry
 *   - Nothing else
 *
 * Intentionally excluded — never add these here:
 *   - Camera / controls
 *   - Player logic
 *   - Physics or RigidBody wrappers (belongs in Experience or a World.js wrapper)
 *   - Interaction hotspots
 *   - Any game or UI state
 */

export default function GarageModel() {
  const { scene } = useGLTF('/models/garage.glb');

  scene.traverse((child) => {
    if (child.isMesh) {
      child.castShadow = true;
      child.receiveShadow = true;
    }
  });

  return <primitive object={scene} />;
}

useGLTF.preload('/models/garage.glb');
