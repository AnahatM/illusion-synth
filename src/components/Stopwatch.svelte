<script lang="ts">
  interface Props {
    visible: boolean;
  }

  let { visible }: Props = $props();

  let elapsed = $state(0);
  let running = $state(false);
  let collapsed = $state(false);
  let intervalId: ReturnType<typeof setInterval> | null = null;
  let startTime = 0;
  let accumulatedTime = 0;

  function start() {
    if (running) return;
    running = true;
    startTime = performance.now();
    intervalId = setInterval(() => {
      elapsed = accumulatedTime + (performance.now() - startTime);
    }, 50);
  }

  function stop() {
    if (!running) return;
    running = false;
    accumulatedTime += performance.now() - startTime;
    elapsed = accumulatedTime;
    if (intervalId !== null) {
      clearInterval(intervalId);
      intervalId = null;
    }
  }

  function reset() {
    stop();
    elapsed = 0;
    accumulatedTime = 0;
  }

  export function cleanup() {
    reset();
    collapsed = false;
  }

  function formatTime(ms: number): string {
    const totalSec = Math.floor(ms / 1000);
    const h = Math.floor(totalSec / 3600);
    const m = Math.floor((totalSec % 3600) / 60);
    const s = totalSec % 60;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  }
</script>

{#if visible}
  <div class="stopwatch" class:collapsed>
    {#if collapsed}
      <button class="mini-panel" onclick={() => (collapsed = false)}>
        <span class="mini-time">{formatTime(elapsed)}</span>
        <svg class="sw-icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="13" r="8"/>
          <path d="M12 9v4l2.5 2.5"/>
          <path d="M10 2h4"/>
          <path d="M12 2v3"/>
        </svg>
      </button>
    {:else}
      <div class="panel">
        <div class="panel-header">
          <svg class="sw-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="13" r="8"/>
            <path d="M12 9v4l2.5 2.5"/>
            <path d="M10 2h4"/>
            <path d="M12 2v3"/>
          </svg>
          <span class="time-display">{formatTime(elapsed)}</span>
          <button class="collapse-btn" onclick={() => (collapsed = true)} title="Minimize">─</button>
        </div>
        <div class="panel-controls">
          {#if !running}
            <button class="sw-btn start" onclick={start}>{elapsed > 0 ? 'Resume' : 'Start'}</button>
          {:else}
            <button class="sw-btn stop" onclick={stop}>Stop</button>
          {/if}
          <button class="sw-btn reset" onclick={reset} disabled={elapsed === 0 && !running}>Reset</button>
        </div>
      </div>
    {/if}
  </div>
{/if}

<style>
  .stopwatch {
    position: absolute;
    bottom: 1rem;
    right: 1rem;
    z-index: 110;
    font-family: var(--font-mono, 'JetBrains Mono', monospace);
  }

  .panel {
    background: rgba(18, 18, 18, 0.95);
    border: 1px solid rgba(255, 255, 255, 0.15);
    padding: 0.6rem 0.8rem;
    min-width: 180px;
  }

  .panel-header {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 0.5rem;
  }

  .sw-icon {
    width: 18px;
    height: 18px;
    color: rgba(255, 255, 255, 0.5);
    flex-shrink: 0;
  }

  .sw-icon-sm {
    width: 14px;
    height: 14px;
    color: rgba(255, 255, 255, 0.5);
    flex-shrink: 0;
  }

  .time-display {
    font-size: 1.3rem;
    color: #fff;
    letter-spacing: 1.5px;
    flex: 1;
  }

  .collapse-btn {
    background: none;
    border: none;
    color: rgba(255, 255, 255, 0.4);
    cursor: pointer;
    font-size: 1rem;
    padding: 0 0.25rem;
    line-height: 1;
  }

  .collapse-btn:hover {
    color: #fff;
  }

  .panel-controls {
    display: flex;
    gap: 0.4rem;
  }

  .sw-btn {
    flex: 1;
    padding: 0.3rem 0.5rem;
    border: 1px solid rgba(255, 255, 255, 0.2);
    background: rgba(255, 255, 255, 0.05);
    color: #fff;
    font-size: 0.75rem;
    font-family: var(--font-mono, monospace);
    text-transform: uppercase;
    letter-spacing: 0.5px;
    cursor: pointer;
    transition: background 0.15s;
  }

  .sw-btn:hover:not(:disabled) {
    background: rgba(255, 255, 255, 0.12);
  }

  .sw-btn:disabled {
    opacity: 0.3;
    cursor: default;
  }

  .sw-btn.start {
    border-color: rgba(80, 200, 120, 0.4);
    color: #50c878;
  }

  .sw-btn.stop {
    border-color: rgba(255, 100, 100, 0.4);
    color: #ff6464;
  }

  .mini-panel {
    background: rgba(18, 18, 18, 0.95);
    border: 1px solid rgba(255, 255, 255, 0.15);
    color: #fff;
    padding: 0.35rem 0.6rem;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 0.4rem;
    font-family: var(--font-mono, monospace);
    transition: background 0.15s;
  }

  .mini-panel:hover {
    background: rgba(255, 255, 255, 0.1);
  }

  .mini-time {
    font-size: 0.85rem;
    letter-spacing: 1px;
  }
</style>
