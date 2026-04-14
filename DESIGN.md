# IllusionSynth — Design Document

> A minimal optical illusion / hypnosis generator website where users browse, view, and customize dynamic visual illusions.

---

## Overview

IllusionSynth is a 2-page web app that renders 14 optical illusions in real-time using WebGL. Users browse a thumbnail grid, open illusions in a fullscreen viewer, and tweak parameters (speed, colors, scale, direction, intensity). Illusion states are URL-shareable.

## Tech Stack

| Layer       | Choice                         | Rationale                                          |
| ----------- | ------------------------------ | -------------------------------------------------- |
| Framework   | Svelte 5 + Vite                | Minimal, fast, no SvelteKit overhead for 2 pages   |
| Rendering   | Three.js + GLSL shaders        | WebGL performance; shaders for 2D, geometry for 3D |
| Routing     | svelte-spa-router (hash-based) | No server needed, works with static hosting        |
| GLSL import | vite-plugin-glsl               | Import .glsl files as strings in Vite              |
| Styling     | CSS variables                  | Dark/light theme toggle, simple and fast           |
| Deployment  | Vercel                         | Free static hosting, easy CI/CD                    |

## Pages

1. **Browse** (`/`) — Illusion thumbnail grid with search/filter, click to open viewer overlay with controls and fullscreen
2. **About** (`/about`) — App description, feature list, developer info (Anahat Mudgal)

## Architecture

### Illusion Plugin System

Every illusion is a plain object conforming to the `IllusionConfig` interface. The viewer and controls are generic — driven entirely by illusion metadata. Adding a new illusion = one new file + one registry entry.

```typescript
interface ParamDef {
  key: string;
  label: string;
  type: "slider" | "color" | "toggle" | "select";
  default: number | string | boolean;
  min?: number; // slider
  max?: number; // slider
  step?: number; // slider
  options?: string[]; // select
}

interface IllusionConfig {
  id: string;
  name: string;
  category: string;
  description: string;
  thumbnail: string;
  params: ParamDef[];
  setup: (
    scene: THREE.Scene,
    camera: THREE.Camera,
    params: Record<string, any>,
  ) => void;
  update: (time: number, params: Record<string, any>) => void;
  dispose: () => void;
}
```

### Rendering Pipeline

- Single shared `THREE.WebGLRenderer`, created once and reused
- On illusion switch: `dispose()` → clear scene → `setup()` → start `requestAnimationFrame` loop calling `update()`
- Resize observer keeps canvas responsive
- No render when tab is hidden (visibility API)

### Fullscreen

Two modes, both available:

- **Maximize**: canvas fills the viewport, controls as collapsible overlay sidebar
- **True Fullscreen**: `Element.requestFullscreen()` on the canvas container, hides browser chrome

### Thumbnails

- Static screenshot images for fast initial page load
- On hover: spin up a small offscreen renderer to animate a live preview
- Cancel animation on mouse-leave to avoid perf overhead on grid

### URL Sharing

Hash-based encoding: `#/illusion/spiral?speed=2&color=%23ff0000&scale=1.5`

- `url-state.ts` handles symmetric encode/decode
- On load: parse hash → restore illusion + params
- On param change: update hash silently (no page reload)

### Theme

- CSS variables for all colors, toggled via `data-theme="dark|light"` on `<html>`
- Svelte store drives the toggle
- Persisted in `localStorage`

### Epilepsy Warning

- Dismissible modal shown on first visit
- Warns about flashing/strobing/rapidly animating content
- Dismissal stored in `localStorage` (won't reappear)
- Optional "reduce motion" mode that caps animation speed

---

## Project Structure

```
src/
├── App.svelte                    # Root: router + theme provider + epilepsy warning
├── app.css                       # Global styles + CSS variables + theme
├── main.ts                       # Entry point
├── routes/
│   ├── Browse.svelte             # Thumbnail grid + search/filter + viewer overlay
│   └── About.svelte              # App info + developer info
├── components/
│   ├── IllusionCard.svelte       # Thumbnail card (static → hover animate)
│   ├── IllusionViewer.svelte     # Fullscreen renderer + controls
│   ├── ControlPanel.svelte       # Dynamic sliders/pickers from ParamDef[]
│   ├── ThemeToggle.svelte        # Dark/light toggle button
│   ├── SearchBar.svelte          # Text filter + category chips
│   └── EpilepsyWarning.svelte   # First-visit warning modal
├── illusions/
│   ├── types.ts                  # IllusionConfig, ParamDef interfaces
│   ├── registry.ts               # Array of all illusion configs (single source of truth)
│   ├── shaders/                  # .glsl fragment/vertex shader files
│   │   ├── spiral.frag
│   │   ├── moire.frag
│   │   ├── tunnel.frag
│   │   └── ...
│   └── items/                    # One file per illusion
│       ├── hypnotic-spiral.ts
│       ├── fibonacci-spiral.ts
│       ├── concentric-moire.ts
│       ├── grid-moire.ts
│       ├── afterimage-flash.ts
│       ├── color-drift.ts
│       ├── breathing-squares.ts
│       ├── cafe-wall.ts
│       ├── rotating-snakes.ts
│       ├── peripheral-drift.ts
│       ├── infinite-tunnel.ts
│       ├── vortex-warp.ts
│       ├── penrose-triangle.ts
│       └── impossible-staircase.ts
├── lib/
│   ├── renderer.ts               # Three.js WebGLRenderer factory, resize, animation loop
│   ├── url-state.ts              # URL hash encode/decode
│   └── theme.ts                  # Theme store (dark/light + localStorage)
└── assets/
    └── thumbnails/               # Static .png thumbnails per illusion
```

---

## Illusion Inventory

### Spirals

| #   | Name             | Rendering | Params                                       |
| --- | ---------------- | --------- | -------------------------------------------- |
| 1   | Hypnotic Spiral  | GLSL      | speed, direction (CW/CCW), arm count, colors |
| 2   | Fibonacci Spiral | GLSL      | speed, zoom, color                           |

### Moiré Patterns

| #   | Name                     | Rendering | Params                               |
| --- | ------------------------ | --------- | ------------------------------------ |
| 3   | Concentric Circles Moiré | GLSL      | speed, offset, line thickness, color |
| 4   | Grid Moiré               | GLSL      | rotation speed, grid density, color  |

### Color / Afterimage

| #   | Name             | Rendering    | Params                         |
| --- | ---------------- | ------------ | ------------------------------ |
| 5   | Afterimage Flash | GLSL + timer | shape, color, duration         |
| 6   | Color Drift      | GLSL         | hue speed, saturation, pattern |

### Op-Art Geometric

| #   | Name              | Rendering | Params                             |
| --- | ----------------- | --------- | ---------------------------------- |
| 7   | Breathing Squares | GLSL      | speed, square count, color pair    |
| 8   | Café Wall         | GLSL      | offset, tile count, color contrast |

### Motion Illusions

| #   | Name             | Rendering | Params                          |
| --- | ---------------- | --------- | ------------------------------- |
| 9   | Rotating Snakes  | GLSL      | ring count, color set, density  |
| 10  | Peripheral Drift | GLSL      | element count, contrast, layout |

### Tunnel / Vortex

| #   | Name            | Rendering | Params                             |
| --- | --------------- | --------- | ---------------------------------- |
| 11  | Infinite Tunnel | GLSL      | speed, ring count, gradient, shape |
| 12  | Vortex Warp     | GLSL      | twist amount, speed, color         |

### Impossible Shapes

| #   | Name                 | Rendering   | Params                           |
| --- | -------------------- | ----------- | -------------------------------- |
| 13  | Penrose Triangle     | 3D geometry | rotation speed, color, wireframe |
| 14  | Impossible Staircase | 3D geometry | rotation, perspective, color     |

---

## Coding Conventions

- **Language**: TypeScript (strict mode)
- **Components**: Svelte 5 runes syntax (`$state`, `$derived`, `$effect`)
- **Naming**: kebab-case files, PascalCase components, camelCase functions/variables
- **Illusion files**: default export an `IllusionConfig` object
- **Shaders**: separate `.frag` / `.vert` files in `illusions/shaders/`, imported via `vite-plugin-glsl`
- **No SvelteKit**: plain Svelte + hash router — keeps the build simple
- **DRY**: all viewer/control logic is generic; illusion-specific code lives only in `illusions/items/`
- **Cleanup**: every illusion must implement `dispose()` to prevent memory leaks on switch
- **Accessibility**: epilepsy warning on first visit; respect `prefers-reduced-motion` media query

---

## Verification Checklist

1. `npm run dev` loads, routing works between Browse and About
2. Epilepsy warning appears on first visit, doesn't reappear after dismiss
3. Thumbnail grid renders; search and category filter work correctly
4. Clicking an illusion opens the viewer with the illusion animating
5. All control types (slider, color, toggle, select) update the illusion in real-time
6. Both fullscreen modes (maximize + Fullscreen API) work
7. URL hash updates on param change; page refresh restores illusion + settings
8. Theme toggle works; preference persists across reload
9. `npm run build` succeeds; Vercel deploy renders correctly
10. No console errors; illusions dispose cleanly on switch (no memory leaks)
11. Responsive: usable on mobile (≥375px width)
