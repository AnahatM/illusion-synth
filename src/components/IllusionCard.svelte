<script lang="ts">
  import type { IllusionConfig } from '../illusions/types';
  import { generateThumbnail } from '../lib/thumbnail-cache';

  interface Props {
    illusion: IllusionConfig;
    layout?: 'grid' | 'compact';
    onClick: () => void;
  }

  let { illusion, layout = 'grid', onClick }: Props = $props();

  let cardEl: HTMLElement;
  let thumbSrc = $state('');
  let hasBeenVisible = $state(false);

  const hasColorParam = $derived(illusion.params.some(p => p.type === 'color'));
  const needsTint = $derived(!hasColorParam || illusion.tintThumbnail === true);

  // Use a pre-generated static thumbnail if available, otherwise fall back to
  // runtime WebGL generation (needed when thumbnails haven't been generated yet).
  const staticUrl = $derived(`/thumbnails/${illusion.id}.webp`);

  $effect(() => {
    if (!cardEl || hasBeenVisible) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          hasBeenVisible = true;
          observer.disconnect();
        }
      },
      { rootMargin: '200px' },
    );
    observer.observe(cardEl);

    return () => observer.disconnect();
  });

  $effect(() => {
    if (!hasBeenVisible || thumbSrc) return;

    // Try static file first via a HEAD request
    fetch(staticUrl, { method: 'HEAD' }).then((res) => {
      if (res.ok) {
        thumbSrc = staticUrl;
      } else {
        // Fall back to runtime generation
        generateThumbnail(illusion).then((url) => {
          thumbSrc = url;
        });
      }
    }).catch(() => {
      generateThumbnail(illusion).then((url) => {
        thumbSrc = url;
      });
    });
  });
</script>

<button class="card" class:compact={layout === 'compact'} bind:this={cardEl} onclick={onClick}>
  <div class="thumbnail" class:tinted={needsTint}>
    {#if thumbSrc}
      <img src={thumbSrc} alt={illusion.name} width="320" height="320" />
    {:else if hasBeenVisible}
      <div class="loading-spinner"></div>
    {/if}
  </div>
  <div class="info">
    <h3>{illusion.name}</h3>
    <p class="desc">{illusion.description}</p>
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
    aspect-ratio: 1 / 1;
    background: #141414;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    position: relative;
  }

  .thumbnail.tinted img {
    filter: grayscale(1) brightness(0.8);
  }

  .thumbnail.tinted::after {
    content: '';
    position: absolute;
    inset: 0;
    background: rgba(255, 255, 255, 0.15);
    mix-blend-mode: multiply;
    pointer-events: none;
  }

  .thumbnail img {
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

  .desc {
    margin: 0 0 0.5rem;
    font-size: 0.78rem;
    color: var(--text-secondary);
    line-height: 1.35;
    display: -webkit-box;
    line-clamp: 2;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .category {
    font-size: 0.75rem;
    color: var(--text-secondary);
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .loading-spinner {
    width: 28px;
    height: 28px;
    border: 3px solid rgba(255, 255, 255, 0.15);
    border-top-color: rgba(255, 255, 255, 0.6);
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  .card.compact {
    display: flex;
    flex-direction: row;
  }

  .card.compact .thumbnail {
    aspect-ratio: 1 / 1;
    width: 80px;
    min-width: 80px;
    flex-shrink: 0;
  }

  .card.compact .info {
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 0.4rem 0.75rem;
    min-width: 0;
  }

  .card.compact h3 {
    font-size: 0.85rem;
    margin-bottom: 0.15rem;
  }

  .card.compact .desc {
    font-size: 0.72rem;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    margin-bottom: 0.25rem;
  }

  .card.compact .category {
    font-size: 0.7rem;
  }

  .card.compact:hover {
    transform: translateY(-2px);
  }

  @media (max-width: 600px) {
    .card {
      display: flex;
      flex-direction: row;
    }

    .thumbnail {
      aspect-ratio: 1 / 1;
      width: 100px;
      min-width: 100px;
      flex-shrink: 0;
    }

    .info {
      display: flex;
      flex-direction: column;
      justify-content: center;
      padding: 0.5rem 0.75rem;
      min-width: 0;
    }

    h3 {
      font-size: 0.85rem;
    }

    .desc {
      font-size: 0.72rem;
      -webkit-line-clamp: 2;
      line-clamp: 2;
    }
  }
</style>
