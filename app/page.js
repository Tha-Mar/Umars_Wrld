'use client';

import EntryOverlay from '@/components/EntryOverlay';
import SceneCanvas from '@/components/SceneCanvas';
import ModalLayer from '@/components/ui/ModalLayer';

export default function Home() {
  return (
    <main style={{ position: 'relative', width: '100vw', height: '100vh' }}>
      {/* 3D scene layer */}
      <SceneCanvas />

      {/* Entry overlay — keeps the first impression clean while the scene loads */}
      <EntryOverlay />

      {/* UI overlay layer — sits on top of the canvas */}
      <ModalLayer />
    </main>
  );
}
