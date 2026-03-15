# Phase 4: OpenWebUI Integration

Add blockchain proof display to the OpenWebUI chat interface.

## Overview

The new `BlockchainProofDisplay.svelte` component displays:
- Consensus score with progress bar
- On-chain transaction links
- IPFS archive hashes
- Agent votes with confidence scores
- Agent influence network (synapses)
- Decision summary and recommendation

## Step 1: Add Component to OpenWebUI

Copy the component to your project:

```bash
cp BlockchainProofDisplay.svelte apps/openwebui/src/lib/
```

## Step 2: Integrate into Chat Interface

Edit `apps/openwebui/src/routes/+page.svelte` (or your chat component):

```svelte
<script>
  import BlockchainProofDisplay from '$lib/BlockchainProofDisplay.svelte';
  
  let deliberationResult = null;
  let useBlockchainMode = false;

  async function handleDeliberation(topic) {
    if (useBlockchainMode) {
      // Call blockchain endpoint
      const response = await fetch('/api/council/deliberate-blockchain', {
        method: 'POST',
        body: JSON.stringify({
          topic: topic,
          num_agents: 4,
          timeout: 30
        })
      });
      deliberationResult = await response.json();
    } else {
      // Call regular endpoint
      // ...
    }
  }
</script>

<div class="chat-container">
  <div class="input-area">
    <input 
      type="text" 
      placeholder="Enter deliberation topic..."
      on:keydown={(e) => {
        if (e.key === 'Enter') handleDeliberation(e.target.value);
      }}
    />
    <label class="blockchain-toggle">
      <input type="checkbox" bind:checked={useBlockchainMode} />
      🧠 Use Blockchain Mode
    </label>
    <button on:click={() => handleDeliberation(inputValue)}>
      {useBlockchainMode ? '⛓️ Deliberate' : '💬 Chat'}
    </button>
  </div>

  <!-- Display blockchain proofs if available -->
  {#if deliberationResult && useBlockchainMode}
    <BlockchainProofDisplay {deliberationResult} />
  {/if}
</div>

<style>
  .blockchain-toggle {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    cursor: pointer;
  }
</style>
```

## Step 3: Add Button to Council UI

Modify your council interface to add a "Blockchain Deliberation" button:

```svelte
<script>
  import BlockchainProofDisplay from '$lib/BlockchainProofDisplay.svelte';
  
  let isBlockchainMode = false;
  let deliberationResult = null;

  async function runBlockchainDeliberation() {
    const topic = document.querySelector('input[name="topic"]').value;
    
    const response = await fetch('/api/council/deliberate-blockchain', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        topic: topic,
        num_agents: 3,
        timeout: 30
      })
    });

    if (response.ok) {
      deliberationResult = await response.json();
      isBlockchainMode = true;
    }
  }
</script>

<div class="council-interface">
  <h2>🏛️ Council Deliberation</h2>
  
  <div class="input-group">
    <textarea 
      name="topic"
      placeholder="Enter topic for deliberation..."
    />
  </div>

  <div class="button-group">
    <button class="btn-regular" on:click={() => runDeliberation()}>
      💬 Regular Deliberation
    </button>
    <button class="btn-blockchain" on:click={runBlockchainDeliberation}>
      ⛓️ Blockchain Deliberation
    </button>
  </div>

  {#if deliberationResult && isBlockchainMode}
    <BlockchainProofDisplay {deliberationResult} />
  {/if}
</div>

<style>
  .council-interface {
    padding: 2rem;
    background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
    border-radius: 12px;
    color: #fff;
  }

  h2 {
    color: #00d4ff;
    margin-bottom: 1.5rem;
  }

  .input-group {
    margin-bottom: 1rem;
  }

  textarea {
    width: 100%;
    padding: 1rem;
    border: 1px solid #00d4ff;
    border-radius: 8px;
    background: rgba(0, 0, 0, 0.3);
    color: #fff;
    font-family: monospace;
    min-height: 80px;
  }

  .button-group {
    display: flex;
    gap: 1rem;
  }

  button {
    padding: 0.8rem 1.5rem;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-weight: bold;
    transition: all 0.3s;
  }

  .btn-regular {
    background: #666;
    color: #fff;
  }

  .btn-regular:hover {
    background: #777;
  }

  .btn-blockchain {
    background: #00d4ff;
    color: #000;
  }

  .btn-blockchain:hover {
    background: #00e8ff;
    transform: translateY(-2px);
    box-shadow: 0 8px 16px rgba(0, 212, 255, 0.3);
  }
</style>
```

## Step 4: Style the Theme

Update your global styles to match the blockchain theme:

```css
/* apps/openwebui/src/styles/theme.css */

:root {
  --color-primary: #00d4ff;
  --color-success: #00d400;
  --color-error: #ff006e;
  --color-bg-dark: #1a1a2e;
  --color-bg-darker: #16213e;
  --color-text-light: #ccc;
  --color-text-muted: #888;
}

/* Blockchain-themed components */
.blockchain-component {
  background: linear-gradient(135deg, var(--color-bg-dark) 0%, var(--color-bg-darker) 100%);
  border: 2px solid var(--color-primary);
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 212, 255, 0.1);
}
```

## Step 5: Test the UI

1. Start OpenWebUI:
```bash
cd apps/openwebui
npm run dev
```

2. Navigate to the council interface

3. Click "⛓️ Blockchain Deliberation"

4. Enter a topic and submit

5. Wait for results (should show within 30 seconds)

6. You should see:
   - Consensus score with progress bar
   - On-chain proof with link to explorer
   - IPFS archives with links
   - Agent votes with confidence
   - Synapses visualization
   - Summary and recommendation

## Step 6: Testing Scenarios

### Test 1: Basic Deliberation
**Topic:** "Should we implement blockchain consensus?"
**Expected:** 70-80% consensus, all agents participating

### Test 2: Contentious Topic
**Topic:** "Should we ban all AI systems?"
**Expected:** Lower consensus (40-60%), mixed votes

### Test 3: Technical Topic
**Topic:** "Is Solidity the best smart contract language?"
**Expected:** High consensus among technical agents

## Step 7: Accessibility Features

The component includes:
- 🎨 High contrast colors for visibility
- ♿ Semantic HTML for screen readers
- ⌨️ Keyboard navigation support
- 📱 Responsive design for mobile

## Step 8: Performance Optimization

For large deliberations with many agents:

```svelte
<script>
  // Lazy load agent votes
  let showAllVotes = false;
  
  $: displayedVotes = showAllVotes 
    ? deliberationResult.votes 
    : deliberationResult.votes?.slice(0, 3);
</script>

{#if displayedVotes?.length > 3 && !showAllVotes}
  <button on:click={() => showAllVotes = true}>
    Show {deliberationResult.votes.length - 3} more votes...
  </button>
{/if}
```

## Troubleshooting

| Problem | Solution |
|---------|----------|
| Component not rendering | Check import path in main component |
| Styling not applied | Verify Svelte preprocessor settings |
| API call fails | Check `/api/council/deliberate-blockchain` endpoint |
| No blockchain proof | Verify contract deployed (Phase 2) |
| IPFS links broken | Start IPFS daemon or check gateway |

## Next: Phase 1 (Testing)

Now all UI is in place. Move to Phase 1 to test everything end-to-end locally.

Deliverables:
- ✅ Blockchain proof display component
- ✅ Integration with council interface
- ✅ Styling and theming
- ✅ Responsive design
- ✅ Accessibility features
