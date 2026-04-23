'use client';

import { useEffect, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
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
const DARK_WALL_COLOR = new THREE.Color('#636872');
const DARK_WOOD_COLOR = new THREE.Color('#54514b');
const DARK_METAL_COLOR = new THREE.Color('#727782');
const WOOD_PANEL_COLOR = new THREE.Color('#8a6a4c');
const SPIN_TARGET_NAME = '191d233c94184f188ac4fad4b07dc182fbx';
const SEQUENCE_DURATION_MS = 60000;
const DESCENT_DURATION_MS = 2000;
const RAPID_SPIN_SPEED = 16;
const LIFT_DURATION_MS = 1200;
const TARGET_CENTER_Y = 1.55;

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
  const { scene } = useGLTF('/models/garage_scene3.glb');
  const spinTargetRef = useRef(null);
  const interactionStartRef = useRef(0);
  const baseRotationRef = useRef(0);
  const baseYRef = useRef(0);
  const liftOffsetRef = useRef(0);

  useEffect(() => {
    const target = scene.getObjectByName(SPIN_TARGET_NAME);
    spinTargetRef.current = target ?? null;
    baseRotationRef.current = target?.rotation.y ?? 0;
    baseYRef.current = target?.position.y ?? 0;

    if (target) {
      const box = new THREE.Box3().setFromObject(target);
      const center = box.getCenter(new THREE.Vector3());
      liftOffsetRef.current = Math.max(0, TARGET_CENTER_Y - center.y);
    }
  }, [scene]);

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
        let correctedSurface = false;

        if (!mat) {
          correctedMeshes.add(child.name);
          correctedSurface = true;
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
          correctedSurface = true;
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
          correctedSurface = true;
        }

        const isStructuralMesh = STRUCTURAL_NAME_RE.test(child.name);
        const colorIsPureBlack = nextMat.color?.getHex?.() === 0x000000;
        const hasNoVisibleTexture = !hasUsableTexture(nextMat.map);

        if (isStructuralMesh && colorIsPureBlack && hasNoVisibleTexture) {
          nextMat.color = INTENTIONALLY_DARK_RE.test(nextMat.name)
            ? new THREE.Color('#40444d')
            : NEUTRAL_FALLBACK.clone();
          correctedMeshes.add(child.name);
          correctedSurface = true;
        }

        if (isStructuralMesh && nextMat.name?.includes('Slate black Wall Paint')) {
          nextMat.color = DARK_WALL_COLOR.clone();
          if ('metalness' in nextMat) nextMat.metalness = 0.05;
          if ('roughness' in nextMat) nextMat.roughness = 0.72;
          correctedMeshes.add(child.name);
          correctedSurface = true;
        }

        if (isStructuralMesh && nextMat.name?.includes('Wood Black UA')) {
          nextMat.color = DARK_WOOD_COLOR.clone();
          if ('metalness' in nextMat) nextMat.metalness = 0.08;
          if ('roughness' in nextMat) nextMat.roughness = 0.78;
          correctedMeshes.add(child.name);
          correctedSurface = true;
        }

        if (isStructuralMesh && nextMat.name?.includes('Aluminium sand black')) {
          nextMat.color = DARK_METAL_COLOR.clone();
          if ('metalness' in nextMat) nextMat.metalness = 0.35;
          if ('roughness' in nextMat) nextMat.roughness = 0.58;
          correctedMeshes.add(child.name);
          correctedSurface = true;
        }

        if (isStructuralMesh && nextMat.name?.includes('Plaster white')) {
          if ('metalness' in nextMat) nextMat.metalness = 0.02;
          if ('roughness' in nextMat) nextMat.roughness = 0.68;
          correctedSurface = true;
        }

        if (isStructuralMesh && nextMat.name?.includes('Bamboo Wood')) {
          nextMat.color = WOOD_PANEL_COLOR.clone();
          if ('metalness' in nextMat) nextMat.metalness = 0.05;
          if ('roughness' in nextMat) nextMat.roughness = 0.7;
          correctedMeshes.add(child.name);
          correctedSurface = true;
        }

        if (isStructuralMesh || correctedSurface) {
          clampMaterialSurface(nextMat);
        }

        if ('envMapIntensity' in nextMat) {
          nextMat.envMapIntensity = isStructuralMesh ? 0.18 : 0.9;
        }

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

  useEffect(() => {
    const onSpin = (e) => {
      if (e.detail?.targetName !== SPIN_TARGET_NAME) return;
      if (spinTargetRef.current) {
        baseRotationRef.current = spinTargetRef.current.rotation.y;
        baseYRef.current = spinTargetRef.current.position.y;
      }
      interactionStartRef.current = performance.now();
    };

    window.addEventListener('world:spin-model', onSpin);
    return () => window.removeEventListener('world:spin-model', onSpin);
  }, []);

  useFrame((_, delta) => {
    const target = spinTargetRef.current;
    if (!target) return;

    const start = interactionStartRef.current;
    if (start === 0) return;

    const now = performance.now();
    const elapsed = now - start;

    const isSpinning =
      elapsed < 2000 ||
      (elapsed >= 4000 && elapsed < 6000) ||
      (elapsed >= 7000 && elapsed < SEQUENCE_DURATION_MS);

    if (isSpinning) {
      target.rotation.y += RAPID_SPIN_SPEED * delta;
    }

    let liftProgress = 0;
    if (elapsed < LIFT_DURATION_MS) {
      liftProgress = elapsed / LIFT_DURATION_MS;
    } else if (elapsed < SEQUENCE_DURATION_MS) {
      liftProgress = 1;
    } else if (elapsed < SEQUENCE_DURATION_MS + DESCENT_DURATION_MS) {
      liftProgress = 1 - (elapsed - SEQUENCE_DURATION_MS) / DESCENT_DURATION_MS;
    }

    target.position.y = baseYRef.current + liftOffsetRef.current * THREE.MathUtils.clamp(liftProgress, 0, 1);

    if (elapsed >= SEQUENCE_DURATION_MS + DESCENT_DURATION_MS) {
      target.position.y = baseYRef.current;
      interactionStartRef.current = 0;
    }
  });

  return <primitive object={scene} />;
}

useGLTF.preload('/models/garage_scene3.glb');
