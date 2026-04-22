'use client';

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

export default function ModalLayer() {
  // activeModal and activePrompt will come from a shared store (e.g. Zustand)
  const activeModal = null;
  const activePrompt = null;

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none', // pass clicks through to canvas by default
        zIndex: 10,
      }}
    >
      <InteractionPrompt message={activePrompt} />

      {/* Future: {activeModal && <Modal id={activeModal} onClose={...} />} */}
    </div>
  );
}
