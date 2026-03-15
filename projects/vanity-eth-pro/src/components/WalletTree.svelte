<script>
  let expandedWallet = null;

  const walletHierarchy = {
    name: 'Genesis Seed (BIPỌ̀N39)',
    balance: 100,
    description: 'From first physical handshake + Esu Merkle root',
    children: [
      {
        name: 'Council of 12 Lineages',
        balance: 0,
        description: '12 diaspora houses (each with rotating sign-off)',
        yieldAPY: 0,
        children: Array(12)
          .fill(0)
          .map((_, i) => ({
            name: `Lineage ${i + 1}`,
            balance: 0,
            yieldAPY: 0,
          })),
      },
      {
        name: '1440 Soul-Bound Inheritance',
        balance: 25,
        description: 'Misspelled ASHE tokens (Obatala\'s palm-wine flaw)',
        yieldAPY: 11.11,
        lockYears: 7,
        status: 'Locked for 7 years',
      },
    ],
  };

  function calculateYield(balance, apy, years) {
    return (balance * Math.pow(1 + apy / 100, years)).toFixed(2);
  }
</script>

<div class="space-y-6">
  <h2 class="text-2xl font-bold text-red-500">1440 Wallet Derivation Tree</h2>

  <div class="bg-gray-900 rounded p-6 border border-gray-700">
    <h3 class="font-bold text-white text-lg mb-2">{walletHierarchy.name}</h3>
    <p class="text-sm text-gray-400 mb-4">{walletHierarchy.description}</p>

    <div class="space-y-4">
      {#each walletHierarchy.children as branch}
        <div class="bg-gray-950 rounded p-4 border-l-4 border-red-600">
          <button
            class="w-full text-left"
            on:click={() =>
              (expandedWallet = expandedWallet === branch.name ? null : branch.name)}
          >
            <div class="flex items-center justify-between">
              <div>
                <h4 class="font-bold text-white">{branch.name}</h4>
                <p class="text-xs text-gray-500 mt-1">{branch.description}</p>
              </div>
              <div class="text-right">
                <p class="text-sm text-green-400 font-bold">{branch.balance}% allocation</p>
                {#if branch.yieldAPY}
                  <p class="text-xs text-orange-400">{branch.yieldAPY}% APY (fasting yield)</p>
                {/if}
                {#if branch.lockYears}
                  <p class="text-xs text-blue-400">🔒 {branch.lockYears}-year lock</p>
                {/if}
              </div>
            </div>
          </button>

          {#if expandedWallet === branch.name && branch.children}
            <div class="mt-4 ml-4 border-l border-gray-700 pl-4 space-y-2">
              {#each branch.children as wallet}
                <div class="text-sm">
                  <p class="text-gray-300 font-mono">{wallet.name}</p>
                  {#if wallet.yieldAPY}
                    <p class="text-xs text-green-400 mt-1">
                      7-year yield: {calculateYield(1, wallet.yieldAPY, 7)} (from 1 token)
                    </p>
                  {/if}
                </div>
              {/each}
              {#if branch.children.length > 12}
                <p class="text-xs text-gray-600">... and {branch.children.length - 12} more</p>
              {/if}
            </div>
          {/if}
        </div>
      {/each}
    </div>
  </div>

  <!-- The 7×7 Journey -->
  <div class="bg-gray-900 rounded p-6 border border-gray-700">
    <h3 class="font-bold text-white text-lg mb-4">The 7×7 Journey (Inheritance Path)</h3>
    <p class="text-sm text-gray-400 mb-6">Only way to inherit any of the 1440 tokens</p>

    <div class="space-y-3">
      {#each [
        { num: 1, title: 'Physical pilgrimage to one shrine', desc: 'Visit one of seven continental shrines' },
        { num: 2, title: '7-day fast + token lock', desc: 'At the shrine, lock tokens and fast' },
        { num: 3, title: 'Create something enduring', desc: 'Art, code, or plant something' },
        { num: 4, title: 'Teach one lesson', desc: 'Share wisdom publicly from your journey' },
        { num: 5, title: '7 days silence', desc: 'Complete solitude after pilgrimage' },
        { num: 6, title: 'Give away 7% Àṣẹ', desc: 'Tithe from earned tokens' },
        { num: 7, title: 'Lineage recitation', desc: 'Council + rotating sign-off' },
      ] as task}
        <div class="flex gap-3 p-3 bg-gray-950 rounded border-l-4 border-yellow-600">
          <div class="flex-shrink-0 text-lg font-bold text-yellow-500 w-6">{task.num}</div>
          <div>
            <p class="font-bold text-white">{task.title}</p>
            <p class="text-xs text-gray-400">{task.desc}</p>
          </div>
        </div>
      {/each}
    </div>
    <p class="text-xs text-gray-600 mt-4 italic">Year-long phases, seven tasks total</p>
  </div>
</div>
