'use client';

import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import Experience from './Experience';

function Loader() {
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#0a0a0a',
        color: '#fff',
        fontFamily: 'sans-serif',
        fontSize: '1rem',
        letterSpacing: '0.1em',
      }}
    >
      Loading...
    </div>
  );
}

export default function SceneCanvas() {
  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      <Suspense fallback={<Loader />}>
        <Canvas
          shadows
          // Garage bounds: 1.91×2.5×0.78 units, centered at origin.
          // Z 0.40 = just inside the entrance (front face at Z 0.33).
          // Y 0.10 = eye level (~60% up a 2.5-unit room).
          // FOV 70 adds perceived depth; near 0.05 prevents clipping near walls.
          camera={{ position: [0, -0.1, 0.40], fov: 70, near: 0.05, far: 8 }}
          style={{ width: '100%', height: '100%' }}
        >
          <Experience />
        </Canvas>
      </Suspense>
    </div>
  );
}
