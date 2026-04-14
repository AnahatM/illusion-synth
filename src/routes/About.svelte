<script lang="ts">
</script>

<div class="about">
  <h1>About IllusionSynth</h1>

  <section>
    <h2>What is IllusionSynth?</h2>
    <p>
      IllusionSynth is an interactive optical illusion generator that renders mesmerizing visual
      patterns in real-time using WebGL. Browse a curated collection of illusions — from hypnotic
      spirals and moiré patterns to impossible shapes and infinite tunnels — and customize them
      with intuitive controls.
    </p>
  </section>

  <section>
    <h2>Features</h2>
    <ul>
      <li><strong>Real-time rendering</strong> — All illusions are GPU-accelerated via WebGL shaders</li>
      <li><strong>Customizable parameters</strong> — Adjust speed, colors, scale, direction, and more</li>
      <li><strong>Fullscreen mode</strong> — Immerse yourself in the visual experience</li>
      <li><strong>Shareable links</strong> — Share your custom illusion settings via URL</li>
      <li><strong>Dark &amp; light themes</strong> — Switch to match your preference</li>
      <li><strong>Responsive design</strong> — Works on desktop and mobile</li>
    </ul>
  </section>

  <section>
    <h2>Illusion Categories</h2>
    <ul>
      <li><strong>Spirals</strong> — Rotating and pulsing spiral patterns</li>
      <li><strong>Moiré</strong> — Overlapping patterns creating interference effects</li>
      <li><strong>Color</strong> — Afterimage and color drift illusions</li>
      <li><strong>Op-Art</strong> — Geometric patterns that appear to move</li>
      <li><strong>Motion</strong> — Static patterns with apparent motion</li>
      <li><strong>Tunnel</strong> — Depth and vortex effects</li>
      <li><strong>Impossible</strong> — Paradoxical 3D geometry</li>
    </ul>
  </section>

  <section>
    <h2>Developer</h2>
    <p>
      Built by <strong>Anahat Mudgal</strong>.
    </p>
    <div class="links">
      <a href="https://AnahatMudgal.com" target="_blank" rel="noopener">AnahatMudgal.com</a>
      <a href="https://github.com/AnahatM" target="_blank" rel="noopener">GitHub</a>
    </div>
  </section>

  <section>
    <h2>Tech Stack</h2>
    <p>
      Svelte 5 &bull; Vite &bull; Three.js &bull; GLSL Shaders &bull; TypeScript
    </p>
  </section>
</div>

<style>
  .about {
    max-width: 720px;
    margin: 0 auto;
    padding: 2rem 1.5rem;
  }

  h1 {
    font-size: 2rem;
    margin-bottom: 2rem;
    background: linear-gradient(135deg, #00ff41, #00cc33);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  section {
    margin-bottom: 2rem;
  }

  h2 {
    font-size: 1.2rem;
    margin: 0 0 0.75rem;
    color: var(--text);
  }

  p, li {
    color: var(--text-secondary);
    line-height: 1.6;
  }

  ul {
    padding-left: 1.5rem;
  }

  li {
    margin-bottom: 0.4rem;
  }

  .links {
    display: flex;
    gap: 1.5rem;
    margin-top: 0.75rem;
  }

  .links a {
    color: var(--accent);
    text-decoration: none;
    font-weight: 500;
  }

  .links a:hover {
    text-decoration: underline;
  }
</style>
