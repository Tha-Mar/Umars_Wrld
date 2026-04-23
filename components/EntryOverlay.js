'use client';

import { useEffect, useMemo, useState } from 'react';
import { useProgress } from '@react-three/drei';

const HERO_IMAGE = encodeURI('/images/ChatGPT Image Apr 23, 2026, 12_22_27 PM.png');

export default function EntryOverlay() {
  const { progress, active } = useProgress();
  const [entered, setEntered] = useState(false);
  const [hidden, setHidden] = useState(false);

  const roundedProgress = useMemo(() => Math.min(100, Math.max(0, Math.round(progress))), [progress]);
  const readyToReveal = entered && !active && roundedProgress >= 100;

  useEffect(() => {
    if (!readyToReveal) return;
    const timeoutId = window.setTimeout(() => setHidden(true), 450);
    return () => window.clearTimeout(timeoutId);
  }, [readyToReveal]);

  const title = !entered ? 'Click to enter' : active ? 'Loading world...' : 'Entering...';
  const caption = !entered
    ? 'Start the experience once the scene is ready.'
    : active
      ? 'Preparing the garage scene in the background.'
      : 'The scene is ready.';

  return (
    <div
      aria-hidden={hidden}
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 20,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: hidden ? 0 : 1,
        pointerEvents: hidden ? 'none' : 'auto',
        transition: 'opacity 420ms ease',
        backgroundImage: `linear-gradient(135deg, rgba(6, 10, 18, 0.18), rgba(6, 10, 18, 0.72)), url("${HERO_IMAGE}")`,
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
      }}
    >
      <button
        type="button"
        onClick={() => setEntered(true)}
        disabled={entered}
        style={{
          border: '1px solid rgba(255,255,255,0.35)',
          background: 'rgba(12, 18, 28, 0.42)',
          color: '#f7f4ed',
          padding: '1rem 1.35rem',
          borderRadius: '999px',
          backdropFilter: 'blur(12px)',
          cursor: entered ? 'default' : 'pointer',
          fontSize: '1rem',
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          minWidth: '220px',
          boxShadow: '0 18px 60px rgba(0, 0, 0, 0.3)',
        }}
      >
        <div style={{ fontWeight: 700 }}>{title}</div>
        <div
          style={{
            marginTop: '0.35rem',
            fontSize: '0.72rem',
            letterSpacing: '0.04em',
            textTransform: 'none',
            color: 'rgba(247, 244, 237, 0.82)',
          }}
        >
          {caption}
        </div>
      </button>

      <div
        style={{
          position: 'absolute',
          left: '1.5rem',
          bottom: '1.5rem',
          width: 'min(280px, calc(100vw - 3rem))',
          padding: '0.9rem 1rem',
          borderRadius: '18px',
          background: 'rgba(9, 14, 23, 0.52)',
          border: '1px solid rgba(255,255,255,0.18)',
          backdropFilter: 'blur(12px)',
          color: '#eef1f8',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '0.78rem',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            marginBottom: '0.55rem',
          }}
        >
          <span>Loading</span>
          <span>{roundedProgress}%</span>
        </div>
        <div
          style={{
            height: '8px',
            borderRadius: '999px',
            background: 'rgba(255,255,255,0.14)',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              width: `${roundedProgress}%`,
              height: '100%',
              borderRadius: '999px',
              background: 'linear-gradient(90deg, #f0c78d 0%, #f7f4ed 50%, #bad0ff 100%)',
              transition: 'width 220ms ease',
            }}
          />
        </div>
      </div>
    </div>
  );
}
