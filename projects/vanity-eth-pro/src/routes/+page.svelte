<script>
  import { onMount } from 'svelte';
  import SearchBar from '../components/SearchBar.svelte';
  import Pyramid from '../components/Pyramid.svelte';
  import Timeline from '../components/Timeline.svelte';
  import WalletTree from '../components/WalletTree.svelte';
  import TitheFlow from '../components/TitheFlow.svelte';
  import Settings from '../components/Settings.svelte';

  let activeTab = 'search'; // search | pyramid | timeline | wallets | tithe
  let searchResults = [];
  let timelineData = null;
  let isLoading = false;
  let config = null;

  $: isConfigured = config?.apiKey ? true : false;

  onMount(async () => {
    // Load config from localStorage
    const saved = localStorage.getItem('asemirror_config');
    if (saved) {
      config = JSON.parse(saved);
    }
    // Load timeline on mount
    await loadTimeline();
  });

  async function handleSearch(query) {
    isLoading = true;
    const response = await fetch('/api/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'search', query }),
    });
    const data = await response.json();
    searchResults = data.data?.sources || [];
    isLoading = false;
  }

  async function loadTimeline() {
    const response = await fetch('/api/timeline', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'timeline' }),
    });
    const data = await response.json();
    timelineData = data.data;
  }
</script>

<main class="bg-black text-white min-h-screen font-sans">
  <!-- Settings Modal (shows if not configured) -->
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
    <div class="text-right text-xs text-gray-500">
      <p>Genesis: 2025-01-01</p>
      <p>Day {timelineData?.daysElapsed || 0} / {timelineData?.daysTotal || 2555}</p>
    </div>
  </header>

  <!-- Tab Navigation -->
  <nav class="bg-gray-950 border-b border-gray-800 flex gap-1 p-2">
    {#each [
      { id: 'search', label: '🔍 Search', icon: '⚡' },
      { id: 'pyramid', label: '🔺 7-Layer', icon: '🏛️' },
      { id: 'timeline', label: '📅 Timeline', icon: '⏳' },
      { id: 'wallets', label: '💰 1440', icon: '🌙' },
      { id: 'tithe', label: '💸 Tithe', icon: '📊' },
    ] as tab}
      <button
        class="px-4 py-2 rounded text-sm font-bold transition-all {activeTab === tab.id
          ? 'bg-red-700 text-white'
          : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}"
        on:click={() => (activeTab = tab.id)}
      >
        {tab.icon} {tab.label}
      </button>
    {/each}
  </nav>

  <!-- Content Area -->
  <div class="p-6 max-w-7xl mx-auto">
    {#if activeTab === 'search'}
      <div class="space-y-6">
        <SearchBar on:search={(e) => handleSearch(e.detail)} />
        {#if isLoading}
          <div class="text-center text-gray-400">Querying the oracle...</div>
        {:else if searchResults.length > 0}
          <div class="space-y-4">
            {#each searchResults as result}
              <div
                class="bg-gray-900 border-l-4 border-red-600 p-4 rounded hover:bg-gray-800 cursor-pointer"
              >
                <p class="text-sm text-gray-400">{result.repo}</p>
                <p class="text-white font-mono text-xs">{result.file}</p>
                <div class="mt-2 flex gap-2">
                  <span class="text-xs bg-red-900 text-red-200 px-2 py-1 rounded">
                    Relevance: {(result.relevance * 100).toFixed(0)}%
                  </span>
                </div>
              </div>
            {/each}
          </div>
        {/if}
      </div>
    {:else if activeTab === 'pyramid'}
      <Pyramid />
    {:else if activeTab === 'timeline'}
      {#if timelineData}
        <Timeline data={timelineData} />
      {/if}
    {:else if activeTab === 'wallets'}
      <WalletTree />
    {:else if activeTab === 'tithe'}
      <TitheFlow />
    {/if}
  </div>

  <!-- Footer -->
  <footer class="border-t border-gray-800 p-4 text-center text-gray-600 text-xs mt-12">
    <p>🤍⚡🍶 — Àṣẹ flows through all layers</p>
  </footer>
</main>

<style>
  :global(body) {
    background-color: #000;
    color: #fff;
    margin: 0;
    padding: 0;
  }
</style>
