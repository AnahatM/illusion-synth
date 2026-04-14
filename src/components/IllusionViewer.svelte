<script lang="ts">
  import type { IllusionConfig } from '../illusions/types';
  import { createRenderer, startAnimationLoop } from '../lib/renderer';
  import { encodeState } from '../lib/url-state';
  import ControlPanel from './ControlPanel.svelte';

  interface Props {
    illusion: IllusionConfig;
    initialParams?: Record<string, any>;
    onClose: () => void;
  }

  let { illusion, initialParams, onClose }: Props = $props();

  let container: HTMLDivElement;
  let controlsOpen = $state(true);
  let isFullscreen = $state(false);
  let params = $state<Record<string, any>>({});

  // Initialize params from defaults + any provided initial params
  function initParams() {
    const p: Record<string, any> = {};
    for (const def of illusion.params) {
      p[def.key] = initialParams?.[def.key] ?? def.default;
    }
    params = p;
  }

  function handleParamChange(key: string, value: any) {
    params = { ...params, [key]: value };
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

  $effect(() => {
    initParams();

    const ctx = createRenderer(container);

    illusion.setup(ctx.scene, ctx.camera, params);

    const stopLoop = startAnimationLoop(ctx, (time) => {
      illusion.update(time, params);
    });

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('keydown', handleKeydown);

    return () => {
      stopLoop();
      illusion.dispose();
      ctx.destroy();
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('keydown', handleKeydown);
    };
  });
</script>

<div class="viewer" bind:this={container}>
  <div class="toolbar">
    <button class="icon-btn" onclick={() => (controlsOpen = !controlsOpen)} title="Toggle controls">
      ⚙
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
      <ControlPanel paramDefs={illusion.params} values={params} onChange={handleParamChange} />
    </div>
  {/if}
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
    border-radius: 6px;
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
    width: 280px;
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
    font-size: 0.8rem;
    opacity: 0.7;
    margin: 0 0 1rem;
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
