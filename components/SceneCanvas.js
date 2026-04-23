'use client';

import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import Experience from './Experience';

export default function SceneCanvas() {
  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      <Suspense fallback={null}>
        <Canvas
          shadows
          dpr={[1, 2]}
          gl={{ antialias: true }}
          // Match the larger garage_scene2 room so distant walls and ceiling do not clip.
          camera={{ position: [0, 1.6, 0], fov: 65, near: 0.1, far: 80 }}
          style={{ width: '100%', height: '100%' }}
        >
          <Experience />
        </Canvas>
      </Suspense>
    </div>
  );
}
