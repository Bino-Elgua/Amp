# Phase 3: Council Service Integration

Integrate blockchain-backed deliberation endpoints into the existing council service.

## Overview

The new `council_blockchain.py` module adds:
- `/api/council/deliberate-blockchain` – Blockchain-backed consensus
- `/api/council/blockchain/status` – Integration status
- `/api/council/blockchain/history` – Deliberation history
- `/api/council/blockchain/agent-state/{agent_id}` – Agent neural state

## Step 1: Update Council Service

Edit `services/council/main.py`:

```python
# Add these imports at the top
from council_blockchain import register_blockchain_routes

# In your app startup (after creating FastAPI app):
@app.on_event("startup")
async def startup():
    print("🏛️  AICouncil Service starting...")
    # ... existing startup code ...
    
    # Register blockchain routes
    await register_blockchain_routes(app)
    print("✅ Blockchain integration loaded")
```

Or use lifespan (FastAPI 0.93+):

```python
from contextlib import asynccontextmanager
from council_blockchain import register_blockchain_routes

@asynccontextmanager
async def lifespan(app):
    # Startup
    print("🏛️  AICouncil Service starting...")
    await register_blockchain_routes(app)
    yield
    # Shutdown
    print("🏛️  AICouncil Service shutting down...")

app = FastAPI(lifespan=lifespan)
```

## Step 2: Configure Environment

Update `.env` with Sui blockchain settings:

```bash
# From Phase 2 (Smart Contract Deployment)
SUI_RPC_URL=https://fullnode.testnet.sui.io:443
SUI_NETWORK=testnet
NEURAL_BRAIN_PACKAGE_ID=0xaBcD1234567890...
AGENT_REGISTRY_ID=0x...
ROUND_COUNTER_ID=0x...

# IPFS (optional, for archival)
IPFS_HOST=/ip4/127.0.0.1/tcp/5001
IPFS_TIMEOUT=10

# Consensus Settings
CONSENSUS_THRESHOLD=0.5
DELIBERATION_TIMEOUT=30

# Wallet (optional, for writing to blockchain)
WALLET_ADDRESS=0x...
WALLET_PRIVATE_KEY=0x...
```

## Step 3: Test Integration Locally

Start the council service:

```bash
cd services/council
python main.py
```

Expected output:
```
🏛️  AICouncil Service starting...
✅ Blockchain integration loaded
Listening on: http://0.0.0.0:8000
```

## Step 4: Test Blockchain Endpoints

### Test 1: Check Status

```bash
curl -X GET "http://localhost:8000/api/council/blockchain/status"
```

Response:
```json
{
  "status": "ready",
  "blockchain_chain": "polygon",
  "contract_address": "0xaBcD1234...",
  "ipfs_enabled": true,
  "consensus_rounds": 0,
  "endpoints": {
    "deliberate": "/api/council/deliberate-blockchain",
    "history": "/api/council/blockchain/history",
    "agent-state": "/api/council/blockchain/agent-state/{agent_id}"
  }
}
```

### Test 2: Run Blockchain Deliberation

```bash
curl -X POST "http://localhost:8000/api/council/deliberate-blockchain" \
  -H "Content-Type: application/json" \
  -d '{
    "topic": "Should we implement this blockchain proposal?",
    "num_agents": 3,
    "timeout": 30
  }'
```

Response:
```json
{
  "topic": "Should we implement this blockchain proposal?",
  "consensus_score": 0.74,
  "consensus_reached": true,
  "votes": [
    {
      "agent_id": "logical_analyzer",
      "position": "agree",
      "confidence": 0.85,
      "reasoning": "From a logical perspective...",
      "ipfs_hash": "QmXxxx..."
    }
  ],
  "chairman_summary": "Council reached 74% consensus...",
  "recommendation": "Proceed with proposal",
  "round_id": 1,
  "on_chain_proof": "0x4a5b6c...",
  "ipfs_proofs": {
    "agents": {...},
    "consensus": "QmConsensus..."
  },
  "synapses": {
    "logical_analyzer->pragmatist": 0.56
  },
  "timestamp": "2024-01-15T10:30:45Z"
}
```

### Test 3: Get Deliberation History

```bash
curl -X GET "http://localhost:8000/api/council/blockchain/history"
```

### Test 4: Get Agent Neural State

```bash
curl -X GET "http://localhost:8000/api/council/blockchain/agent-state/logical_analyzer"
```

## Step 5: Update API Documentation

The FastAPI auto-docs will be updated at:
```
http://localhost:8000/docs
```

You'll see the new endpoints:
- `POST /api/council/deliberate-blockchain`
- `GET /api/council/blockchain/status`
- `GET /api/council/blockchain/history`
- `GET /api/council/blockchain/agent-state/{agent_id}`

## Step 6: Integrate with OpenWebUI

The endpoints are now ready for the UI layer (Phase 4).

## Troubleshooting

| Problem | Solution |
|---------|----------|
| `ModuleNotFoundError: blockchain_core` | Check neural-brain in sys.path, run from correct directory |
| `Contract not configured` | Verify BRAIN_CONTRACT_ADDRESS in .env |
| `IPFS unavailable` | Start IPFS daemon or disable in config |
| `Consensus score 0` | Check agent reasoning logic, increase timeout |

## Next: Phase 4

Now the blockchain endpoints are ready. Move to Phase 4 to display blockchain proofs in the UI.

Endpoints available:
- ✅ `/api/council/deliberate-blockchain`
- ✅ `/api/council/blockchain/status`
- ✅ `/api/council/blockchain/history`
- ✅ `/api/council/blockchain/agent-state/{agent_id}`
