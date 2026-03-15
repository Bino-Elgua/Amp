<script>
  let expandedSection = null;

  const titheBreakdown = [
    {
      id: 'treasury',
      label: 'Treasury',
      percent: 50,
      color: '#ffaa00',
      description: 'Funds physical shrines & robots',
      details: [
        'Shrine construction + maintenance',
        'Robot deployment for witness mesh',
        'Infrastructure (BLE + LoRa beacons)',
      ],
    },
    {
      id: 'inheritance',
      label: '1440 Inheritance Vaults',
      percent: 25,
      color: '#00ff00',
      description: 'Perpetual fasting yield (11.11% APY)',
      details: [
        'Soul-bound wallets locked 7 years',
        'Compound yield automatically accrues',
        'Only inheritable via 7×7 Journey',
      ],
    },
    {
      id: 'council',
      label: 'Council + Entropy Pool',
      percent: 15,
      color: '#0000ff',
      description: 'Rotating council + governance',
      details: [
        'Council of 12 lineages governance',
        'Entropy pool for VM randomness',
        'DAO treasury for strategic decisions',
      ],
    },
    {
      id: 'burn',
      label: 'Burn Void',
      percent: 10,
      color: '#8b0000',
      description: 'Blood sacrifice (permanent removal)',
      details: [
        'Tokens burned forever',
        'Increases scarcity of remaining supply',
        'Ritual de-inflation mechanism',
      ],
    },
  ];
</script>

<div class="space-y-8">
  <h2 class="text-2xl font-bold text-red-500">Tithe Flow (100% Allocation)</h2>

  <!-- Pie/Flow Chart -->
  <div class="grid md:grid-cols-2 gap-6">
    <!-- Visual Flow -->
    <div class="bg-gray-900 rounded p-6 flex items-center justify-center">
      <svg viewBox="0 0 200 200" class="w-full max-w-xs">
        <!-- Treasury (50%) - 0 to 180 degrees -->
        <path
          d="M 100,100 L 100,20 A 80,80 0 0,1 180,100 Z"
          fill="#ffaa00"
          opacity="0.7"
          stroke="#ffaa00"
          stroke-width="2"
        />
        <!-- Inheritance (25%) - 180 to 270 degrees -->
        <path
          d="M 100,100 L 180,100 A 80,80 0 0,1 20,100 Z"
          fill="#00ff00"
          opacity="0.7"
          stroke="#00ff00"
          stroke-width="2"
        />
        <!-- Council (15%) - 270 to 297 degrees -->
        <path
          d="M 100,100 L 20,100 A 80,80 0 0,1 34,39 Z"
          fill="#0000ff"
          opacity="0.7"
          stroke="#0000ff"
          stroke-width="2"
        />
        <!-- Burn (10%) - remaining -->
        <path
          d="M 100,100 L 34,39 A 80,80 0 0,1 100,20 Z"
          fill="#8b0000"
          opacity="0.7"
          stroke="#8b0000"
          stroke-width="2"
        />

        <text x="100" y="100" text-anchor="middle" dy="0.3em" class="text-white font-bold" fill="white" font-size="20">
          100%
        </text>
      </svg>
    </div>

    <!-- Details -->
    <div class="space-y-2">
      {#each titheBreakdown as item}
        <div
          class="bg-gray-950 rounded p-3 border-l-4 cursor-pointer hover:bg-gray-900 transition-colors"
          style="border-left-color: {item.color}"
          on:click={() =>
            (expandedSection = expandedSection === item.id ? null : item.id)}
        >
          <div class="flex items-center justify-between">
            <div>
              <p class="font-bold text-white">{item.label}</p>
              <p class="text-xs text-gray-400">{item.description}</p>
            </div>
            <div
              class="text-2xl font-bold"
              style="color: {item.color}"
            >
              {item.percent}%
            </div>
          </div>

          {#if expandedSection === item.id}
            <div class="mt-3 ml-0 pl-3 border-l-2 border-gray-700 py-2">
              <ul class="space-y-1 text-xs text-gray-300">
                {#each item.details as detail}
                  <li>→ {detail}</li>
                {/each}
              </ul>
            </div>
          {/if}
        </div>
      {/each}
    </div>
  </div>

  <!-- Effective Rate (3.69%) -->
  <div class="bg-gray-900 rounded p-6 border border-gray-700">
    <h3 class="font-bold text-white mb-3">Effective Tithe Rate: 3.69%</h3>
    <p class="text-sm text-gray-400 mb-4">
      Applied to every transaction on the Shrine Economy layer. Routed automatically as shown above.
    </p>
    <div class="bg-gray-950 rounded p-4 font-mono text-xs text-gray-300">
      <p>50% → Treasury (shrines + robots)</p>
      <p>25% → 1440 Inheritance (11.11% APY)</p>
      <p>15% → Council (governance + entropy)</p>
      <p>10% → Burn Void (deflationary)</p>
      <p class="text-gray-600 mt-2">Total: 100% of every 3.69% tithe</p>
    </div>
  </div>

  <!-- Example Transaction -->
  <div class="bg-gray-900 rounded p-6 border border-gray-700">
    <h3 class="font-bold text-white mb-4">Example: 100 Àṣẹ Transaction</h3>
    <div class="space-y-2 text-sm">
      <div class="flex justify-between">
        <span class="text-gray-400">Transaction amount:</span>
        <span class="text-white font-bold">100 Àṣẹ</span>
      </div>
      <div class="flex justify-between">
        <span class="text-gray-400">Tithe (3.69%):</span>
        <span class="text-orange-400 font-bold">3.69 Àṣẹ</span>
      </div>
      <div class="border-t border-gray-700 pt-2 mt-2 space-y-2">
        <div class="flex justify-between text-xs">
          <span class="text-gray-500">→ Treasury (50%):</span>
          <span class="text-yellow-600">1.845 Àṣẹ</span>
        </div>
        <div class="flex justify-between text-xs">
          <span class="text-gray-500">→ Inheritance (25%):</span>
          <span class="text-green-500">0.9225 Àṣẹ</span>
        </div>
        <div class="flex justify-between text-xs">
          <span class="text-gray-500">→ Council (15%):</span>
          <span class="text-blue-500">0.5535 Àṣẹ</span>
        </div>
        <div class="flex justify-between text-xs">
          <span class="text-gray-500">→ Burn Void (10%):</span>
          <span class="text-red-700">0.369 Àṣẹ</span>
        </div>
      </div>
      <div class="flex justify-between border-t border-gray-700 pt-2 mt-2">
        <span class="text-gray-400">Recipient receives:</span>
        <span class="text-white font-bold">96.31 Àṣẹ</span>
      </div>
    </div>
  </div>
</div>
