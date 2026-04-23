'use client';

import { useEffect } from 'react';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

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

        // Lift the fully black room finishes so they read more like dark painted walls.
        if (mat.name?.includes('Slate black Wall Paint')) {
          mat.color = new THREE.Color('#2a2a2f');
          if ('roughness' in mat) mat.roughness = 0.88;
        }

        // Let the built-in model lights actually glow a bit in the scene.
        if (mat.name?.includes('Glowing glass green')) {
          if ('emissive' in mat) mat.emissive = new THREE.Color('#d7fff2');
          if ('emissiveIntensity' in mat) mat.emissiveIntensity = 3.5;
          if ('toneMapped' in mat) mat.toneMapped = false;
        }

        if (
          mat.name?.includes('Glass') ||
          mat.name?.includes('glass') ||
          mat.transparent
        ) {
          child.castShadow = false;
          mat.depthWrite = false;
          if ('envMapIntensity' in mat) mat.envMapIntensity = 1.25;
          if ('opacity' in mat && mat.opacity < 0.6) mat.opacity = Math.max(mat.opacity, 0.32);
          mat.needsUpdate = true;
        } else if ('envMapIntensity' in mat) {
          mat.envMapIntensity = 0.85;
        }
      });
    });
  }, [scene]);

  return <primitive object={scene} />;
}

useGLTF.preload('/models/garage_scene2.glb');
