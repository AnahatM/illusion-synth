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

  <div class="grid">
    {#each filtered as illusion (illusion.id)}
      <IllusionCard {illusion} onClick={() => openIllusion(illusion)} />
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
    background: linear-gradient(135deg, #00ff41, #00cc33);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .tagline {
    color: var(--text-secondary);
    margin: 0.5rem 0 0;
    font-size: 1rem;
  }

  .grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
    gap: 1.25rem;
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
  }
</style>
