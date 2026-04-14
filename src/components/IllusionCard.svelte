<script lang="ts">
  import type { IllusionConfig } from '../illusions/types';

  interface Props {
    illusion: IllusionConfig;
    onClick: () => void;
  }

  let { illusion, onClick }: Props = $props();
</script>

<button class="card" onclick={onClick}>
  <div class="thumbnail">
    <div class="placeholder">
      <span class="icon">✦</span>
    </div>
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
    border-radius: 12px;
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
  }

  .placeholder {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .icon {
    font-size: 2.5rem;
    opacity: 0.3;
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
