import * as THREE from "three";
import type { IllusionConfig } from "../illusions/types";

const cache = new Map<string, string>();
// Deduplicates concurrent requests for the same illusion id
const inFlight = new Map<string, Promise<string>>();

let sharedRenderer: THREE.WebGLRenderer | null = null;
let sharedCanvas: HTMLCanvasElement | null = null;
let flipCanvas: HTMLCanvasElement | null = null;
let flipCtx: CanvasRenderingContext2D | null = null;

const THUMB_SIZE = 320;

// Serial queue: guarantees only one render runs at a time on the shared renderer.
// Every new render is chained onto the tail so they execute one-by-one regardless
// of how many cards become visible simultaneously.
let renderQueue: Promise<void> = Promise.resolve();

function getRenderer(): THREE.WebGLRenderer {
  if (!sharedRenderer) {
    sharedCanvas = document.createElement("canvas");
    sharedCanvas.width = THUMB_SIZE;
    sharedCanvas.height = THUMB_SIZE;
    sharedRenderer = new THREE.WebGLRenderer({
      canvas: sharedCanvas,
      alpha: true,
      antialias: true,
      preserveDrawingBuffer: true,
    });
    sharedRenderer.setSize(THUMB_SIZE, THUMB_SIZE);
  }
  return sharedRenderer;
}

function getFlipCanvas(): {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
} {
  if (!flipCanvas) {
    flipCanvas = document.createElement("canvas");
    flipCanvas.width = THUMB_SIZE;
    flipCanvas.height = THUMB_SIZE;
    flipCtx = flipCanvas.getContext("2d")!;
  }
  return { canvas: flipCanvas, ctx: flipCtx! };
}

export function getThumbnail(id: string): string | undefined {
  return cache.get(id);
}

/** Renders one thumbnail. Must only be called from within the serial queue. */
async function renderOne(illusion: IllusionConfig): Promise<string> {
  const renderer = getRenderer();

  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);
  camera.position.z = 1;

  const defaults: Record<string, any> = {};
  for (const p of illusion.params) {
    defaults[p.key] = p.default;
  }

  const result = illusion.setup(scene, camera, defaults);
  if (result && typeof (result as any).then === "function") {
    await (result as Promise<void>);
  }

  illusion.update(0.5, defaults);
  renderer.clear();
  renderer.render(scene, camera);

  // Capture immediately after render — no yields between render and drawImage
  const { canvas: fc, ctx } = getFlipCanvas();
  ctx.clearRect(0, 0, THUMB_SIZE, THUMB_SIZE);
  ctx.drawImage(sharedCanvas!, 0, 0);
  const dataUrl = fc.toDataURL("image/webp", 0.8);

  illusion.dispose();
  while (scene.children.length > 0) {
    scene.remove(scene.children[0]);
  }

  cache.set(illusion.id, dataUrl);
  return dataUrl;
}

export function generateThumbnail(illusion: IllusionConfig): Promise<string> {
  // Serve from cache immediately
  const cached = cache.get(illusion.id);
  if (cached) return Promise.resolve(cached);

  // Return the existing promise if this illusion is already queued/rendering
  const existing = inFlight.get(illusion.id);
  if (existing) return existing;

  // Chain onto the serial queue so this render waits for all prior renders to finish
  const promise: Promise<string> = renderQueue.then(() => renderOne(illusion));

  // Extend the queue tail — swallow errors so one bad render doesn't stall the queue
  renderQueue = promise.then(
    () => {},
    () => {},
  );

  inFlight.set(illusion.id, promise);
  promise.then(
    () => inFlight.delete(illusion.id),
    () => inFlight.delete(illusion.id),
  );

  return promise;
}

/** Dispose the shared renderer when no longer needed. */
export function disposeRenderer(): void {
  if (sharedRenderer) {
    sharedRenderer.dispose();
    sharedRenderer = null;
    sharedCanvas = null;
    flipCanvas = null;
    flipCtx = null;
  }
}

/** Clear all cached thumbnails. */
export function clearCache(): void {
  cache.clear();
}
