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
      <ambientLight intensity={0.35} color="#eef2f7" />
      <hemisphereLight intensity={0.25} color="#edf3ff" groundColor="#5f5a54" />
      <directionalLight
        position={[10, 12, 8]}
        intensity={0.55}
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-camera-near={0.5}
        shadow-camera-far={80}
        shadow-camera-left={-20}
        shadow-camera-right={20}
        shadow-camera-top={20}
        shadow-camera-bottom={-20}
      />
      <pointLight position={[0, 3.8, 0]} intensity={0.9} distance={18} color="#f3f6fb" />
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
