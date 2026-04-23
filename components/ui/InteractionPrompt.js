'use client';

/*
 * InteractionPrompt: contextual hint shown at the bottom of the screen.
 *
 * Props (future):
 *   message  — string | null   e.g. "Press E to inspect"
 *
 * Driven by: proximity detection in PlayerController or Hotspot components.
 * All display logic lives here; detection logic stays in 3D-land.
 *
 * The container is always present so future messages animate in without
 * layout shifts. Content is hidden when message is null.
 */

export default function InteractionPrompt({ message }) {
  return (
    <div
      style={{
        position: 'absolute',
        bottom: '10%',
        left: '50%',
        transform: 'translateX(-50%)',
        pointerEvents: 'none',
        userSelect: 'none',
        minWidth: 160,
        textAlign: 'center',
      }}
    >
      {message && (
        <span
          style={{
            display: 'inline-block',
            background: 'rgba(0,0,0,0.55)',
            color: 'rgba(255,255,255,0.85)',
            padding: '6px 18px',
            borderRadius: '4px',
            fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
            fontSize: '0.78rem',
            fontWeight: 400,
            letterSpacing: '0.08em',
          }}
        >
          {message}
        </span>
      )}
    </div>
  );
}
