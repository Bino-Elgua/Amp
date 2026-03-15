# AICouncil - Quick Reference

## One-Page System Summary

### What Is It?
A distributed consensus engine that orchestrates multiple AI agents to deliberate, reach consensus, and record everything on Sui blockchain + Arweave.

### Core Components (1,283 lines of code)

| File | Lines | Purpose |
|------|-------|---------|
| `blockchain_core.py` | 449 | Core consensus logic & Arweave integration |
| `neural_brain.move` | 306 | Sui smart contract for recording |
| `main.py` | 283 | FastAPI deliberation endpoints |
| `council_blockchain.py` | 245 | API response formatting |

### Services

| Service | Port | Status | Purpose |
|---------|------|--------|---------|
| Council | 8000 | ✅ | Deliberation API |
| LiteLLM | 4000 | ✅ | LLM gateway (Venice + Ollama) |
| OpenWebUI | 8080 | 🟡 | Chat interface |
| Web Dashboard | 3000 | 🟡 | Analytics UI |
| Blockchain Brain | N/A | ✅ | Consensus engine |

### Data Flow

```
User Question
    ↓
Council Service
    ↓
BlockchainNeuralBrain
    ├─ 1. Broadcast to N agents
    ├─ 2. Parallel reasoning (Venice or Ollama)
    ├─ 3. Calculate synapses (influence)
    ├─ 4. Compute consensus score
    ├─ 5. Record on Sui blockchain
    └─ 6. Archive on Arweave
    ↓
Result with Proofs
```

### Key Classes

**BlockchainNeuralBrain** (blockchain_core.py)
```python
class BlockchainNeuralBrain:
    async def deliberate_with_chain(topic, agents, timeout)
    async def _run_agent_reasoning(topic, agents, timeout)
    async def _calculate_synapses(agent_states)
    def _compute_consensus(agent_states)
    async def _record_to_blockchain(round_id, agents, score)
    async def _archive_to_arweave(round_id, agents, score)
```

**Sui Contract** (neural_brain.move)
```move
struct Agent
struct NeuronState (agent's thinking)
struct Synapse (influence between agents)
struct ConsensusRound (deliberation session)

fun register_agent()
fun record_neural_activity()
fun form_synapse()
fun finalize_consensus()
```

### API Endpoints

```
POST /api/council/deliberate
POST /api/council/deliberate-blockchain
GET  /api/council/agents
GET  /api/council/blockchain/history
GET  /api/council/blockchain/status
POST /v1/chat/completions (LiteLLM)
```

### Configuration

```bash
VENICE_API_KEY=...                    # LLM provider
OLLAMA_ENDPOINT=http://ollama:11434   # Fallback
SUI_RPC_URL=...                       # Blockchain
ARWEAVE_WALLET_PATH=...               # Storage
BLOCKCHAIN_CHAIN=sui                  # Network
CONSENSUS_THRESHOLD=0.5               # Min agreement
```

### Quick Start

```bash
npm run install:all
npm run dev
# Services: http://localhost:8080, :3000, :8000, :4000
```

### Test

```bash
cd services/neural-brain
python -m pytest test_blockchain_integration.py -v
```

### Agents

- **Logical Analyzer**: Reasoning consistency
- **Pragmatist**: Feasibility & resources
- **Devil's Advocate**: Risks & edge cases
- **Ethics Advisor**: Ethical implications
- **Domain Expert**: Specialized knowledge

### Consensus Score

| Score | Status |
|-------|--------|
| 0.0–0.49 | ❌ No consensus |
| 0.50–0.74 | ⚠️ Partial |
| 0.75–1.0 | ✅ Strong |

### Blockchain Recording

1. Agent reasoning → Hash → Sui contract
2. Events emitted (NeuralActivity, SynapseFormed, ConsensusFinalized)
3. Transaction hash = on_chain_proof
4. Full reasoning archived on Arweave
5. Arweave transaction IDs = arweave_proofs

### Dependencies

**Core**: FastAPI, AsyncIO, Pydantic
**LLM**: LiteLLM, httpx
**Blockchain**: Sui SDK, Arweave
**Container**: Docker, Docker Compose
**Testing**: pytest, Jest

### Response Schema

```json
{
  "round_id": 42,
  "topic": "...",
  "consensus_score": 0.75,
  "consensus_reached": true,
  "agent_states": {
    "agent_id": {
      "reasoning": "...",
      "confidence": 0.85,
      "arweave_hash": "Tx_..."
    }
  },
  "on_chain_proof": "Sui_tx_...",
  "arweave_proofs": {
    "agents": {...},
    "consensus": "Tx_..."
  },
  "synapses": {
    "agent1->agent2": 0.56
  },
  "timestamp": "2024-01-15T10:30:45Z"
}
```

### Typical Latency

- Agent reasoning: 2-5s
- Consensus calc: <100ms
- Sui recording: 2-5s
- Arweave archival: 2-10s
- **Total**: 5-20s per deliberation

### File Locations

```
services/neural-brain/      ← Consensus engine
services/council/           ← API service
contracts/neural_brain.move ← Smart contract
apps/openwebui/             ← Chat UI
apps/web/                   ← Dashboard
```

### Status

| Phase | Status | Components |
|-------|--------|------------|
| 1 | ✅ Complete | Docker, LiteLLM, Venice + Ollama |
| 2 | ✅ Complete | Council, Blockchain, Arweave, Tests |
| 3 | 🟡 In Progress | RAG, NFTs, Dashboard |
| 4 | 🔵 Planned | Auth, Rate limiting, Production |

### Links

- **Docs**: See `/docs` folder
- **API**: `http://localhost:8000/docs` (Swagger)
- **GitHub**: https://github.com/jbino85/aicouncil

### Troubleshooting

| Issue | Fix |
|-------|-----|
| Venice API fails | Falls back to Ollama |
| Ollama not running | `docker run -d ollama/ollama` |
| Sui connection fails | Check RPC URL & contract deployed |
| Arweave fails | Ensure wallet has AR tokens |
| Port conflicts | Change PORT vars in .env |

### Key Features

✅ Multi-agent deliberation  
✅ Parallel reasoning  
✅ Consensus scoring  
✅ Blockchain recording (Sui)  
✅ Permanent archival (Arweave)  
✅ Cryptographic proofs  
✅ OpenAI-compatible API  
✅ Local fallback (Ollama)  
✅ Docker deployment  
✅ Comprehensive tests  

### Next Steps

1. Deploy Sui contract to testnet
2. Integrate OpenWebUI
3. Test blockchain flow end-to-end
4. Add RAG pipeline
5. Implement NFT minting
6. Add user authentication
7. Deploy to production

---

**For detailed info, see SYSTEM_RUNDOWN.md or FULL_SYSTEM_OVERVIEW.md**
