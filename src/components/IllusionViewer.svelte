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
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="18" height="18">
        <circle cx="12" cy="12" r="3"/>
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09a1.65 1.65 0 0 0-1.08-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09a1.65 1.65 0 0 0 1.51-1.08 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1.08z"/>
      </svg>
    </button>
    <button class="icon-btn" onclick={() => (stopwatchVisible = !stopwatchVisible)} title="Stopwatch">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18">
        <circle cx="12" cy="13" r="8"/>
        <path d="M12 9v4l2.5 2.5"/>
        <path d="M10 2h4"/>
        <path d="M12 2v3"/>
      </svg>
    </button>
    <button class="icon-btn fullscreen-btn" onclick={toggleFullscreen} title="Toggle fullscreen">
      {isFullscreen ? '⊡' : '⛶'}
    </button>
    <button class="icon-btn close-btn" onclick={onClose} title="Close">✕</button>
  </div>

  {#if !controlsOpen}
    <button class="show-tab" onclick={() => (controlsOpen = true)} title="Show settings">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="14" height="14">
        <polyline points="9 18 15 12 9 6"/>
      </svg>
      <span>Settings</span>
    </button>
  {/if}

  <div class="controls-sidebar" class:collapsed={!controlsOpen}>
    <button class="collapse-btn" onclick={() => (controlsOpen = false)} title="Hide panel">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="16" height="16">
        <polyline points="15 18 9 12 15 6"/>
      </svg>
      <span>Hide</span>
    </button>
    <h3>{illusion.name}</h3>
    <p class="description">{illusion.description}</p>
    <div class="how-to">
      <strong>How to experience:</strong>
      <p>{illusion.howTo}</p>
    </div>
    <ControlPanel paramDefs={illusion.params} values={params} onChange={handleParamChange} onReset={handleReset} />
  </div>

  <Stopwatch bind:this={stopwatchRef} visible={stopwatchVisible} />
</div>

<style>
  .viewer {
    position: fixed;
    inset: 0;
    z-index: 100;
    background: #000;
    overflow: hidden;
    /* Pin dark-mode palette so light theme never bleeds into the viewer */
    --bg: #000000;
    --surface: #0a0a0a;
    --surface-hover: #141414;
    --border: #2a2a2a;
    --text: #e0e0e0;
    --text-secondary: #888888;
    --accent: #ffffff;
    color-scheme: dark;
  }

  .viewer :global(canvas) {
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

  .fullscreen-btn {
    display: flex;
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
    transition: transform 0.3s ease;
    border-right: 1px solid rgba(255, 255, 255, 0.15);
  }

  .controls-sidebar.collapsed {
    transform: translateX(-100%);
  }

  .collapse-btn {
    display: flex;
    align-items: center;
    gap: 0.35rem;
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 0;
    color: #fff;
    padding: 0.35rem 0.6rem;
    font-size: 0.75rem;
    cursor: pointer;
    margin-bottom: 0.75rem;
    transition: background 0.2s;
  }

  .collapse-btn:hover {
    background: rgba(255, 255, 255, 0.2);
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

  .show-tab {
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    z-index: 106;
    display: flex;
    align-items: center;
    gap: 0.3rem;
    background: rgba(0, 0, 0, 0.7);
    backdrop-filter: blur(8px);
    border: 1px solid rgba(255, 255, 255, 0.15);
    border-left: none;
    color: rgba(255, 255, 255, 0.7);
    padding: 0.5rem 0.5rem 0.5rem 0.35rem;
    font-size: 0.7rem;
    font-family: inherit;
    cursor: pointer;
    writing-mode: vertical-lr;
    text-orientation: mixed;
    letter-spacing: 0.5px;
    transition: background 0.2s, color 0.2s;
  }

  .show-tab svg {
    transform: rotate(90deg);
  }

  .show-tab:hover {
    background: rgba(255, 255, 255, 0.15);
    color: #fff;
  }

  @media (max-width: 600px) {
    .controls-sidebar {
      width: 100%;
      top: auto;
      bottom: 0;
      left: 0;
      right: 0;
      max-height: 50%;
      border-right: none;
      border-top: 1px solid rgba(255, 255, 255, 0.15);
    }

    .controls-sidebar.collapsed {
      transform: translateX(0) translateY(100%);
    }

    .collapse-btn svg {
      transform: rotate(-90deg);
    }

    .fullscreen-btn {
      display: none;
    }

    .show-tab {
      left: 50%;
      top: auto;
      bottom: 0;
      transform: translateX(-50%);
      writing-mode: horizontal-tb;
      padding: 0.35rem 0.7rem;
      border: 1px solid rgba(255, 255, 255, 0.15);
      border-bottom: none;
      flex-direction: row;
    }

    .show-tab svg {
      transform: rotate(0deg);
    }
  }
</style>
