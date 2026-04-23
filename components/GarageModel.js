'use client';

import { useEffect } from 'react';
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

const HIDDEN_MESHES = new Set([
  'car_space',
  'focus_point',
  'focus_point001',
]);

export default function GarageModel() {
  const { scene } = useGLTF('/models/garage_scene2.glb');

  useEffect(() => {
    scene.traverse((child) => {
      if (!child.isMesh) return;

      if (
        HIDDEN_MESHES.has(child.name) ||
        child.name.startsWith('Sketchfab_model') ||
        child.name.startsWith('boss_boss_row_')
      ) {
        child.visible = false;
        return;
      }

      const material = Array.isArray(child.material) ? child.material : [child.material];

      child.castShadow = true;
      child.receiveShadow = true;

      material.forEach((mat) => {
        if (!mat) return;
        if (
          mat.name?.includes('Glass') ||
          mat.name?.includes('glass') ||
          mat.transparent
        ) {
          child.castShadow = false;
          mat.depthWrite = false;
          mat.needsUpdate = true;
        }
      });
    });
  }, [scene]);

  return <primitive object={scene} />;
}

useGLTF.preload('/models/garage_scene2.glb');
