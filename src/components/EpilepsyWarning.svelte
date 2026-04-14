<script lang="ts">
  const DISMISS_KEY = 'illusionsynth-epilepsy-dismissed';

  let dismissed = $state(
    typeof localStorage !== 'undefined' && localStorage.getItem(DISMISS_KEY) === 'true'
  );

  function dismiss() {
    dismissed = true;
    localStorage.setItem(DISMISS_KEY, 'true');
  }
</script>

{#if !dismissed}
  <div class="overlay">
    <div class="modal">
      <h2>⚠ Photosensitivity Warning</h2>
      <p>
        IllusionSynth contains <strong>rapidly flashing, strobing, and rotating visual patterns</strong>
        that may cause discomfort or trigger seizures in people with photosensitive epilepsy.
      </p>
      <p>
        If you or someone you know has epilepsy or a seizure disorder, please exercise caution
        or consult a medical professional before viewing.
      </p>
      <button onclick={dismiss}>I Understand — Continue</button>
    </div>
  </div>
{/if}

<style>
  .overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.85);
    z-index: 9999;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1rem;
  }

  .modal {
    background: var(--bg, #000000);
    color: var(--text, #eee);
    border: 1px solid var(--border, #333);
    border-radius: 0;
    padding: 2rem;
    max-width: 480px;
    text-align: center;
  }

  h2 {
    margin: 0 0 1rem;
    font-size: 1.3rem;
  }

  p {
    font-size: 0.95rem;
    line-height: 1.5;
    margin: 0 0 1rem;
    opacity: 0.9;
  }

  button {
    background: var(--accent, #ffffff);
    color: #000;
    border: none;
    border-radius: 0;
    padding: 0.75rem 1.5rem;
    font-size: 1rem;
    cursor: pointer;
    transition: opacity 0.2s;
  }

  button:hover {
    opacity: 0.85;
  }
</style>
