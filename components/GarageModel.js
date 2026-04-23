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

const STRUCTURAL_NAME_RE = /wall|ceiling|floor|garage_door|door_frame/i;
const INTENTIONALLY_DARK_RE = /Slate black Wall Paint|Wood Black UA|Aluminium sand black/i;
const NEUTRAL_FALLBACK = new THREE.Color('#7b7f87');

function clampMaterialSurface(material) {
  if ('metalness' in material && typeof material.metalness === 'number') {
    material.metalness = Math.min(material.metalness, 0.5);
  }
  if ('roughness' in material && typeof material.roughness === 'number') {
    material.roughness = THREE.MathUtils.clamp(material.roughness, 0.3, 0.8);
  }
}

function hasUsableTexture(texture) {
  if (!texture) return false;
  return Boolean(texture.image || texture.source?.data);
}

export default function GarageModel() {
  const { scene } = useGLTF('/models/garage_scene2.glb');

  useEffect(() => {
    const correctedMeshes = new Set();
    const warnedMeshes = new Set();

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

      const nextMaterials = material.map((mat) => {
        if (!mat) {
          correctedMeshes.add(child.name);
          return new THREE.MeshStandardMaterial({
            color: NEUTRAL_FALLBACK,
            metalness: 0.1,
            roughness: 0.6,
            side: THREE.DoubleSide,
          });
        }

        let nextMat = mat;
        const isStandardLike = mat.isMeshStandardMaterial || mat.isMeshPhysicalMaterial;
        if (!isStandardLike) {
          nextMat = new THREE.MeshStandardMaterial({
            color: mat.color?.clone?.() ?? NEUTRAL_FALLBACK.clone(),
            map: hasUsableTexture(mat.map) ? mat.map : null,
            normalMap: hasUsableTexture(mat.normalMap) ? mat.normalMap : null,
            transparent: mat.transparent,
            opacity: mat.opacity ?? 1,
            side: THREE.DoubleSide,
          });
          correctedMeshes.add(child.name);
        }

        const textureMissing = nextMat.map && !hasUsableTexture(nextMat.map);
        if (textureMissing) {
          if (!warnedMeshes.has(child.name)) {
            console.warn('[GarageModel] Missing texture, using neutral fallback material for:', child.name);
            warnedMeshes.add(child.name);
          }
          nextMat = new THREE.MeshStandardMaterial({
            color: NEUTRAL_FALLBACK,
            metalness: 0.1,
            roughness: 0.6,
            side: THREE.DoubleSide,
          });
          correctedMeshes.add(child.name);
        }

        const isStructuralMesh = STRUCTURAL_NAME_RE.test(child.name);
        const colorIsPureBlack = nextMat.color?.getHex?.() === 0x000000;
        const hasNoVisibleTexture = !hasUsableTexture(nextMat.map);

        if (isStructuralMesh && colorIsPureBlack && hasNoVisibleTexture) {
          nextMat.color = INTENTIONALLY_DARK_RE.test(nextMat.name)
            ? new THREE.Color('#40444d')
            : NEUTRAL_FALLBACK.clone();
          correctedMeshes.add(child.name);
        }

        clampMaterialSurface(nextMat);

        if (isStructuralMesh) {
          nextMat.side = THREE.DoubleSide;
        }

        // Let the built-in model lights actually glow a bit in the scene.
        if (nextMat.name?.includes('Glowing glass green')) {
          if ('emissive' in nextMat) nextMat.emissive = new THREE.Color('#d7fff2');
          if ('emissiveIntensity' in nextMat) nextMat.emissiveIntensity = 3;
          if ('toneMapped' in nextMat) nextMat.toneMapped = false;
          correctedMeshes.add(child.name);
        }

        if (
          nextMat.name?.includes('Glass') ||
          nextMat.name?.includes('glass') ||
          nextMat.transparent
        ) {
          child.castShadow = false;
          nextMat.depthWrite = false;
          if ('opacity' in nextMat && nextMat.opacity < 0.6) {
            nextMat.opacity = Math.max(nextMat.opacity, 0.32);
          }
        }

        nextMat.needsUpdate = true;
        return nextMat;
      });

      child.material = Array.isArray(child.material) ? nextMaterials : nextMaterials[0];
    });

    if (correctedMeshes.size > 0) {
      console.info(
        '[GarageModel] Corrected materials for meshes:',
        Array.from(correctedMeshes).sort(),
      );
    }
  }, [scene]);

  return <primitive object={scene} />;
}

useGLTF.preload('/models/garage_scene2.glb');
