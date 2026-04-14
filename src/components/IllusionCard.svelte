<script lang="ts">
  import * as THREE from 'three';
  import type { IllusionConfig } from '../illusions/types';

  interface Props {
    illusion: IllusionConfig;
    onClick: () => void;
  }

  let { illusion, onClick }: Props = $props();

  let canvas: HTMLCanvasElement;

  const hasColorParam = $derived(illusion.params.some(p => p.type === 'color'));
  const needsTint = $derived(!hasColorParam);

  $effect(() => {
    if (!canvas) return;

    const width = 320;
    const height = 200;

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setSize(width, height);

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);
    camera.position.z = 1;

    const defaults: Record<string, any> = {};
    for (const p of illusion.params) {
      defaults[p.key] = p.default;
    }

    const result = illusion.setup(scene, camera, defaults);
    const doRender = () => {
      illusion.update(0.5, defaults);
      renderer.render(scene, camera);
      illusion.dispose();
      renderer.dispose();
    };
    if (result && typeof (result as any).then === 'function') {
      (result as Promise<void>).then(doRender);
    } else {
      doRender();
    }
  });
</script>

<button class="card" onclick={onClick}>
  <div class="thumbnail" class:tinted={needsTint}>
    <canvas bind:this={canvas}></canvas>
  </div>
  <div class="info">
    <h3>{illusion.name}</h3>
    <span class="category">{illusion.category}</span>
  </div>
</button>

<style>
  .card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 0;
    overflow: hidden;
    cursor: pointer;
    transition: transform 0.2s, box-shadow 0.2s;
    text-align: left;
    padding: 0;
    width: 100%;
    color: var(--text);
  }

  .card:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
  }

  .thumbnail {
    aspect-ratio: 16 / 10;
    background: var(--surface-hover);
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    position: relative;
  }

  .thumbnail.tinted canvas {
    filter: grayscale(1) brightness(0.8);
  }

  .thumbnail.tinted::after {
    content: '';
    position: absolute;
    inset: 0;
    background: rgba(0, 255, 65, 0.25);
    mix-blend-mode: multiply;
    pointer-events: none;
  }

  .thumbnail canvas {
    width: 100%;
    height: 100%;
    display: block;
    object-fit: cover;
  }

  .info {
    padding: 0.75rem 1rem;
  }

  h3 {
    margin: 0 0 0.25rem;
    font-size: 0.95rem;
  }

  .category {
    font-size: 0.75rem;
    color: var(--text-secondary);
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
</style>
