<script lang="ts">
  import { illusions, categories, getIllusionById } from '../illusions/registry';
  import { decodeState, applyDecodedParams } from '../lib/url-state';
  import type { IllusionConfig } from '../illusions/types';
  import SearchBar from '../components/SearchBar.svelte';
  import IllusionCard from '../components/IllusionCard.svelte';
  import IllusionViewer from '../components/IllusionViewer.svelte';

  let query = $state('');
  let selectedCategory = $state('');
  let activeIllusion = $state<IllusionConfig | null>(null);
  let initialParams = $state<Record<string, any> | undefined>(undefined);
  let layout = $state<'grid' | 'compact'>('grid');

  // Check URL hash on mount
  $effect(() => {
    const decoded = decodeState(window.location.hash);
    if (decoded) {
      const illusion = getIllusionById(decoded.id);
      if (illusion) {
        initialParams = applyDecodedParams(decoded.params, illusion.params);
        activeIllusion = illusion;
      }
    }
  });

  let filtered = $derived(
    illusions.filter((i) => {
      const matchesQuery =
        !query || i.name.toLowerCase().includes(query.toLowerCase()) ||
        i.category.toLowerCase().includes(query.toLowerCase());
      const matchesCategory = !selectedCategory || i.category === selectedCategory;
      return matchesQuery && matchesCategory;
    })
  );

  function openIllusion(illusion: IllusionConfig) {
    initialParams = undefined;
    activeIllusion = illusion;
  }

  function closeViewer() {
    activeIllusion = null;
    window.history.replaceState(null, '', window.location.pathname);
  }
</script>

<div class="browse">
  <header class="page-header">
    <h1>IllusionSynth</h1>
    <p class="tagline">Explore, customize, and experience optical illusions</p>
  </header>

  <SearchBar
    {query}
    {categories}
    {selectedCategory}
    onQueryChange={(q) => (query = q)}
    onCategoryChange={(c) => (selectedCategory = c)}
  />

  <div class="toolbar-row">
    <span class="result-count">{filtered.length} illusion{filtered.length !== 1 ? 's' : ''}</span>
    <div class="layout-toggle">
      <button
        class="layout-btn"
        class:active={layout === 'grid'}
        onclick={() => (layout = 'grid')}
        title="Grid layout"
      >
        <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
          <rect x="3" y="3" width="7" height="7" rx="1"/>
          <rect x="14" y="3" width="7" height="7" rx="1"/>
          <rect x="3" y="14" width="7" height="7" rx="1"/>
          <rect x="14" y="14" width="7" height="7" rx="1"/>
        </svg>
        <span>Grid</span>
      </button>
      <button
        class="layout-btn"
        class:active={layout === 'compact'}
        onclick={() => (layout = 'compact')}
        title="Compact layout"
      >
        <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
          <rect x="3" y="4" width="18" height="3" rx="1"/>
          <rect x="3" y="10.5" width="18" height="3" rx="1"/>
          <rect x="3" y="17" width="18" height="3" rx="1"/>
        </svg>
        <span>Compact</span>
      </button>
    </div>
  </div>

  <div class="grid" class:compact={layout === 'compact'}>
    {#each filtered as illusion (illusion.id)}
      <IllusionCard {illusion} {layout} onClick={() => openIllusion(illusion)} />
    {/each}
  </div>

  {#if filtered.length === 0}
    <p class="empty">No illusions found matching your search.</p>
  {/if}
</div>

{#if activeIllusion}
  <IllusionViewer
    illusion={activeIllusion}
    {initialParams}
    onClose={closeViewer}
  />
{/if}

<style>
  .browse {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem 1.5rem;
  }

  .page-header {
    text-align: center;
    margin-bottom: 2rem;
  }

  .page-header h1 {
    font-size: 2.2rem;
    margin: 0;
    background: linear-gradient(135deg, var(--text), var(--text-secondary));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .tagline {
    color: var(--text-secondary);
    margin: 0.5rem 0 0;
    font-size: 1rem;
  }

  .toolbar-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 1rem;
  }

  .result-count {
    font-size: 0.8rem;
    color: var(--text-secondary);
  }

  .layout-toggle {
    display: flex;
    border: 1px solid var(--border);
  }

  .layout-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.35rem;
    padding: 0.35rem 0.6rem;
    background: var(--surface);
    color: var(--text-secondary);
    border: none;
    cursor: pointer;
    font-family: inherit;
    font-size: 0.75rem;
    transition: background 0.15s, color 0.15s;
  }

  .layout-btn + .layout-btn {
    border-left: 1px solid var(--border);
  }

  .layout-btn.active {
    background: var(--accent);
    color: var(--bg, #000);
  }

  .layout-btn:hover:not(.active) {
    background: var(--border);
    color: var(--text);
  }

  .grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
    gap: 1.25rem;
  }

  .grid.compact {
    grid-template-columns: 1fr;
    max-width: 700px;
    margin-left: auto;
    margin-right: auto;
    gap: 0.5rem;
  }

  .empty {
    text-align: center;
    color: var(--text-secondary);
    padding: 3rem 0;
  }

  @media (max-width: 600px) {
    .grid {
      grid-template-columns: 1fr;
    }

    .layout-toggle {
      display: none;
    }
  }
</style>
