<script lang="ts">
  import { illusions } from '../illusions/registry';
  import { generateThumbnail } from '../lib/thumbnail-cache';

  let status = $state('starting');
  let done = $state(0);
  let total = $state(illusions.length);

  async function run() {
    const results: Record<string, string> = {};
    for (const illusion of illusions) {
      status = illusion.id;
      try {
        results[illusion.id] = await generateThumbnail(illusion);
      } catch (e) {
        console.error('[capture] failed:', illusion.id, e);
      }
      done++;
    }
    // Expose results on window for Playwright to read
    (window as any).__captureResults = results;
    status = 'done';
  }

  run();
</script>

<div style="font-family:monospace;padding:1rem">
  <p>Capturing thumbnails… {done}/{total}</p>
  <p>Current: {status}</p>
</div>
