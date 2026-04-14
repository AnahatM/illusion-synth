<script lang="ts">
  import type { ParamDef } from '../illusions/types';

  interface Props {
    paramDefs: ParamDef[];
    values: Record<string, any>;
    onChange: (key: string, value: any) => void;
  }

  let { paramDefs, values, onChange }: Props = $props();
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
        <input
          id={param.key}
          type="color"
          value={values[param.key]}
          oninput={(e) => onChange(param.key, (e.target as HTMLInputElement).value)}
        />
      {:else if param.type === 'toggle'}
        <input
          id={param.key}
          type="checkbox"
          checked={values[param.key]}
          onchange={(e) => onChange(param.key, (e.target as HTMLInputElement).checked)}
        />
      {:else if param.type === 'select'}
        <select
          id={param.key}
          value={values[param.key]}
          onchange={(e) => onChange(param.key, (e.target as HTMLSelectElement).value)}
        >
          {#each param.options ?? [] as opt}
            <option value={opt}>{opt}</option>
          {/each}
        </select>
      {/if}
    </div>
  {/each}
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
    align-items: center;
    gap: 0.5rem;
  }

  label {
    min-width: 6rem;
    font-size: 0.85rem;
    color: var(--text-secondary);
  }

  input[type='range'] {
    flex: 1;
    accent-color: var(--accent);
  }

  input[type='color'] {
    width: 2.5rem;
    height: 2rem;
    border: 1px solid var(--border);
    border-radius: 4px;
    cursor: pointer;
    background: none;
    padding: 2px;
  }

  input[type='checkbox'] {
    accent-color: var(--accent);
    width: 1.2rem;
    height: 1.2rem;
  }

  select {
    background: var(--surface);
    color: var(--text);
    border: 1px solid var(--border);
    border-radius: 4px;
    padding: 0.3rem 0.5rem;
    font-size: 0.85rem;
  }

  .value {
    min-width: 3rem;
    text-align: right;
    font-size: 0.8rem;
    font-family: monospace;
    color: var(--text-secondary);
  }
</style>
