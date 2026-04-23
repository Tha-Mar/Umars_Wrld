'use client';

import { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { RigidBody, CapsuleCollider } from '@react-three/rapier';
import * as THREE from 'three';

// --- Tweak these to adjust feel ---
const SPEED       = 0.8;   // units/sec — raise for faster walk, lower for slower
const SENSITIVITY = 0.002; // mouse look — lower = slower turn, higher = snappier
const EYE_OFFSET  = 0.02;  // camera height above capsule centre
//
// World-space room (root −90° X matrix applied):
//   Floor Y ≈ −0.24.  Mid-room structure at Y ≈ +0.04 creates a 0.28-unit gap.
//
// Capsule: halfHeight=0.06, radius=0.06 → total 0.24 units (fits gap with 0.04 clearance)
//   Spawn at Y=−0.10: top=+0.02 (below structure at +0.04), bottom=−0.22 (above floor −0.24)
//   Gravity drops capsule cleanly to floor. Settled centre: −0.24 + 0.12 = −0.12
//   Eye Y: −0.12 + 0.02 = −0.10  (matches pre-physics camera feel)

const SPAWN         = [0, -0.10, 0.40]; // clear zone between floor and mid-room structure
const FALL_RESET_Y  = -3;               // safety: teleport back if player escapes world

const UP = new THREE.Vector3(0, 1, 0);

export default function Player() {
  const rb      = useRef();
  const moveDir = useRef(new THREE.Vector3());
  const keys    = useRef({ w: false, a: false, s: false, d: false });
  const yaw     = useRef(0);
  const pitch   = useRef(0);
  const locked  = useRef(false);

  const { camera, gl } = useThree();

  // Rotation order must be YXZ for correct first-person look.
  useEffect(() => {
    camera.rotation.order = 'YXZ';
  }, [camera]);

  // Pointer lock — click canvas to capture mouse, Escape to release.
  useEffect(() => {
    const canvas = gl.domElement;

    const onLockChange = () => {
      locked.current = document.pointerLockElement === canvas;
    };
    const onClick = () => {
      if (!locked.current) canvas.requestPointerLock();
    };
    const onMouseMove = (e) => {
      if (!locked.current) return;
      yaw.current   -= e.movementX * SENSITIVITY;
      pitch.current -= e.movementY * SENSITIVITY;
      pitch.current  = Math.max(-Math.PI / 2.2, Math.min(Math.PI / 2.2, pitch.current));
    };

    canvas.addEventListener('click', onClick);
    document.addEventListener('pointerlockchange', onLockChange);
    document.addEventListener('mousemove', onMouseMove);

    return () => {
      canvas.removeEventListener('click', onClick);
      document.removeEventListener('pointerlockchange', onLockChange);
      document.removeEventListener('mousemove', onMouseMove);
    };
  }, [gl]);

  // WASD key state.
  useEffect(() => {
    const down = (e) => {
      if (e.code === 'KeyW') keys.current.w = true;
      if (e.code === 'KeyA') keys.current.a = true;
      if (e.code === 'KeyS') keys.current.s = true;
      if (e.code === 'KeyD') keys.current.d = true;
    };
    const up = (e) => {
      if (e.code === 'KeyW') keys.current.w = false;
      if (e.code === 'KeyA') keys.current.a = false;
      if (e.code === 'KeyS') keys.current.s = false;
      if (e.code === 'KeyD') keys.current.d = false;
    };
    window.addEventListener('keydown', down);
    window.addEventListener('keyup', up);
    return () => {
      window.removeEventListener('keydown', down);
      window.removeEventListener('keyup', up);
    };
  }, []);

  useFrame(() => {
    if (!rb.current) return;

    const pos = rb.current.translation();

    // Skip frame if physics body isn't valid yet.
    if (!Number.isFinite(pos.x) || !Number.isFinite(pos.y) || !Number.isFinite(pos.z)) return;

    // Safety reset if player escapes world geometry.
    if (pos.y < FALL_RESET_Y) {
      rb.current.setTranslation({ x: SPAWN[0], y: SPAWN[1], z: SPAWN[2] }, true);
      rb.current.setLinvel({ x: 0, y: 0, z: 0 }, true);
      return;
    }

    const { w, a, s, d } = keys.current;
    const vel = rb.current.linvel();

    moveDir.current.set(
      (d ? 1 : 0) - (a ? 1 : 0),
      0,
      (s ? 1 : 0) - (w ? 1 : 0),
    );
    if (moveDir.current.lengthSq() > 0) moveDir.current.normalize();
    moveDir.current.applyAxisAngle(UP, yaw.current);

    rb.current.setLinvel(
      { x: moveDir.current.x * SPEED, y: vel.y, z: moveDir.current.z * SPEED },
      true,
    );

    camera.position.set(pos.x, pos.y + EYE_OFFSET, pos.z);
    camera.rotation.y = yaw.current;
    camera.rotation.x = pitch.current;
  });

  return (
    <RigidBody
      ref={rb}
      position={SPAWN}
      lockRotations
      colliders={false}
    >
      <CapsuleCollider args={[0.06, 0.06]} />
    </RigidBody>
  );
}
