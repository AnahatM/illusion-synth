import * as THREE from "three";

export interface RendererContext {
  renderer: THREE.WebGLRenderer;
  scene: THREE.Scene;
  camera: THREE.OrthographicCamera;
  canvas: HTMLCanvasElement;
  destroy: () => void;
}

export interface RendererOptions {
  fillCanvas?: boolean;
}

export function createRenderer(
  container: HTMLElement,
  options?: RendererOptions,
): RendererContext {
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  const canvas = renderer.domElement;
  container.appendChild(canvas);

  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);
  camera.position.z = 1;

  function resize() {
    const w = container.clientWidth;
    const h = container.clientHeight;
    renderer.setSize(w, h);
    if (options?.fillCanvas) {
      camera.left = -1;
      camera.right = 1;
      camera.top = 1;
      camera.bottom = -1;
    } else {
      const aspect = w / h;
      camera.left = -aspect;
      camera.right = aspect;
      camera.top = 1;
      camera.bottom = -1;
    }
    camera.updateProjectionMatrix();
  }

  const observer = new ResizeObserver(resize);
  observer.observe(container);
  resize();

  function destroy() {
    observer.disconnect();
    renderer.dispose();
    if (canvas.parentElement) canvas.parentElement.removeChild(canvas);
  }

  return { renderer, scene, camera, canvas, destroy };
}

export function startAnimationLoop(
  ctx: RendererContext,
  update: (time: number) => void,
): () => void {
  let frameId: number;
  let running = true;

  function onVisibilityChange() {
    if (document.hidden) {
      cancelAnimationFrame(frameId);
    } else if (running) {
      frameId = requestAnimationFrame(loop);
    }
  }
  document.addEventListener("visibilitychange", onVisibilityChange);

  function loop(time: number) {
    if (!running) return;
    update(time * 0.001); // convert ms to seconds
    ctx.renderer.render(ctx.scene, ctx.camera);
    frameId = requestAnimationFrame(loop);
  }

  frameId = requestAnimationFrame(loop);

  return () => {
    running = false;
    cancelAnimationFrame(frameId);
    document.removeEventListener("visibilitychange", onVisibilityChange);
  };
}
