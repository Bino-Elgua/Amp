<script>
  let selectedLayer = null;

  const layers = [
    {
      id: 1,
      name: 'Physical Genesis',
      tech: 'First real handshake + Esu Merkle root',
      role: 'Birth moment of the entire chain',
      color: '#8b0000',
    },
    {
      id: 2,
      name: 'Oso-lang Compiler',
      tech: 'Julia → VM bytecode',
      role: '@guardian, @tithe(0.0369), @impact',
      color: '#cc0000',
    },
    {
      id: 3,
      name: 'Entropy Oracle',
      tech: 'ifascript (256 Odù → cowrie casts)',
      role: 'Randomness + divination',
      color: '#ff3333',
    },
    {
      id: 4,
      name: 'Witness Mesh',
      tech: 'BLE + LoRa (ESP32 / Heltec beacons)',
      role: 'Proof-of-Presence handshakes',
      color: '#ffaa00',
    },
    {
      id: 5,
      name: 'Techgnosis VM',
      tech: 'Go core + 160 opcodes',
      role: 'Orisha primitives',
      color: '#ffff00',
    },
    {
      id: 6,
      name: 'AIO / SimaaS',
      tech: 'Julia + VeilSim',
      role: 'Ethical simulation, impact scoring',
      color: '#00ff00',
    },
    {
      id: 7,
      name: 'Shrine Economy',
      tech: 'Move + .tech DSL',
      role: '1440 vaults, burns, fasting yields',
      color: '#0000ff',
    },
  ];
</script>

<div class="space-y-8">
  <h2 class="text-2xl font-bold text-red-500">The Seven-Layer Stack</h2>

  <!-- SVG Pyramid -->
  <svg viewBox="0 0 400 500" class="w-full max-w-2xl mx-auto">
    <!-- Layer 7 (bottom) -->
    <polygon points="50,450 350,450 380,350 20,350" fill="#0000ff" opacity="0.4" />
    <text x="200" y="405" text-anchor="middle" class="text-white text-lg font-bold" fill="white">
      Shrine Economy
    </text>

    <!-- Layer 6 -->
    <polygon points="60,340 340,340 370,240 30,240" fill="#00ff00" opacity="0.4" />
    <text x="200" y="295" text-anchor="middle" class="text-white text-lg font-bold" fill="white">
      AIO / SimaaS
    </text>

    <!-- Layer 5 -->
    <polygon points="80,230 320,230 350,130 50,130" fill="#ffff00" opacity="0.4" />
    <text x="200" y="185" text-anchor="middle" class="text-gray-900 text-lg font-bold" fill="#000">
      Techgnosis VM
    </text>

    <!-- Layer 4 -->
    <polygon points="100,120 300,120 330,20 70,20" fill="#ffaa00" opacity="0.4" />
    <text x="200" y="75" text-anchor="middle" class="text-gray-900 text-lg font-bold" fill="#000">
      Witness Mesh
    </text>

    <!-- Top layers would go here -->
  </svg>

  <!-- Detailed Layer List -->
  <div class="space-y-3">
    {#each layers as layer}
      <button
        class="w-full text-left p-4 rounded border-l-4 transition-all {selectedLayer === layer.id
          ? 'bg-gray-900 border-l-4'
          : 'bg-gray-950 border-gray-700 hover:bg-gray-900'}"
        style="border-left-color: {layer.color}"
        on:click={() => (selectedLayer = selectedLayer === layer.id ? null : layer.id)}
      >
        <div class="flex items-center gap-3">
          <div class="text-2xl font-bold text-gray-600">{layer.id}</div>
          <div class="flex-1">
            <h3 class="font-bold text-white">{layer.name}</h3>
            <p class="text-sm text-gray-400">{layer.tech}</p>
          </div>
          <div class="text-2xl">{selectedLayer === layer.id ? '▼' : '▶'}</div>
        </div>

        {#if selectedLayer === layer.id}
          <div class="mt-3 ml-0 pl-8 border-l border-gray-700 py-2">
            <p class="text-sm text-gray-300">
              <strong>Sacred Role:</strong> {layer.role}
            </p>
            <div class="mt-2 space-y-1 text-xs text-gray-500">
              <p>→ Mints value from previous layer</p>
              <p>→ Feeds entropy to next layer</p>
            </div>
          </div>
        {/if}
      </button>
    {/each}
  </div>

  <!-- Data Flow -->
  <div class="bg-gray-900 border border-gray-700 rounded p-4 mt-6">
    <h3 class="font-bold text-white mb-3">Data Flow (Circular)</h3>
    <p class="text-sm text-gray-300 font-mono">
      ifascript → entropy → oso-lang → IR → handshake VM → Techgnosis opcodes → L0 mint → 1440
      wallets → tithe → back to ifascript
    </p>
  </div>
</div>

<style>
  svg {
    filter: drop-shadow(0 0 20px rgba(220, 38, 38, 0.2));
  }
</style>
