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
    <a href="#/" class="nav-brand">IllusionSynth</a>
    <div class="nav-links">
      <a href="#/">Browse</a>
      <a href="#/about">About</a>
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
  }

  .nav-links a:hover {
    color: var(--text);
  }

  main {
    min-height: calc(100vh - 60px);
  }
</style>
