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

function ShowroomLights() {
  return (
    <>
      <ambientLight intensity={0.16} color="#fff8f2" />
      <hemisphereLight intensity={0.38} color="#fff9f4" groundColor="#817468" />

      <group rotation={[0, Math.PI / 2, 0]}>
        <directionalLight
          position={[6, 8, 4]}
          intensity={0.22}
          color="#fff5ea"
        />
        <directionalLight
          position={[-5, 6, -3]}
          intensity={0.1}
          color="#eef6ff"
        />

        <spotLight
          position={[-1.4, 4.6, 0]}
          intensity={18}
          angle={0.95}
          penumbra={1}
          distance={22}
          decay={1.7}
          color="#fff8ef"
        />
        <spotLight
          position={[4.4, 4.8, -2.7]}
          intensity={14}
          angle={0.82}
          penumbra={1}
          distance={18}
          decay={1.8}
          color="#f4f8ff"
        />
        <spotLight
          position={[4.4, 4.5, 2.7]}
          intensity={12}
          angle={0.82}
          penumbra={1}
          distance={18}
          decay={1.8}
          color="#fff1e2"
        />

        <pointLight
          position={[1.5, 2.4, 0]}
          intensity={0.3}
          distance={18}
          decay={2}
          color="#ffe7d2"
        />
        <pointLight
          position={[-4.8, 2.6, 0]}
          intensity={0.22}
          distance={16}
          decay={2}
          color="#fff3e7"
        />
      </group>
    </>
  );
}

export default function Experience() {
  return (
    <>
      <ShowroomLights />
      <World />
    </>
  );
}
