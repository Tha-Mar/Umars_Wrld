'use client';

import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import * as THREE from 'three';
import Experience from './Experience';

export default function SceneCanvas() {
  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      <Suspense fallback={null}>
        <Canvas
          shadows
          dpr={[1, 2]}
          gl={{ antialias: true, powerPreference: 'high-performance' }}
          onCreated={({ gl }) => {
            gl.outputColorSpace = THREE.SRGBColorSpace;
            gl.toneMapping = THREE.ACESFilmicToneMapping;
            gl.toneMappingExposure = 0.64;
            gl.shadowMap.type = THREE.PCFSoftShadowMap;
            if ('useLegacyLights' in gl) {
              gl.useLegacyLights = false;
            }
          }}
          // Match the larger garage_scene3 room so distant walls and ceiling do not clip.
          camera={{ position: [0, 1.6, 0], fov: 65, near: 0.1, far: 80 }}
          style={{ width: '100%', height: '100%' }}
        >
          <Experience />
        </Canvas>
      </Suspense>
    </div>
  );
}
