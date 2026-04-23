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

export default function Experience() {
  return (
    <>
      <ambientLight intensity={0.18} color="#fff7f0" />
      <hemisphereLight intensity={0.34} color="#fff8f2" groundColor="#766b60" />
      <directionalLight
        position={[7, 9, 5]}
        intensity={0.14}
        color="#fff3e6"
      />
      <pointLight
        position={[-2.5, 2.8, 0]}
        intensity={0.42}
        distance={18}
        decay={2}
        color="#ffd8b8"
      />
      <pointLight
        position={[6, 3.2, -1.5]}
        intensity={0.28}
        distance={16}
        decay={2}
        color="#ffe6cc"
      />
      <pointLight
        position={[-5, 2.6, 1.8]}
        intensity={0.22}
        distance={15}
        decay={2}
        color="#fff0dc"
      />
      <World />
    </>
  );
}
