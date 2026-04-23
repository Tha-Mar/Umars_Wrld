'use client';

import { Suspense } from 'react';
import { Physics } from '@react-three/rapier';
import GarageModel from './GarageModel';
import GarageColliders from './GarageColliders';
import Player from './Player';

/*
 * World owns:
 *   - The <Physics> provider (Rapier WASM)
 *   - GarageModel      — visual only, never receives physics props
 *   - GarageColliders  — invisible blocking volumes, no visual geometry
 *   - Player           — capsule rigid body + first-person camera controller
 *
 * <Physics> is wrapped in its own <Suspense> inside the Canvas so that the
 * Rapier WASM is guaranteed to be loaded before any RigidBody mounts.
 * The outer Suspense in SceneCanvas wraps the Canvas element itself (a different
 * React tree) and cannot catch the WASM promise thrown by <Physics>.
 *
 * Add inside <Physics> later:
 *   <Hotspots />   sensor colliders for proximity detection
 *
 * Experience.js owns lighting and stays physics-unaware.
 */

export default function World() {
  return (
    <Suspense fallback={null}>
      <Physics gravity={[0, -9.81, 0]}>
        {/* Visual environment — render-only, no colliders */}
        <Suspense fallback={null}>
          <GarageModel />
        </Suspense>

        {/* Collision world — invisible blocking volumes */}
        <GarageColliders />

        {/* Player — capsule body + first-person controls */}
        <Player />

        {/* Future: <Hotspots /> */}
      </Physics>
    </Suspense>
  );
}
