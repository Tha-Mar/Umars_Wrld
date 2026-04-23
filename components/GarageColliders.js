'use client';

import { useMemo } from 'react';
import { useGLTF } from '@react-three/drei';
import { RigidBody, TrimeshCollider, CuboidCollider } from '@react-three/rapier';

/*
 * GarageColliders: collision geometry for garage_scene3.glb
 *
 * Root scene orientation:
 *   Three.js v176 GLTFLoader applies NO global transform to the scene Group.
 *   Room structure nodes are direct scene-root nodes with no rotation —
 *   the floor is at Y=0, perfectly flat. The visual "tilt" was a physics
 *   height bug: Cube-derived meshes (walls_white = Cube.003, ceiling_beans
 *   = Cube, etc.) export with 6 faces including horizontal top/bottom caps.
 *   Those caps create Rapier surfaces at mid-room height (e.g. a beam bottom
 *   at Y≈3), so the player capsule landed on them instead of the floor and
 *   the camera ended up near the ceiling.
 *
 * Fix: only Plane-type GLB meshes in ROOM_NODES (single surface, no caps).
 *   Outer walls are CuboidColliders built from the known floor bounds:
 *   Floor accessor: X −7.494 to 11.173, Z −4.076 to 4.076
 *
 * To revert to garage.glb: change the useGLTF path and swap ROOM_NODES for
 *   EXCLUDED_NODES = new Set(['Object_3']).
 */

// Only Plane-type meshes — no horizontal mid-height end-caps
const ROOM_NODES = new Set([
  'floor',              // Plane     — flat surface at Y=0
  'main_ceiling',       // Plane.005 — ceiling at Y≈4.2
  'wall_behind_wood',   // Plane.001 — wall backing
  'ceiling_back',       // Plane.002 — back ceiling section
  'ceiling_back_frame', // Plane.003 — back ceiling frame
  'garage_door',        // Plane.006 — door panel
  'garage_door_detail', // Plane.007 — door detail
]);

// Outer room bounds from floor accessor (used for CuboidCollider walls)
//   X: −7.494 to 11.173  →  centre 1.84,  half 9.34
//   Z: −4.076 to  4.076  →  centre 0,     half 4.08
const CX = 1.84;   // room centre X
const HX = 9.34;   // room half-width
const HZ = 4.08;   // room half-depth
const WH = 5;      // wall half-height (taller than room to avoid gaps)
const WT = 0.25;   // wall half-thickness

export default function GarageColliders() {
  const { scene } = useGLTF('/models/garage_scene3.glb');

  const trimeshes = useMemo(() => {
    scene.updateMatrixWorld(true);

    const result = [];
    scene.traverse((child) => {
      if (!child.isMesh || !ROOM_NODES.has(child.name)) return;

      const geo = child.geometry.clone();
      geo.applyMatrix4(child.matrixWorld);

      const positions = new Float32Array(geo.attributes.position.array);
      const indices = geo.index
        ? new Uint32Array(geo.index.array)
        : buildSequentialIndices(geo.attributes.position.count);
      result.push({ key: child.uuid, positions, indices });
    });
    return result;
  }, [scene]);

  return (
    <>
      {/* Trimesh floor + ceiling + door surfaces */}
      <RigidBody type="fixed" colliders={false}>
        {trimeshes.map(({ key, positions, indices }) => (
          <TrimeshCollider key={key} args={[positions, indices]} />
        ))}
      </RigidBody>

      {/* Outer wall boxes — bounding the room using known floor extents */}
      <RigidBody type="fixed">
        {/* −X wall */}
        <CuboidCollider args={[WT, WH, HZ]} position={[-7.49, WH, 0]} />
        {/* +X wall */}
        <CuboidCollider args={[WT, WH, HZ]} position={[11.17, WH, 0]} />
        {/* −Z wall */}
        <CuboidCollider args={[HX, WH, WT]} position={[CX, WH, -4.08]} />
        {/* +Z wall */}
        <CuboidCollider args={[HX, WH, WT]} position={[CX, WH, 4.08]} />
      </RigidBody>
    </>
  );
}

function buildSequentialIndices(count) {
  const idx = new Uint32Array(count);
  for (let i = 0; i < count; i++) idx[i] = i;
  return idx;
}
