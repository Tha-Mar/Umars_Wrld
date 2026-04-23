'use client';

import { useState, useEffect } from 'react';
import InteractionPrompt from './InteractionPrompt';

/*
 * ModalLayer: top-level UI overlay that sits above the Canvas.
 *
 * Add here later:
 *   - Modal state (useModalStore or React context)
 *   - <Modal /> components keyed to hotspot IDs
 *   - Inventory, pause menu, etc.
 *
 * Keep all modal/UI state here, never inside 3D mesh components.
 */

const styles = {
  root: {
    position: 'absolute',
    inset: 0,
    pointerEvents: 'none',
    zIndex: 10,
    fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
  },
  title: {
    position: 'absolute',
    top: 20,
    left: 24,
    color: 'rgba(255,255,255,0.75)',
    fontSize: '0.75rem',
    fontWeight: 500,
    letterSpacing: '0.12em',
    textTransform: 'uppercase',
    userSelect: 'none',
  },
};

export default function ModalLayer() {
  const [activePrompt, setActivePrompt] = useState(null);

  useEffect(() => {
    const handler = (e) => setActivePrompt(e.detail);
    window.addEventListener('world:prompt', handler);
    return () => window.removeEventListener('world:prompt', handler);
  }, []);

  return (
    <div style={styles.root}>
      <span style={styles.title}>Garage Prototype</span>

      <InteractionPrompt message={activePrompt} />

      {/* Future: {activeModal && <Modal id={activeModal} onClose={...} />} */}
    </div>
  );
}
