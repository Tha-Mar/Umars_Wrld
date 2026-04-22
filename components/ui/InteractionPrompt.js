'use client';

/*
 * InteractionPrompt: contextual hint shown near a hotspot.
 *
 * Props (future):
 *   message  — string | null   e.g. "Press E to inspect"
 *   position — { x, y }        screen-space coords projected from 3D hotspot
 *
 * Driven by: proximity detection in PlayerController or Hotspot components.
 * All display logic lives here; detection logic stays in 3D-land.
 */

export default function InteractionPrompt({ message }) {
  if (!message) return null;

  return (
    <div
      style={{
        position: 'absolute',
        bottom: '15%',
        left: '50%',
        transform: 'translateX(-50%)',
        background: 'rgba(0,0,0,0.65)',
        color: '#fff',
        padding: '8px 20px',
        borderRadius: '6px',
        fontFamily: 'sans-serif',
        fontSize: '0.9rem',
        letterSpacing: '0.05em',
        pointerEvents: 'none',
      }}
    >
      {message}
    </div>
  );
}
