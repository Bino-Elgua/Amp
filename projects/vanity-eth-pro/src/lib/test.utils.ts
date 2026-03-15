/**
 * Test utilities for ÀṣẹMirror
 */

export function mockLLMResponse(query: string): string {
  const responses: Record<string, string> = {
    '@impact': 'The @impact decorator is defined in src/compiler.ts at line 145. It marks functions that contribute to ecosystem value.',
    'tithe': 'Tithe routing: 50% Treasury, 25% Inheritance, 15% Council, 10% Burn. Implemented in src/vm/shrine.move.',
    '1440': 'The 1440 soul-bound wallets are derived from BIPỌ̀N39 seed. See wallet-derivation.jl for implementation.',
    'sabbath': 'Sabbath enforcement blocks all transactions Saturday 00:00-23:59 UTC. Check src/vm/sabbath.rs.',
  };

  for (const [key, value] of Object.entries(responses)) {
    if (query.toLowerCase().includes(key.toLowerCase())) {
      return value;
    }
  }

  return `I found information about "${query}" in your repositories. Here are the top matches...`;
}

export function mockTimelineData() {
  return {
    genesisDate: new Date('2025-01-01'),
    daysElapsed: 5,
    daysTotal: 2555,
    percentComplete: 0.19,
    phases: [
      { name: 'Phase 1: Genesis', days: 90, color: '#ff0000', progress: 5 },
      { name: 'Phase 2: Handshake', days: 90, color: '#ff5500', progress: 0 },
      { name: 'Phase 3: Entropy', days: 90, color: '#ffaa00', progress: 0 },
      { name: 'Phase 4: VM', days: 90, color: '#ffff00', progress: 0 },
      { name: 'Phase 5: Shrine', days: 90, color: '#00ff00', progress: 0 },
      { name: 'Phase 6: Council', days: 90, color: '#0000ff', progress: 0 },
      { name: 'Phase 7: Journey', days: 1825, color: '#ff00ff', progress: 0 },
    ],
    priorityItems: [
      { order: 1, title: 'Add @genesisFlawToken to compiler', status: 'in-progress' },
      { order: 2, title: 'Implement wallet derivation (Go FFI)', status: 'in-progress' },
      { order: 3, title: 'Tithe split routing logic (Go FFI)', status: 'todo' },
    ],
  };
}

export function mockVisualization(type: string) {
  const visualizations: Record<string, any> = {
    '7-layer': {
      type: 'pyramid',
      layers: [
        { name: 'Physical Genesis', color: '#8b0000' },
        { name: 'Oso-lang Compiler', color: '#ff0000' },
        { name: 'Entropy Oracle', color: '#ff6666' },
        { name: 'Witness Mesh', color: '#ffaa00' },
        { name: 'Techgnosis VM', color: '#ffff00' },
        { name: 'AIO / SimaaS', color: '#00ff00' },
        { name: 'Shrine Economy', color: '#0000ff' },
      ],
    },
    '1440-wallets': {
      type: 'tree',
      root: 'Genesis Seed (BIPỌ̀N39)',
      balance: 100,
      children: [
        { name: 'Council of 12', wallets: 12, yieldAPY: 0 },
        { name: '1440 Soul-Bound', wallets: 1440, yieldAPY: 11.11, lockYears: 7 },
      ],
    },
    'tithe-flow': {
      type: 'flow',
      total: 100,
      splits: [
        { name: 'Treasury', percent: 50, color: '#ffaa00' },
        { name: 'Inheritance', percent: 25, color: '#00ff00' },
        { name: 'Council', percent: 15, color: '#0000ff' },
        { name: 'Burn Void', percent: 10, color: '#8b0000' },
      ],
    },
  };

  return visualizations[type] || visualizations['7-layer'];
}
