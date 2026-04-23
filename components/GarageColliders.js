'use client';

import { useMemo } from 'react';
import { useGLTF } from '@react-three/drei';
import { RigidBody, TrimeshCollider } from '@react-three/rapier';

/*
 * GarageColliders: trimesh collision derived from the actual GLB geometry.
 *
 * Architecture rule:
 *   This component owns all collision geometry.
 *   GarageModel.js is render-only and must never receive RigidBody or collider props.
 *
 * Why trimesh instead of hand-placed boxes:
 *   Inspection showed the room is not a simple rectangular box:
 *     - Left wall at X ≈ −0.87, right wall at X ≈ +0.80 (not ±0.96)
 *     - Floor geometry only extends to X ≈ +0.38 on the right side
 *     - "Ground" mesh is a vertical panel at Z ≈ −0.23, not a flat floor
 *   Box colliders produced invisible walls, walkthrough walls, and floor gaps.
 *
 * Why explicit TrimeshCollider instead of colliders="trimesh":
 *   rapier's auto-collider generation uses traverseVisible(), which skips
 *   meshes with visible={false}. Explicit TrimeshCollider with extracted
 *   vertex/index data bypasses that traversal entirely.
 *
 * Mesh inclusion:
 *   Object_2 (Ground,   63 verts) — vertical panel + surface details
 *   Object_4 (Pillars, 3964 verts) — mid-height structural objects
 *   Object_5 (WallsA, 24307 verts) — primary floor + walls
 *   Object_6 (WallsB,  6256 verts) — secondary walls + surfaces
 *
 *   Object_3 (Lights_D, 512 verts) excluded — decorative fixtures.
 *   Remove from EXCLUDED_NODES below if collision with those is needed.
 *
 * Performance:
 *   Rapier builds a BVH tree once on startup for static fixed bodies.
 *   ~26K tris at O(log n) per query is well within budget.
 */

const EXCLUDED_NODES = new Set(['Object_3']); // Lights_D — decorative, no collision

export default function GarageColliders() {
  const { scene } = useGLTF('/models/garage.glb');

  const trimeshes = useMemo(() => {
    // The GLB root node (Sketchfab_model) carries a raw matrix — a −90° X rotation
    // that converts Blender's Z-up space to GLTF Y-up. Three.js applies it when
    // rendering via <primitive object={scene} />, but geo.attributes.position.array
    // holds raw local-space (Z-up) values. Without applying matrixWorld first, the
    // collision geometry would be 90° off from the visual mesh.
    scene.updateMatrixWorld(true);

    const result = [];
    scene.traverse((child) => {
      if (!child.isMesh || EXCLUDED_NODES.has(child.name)) return;

      // Clone geometry so the original shared buffer is not mutated.
      const geo = child.geometry.clone();
      // Bake the full world transform into vertex positions.
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
    <RigidBody type="fixed" colliders={false}>
      {trimeshes.map(({ key, positions, indices }) => (
        <TrimeshCollider key={key} args={[positions, indices]} />
      ))}
    </RigidBody>
  );
}

function buildSequentialIndices(count) {
  const idx = new Uint32Array(count);
  for (let i = 0; i < count; i++) idx[i] = i;
  return idx;
}
