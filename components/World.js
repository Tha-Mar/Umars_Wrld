'use client';

import { Suspense } from 'react';
import { Physics } from '@react-three/rapier';
import GarageModel from './GarageModel';
import GarageColliders from './GarageColliders';
import Player from './Player';
import Hotspot from './Hotspot';

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
        {/* Rotate the garage scene and its collision world together. */}
        <group rotation={[0, Math.PI / 2, 0]}>
          {/* Visual environment — render-only, no colliders */}
          <Suspense fallback={null}>
            <GarageModel />
          </Suspense>

          {/* Collision world — invisible blocking volumes */}
          <Suspense fallback={null}>
            <GarageColliders />
          </Suspense>
        </group>

        {/* Player — capsule body + first-person controls */}
        <Player />

        {/* Hotspot: car interaction — adjust position/radius to match visual */}
        <Hotspot
          position={[-2.53, 1.03, -9.9]}
          radius={2.6}
          prompt="Press E to interact"
          audioSrc="/audio/Ranting.mp3"
        />

        <Hotspot
          position={[-0.08, 0.4, 0]}
          radius={1.8}
          prompt="Press E to spin"
          audioSrc="/audio/Oiiaioooooiai cat meme psytrance remix.mp3"
          onInteract={() => {
            window.dispatchEvent(
              new CustomEvent('world:spin-model', {
                detail: { targetName: '191d233c94184f188ac4fad4b07dc182fbx' },
              }),
            );
          }}
        />
      </Physics>
    </Suspense>
  );
}
