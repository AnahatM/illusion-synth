<script lang="ts">
  import type { ParamDef } from '../illusions/types';
  import ColorPicker from './ColorPicker.svelte';

  interface Props {
    paramDefs: ParamDef[];
    values: Record<string, any>;
    onChange: (key: string, value: any) => void;
    onReset?: () => void;
  }

  let { paramDefs, values, onChange, onReset }: Props = $props();
</script>

<div class="control-panel">
  {#each paramDefs as param}
    <div class="control">
      <label for={param.key}>{param.label}</label>
      {#if param.type === 'slider'}
        <input
          id={param.key}
          type="range"
          min={param.min}
          max={param.max}
          step={param.step ?? 0.01}
          value={values[param.key]}
          oninput={(e) => onChange(param.key, parseFloat((e.target as HTMLInputElement).value))}
        />
        <span class="value">{Number(values[param.key]).toFixed(2)}</span>
      {:else if param.type === 'color'}
        <ColorPicker
          value={values[param.key]}
          onChange={(v) => onChange(param.key, v)}
        />
      {:else if param.type === 'toggle'}
        <input
          id={param.key}
          type="checkbox"
          checked={values[param.key]}
          onchange={(e) => onChange(param.key, (e.target as HTMLInputElement).checked)}
        />
      {:else if param.type === 'select'}
        <div class="segmented" id={param.key}>
          {#each param.options ?? [] as opt}
            <button
              class="seg-btn"
              class:active={values[param.key] === opt}
              onclick={() => onChange(param.key, opt)}
            >{opt}</button>
          {/each}
        </div>
      {/if}
    </div>
  {/each}

  {#if onReset}
    <button class="reset-btn" onclick={onReset}>Reset to Defaults</button>
  {/if}
</div>

<style>
  .control-panel {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    padding: 1rem;
  }

  .control {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 0.5rem;
  }

  label {
    min-width: 5.5rem;
    flex-shrink: 0;
    font-size: 0.85rem;
    color: var(--text-secondary);
  }

  input[type='range'] {
    flex: 1;
    -webkit-appearance: none;
    appearance: none;
    height: 4px;
    background: var(--border, #1a3a1a);
    outline: none;
    cursor: pointer;
  }

  input[type='range']::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 14px;
    height: 14px;
    background: var(--accent, #00ff41);
    border: none;
    cursor: pointer;
    box-shadow: 0 0 6px rgba(0, 255, 65, 0.5);
  }

  input[type='range']::-moz-range-thumb {
    width: 14px;
    height: 14px;
    background: var(--accent, #00ff41);
    border: none;
    border-radius: 0;
    cursor: pointer;
    box-shadow: 0 0 6px rgba(0, 255, 65, 0.5);
  }

  input[type='range']::-moz-range-track {
    height: 4px;
    background: var(--border, #1a3a1a);
    border: none;
  }

  input[type='checkbox'] {
    accent-color: var(--accent);
    width: 1.2rem;
    height: 1.2rem;
  }

  .segmented {
    display: flex;
    flex-direction: column;
    width: 100%;
    border: 1px solid var(--border);
    overflow: hidden;
  }

  .seg-btn {
    padding: 0.35rem 0.5rem;
    background: var(--surface);
    color: var(--text-secondary);
    border: none;
    border-bottom: 1px solid var(--border);
    font-family: inherit;
    font-size: 0.75rem;
    cursor: pointer;
    transition: background 0.15s, color 0.15s;
    text-align: left;
  }

  .seg-btn:last-child {
    border-bottom: none;
  }

  .seg-btn.active {
    background: var(--accent, #00ff41);
    color: #000;
    font-weight: 600;
  }

  .seg-btn:hover:not(.active) {
    background: var(--border);
    color: var(--text);
  }

  .value {
    min-width: 3rem;
    text-align: right;
    font-size: 0.8rem;
    font-family: monospace;
    color: var(--text-secondary);
  }

  .reset-btn {
    margin-top: 0.5rem;
    padding: 0.5rem 1rem;
    background: transparent;
    color: var(--accent, #00ff41);
    border: 1px solid var(--accent, #00ff41);
    font-family: inherit;
    font-size: 0.8rem;
    cursor: pointer;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    transition: background 0.2s, color 0.2s;
    width: 100%;
  }

  .reset-btn:hover {
    background: var(--accent, #00ff41);
    color: #000;
  }
</style>
