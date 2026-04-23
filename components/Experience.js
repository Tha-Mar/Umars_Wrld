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
      <ambientLight intensity={0.95} color="#eef1f8" />
      <hemisphereLight intensity={0.7} color="#dbe6f7" groundColor="#453f39" />
      <directionalLight
        position={[10, 12, 8]}
        intensity={1.1}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-near={0.5}
        shadow-camera-far={80}
        shadow-camera-left={-20}
        shadow-camera-right={20}
        shadow-camera-top={20}
        shadow-camera-bottom={-20}
      />
      <pointLight position={[2, 3.6, -2]} intensity={7} distance={16} color="#ffe6c7" />
      <pointLight position={[-4, 3.2, 2]} intensity={5} distance={14} color="#d6e3ff" />
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
