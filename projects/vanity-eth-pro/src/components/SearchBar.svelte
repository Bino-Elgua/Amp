<script>
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();

  let searchQuery = '';
  let suggestions = [
    'where does @impact live',
    'show me the 1440 wallets',
    'Èjì Ogbe → Àṣẹ mint path',
    'tithe split code',
    'sabbath freeze logic',
  ];
  let showSuggestions = false;

  function handleSearch() {
    if (searchQuery.trim()) {
      dispatch('search', searchQuery);
      searchQuery = '';
      showSuggestions = false;
    }
  }

  function selectSuggestion(suggestion) {
    searchQuery = suggestion;
    handleSearch();
  }

  function handleKeydown(e) {
    if (e.key === 'Enter') {
      handleSearch();
    }
  }
</script>

<div class="space-y-4">
  <div class="relative">
    <div class="flex gap-2">
      <input
        type="text"
        placeholder="Ask the oracle... (Àṣẹ, opcodes, Odu names, English)"
        class="flex-1 bg-gray-900 border-2 border-gray-700 rounded px-4 py-3 text-white focus:outline-none focus:border-red-600 transition-colors"
        bind:value={searchQuery}
        on:focus={() => (showSuggestions = true)}
        on:keydown={handleKeydown}
      />
      <button
        class="bg-red-700 hover:bg-red-600 text-white px-6 py-3 rounded font-bold transition-colors"
        on:click={handleSearch}
      >
        ⚡ Ask
      </button>
    </div>

    {#if showSuggestions && searchQuery === ''}
      <div
        class="absolute top-full left-0 right-0 mt-2 bg-gray-900 border border-gray-700 rounded shadow-lg z-10"
      >
        <p class="text-xs text-gray-500 p-3 border-b border-gray-700">
          Examples that work instantly:
        </p>
        {#each suggestions as suggestion}
          <button
            class="w-full text-left px-4 py-2 hover:bg-gray-800 text-gray-300 hover:text-white text-sm transition-colors"
            on:click={() => selectSuggestion(suggestion)}
          >
            {suggestion}
          </button>
        {/each}
      </div>
    {/if}
  </div>

  <div class="flex gap-2 flex-wrap">
    {#each ['ashe', '1440-wallets', 'orishas', 'tithe', 'genesis', 'opcode'] as tag}
      <button
        class="text-xs bg-gray-900 border border-gray-700 text-gray-300 px-3 py-1 rounded hover:border-red-600 transition-colors"
        on:click={() => {
          searchQuery = tag;
          handleSearch();
        }}
      >
        #{tag}
      </button>
    {/each}
  </div>
</div>

<style>
  /* Smooth animations */
  input:focus {
    box-shadow: 0 0 10px rgba(220, 38, 38, 0.3);
  }
</style>
