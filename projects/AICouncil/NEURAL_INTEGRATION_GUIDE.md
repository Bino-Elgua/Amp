# Neural Blockchain Integration Guide

Integrate blockchain neural capabilities into AICouncil's consensus engine.

## Quick Start

### 1. Install Dependencies

```bash
cd services/neural-brain
pip install -r requirements.txt
```

### 2. Configure Environment

Create `.env` file:

```bash
# Blockchain
BLOCKCHAIN_CHAIN=polygon          # or solana
POLYGON_RPC_URL=http://localhost:8545
BRAIN_CONTRACT_ADDRESS=0x...      # Deploy contract first
BRAIN_CONTRACT_ABI=[...]          # From contract deployment
WALLET_ADDRESS=0x...              # Your wallet
WALLET_PRIVATE_KEY=...            # Private key for transactions

# IPFS
IPFS_HOST=/ip4/127.0.0.1/tcp/5001
IPFS_TIMEOUT=10

# Consensus
CONSENSUS_THRESHOLD=0.5           # 50% minimum
DELIBERATION_TIMEOUT=30           # Seconds
```

### 3. Deploy Smart Contract

**Polygon (EVM-compatible):**

```bash
cd contracts

# Install Foundry or Hardhat
npm install -D hardhat

# Deploy
npx hardhat run scripts/deploy.js --network polygon
```

**Solana (using Anchor):**

```bash
# Install Anchor
cargo install --git https://github.com/project-serum/anchor

# Build & deploy
anchor build
anchor deploy
```

### 4. Test Blockchain Integration

```bash
cd services/neural-brain

python -m pytest tests/

# Or run directly
python blockchain_core.py
```

## Integration Points

### A. Council Service (Enhanced)

Modify `services/council/main.py`:

```python
from neural_brain.blockchain_core import BlockchainNeuralBrain

@app.post("/api/council/deliberate-blockchain")
async def deliberate_blockchain(request: DeliberationRequest):
    """Blockchain-backed deliberation"""
    
    brain = BlockchainNeuralBrain(chain=os.getenv("BLOCKCHAIN_CHAIN"))
    
    # Get available agents from registry
    agents = await get_council_agents()
    
    # Run deliberation with blockchain recording
    result = await brain.deliberate_with_chain(
        topic=request.topic,
        agents=agents,
        timeout=int(os.getenv("DELIBERATION_TIMEOUT", "30"))
    )
    
    return DeliberationResponse(
        topic=result['topic'],
        consensus_score=result['consensus_score'],
        consensus_reached=result['consensus_reached'],
        votes=[
            AgentVote(
                agent_id=agent_id,
                position="agree" if state['confidence'] > 0.6 else "uncertain",
                confidence=state['confidence'],
                reasoning=state['reasoning']
            )
            for agent_id, state in result['agent_states'].items()
        ],
        chairman_summary="Consensus achieved through distributed reasoning on blockchain.",
        on_chain_proof=result['on_chain_proof'],
        ipfs_archive=result['ipfs_proofs']
    )
```

### B. OpenWebUI Enhancement

Add blockchain proof display to chat interface:

```svelte
<!-- apps/openwebui/src/lib/BlockchainProof.svelte -->

<script>
  import { onMount } from 'svelte';
  
  export let onChainProof;
  export let ipfsArchive;
  
  let chain = 'polygon';
  
  function getExplorerUrl(txHash) {
    const explorers = {
      'polygon': 'https://polygonscan.com/tx/',
      'solana': 'https://solana.fm/tx/'
    };
    return explorers[chain] + txHash;
  }
  
  function getIPFSUrl(hash) {
    return `https://gateway.pinata.cloud/ipfs/${hash}`;
  }
</script>

<div class="blockchain-proof">
  {#if onChainProof}
    <div class="proof-box">
      <h4>⛓️ On-Chain Proof</h4>
      <p>Transaction recorded on {chain}</p>
      <a href={getExplorerUrl(onChainProof)} target="_blank">
        View TX: {onChainProof.slice(0, 10)}...
      </a>
    </div>
  {/if}
  
  {#if ipfsArchive}
    <div class="archive-box">
      <h4>📦 IPFS Archive</h4>
      <ul>
        {#each Object.entries(ipfsArchive.agents) as [agentId, hash]}
          <li>
            {agentId}: <a href={getIPFSUrl(hash)} target="_blank">
              {hash.slice(0, 8)}...
            </a>
          </li>
        {/each}
      </ul>
    </div>
  {/if}
</div>

<style>
  .blockchain-proof {
    margin: 1rem 0;
    padding: 1rem;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    background: #f5f5f5;
  }
  
  .proof-box, .archive-box {
    margin: 0.5rem 0;
  }
  
  h4 {
    margin: 0 0 0.5rem 0;
    font-size: 0.95rem;
  }
  
  a {
    color: #0066cc;
    text-decoration: none;
  }
</style>
```

## Workflow

### Full Blockchain Deliberation Flow

```
1. User submits topic via OpenWebUI
   ↓
2. Council Service receives request
   ↓
3. BlockchainNeuralBrain.deliberate_with_chain()
   ├─ Create consensus round on blockchain
   ├─ Broadcast to agent pool
   ├─ Agents run LLM inference in parallel
   ├─ Record neural activity on-chain
   ├─ Calculate synapses (influence weights)
   ├─ Archive to IPFS
   └─ Return result with proofs
   ↓
4. Results displayed with blockchain links
   ├─ On-chain transaction explorer link
   ├─ IPFS archive of agent reasoning
   └─ Synaptic influence visualization
```

## Architecture Diagram

```
┌─────────────────────────────────────┐
│  OpenWebUI Chat Interface           │
│  "Blockchain Deliberation" Button   │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│  Council Service (FastAPI)          │
│  /api/council/deliberate-blockchain │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│  BlockchainNeuralBrain              │
│  ├─ Agent Reasoning                 │
│  ├─ Synapse Formation               │
│  ├─ Consensus Calculation           │
│  └─ Proof Generation                │
└──┬──────────────┬────────────┬──────┘
   │              │            │
   ▼              ▼            ▼
┌─────────┐  ┌────────┐  ┌──────────┐
│  Agents │  │ Smart  │  │   IPFS   │
│ (LLMs)  │  │Contract│  │ Archive  │
└─────────┘  │(Polygon)  └──────────┘
             └────────┘
```

## Advanced Features

### A. Agent Reputation System

```python
# In blockchain_core.py

async def calculate_agent_reputation(agent_id: str) -> float:
    """
    Score agents based on historical accuracy
    """
    history = await self._get_agent_consensus_history(agent_id)
    
    if not history:
        return 1.0  # Base reputation
    
    # Calculate prediction accuracy
    correct = sum(1 for h in history if h['consensus_reached'])
    accuracy = correct / len(history)
    
    # Factor in participation consistency
    consistency = len(history) / 100  # Scale to [0, 1]
    
    reputation = (accuracy * 0.7 + consistency * 0.3)
    return max(0.1, min(1.0, reputation))
```

### B. Incentive Mechanism

```solidity
// In NeuralBrain.sol

contract NeuralIncentives {
    mapping(bytes32 => uint256) public agentRewards;
    
    function distributeConsensusRewards(
        uint256 roundId,
        bytes32[] calldata agentIds,
        uint256[] calldata rewards
    ) external {
        ConsensusRound memory round = consensusRounds[roundId];
        require(round.finalized, "Round not finalized");
        
        for (uint i = 0; i < agentIds.length; i++) {
            bytes32 agentId = agentIds[i];
            uint256 reward = rewards[i];
            
            agentRewards[agentId] += reward;
            // Transfer tokens to agent controller
            // IERC20(TOKEN).transfer(agents[agentId].controller, reward);
        }
    }
}
```

### C. Privacy-Preserving Reasoning

```python
# Use zero-knowledge proofs for sensitive deliberation

from py_ecc.bls import G2ProofOfPossession as bls

async def create_zk_proof_of_reasoning(
    agent_reasoning: str,
    commitment: bytes32
) -> bytes:
    """
    Create zero-knowledge proof that agent contributed
    to consensus without revealing actual reasoning
    """
    # Hash reasoning without revealing content
    reasoning_hash = keccak256(agent_reasoning)
    
    # Create proof that hash matches commitment
    proof = bls.SkToPk(int(reasoning_hash))
    
    return proof
```

## Monitoring & Debugging

### Check Blockchain State

```python
# Query contract state
brain = BlockchainNeuralBrain()

# Get all consensus rounds
rounds = brain.get_consensus_history()

# Get specific agent state
agent_state = brain.get_agent_neural_state('logical_analyzer')

# View synapses for visualization
synapses = brain.synapses.get(round_id, {})
```

### View IPFS Archives

```bash
# Access agent reasoning
curl -X GET "https://gateway.pinata.cloud/ipfs/{hash}"

# Pin important records
ipfs pin add {hash}
```

### Monitor Contract Events

```javascript
// Listen for blockchain events
const contract = new ethers.Contract(address, abi, provider);

contract.on("ConsensusFinalized", (roundId, score, reached, event) => {
  console.log(`Round ${roundId}: ${score * 100}% consensus`);
});
```

## Troubleshooting

| Issue | Solution |
|-------|----------|
| IPFS timeout | Check IPFS daemon: `ipfs daemon` |
| Contract call fails | Verify wallet has gas; check RPC URL |
| Agent reasoning empty | Check LLM endpoint; increase timeout |
| Consensus score 0 | Verify agent confidence calculation |

## Next Steps

1. **Deploy to testnet** (Polygon Mumbai)
2. **Test with real agents** (migrate from mock)
3. **Add reputation tracking**
4. **Implement token incentives**
5. **Scale to production mainnet**

---

See `BLOCKCHAIN_NEURAL_INTEGRATION.md` for architectural details.
