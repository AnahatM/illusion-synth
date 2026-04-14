<script lang="ts">
  import Router from 'svelte-spa-router';
  import Browse from './routes/Browse.svelte';
  import About from './routes/About.svelte';
  import ThemeToggle from './components/ThemeToggle.svelte';
  import EpilepsyWarning from './components/EpilepsyWarning.svelte';
  import { theme } from './lib/theme';

  const routes = {
    '/': Browse,
    '/about': About,
  };

  let currentTheme = $state<'dark' | 'light'>('dark');
  theme.subscribe((v) => (currentTheme = v));
</script>

<EpilepsyWarning />

<nav class="nav">
  <div class="nav-inner">
    <a href="#/" class="nav-brand">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
      </svg>
      IllusionSynth
    </a>
    <div class="nav-links">
      <a href="#/">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <rect x="3" y="3" width="7" height="7" rx="1"/>
          <rect x="14" y="3" width="7" height="7" rx="1"/>
          <rect x="3" y="14" width="7" height="7" rx="1"/>
          <rect x="14" y="14" width="7" height="7" rx="1"/>
        </svg>
        Browse
      </a>
      <a href="#/about">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"/>
          <line x1="12" y1="16" x2="12" y2="12"/>
          <line x1="12" y1="8" x2="12.01" y2="8"/>
        </svg>
        About
      </a>
      <ThemeToggle />
    </div>
  </div>
</nav>

<main>
  <Router {routes} />
</main>

<style>
  .nav {
    position: sticky;
    top: 0;
    z-index: 50;
    background: var(--bg);
    border-bottom: 1px solid var(--border);
    backdrop-filter: blur(10px);
  }

  .nav-inner {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0.75rem 1.5rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .nav-brand {
    font-size: 1.2rem;
    font-weight: 700;
    text-decoration: none;
    color: var(--text);
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .nav-links {
    display: flex;
    align-items: center;
    gap: 1.25rem;
  }

  .nav-links a {
    color: var(--text-secondary);
    text-decoration: none;
    font-size: 0.9rem;
    transition: color 0.2s;
    display: flex;
    align-items: center;
    gap: 0.35rem;
  }

  .nav-links a:hover {
    color: var(--text);
  }

  main {
    min-height: calc(100vh - 60px);
  }
</style>
