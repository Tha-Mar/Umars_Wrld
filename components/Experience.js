'use client';

import { Environment } from '@react-three/drei';
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

function CinematicLights() {
  return (
    <>
      <Environment preset="warehouse" intensity={0.24} />
      <ambientLight intensity={0.02} color="#efede9" />
      <group rotation={[0, Math.PI / 2, 0]}>
        <directionalLight
          position={[8, 10, 5]}
          intensity={0.62}
          color="#fff3e7"
          castShadow
          shadow-mapSize={[2048, 2048]}
          shadow-camera-near={0.5}
          shadow-camera-far={40}
          shadow-camera-left={-14}
          shadow-camera-right={14}
          shadow-camera-top={14}
          shadow-camera-bottom={-14}
          shadow-bias={-0.00015}
          shadow-normalBias={0.03}
        />
        <directionalLight
          position={[-6, 5, -8]}
          intensity={0.1}
          color="#dbe7f7"
        />
      </group>
    </>
  );
}

export default function Experience() {
  return (
    <>
      <CinematicLights />
      <World />
    </>
  );
}
