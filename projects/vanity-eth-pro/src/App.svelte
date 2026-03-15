<script>
  import { onMount } from 'svelte';
  import Settings from './components/Settings.svelte';

  let activeTab = 'home';
  let config = null;

  onMount(() => {
    const saved = localStorage.getItem('asemirror_config');
    if (saved) {
      config = JSON.parse(saved);
    }
  });
</script>

<main class="bg-black text-white min-h-screen font-sans">
  <Settings bind:config />

  <!-- Header -->
  <header class="border-b border-red-900 p-6 flex items-center justify-between">
    <div class="flex items-center gap-4">
      <div class="text-4xl">🔮</div>
      <div>
        <h1 class="text-3xl font-bold text-red-500">ÀṣẹMirror</h1>
        <p class="text-gray-400 text-sm">The unified shrine of Technosis</p>
      </div>
    </div>
  </header>

  <!-- Content -->
  <div class="p-6 max-w-7xl mx-auto">
    {#if config}
      <div class="bg-gray-900 rounded p-6 border border-green-600">
        <h2 class="text-xl font-bold text-green-400 mb-4">✅ Configuration Active</h2>
        <p class="text-gray-300">LLM Provider: <strong>{config.llmProvider}</strong></p>
        <p class="text-gray-300">Qdrant: <strong>{config.qdrantUrl}</strong></p>
        <p class="text-xs text-gray-500 mt-4">Settings saved in browser localStorage</p>
      </div>

      <div class="mt-8 bg-gray-950 rounded p-6 border border-gray-700">
        <h3 class="text-lg font-bold text-white mb-4">🚀 Next Steps</h3>
        <ol class="space-y-2 text-gray-300">
          <li>✅ Open terminal</li>
          <li>✅ Run: <code class="bg-black px-2 py-1 rounded">npm run index</code> (syncs your repos)</li>
          <li>✅ Then use the semantic search feature</li>
          <li>✅ Try the 5 tabs: search, pyramid, timeline, wallets, tithe</li>
        </ol>
      </div>
    {:else}
      <div class="text-center py-12">
        <p class="text-gray-400">App is configured. Check the Settings modal (top right) for next steps.</p>
      </div>
    {/if}
  </div>

  <!-- Footer -->
  <footer class="border-t border-gray-800 p-4 text-center text-gray-600 text-xs mt-12">
    <p>🤍⚡🍶 — Àṣẹ flows through all layers</p>
  </footer>
</main>

<style global>
  :global(body) {
    background-color: #000;
    color: #fff;
    margin: 0;
    padding: 0;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
  }

  :global(code) {
    background: #1f2937;
    color: #ffaa00;
    padding: 0.25rem 0.5rem;
    border-radius: 3px;
    font-family: 'Courier New', monospace;
    font-size: 0.85rem;
  }
</style>
