import * as THREE from "three";
import type { IllusionConfig } from "../illusions/types";

const cache = new Map<string, string>();
// Deduplicates concurrent requests for the same illusion id
const inFlight = new Map<string, Promise<string>>();

let flipCanvas: HTMLCanvasElement | null = null;
let flipCtx: CanvasRenderingContext2D | null = null;

const THUMB_SIZE = 320;

// Serial queue: guarantees one render at a time regardless of how many cards
// become visible simultaneously.
let renderQueue: Promise<void> = Promise.resolve();

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

/** Renders one thumbnail. Called strictly from within the serial queue. */
async function renderOne(illusion: IllusionConfig): Promise<string> {
  // Create a fresh canvas + renderer per illusion so that disposing materials
  // and geometries after capture never corrupts a shared WebGL program cache.
  const canvas = document.createElement("canvas");
  canvas.width = THUMB_SIZE;
  canvas.height = THUMB_SIZE;
  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: true,
    preserveDrawingBuffer: true,
  });
  renderer.setSize(THUMB_SIZE, THUMB_SIZE);

  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);
  camera.position.z = 1;

  const defaults: Record<string, any> = {};
  for (const p of illusion.params) {
    defaults[p.key] = p.default;
  }

  try {
    const result = illusion.setup(scene, camera, defaults);
    if (result && typeof (result as any).then === "function") {
      await (result as Promise<void>);
    }

    illusion.update(0.5, defaults);
    // First render primes all GPU texture uploads; second render captures the
    // fully-textured frame. Without this, texture-dependent illusions render blank.
    renderer.render(scene, camera);
    renderer.render(scene, camera);

    // gl.finish() stalls the CPU until the GPU has finished writing the framebuffer.
    (renderer.getContext() as WebGLRenderingContext).finish();

    const { canvas: fc, ctx } = getFlipCanvas();
    ctx.clearRect(0, 0, THUMB_SIZE, THUMB_SIZE);
    ctx.drawImage(canvas, 0, 0);

    const dataUrl = fc.toDataURL("image/webp", 0.85);
    cache.set(illusion.id, dataUrl);
    return dataUrl;
  } finally {
    illusion.dispose();
    while (scene.children.length > 0) scene.remove(scene.children[0]);
    renderer.dispose();
  }
}

export function generateThumbnail(illusion: IllusionConfig): Promise<string> {
  // Serve from cache immediately
  const cached = cache.get(illusion.id);
  if (cached) return Promise.resolve(cached);

  // Return the existing promise if already queued/in-flight
  const existing = inFlight.get(illusion.id);
  if (existing) return existing;

  // Chain onto the serial queue tail
  const promise: Promise<string> = renderQueue.then(() => renderOne(illusion));

  // Advance the tail — swallow errors so a broken illusion doesn't stall the queue
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

/** Clear all cached thumbnails. */
export function clearCache(): void {
  cache.clear();
}
