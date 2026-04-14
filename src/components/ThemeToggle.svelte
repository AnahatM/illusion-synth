<script lang="ts">
  import { toggleTheme, theme } from '../lib/theme';

  let current = $state<'dark' | 'light'>('dark');
  theme.subscribe((v) => (current = v));
</script>

<button class="theme-toggle" onclick={toggleTheme} title="Toggle theme">
  {current === 'dark' ? '☀' : '🌙'}
</button>

<style>
  .theme-toggle {
    background: var(--surface);
    color: var(--text);
    border: 1px solid var(--border);
    border-radius: 8px;
    width: 2.5rem;
    height: 2.5rem;
    font-size: 1.2rem;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background 0.2s;
  }

  .theme-toggle:hover {
    background: var(--surface-hover);
  }
</style>
