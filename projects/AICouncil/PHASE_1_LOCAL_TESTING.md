# Phase 1: Local Testing & Verification

Test everything end-to-end on your local machine.

## Prerequisites

- Python 3.9+
- Node.js 16+
- IPFS daemon (optional)
- All phases 2-4 completed

## Step 1: Install Python Dependencies

```bash
cd services/neural-brain
pip install -r requirements.txt
```

Verify installation:
```bash
python -c "import web3; import ipfshttpclient; print('✅ All dependencies installed')"
```

## Step 2: Configure Local Environment

Create `.env` in project root:

```bash
# From Phase 2
BLOCKCHAIN_CHAIN=polygon
POLYGON_RPC_URL=https://rpc-mumbai.maticvigil.com
BRAIN_CONTRACT_ADDRESS=0x...your_deployed_address...
BRAIN_CONTRACT_ABI=[...paste full ABI...]

# IPFS (optional)
IPFS_HOST=/ip4/127.0.0.1/tcp/5001
IPFS_TIMEOUT=10

# Consensus
CONSENSUS_THRESHOLD=0.5
DELIBERATION_TIMEOUT=30
COUNCIL_DEBUG=true
```

## Step 3: Run Unit Tests

Test the blockchain core functionality:

```bash
cd services/neural-brain
python test_blockchain_integration.py
```

Expected output:
```
🧠  BLOCKCHAIN NEURAL INTEGRATION TEST SUITE
=== Test 1: Basic Deliberation ===
✓ Consensus score: 75.3%
✓ Agents participated: 3

=== Test 2: Synapse Formation ===
✓ Round 1 synapses:
  agent_a->agent_b: 0.450
  agent_b->agent_a: 0.380

=== Test 3: Consensus History ===
✓ Total rounds: 3

✅ ALL TESTS PASSED

=== RESULT SUMMARY ===
{
  "round_id": 7,
  "consensus_score": 0.742,
  "consensus_reached": true,
  "agents": 4,
  "on_chain_proof": null,  # null in test mode
  "ipfs_archive": false,   # unless IPFS running
  "timestamp": "2024-01-15T10:30:45Z"
}
```

## Step 4: Start Council Service

In a terminal window:

```bash
cd services/council
python main.py
```

Expected output:
```
============================================================
🏛️  AICouncil Service
============================================================
Listening on: http://0.0.0.0:8000
API Docs: http://localhost:8000/docs
Health: http://localhost:8000/health
============================================================
```

Keep this running in the background.

## Step 5: Test Council Endpoints

In another terminal, test the endpoints:

### Test 1: Health Check
```bash
curl -X GET "http://localhost:8000/health"
```

Response:
```json
{
  "status": "healthy",
  "debug": true
}
```

### Test 2: Regular Deliberation
```bash
curl -X POST "http://localhost:8000/api/council/deliberate" \
  -H "Content-Type: application/json" \
  -d '{
    "topic": "Is blockchain useful for AI consensus?",
    "num_agents": 3
  }'
```

### Test 3: Blockchain Deliberation
```bash
curl -X POST "http://localhost:8000/api/council/deliberate-blockchain" \
  -H "Content-Type: application/json" \
  -d '{
    "topic": "Should we implement this AI safety proposal?",
    "num_agents": 3,
    "timeout": 30
  }'
```

Response (example):
```json
{
  "topic": "Should we implement this AI safety proposal?",
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
  "ipfs_proofs": {...},
  "synapses": {...},
  "timestamp": "2024-01-15T10:30:45Z"
}
```

### Test 4: Blockchain Status
```bash
curl -X GET "http://localhost:8000/api/council/blockchain/status"
```

### Test 5: Deliberation History
```bash
curl -X GET "http://localhost:8000/api/council/blockchain/history"
```

## Step 6: Test with OpenWebUI (Optional)

If you have OpenWebUI set up:

```bash
cd apps/openwebui
npm run dev
```

Navigate to http://localhost:5173 and:
1. Go to Council interface
2. Click "⛓️ Blockchain Deliberation"
3. Enter a topic
4. Observe the blockchain proof display

## Step 7: Verify Blockchain Integration

Check that contract methods are callable:

```python
# Test in Python REPL
from services.neural_brain.blockchain_core import BlockchainNeuralBrain
import asyncio

async def test():
    brain = BlockchainNeuralBrain(chain="polygon")
    
    # Test agent reasoning
    agents = [
        {'id': 'analyzer', 'expertise': ['logic']},
        {'id': 'pragmatist', 'expertise': ['feasibility']},
    ]
    
    result = await brain.deliberate_with_chain(
        topic="Test topic",
        agents=agents,
        timeout=10
    )
    
    print(f"Consensus: {result['consensus_score']:.1%}")
    print(f"Round ID: {result['round_id']}")
    print(f"Agents: {len(result['agent_states'])}")

asyncio.run(test())
```

Expected output:
```
🧠 Neural Deliberation: Test topic
   Agents: 2
   Chain: polygon
✓ Round 1 initialized
📍 Running agent reasoning loop (timeout: 10s)...
  ✓ analyzer: abc123...
  ✓ pragmatist: def456...
🔗 Forming synapses...
   Consensus score: 0.73
⛓️  Recording to blockchain...
📦 Archiving to IPFS...

Consensus: 73.0%
Round ID: 1
Agents: 2
```

## Step 8: Load Testing

Test with multiple concurrent deliberations:

```bash
# Using Apache Bench
ab -n 10 -c 5 \
  -p payload.json \
  -T application/json \
  http://localhost:8000/api/council/deliberate-blockchain

# payload.json
{
  "topic": "Test proposal",
  "num_agents": 3,
  "timeout": 30
}
```

## Step 9: Verification Checklist

- [ ] Unit tests pass
- [ ] Council service starts without errors
- [ ] Health check endpoint responds
- [ ] Regular deliberation works
- [ ] Blockchain deliberation works
- [ ] Consensus score is calculated
- [ ] Agent votes are collected
- [ ] IPFS archival works (if IPFS running)
- [ ] Blockchain proofs generated
- [ ] UI displays results (if OpenWebUI available)

## Step 10: Debug Mode

For detailed logging:

Edit `.env`:
```bash
COUNCIL_DEBUG=true
```

Then check logs:
```bash
tail -f council.log
```

For blockchain debugging:

```python
# In blockchain_core.py, add:
import logging
logging.basicConfig(level=logging.DEBUG)
```

## Troubleshooting

| Problem | Solution |
|---------|----------|
| Import errors | Check PYTHONPATH, run from project root |
| Connection refused | Start council service first |
| Consensus score 0 | Check agent reasoning, increase timeout |
| Contract error | Verify contract address in .env |
| IPFS timeout | Start IPFS daemon or disable in config |
| Memory error | Reduce num_agents or deliberation_timeout |

## Performance Metrics

Expected performance on local machine:

| Operation | Time | Notes |
|-----------|------|-------|
| Agent reasoning (1 agent) | 100ms | Mocked LLM |
| Agent reasoning (3 agents) | 250ms | Parallel execution |
| Synapse formation | 50ms | Matrix computation |
| Blockchain record | 0ms | Local test (no actual TX) |
| IPFS archive | 100-500ms | If IPFS running |
| Total deliberation | 500-1000ms | End-to-end |

## Next Steps

### If All Tests Pass ✅
Congratulations! Your blockchain neural integration is working locally.

Next steps:
1. Deploy to testnet (you did Phase 2)
2. Run integration tests against real contract
3. Monitor gas usage & optimization
4. Plan mainnet deployment

### If Tests Fail ❌
1. Check error messages carefully
2. Review troubleshooting section
3. Verify all prerequisites installed
4. Check that all phases are complete
5. Review contract address & ABI

## Going to Production

When ready to go live:

1. Deploy contract to mainnet (Phase 2 variation)
2. Update RPC URL to mainnet
3. Add rate limiting to endpoints
4. Enable authentication for council
5. Monitor contract calls & costs
6. Set up alerting for failures

---

**All phases complete!** 🎉

You now have:
- ✅ Blockchain neural framework
- ✅ Smart contracts deployed
- ✅ Council service integration
- ✅ UI with proof display
- ✅ Local testing verified
