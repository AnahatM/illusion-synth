<script lang="ts">
  interface Props {
    value: string;
    onChange: (value: string) => void;
  }

  let { value, onChange }: Props = $props();

  let open = $state(false);
  let pickerEl: HTMLDivElement;

  // HSV state derived from hex
  let hue = $state(0);
  let sat = $state(1);
  let val = $state(1);

  // Preset swatches
  const swatches = [
    '#ff0000', '#ff6600', '#ffcc00', '#33cc33', '#00cccc',
    '#0066ff', '#7c3aed', '#cc33cc', '#ff3399', '#ffffff',
    '#cccccc', '#666666', '#333333', '#000000',
  ];

  function hexToHsv(hex: string) {
    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b = parseInt(hex.slice(5, 7), 16) / 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    const d = max - min;
    let h = 0;
    if (d !== 0) {
      if (max === r) h = ((g - b) / d + 6) % 6;
      else if (max === g) h = (b - r) / d + 2;
      else h = (r - g) / d + 4;
      h /= 6;
    }
    const s = max === 0 ? 0 : d / max;
    return { h, s, v: max };
  }

  function hsvToHex(h: number, s: number, v: number): string {
    const i = Math.floor(h * 6);
    const f = h * 6 - i;
    const p = v * (1 - s);
    const q = v * (1 - f * s);
    const t = v * (1 - (1 - f) * s);
    let r: number, g: number, b: number;
    switch (i % 6) {
      case 0: r = v; g = t; b = p; break;
      case 1: r = q; g = v; b = p; break;
      case 2: r = p; g = v; b = t; break;
      case 3: r = p; g = q; b = v; break;
      case 4: r = t; g = p; b = v; break;
      default: r = v; g = p; b = q; break;
    }
    const toHex = (n: number) => Math.round(n * 255).toString(16).padStart(2, '0');
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  }

  function syncFromHex(hex: string) {
    const hsv = hexToHsv(hex);
    hue = hsv.h;
    sat = hsv.s;
    val = hsv.v;
  }

  // Init from value
  $effect(() => {
    if (!open && value) syncFromHex(value);
  });

  function emitColor() {
    onChange(hsvToHex(hue, sat, val));
  }

  function handleSvPointer(e: PointerEvent) {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    sat = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    val = Math.max(0, Math.min(1, 1 - (e.clientY - rect.top) / rect.height));
    emitColor();
  }

  function handleHuePointer(e: PointerEvent) {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    hue = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    emitColor();
  }

  function startDrag(handler: (e: PointerEvent) => void) {
    return (e: PointerEvent) => {
      handler(e);
      const move = (ev: PointerEvent) => handler(ev);
      const up = () => {
        window.removeEventListener('pointermove', move);
        window.removeEventListener('pointerup', up);
      };
      window.addEventListener('pointermove', move);
      window.addEventListener('pointerup', up);
    };
  }

  function handleClickOutside(e: MouseEvent) {
    if (pickerEl && !pickerEl.contains(e.target as Node)) {
      open = false;
    }
  }

  $effect(() => {
    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  });
</script>

<div class="color-picker-wrapper" bind:this={pickerEl}>
  <button
    class="swatch-btn"
    style:background={value}
    onclick={() => { syncFromHex(value); open = !open; }}
    title="Pick color"
  ></button>
  <span class="hex-label">{value}</span>

  {#if open}
    <div class="picker-popup">
      <!-- SV area -->
      <div
        class="sv-area"
        role="slider"
        aria-label="Saturation and brightness"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(sat * 100)}
        tabindex="0"
        style:background={`hsl(${hue * 360}, 100%, 50%)`}
        onpointerdown={startDrag(handleSvPointer)}
      >
        <div class="sv-white"></div>
        <div class="sv-black"></div>
        <div
          class="sv-cursor"
          style:left={`${sat * 100}%`}
          style:top={`${(1 - val) * 100}%`}
        ></div>
      </div>

      <!-- Hue bar -->
      <div
        class="hue-bar"
        role="slider"
        aria-label="Hue"
        aria-valuemin={0}
        aria-valuemax={360}
        aria-valuenow={Math.round(hue * 360)}
        tabindex="0"
        onpointerdown={startDrag(handleHuePointer)}
      >
        <div class="hue-cursor" style:left={`${hue * 100}%`}></div>
      </div>

      <!-- Swatches -->
      <div class="presets">
        {#each swatches as sw}
          <button
            class="preset"
            style:background={sw}
            onclick={() => { syncFromHex(sw); onChange(sw); }}
            title={sw}
          ></button>
        {/each}
      </div>
    </div>
  {/if}
</div>

<style>
  .color-picker-wrapper {
    position: relative;
    display: flex;
    align-items: center;
    gap: 0.4rem;
  }

  .swatch-btn {
    width: 2rem;
    height: 2rem;
    border: 2px solid rgba(255, 255, 255, 0.2);
    border-radius: 0;
    cursor: pointer;
    padding: 0;
    flex-shrink: 0;
  }

  .hex-label {
    font-size: 0.75rem;
    font-family: monospace;
    color: var(--text-secondary, #00aa2a);
    min-width: 4rem;
  }

  .picker-popup {
    position: absolute;
    top: 100%;
    left: 0;
    margin-top: 0.5rem;
    background: #0a0a0a;
    border: 1px solid rgba(255, 255, 255, 0.15);
    border-radius: 0;
    padding: 0.75rem;
    z-index: 200;
    width: 220px;
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.6);
  }

  .sv-area {
    position: relative;
    width: 100%;
    height: 140px;
    border-radius: 0;
    cursor: crosshair;
    touch-action: none;
    overflow: hidden;
  }

  .sv-white {
    position: absolute;
    inset: 0;
    background: linear-gradient(to right, #fff, transparent);
  }

  .sv-black {
    position: absolute;
    inset: 0;
    background: linear-gradient(to top, #000, transparent);
  }

  .sv-cursor {
    position: absolute;
    width: 14px;
    height: 14px;
    border: 2px solid #fff;
    border-radius: 50%;
    box-shadow: 0 0 3px rgba(0, 0, 0, 0.5);
    transform: translate(-50%, -50%);
    pointer-events: none;
  }

  .hue-bar {
    position: relative;
    width: 100%;
    height: 14px;
    margin-top: 0.5rem;
    border-radius: 0;
    background: linear-gradient(to right,
      #f00 0%, #ff0 17%, #0f0 33%, #0ff 50%,
      #00f 67%, #f0f 83%, #f00 100%
    );
    cursor: pointer;
    touch-action: none;
  }

  .hue-cursor {
    position: absolute;
    top: -1px;
    width: 8px;
    height: 16px;
    background: #fff;
    border-radius: 0;
    box-shadow: 0 0 3px rgba(0, 0, 0, 0.4);
    transform: translateX(-50%);
    pointer-events: none;
  }

  .presets {
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
    margin-top: 0.5rem;
  }

  .preset {
    width: 20px;
    height: 20px;
    border: 1px solid rgba(255, 255, 255, 0.15);
    border-radius: 0;
    cursor: pointer;
    padding: 0;
    transition: transform 0.15s;
  }

  .preset:hover {
    transform: scale(1.2);
    border-color: #fff;
  }
</style>
