'use client';

import { Suspense } from 'react';
import { OrbitControls } from '@react-three/drei';
import GarageModel from './GarageModel';

/*
 * Experience owns:
 *   - camera rig / controls (swap OrbitControls for PlayerController later)
 *   - scene lighting
 *   - scene root that groups environment, hotspots, and player
 *
 * Add here later:
 *   <PlayerController />
 *   <Hotspots />
 *
 * When adding physics, introduce a World.js wrapper that owns <Physics> and
 * wraps <GarageModel> in a <RigidBody type="fixed">. Keep GarageModel.js
 * untouched — it only loads and renders geometry.
 */

function SceneLights() {
  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight
        position={[10, 15, 10]}
        intensity={1.2}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-near={0.5}
        shadow-camera-far={80}
        shadow-camera-left={-20}
        shadow-camera-right={20}
        shadow-camera-top={20}
        shadow-camera-bottom={-20}
      />
      <pointLight position={[-8, 6, -4]} intensity={0.6} color="#ffd580" />
    </>
  );
}

export default function Experience() {
  return (
    <>
      <SceneLights />

      {/* Temporary orbit controls — replace with PlayerController for walking */}
      {/* Target [0,-0.1,0] = room center, slightly below midpoint to avoid ceiling-staring.
          Polar limits let you look up at the ceiling (0.15) and down at the floor (0.85π).
          Distance 0.1–2.0 keeps you inside or just outside the entrance. */}
      <OrbitControls
        enablePan={false}
        target={[0, -0.1, 0]}
        minPolarAngle={0.15}
        maxPolarAngle={Math.PI * 0.85}
        minDistance={0.1}
        maxDistance={2.0}
      />

      {/* Environment */}
      <Suspense fallback={null}>
        <GarageModel />
      </Suspense>

      {/*
       * Future slots:
       * <Hotspots />
       * <Player />
       */}
    </>
  );
}
