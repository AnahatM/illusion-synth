<script lang="ts">
  import type { IllusionConfig } from '../illusions/types';
  import { createRenderer, startAnimationLoop } from '../lib/renderer';
  import { encodeState } from '../lib/url-state';
  import ControlPanel from './ControlPanel.svelte';
  import Stopwatch from './Stopwatch.svelte';

  interface Props {
    illusion: IllusionConfig;
    initialParams?: Record<string, any>;
    onClose: () => void;
  }

  let { illusion, initialParams, onClose }: Props = $props();

  let container: HTMLDivElement;
  let controlsOpen = $state(true);
  let isFullscreen = $state(false);
  let stopwatchVisible = $state(false);
  let stopwatchRef: Stopwatch | null = null;
  let params = $state<Record<string, any>>({});

  // Use a mutable ref so the animation loop always reads current params
  // without triggering Svelte's reactivity / re-running $effect
  let paramsRef: Record<string, any> = {};

  function initParams() {
    const p: Record<string, any> = {};
    for (const def of illusion.params) {
      p[def.key] = initialParams?.[def.key] ?? def.default;
    }
    params = p;
    paramsRef = p;
  }

  function handleParamChange(key: string, value: any) {
    params = { ...params, [key]: value };
    paramsRef = params;
    window.history.replaceState(null, '', encodeState(illusion, params));
  }

  function handleReset() {
    const p: Record<string, any> = {};
    for (const def of illusion.params) {
      p[def.key] = def.default;
    }
    params = p;
    paramsRef = p;
    window.history.replaceState(null, '', encodeState(illusion, params));
  }

  function toggleFullscreen() {
    if (!document.fullscreenElement) {
      container?.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  }

  function handleFullscreenChange() {
    isFullscreen = !!document.fullscreenElement;
  }

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === 'Escape' && !document.fullscreenElement) {
      onClose();
    }
  }

  // This effect runs ONCE per illusion (only depends on container + illusion identity).
  // Params are read via paramsRef to avoid re-triggering.
  $effect(() => {
    if (!container) return;

    // Capture the illusion in a local variable for safe closure
    const currentIllusion = illusion;
    initParams();

    const ctx = createRenderer(container, { fillCanvas: currentIllusion.fillCanvas });
    currentIllusion.setup(ctx.scene, ctx.camera, paramsRef, ctx.canvas);

    const stopLoop = startAnimationLoop(ctx, (time) => {
      currentIllusion.update(time, paramsRef, ctx);
    });

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('keydown', handleKeydown);

    return () => {
      stopLoop();
      currentIllusion.dispose();
      ctx.destroy();
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('keydown', handleKeydown);
      stopwatchVisible = false;
      stopwatchRef?.cleanup();
    };
  });
</script>

<div class="viewer" bind:this={container}>
  <div class="toolbar">
    <button class="icon-btn" onclick={() => (controlsOpen = !controlsOpen)} title="Toggle controls">
      ⚙
    </button>
    <button class="icon-btn" onclick={() => (stopwatchVisible = !stopwatchVisible)} title="Stopwatch">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18">
        <circle cx="12" cy="13" r="8"/>
        <path d="M12 9v4l2.5 2.5"/>
        <path d="M10 2h4"/>
        <path d="M12 2v3"/>
      </svg>
    </button>
    <button class="icon-btn" onclick={toggleFullscreen} title="Toggle fullscreen">
      {isFullscreen ? '⊡' : '⛶'}
    </button>
    <button class="icon-btn close-btn" onclick={onClose} title="Close">✕</button>
  </div>

  {#if controlsOpen}
    <div class="controls-sidebar">
      <h3>{illusion.name}</h3>
      <p class="description">{illusion.description}</p>
      <div class="how-to">
        <strong>How to experience:</strong>
        <p>{illusion.howTo}</p>
      </div>
      <ControlPanel paramDefs={illusion.params} values={params} onChange={handleParamChange} onReset={handleReset} />
    </div>
  {/if}

  <Stopwatch bind:this={stopwatchRef} visible={stopwatchVisible} />
</div>

<style>
  .viewer {
    position: fixed;
    inset: 0;
    z-index: 100;
    background: #000;
    display: flex;
  }

  .viewer :global(canvas) {
    flex: 1;
    display: block;
  }

  .toolbar {
    position: absolute;
    top: 1rem;
    right: 1rem;
    display: flex;
    gap: 0.5rem;
    z-index: 110;
  }

  .icon-btn {
    background: rgba(0, 0, 0, 0.6);
    color: #fff;
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 0;
    width: 2.5rem;
    height: 2.5rem;
    font-size: 1.2rem;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background 0.2s;
  }

  .icon-btn:hover {
    background: rgba(255, 255, 255, 0.15);
  }

  .controls-sidebar {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    width: 340px;
    background: rgba(0, 0, 0, 0.75);
    backdrop-filter: blur(10px);
    color: #fff;
    overflow-y: auto;
    padding: 1rem;
    z-index: 105;
  }

  .controls-sidebar h3 {
    margin: 0 0 0.25rem;
    font-size: 1.1rem;
  }

  .description {
    font-family: var(--font-sans);
    font-size: 0.85rem;
    opacity: 0.7;
    margin: 0 0 0.75rem;
    line-height: 1.6;
  }

  .how-to {
    font-family: var(--font-sans);
    font-size: 0.85rem;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 0;
    padding: 0.6rem 0.75rem;
    margin: 0 0 1rem;
    line-height: 1.6;
  }

  .how-to strong {
    color: var(--accent, #ffffff);
    display: block;
    margin-bottom: 0.25rem;
    font-size: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .how-to p {
    margin: 0;
    opacity: 0.8;
  }

  @media (max-width: 600px) {
    .controls-sidebar {
      width: 100%;
      top: auto;
      bottom: 0;
      max-height: 50%;
    }
  }
</style>
