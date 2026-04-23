'use client';

import World from './World';

/*
 * Experience owns:
 *   - scene lighting
 *   - scene root that mounts World
 *
 * Camera is now driven by Player inside World.
 * Experience stays physics-unaware.
 *
 * Add here later:
 *   <PlayerController />  if camera rig logic needs to move up out of Player
 */

function SceneLights() {
  return (
    <>
      <ambientLight intensity={0.85} color="#f1f3f6" />
      <directionalLight
        position={[10, 12, 8]}
        intensity={1.45}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-near={0.5}
        shadow-camera-far={80}
        shadow-camera-left={-20}
        shadow-camera-right={20}
        shadow-camera-top={20}
        shadow-camera-bottom={-20}
      />
    </>
  );
}

export default function Experience() {
  return (
    <>
      <SceneLights />
      <World />
    </>
  );
}
