import * as THREE from "three";
import type { IllusionConfig } from "../illusions/types";

const cache = new Map<string, string>();

let sharedRenderer: THREE.WebGLRenderer | null = null;
let sharedCanvas: HTMLCanvasElement | null = null;

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

  const dataUrl = sharedCanvas!.toDataURL("image/webp", 0.8);

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
  }
}
