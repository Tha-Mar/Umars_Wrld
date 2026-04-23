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
      <ambientLight intensity={0.8} color="#f2ede4" />
      <hemisphereLight intensity={0.55} color="#f6f1e8" groundColor="#3a342f" />
      <directionalLight
        position={[8, 12, 6]}
        intensity={1.6}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-near={0.5}
        shadow-camera-far={80}
        shadow-camera-left={-20}
        shadow-camera-right={20}
        shadow-camera-top={20}
        shadow-camera-bottom={-20}
      />
      <pointLight position={[2, 3.6, -2]} intensity={8} distance={16} color="#fff1d6" />
      <pointLight position={[-4, 3.2, 2]} intensity={5} distance={14} color="#ffd7a3" />
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
