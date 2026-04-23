'use client';

import { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

/*
 * Hotspot: invisible proximity sensor that shows a prompt and plays audio.
 *
 * Props:
 *   position  [x, y, z]   — world-space centre of the trigger zone
 *   radius    number       — trigger distance in world units (default 3)
 *   prompt    string       — text shown in InteractionPrompt
 *   audioSrc  string       — path to audio file (e.g. '/audio/Ranting.mp3')
 *
 * To change trigger object: adjust `position` to match the object's world coords.
 * To change radius: increase for easier trigger, decrease for tight zone.
 * To change audio: swap `audioSrc` prop.
 *
 * Communication: dispatches 'world:prompt' CustomEvent on window so ModalLayer
 * can update without shared state management.
 */

const _cam = new THREE.Vector3();

export default function Hotspot({
  position = [0, 0, 0],
  radius = 3,
  prompt = 'Press E to interact',
  audioSrc,
}) {
  const { camera } = useThree();
  const hotspotPos = useRef(new THREE.Vector3(...position));
  const inRangeRef = useRef(false);
  const triggeredRef = useRef(false);
  const audioRef = useRef(null);

  useEffect(() => {
    if (audioSrc) audioRef.current = new Audio(audioSrc);
  }, [audioSrc]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.code !== 'KeyE' || !inRangeRef.current || triggeredRef.current) return;
      triggeredRef.current = true;
      audioRef.current?.play().catch(() => {});
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  useFrame(() => {
    _cam.copy(camera.position);
    const inRange = _cam.distanceTo(hotspotPos.current) < radius;
    if (inRange === inRangeRef.current) return;
    inRangeRef.current = inRange;
    if (!inRange) triggeredRef.current = false;
    window.dispatchEvent(
      new CustomEvent('world:prompt', { detail: inRange ? prompt : null }),
    );
  });

  return null;
}
