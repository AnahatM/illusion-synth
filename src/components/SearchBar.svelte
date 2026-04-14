<script lang="ts">
  interface Props {
    query: string;
    categories: string[];
    selectedCategory: string;
    onQueryChange: (q: string) => void;
    onCategoryChange: (c: string) => void;
  }

  let { query, categories, selectedCategory, onQueryChange, onCategoryChange }: Props = $props();
</script>

<div class="search-bar">
  <input
    type="text"
    placeholder="Search illusions..."
    value={query}
    oninput={(e) => onQueryChange((e.target as HTMLInputElement).value)}
  />
  <div class="chips">
    <button
      class="chip"
      class:active={selectedCategory === ''}
      onclick={() => onCategoryChange('')}
    >All</button>
    {#each categories as cat}
      <button
        class="chip"
        class:active={selectedCategory === cat}
        onclick={() => onCategoryChange(cat)}
      >{cat}</button>
    {/each}
  </div>
</div>

<style>
  .search-bar {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    margin-bottom: 1.5rem;
  }

  input {
    width: 100%;
    padding: 0.6rem 1rem;
    border: 1px solid var(--border);
    border-radius: 8px;
    background: var(--surface);
    color: var(--text);
    font-size: 1rem;
    outline: none;
    transition: border-color 0.2s;
    box-sizing: border-box;
  }

  input:focus {
    border-color: var(--accent);
  }

  .chips {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  .chip {
    padding: 0.3rem 0.75rem;
    border: 1px solid var(--border);
    border-radius: 999px;
    background: var(--surface);
    color: var(--text-secondary);
    font-size: 0.8rem;
    cursor: pointer;
    transition: all 0.2s;
  }

  .chip:hover {
    background: var(--surface-hover);
  }

  .chip.active {
    background: var(--accent);
    color: #fff;
    border-color: var(--accent);
  }
</style>
