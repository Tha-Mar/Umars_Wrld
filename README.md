# Umar's Wrld

Desktop-first 3D interactive website built with Next.js, React Three Fiber, and Drei.

## Setup

```bash
npm install
```

## Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The site is desktop-first and expects a fullscreen browser window.

## Add your model

Place your garage GLB at:

```
public/models/garage.glb
```

The scene will load it automatically. If the file is missing, the canvas will render but show an empty scene.

---

## Project structure

```
app/
  layout.js          — root HTML shell, imports globals.css
  page.js            — composes SceneCanvas + ModalLayer (nothing else)
  globals.css        — full-screen reset

components/
  SceneCanvas.js     — mounts the R3F <Canvas>, owns Suspense/loading fallback
  Experience.js      — scene root: lights, camera/controls, environment, future player
  GarageModel.js     — GLB loader; pure mesh renderer, no logic

  ui/
    ModalLayer.js        — absolute overlay above canvas; root of all 2D UI
    InteractionPrompt.js — contextual hint ("Press E to inspect")
```

### How each file supports future expansion

**`SceneCanvas.js`**
Owns the `<Canvas>` and the loading fallback. Swap the fallback for a styled loading screen without touching anything else.

**`Experience.js`**
Scene root. This is where you add:
- `<PlayerController />` (WASD / pointer-lock walking)
- `<Hotspots />` group for interaction points
- Raycasting / proximity detection

The current `<OrbitControls>` is a placeholder — remove it when `PlayerController` is ready.

When adding physics, introduce a `World.js` component here that owns the `<Physics>` provider and wraps the environment in a `<RigidBody type="fixed">`. `GarageModel.js` stays untouched.

**`GarageModel.js`**
Loads the GLB and renders meshes. Intentionally dumb: no props, no state, no physics. Collision concerns belong in `World.js`, not here — this file should never need to change when the physics setup changes.

**`ModalLayer.js`**
Sits at `z-index: 10` above the canvas with `pointer-events: none` so clicks pass through by default. When a modal is open, set `pointer-events: auto` on the modal element only. Wire a Zustand store here to track `activeModal` and `activePrompt`.

**`InteractionPrompt.js`**
Renders the "Press E" style hint. Driven by whatever proximity/raycast logic lives in `Experience`. The 3D side detects proximity; this component only displays the result.

### Packages installed

| Package | Purpose |
|---|---|
| `three` | Core WebGL / 3D engine |
| `@react-three/fiber` | React renderer for Three.js |
| `@react-three/drei` | Helpers: `useGLTF`, `OrbitControls`, `Environment`, etc. |
| `@react-three/rapier` | Physics (Rapier WASM) — installed, not yet wired up |

### What is NOT here yet (by design)

- Player movement / pointer lock
- Interaction hotspots
- Modal content
- Physics collisions
- Any Rapier `<Physics>` wrapper

These all have clear insertion points in `Experience.js`, `ModalLayer.js`, and a future `World.js`.

### Future expansion map

| Feature | Where to add |
|---|---|
| WASD walking / pointer lock | Replace `<OrbitControls>` in `Experience.js` with `<PlayerController>` |
| Physics world | Create `World.js` that owns `<Physics>` + `<RigidBody type="fixed">` around `<GarageModel>`; mount it in `Experience.js` — never modify `GarageModel.js` |
| Interaction hotspots | Add `<Hotspots>` as a sibling to the environment in `Experience.js` |
| Modal content | Wire Zustand store into `ModalLayer.js`, render `<Modal>` conditionally |
| Proximity hints | Detection in `Experience`, pass `message` prop down to `InteractionPrompt` |
