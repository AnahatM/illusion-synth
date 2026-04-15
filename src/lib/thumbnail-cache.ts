import * as THREE from "three";
import type { IllusionConfig } from "../illusions/types";

const cache = new Map<string, string>();

let sharedRenderer: THREE.WebGLRenderer | null = null;
let sharedCanvas: HTMLCanvasElement | null = null;
let flipCanvas: HTMLCanvasElement | null = null;
let flipCtx: CanvasRenderingContext2D | null = null;

const THUMB_SIZE = 320;

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

export async function generateThumbnail(
  illusion: IllusionConfig,
): Promise<string> {
  const cached = cache.get(illusion.id);
  if (cached) return cached;

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
    await result;
  }

  illusion.update(0.5, defaults);
  renderer.render(scene, camera);

  // Read pixels from WebGL and flip vertically for cross-browser consistency
  // (Firefox does not always flip correctly with toDataURL on WebGL canvases)
  const gl = renderer.getContext();
  const pixels = new Uint8Array(THUMB_SIZE * THUMB_SIZE * 4);
  gl.readPixels(
    0,
    0,
    THUMB_SIZE,
    THUMB_SIZE,
    gl.RGBA,
    gl.UNSIGNED_BYTE,
    pixels,
  );

  const { canvas: fc, ctx } = getFlipCanvas();
  const imageData = ctx.createImageData(THUMB_SIZE, THUMB_SIZE);

  // WebGL readPixels gives bottom-to-top rows; flip to top-to-bottom
  const rowSize = THUMB_SIZE * 4;
  for (let y = 0; y < THUMB_SIZE; y++) {
    const srcOffset = (THUMB_SIZE - y - 1) * rowSize;
    const dstOffset = y * rowSize;
    imageData.data.set(
      pixels.subarray(srcOffset, srcOffset + rowSize),
      dstOffset,
    );
  }
  ctx.putImageData(imageData, 0, 0);

  const dataUrl = fc.toDataURL("image/webp", 0.8);

  illusion.dispose();

  // Clear the scene to prevent state leaking between renders
  while (scene.children.length > 0) {
    scene.remove(scene.children[0]);
  }

  cache.set(illusion.id, dataUrl);
  return dataUrl;
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
