# Quick Start: Blockchain Integration

## 🚀 TL;DR - Get Running in 5 Minutes

### Step 1: Install Dependencies
```bash
cd services/neural-brain
pip install -r requirements.txt

cd ../council
pip install -r requirements.txt
cd ../..
```

### Step 2: Run Tests
```bash
chmod +x run-tests.sh
./run-tests.sh
```

### Step 3: Start Council Service
```bash
cd services/council
python3 main.py
```

You should see:
```
🏛️  AICouncil Service starting...
✅ Blockchain integration loaded
Listening on: http://0.0.0.0:8000
```

### Step 4: Test an Endpoint
```bash
curl http://localhost:8000/api/council/blockchain/status
```

Response:
```json
{
  "status": "ready",
  "blockchain_chain": "sui",
  "contract_address": "not_configured",
  "arweave_enabled": false,
  "consensus_rounds": 0,
  "endpoints": {
    "deliberate": "/api/council/deliberate-blockchain",
    "history": "/api/council/blockchain/history",
    "agent-state": "/api/council/blockchain/agent-state/{agent_id}"
  }
}
```

## 📋 What Was Changed

| Component | Status | What Changed |
|-----------|--------|-------------|
| Council Service | ✅ Ready | Added blockchain routes |
| Blockchain Core | ✅ Fixed | Fixed contract_id check |
| UI Component | ✅ Ready | (No changes needed) |
| Dependencies | ✅ Updated | Added pydantic to council |
| Tests | ✅ Fixed | Fixed assertion in test |

## 🔗 New Endpoints

```
POST /api/council/deliberate-blockchain
  Run blockchain-backed deliberation
  
GET /api/council/blockchain/status
  Check blockchain integration status
  
GET /api/council/blockchain/history
  Get all past deliberations
  
GET /api/council/blockchain/agent-state/{agent_id}
  Get specific agent's neural state
```

## 📝 Example: Run a Deliberation

```bash
curl -X POST http://localhost:8000/api/council/deliberate-blockchain \
  -H "Content-Type: application/json" \
  -d '{
    "topic": "Should we implement blockchain-based AI consensus?",
    "num_agents": 3,
    "timeout": 30
  }'
```

Response:
```json
{
  "topic": "Should we implement blockchain-based AI consensus?",
  "consensus_score": 0.75,
  "consensus_reached": true,
  "votes": [
    {
      "agent_id": "logical_analyzer",
      "position": "agree",
      "confidence": 0.85,
      "reasoning": "[Agent reasoning here]",
      "arweave_hash": null
    }
  ],
  "chairman_summary": "Council reached 75% consensus...",
  "recommendation": "Proceed with proposal",
  "round_id": 1,
  "on_chain_proof": "Sui_tx_1_75",
  "arweave_proofs": null,
  "synapses": {
    "logical_analyzer->pragmatist": 0.56,
    "logical_analyzer->devils_advocate": 0.62,
    "pragmatist->logical_analyzer": 0.54,
    "pragmatist->devils_advocate": 0.58,
    "devils_advocate->logical_analyzer": 0.60,
    "devils_advocate->pragmatist": 0.52
  },
  "timestamp": "2024-12-16T10:30:45.123456"
}
```

## 🎨 UI Integration Example

In your chat component:

```svelte
<script>
  import BlockchainProofDisplay from '$lib/BlockchainProofDisplay.svelte';
  
  let result = null;
  
  async function runBlockchainDeliberation() {
    const response = await fetch('/api/council/deliberate-blockchain', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        topic: "Some question",
        num_agents: 3,
        timeout: 30
      })
    });
    result = await response.json();
  }
</script>

<button on:click={runBlockchainDeliberation}>
  ⛓️ Blockchain Deliberation
</button>

{#if result}
  <BlockchainProofDisplay deliberationResult={result} />
{/if}
```

## ⚙️ Configuration

### Required `.env` vars:
```bash
COUNCIL_PORT=8000
COUNCIL_DEBUG=true
BLOCKCHAIN_CHAIN=sui
CONSENSUS_THRESHOLD=0.5
```

### Optional (after Phase 2 deployment):
```bash
SUI_RPC_URL=https://fullnode.testnet.sui.io:443
NEURAL_BRAIN_PACKAGE_ID=0x...
AGENT_REGISTRY_ID=0x...
ROUND_COUNTER_ID=0x...
ARWEAVE_WALLET_PATH=/path/to/wallet.json
```

## 🧪 Run Tests

**Automated:**
```bash
./run-tests.sh
```

**Manual:**
```bash
cd services/neural-brain
python3 test_blockchain_integration.py
```

Tests included:
- ✅ Basic deliberation
- ✅ Synapse formation
- ✅ Consensus history
- ✅ Agent neural state
- ✅ Confidence estimation
- ✅ Consensus round creation
- ✅ Full workflow

## 🔄 Architecture

```
Frontend (BlockchainProofDisplay.svelte)
    ↓
API Endpoint (/api/council/deliberate-blockchain)
    ↓
Council Service (main.py)
    ↓
BlockchainNeuralBrain (blockchain_core.py)
    ├→ Agent Reasoning (parallel async)
    ├→ Synapse Formation (influence calc)
    ├→ Consensus Scoring
    ├→ Blockchain Recording (Sui RPC)
    └→ Arweave Archival (optional)
```

## 📚 Full Documentation

- **Phase Overview**: `START_HERE_PHASES_2_3_4_1.md`
- **Phase 3 Details**: `PHASE_3_INTEGRATION.md`
- **Phase 4 Details**: `PHASE_4_UI.md`
- **Phase 1 Testing**: `PHASE_1_LOCAL_TESTING.md`
- **Implementation**: `IMPLEMENTATION_STATUS.md`

## 🎯 Next Steps

1. ✅ Dependencies installed
2. ✅ Tests run
3. ✅ Council service started
4. ⏳ Deploy smart contract (Phase 2) on external machine
5. 🔜 Test with actual blockchain

## 🆘 Troubleshooting

| Issue | Fix |
|-------|-----|
| Port 8000 in use | Change `COUNCIL_PORT` in `.env` |
| Blockchain routes not loading | Ensure `council_blockchain.py` is in same dir as `main.py` |
| Tests fail | Run `pip install -r requirements.txt` in each service |
| Arweave not available | This is OK - service works without it |

## ✨ Features

✅ Multi-agent deliberation
✅ Parallel reasoning
✅ Consensus scoring
✅ Blockchain recording (ready for Sui)
✅ Permanent archival (Arweave ready)
✅ Agent influence networks
✅ Full audit trail
✅ Beautiful UI display
✅ OpenAI-compatible API
✅ Local fallback (Ollama)

---

**Ready to start?** Run `./run-tests.sh` and then `cd services/council && python3 main.py`
