# Neural Blockchain Architecture: Visual Reference

## System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER INTERFACE                          │
│                      (OpenWebUI + Blockchain)                   │
└────────────────┬────────────────────────────────────────────────┘
                 │
    ┌────────────┴────────────┐
    │                         │
    ▼                         ▼
┌──────────────┐         ┌──────────────────┐
│ Chat Mode    │         │ Council Debate   │
│ (Standard)   │         │ (Blockchain)     │
└──────────────┘         └────────┬─────────┘
                                  │
                    ┌─────────────┴──────────────┐
                    │                            │
                    ▼                            ▼
         ┌────────────────────┐        ┌──────────────────────┐
         │  Council Service   │        │ Blockchain Neural    │
         │  (FastAPI)         │        │ Brain Integration    │
         │                    │        │ (blockchain_core.py) │
         │ - Deliberate       │        │                      │
         │ - Vote            │        │ - Agent Coordination │
         │ - Synthesize      │        │ - Consensus Engine   │
         │ - Output          │        │ - IPFS Archive       │
         └────────┬───────────┘        └──────────┬───────────┘
                  │                               │
         ┌────────┴───────────────────────────────┘
         │
    ┌────┴───────────────────┬──────────────────┬────────────────┐
    │                        │                  │                │
    ▼                        ▼                  ▼                ▼
┌─────────────┐        ┌──────────────┐   ┌─────────────┐  ┌──────────┐
│   Agents    │        │ Smart        │   │ IPFS        │  │ Wallets  │
│             │        │ Contracts    │   │ Archive     │  │ & Keys   │
│ - Analyzer  │        │              │   │             │  │          │
│ - Pragmatist│        │ NeuralBrain  │   │ - Thoughts  │  │ Control  │
│ - Advocate  │        │ Contract     │   │ - Proofs    │  │ Agents   │
│             │        │              │   │ - History   │  │          │
└──────┬──────┘        └──────┬───────┘   └──────┬──────┘  └──────────┘
       │                      │                  │
       │                      ▼                  │
       │              ┌────────────────┐        │
       │              │ Blockchain     │        │
       │              │ (Polygon/Solana│        │
       │              │                │        │
       │              │ - Neurons      │        │
       │              │ - Synapses     │        │
       │              │ - Consensus    │        │
       │              │ - Rewards      │        │
       │              └────────────────┘        │
       │                                        │
       └────────────────┬─────────────────────┬─┘
                        │                     │
                    ┌───▼──────┐          ┌───▼───────┐
                    │ LLM Nodes │          │ IPFS Daemon
                    │ (Local)   │          │ (P2P Store)
                    └───────────┘          └───────────┘
```

## Consensus Round Lifecycle

```
┌─────────────────────────────────────────────────────────────────┐
│                    CONSENSUS ROUND FLOW                         │
└─────────────────────────────────────────────────────────────────┘

1. INITIALIZATION
   ┌──────────────┐
   │ User Query   │
   │ via UI       │
   └──────┬───────┘
          │
          ▼
   ┌──────────────────────────────────────────┐
   │ BlockchainNeuralBrain.deliberate_with_   │
   │ chain(topic, agents, timeout)            │
   └──────┬───────────────────────────────────┘
          │
          ▼
   ┌──────────────────────────────────────────┐
   │ Create Consensus Round on Blockchain     │
   │ (NeuralBrain.createConsensusRound)       │
   │                                          │
   │ Returns: round_id (uint256)              │
   └──────┬───────────────────────────────────┘

2. AGENT REASONING
   ┌──────────────────────────────────────────┐
   │ Broadcast topic to all agents (parallel) │
   └──────┬───────────────────────────────────┘
          │
    ┌─────┴─────┬─────────┬──────────┐
    │           │         │          │
    ▼           ▼         ▼          ▼
  ┌────┐     ┌────┐   ┌────┐    ┌────┐
  │ A1 │     │ A2 │   │ A3 │    │ A4 │
  │LLM │     │LLM │   │LLM │    │LLM │
  └─┬──┘     └─┬──┘   └─┬──┘    └─┬──┘
    │          │       │         │
    └──────────┼───────┼─────────┘
               │       │
               ▼       ▼
    ┌────────────────────────────┐
    │ Collect Reasoning Results  │
    │ (with confidence scores)   │
    └──────┬─────────────────────┘

3. NEURAL RECORDING
   ┌──────────────────────────────────────────┐
   │ For each agent:                          │
   │ - Hash reasoning                         │
   │ - Store on IPFS                          │
   │ - Record on blockchain                   │
   │ (NeuralBrain.recordNeuralActivity)       │
   └──────┬───────────────────────────────────┘
          │
          ▼
   ┌──────────────────────────────────────────┐
   │ Blockchain Events:                       │
   │ emit NeuralActivity(agentId, thought,    │
   │   confidence, timestamp)                 │
   └──────┬───────────────────────────────────┘

4. SYNAPSE FORMATION
   ┌──────────────────────────────────────────┐
   │ For all agent pairs:                     │
   │ - Calculate influence (embedding sim)    │
   │ - Record synapse on blockchain           │
   │ (NeuralBrain.formSynapse)                │
   │                                          │
   │ Weight = confidence_a × confidence_b ×   │
   │          semantic_similarity             │
   └──────┬───────────────────────────────────┘
          │
          ▼
   ┌──────────────────────────────────────────┐
   │ Blockchain Events:                       │
   │ emit SynapseFormed(fromAgent, toAgent,   │
   │   weight, timestamp)                     │
   └──────┬───────────────────────────────────┘

5. CONSENSUS COMPUTATION
   ┌──────────────────────────────────────────┐
   │ Consensus Score = avg(agent_confidence) │
   │ Consensus Reached = score > threshold    │
   │                                          │
   │ _compute_consensus(agent_states)        │
   └──────┬───────────────────────────────────┘
          │
          ▼
   ┌──────────────────────────────────────────┐
   │ Finalize Round on Blockchain             │
   │ (NeuralBrain.finalizeConsensusRound)     │
   │                                          │
   │ Stores: roundId, score, votes[], votes   │
   └──────┬───────────────────────────────────┘
          │
          ▼
   ┌──────────────────────────────────────────┐
   │ Blockchain Events:                       │
   │ emit ConsensusFinalized(roundId, score,  │
   │   consensusReached, timestamp)           │
   └──────┬───────────────────────────────────┘

6. ARCHIVAL & RETURN
   ┌──────────────────────────────────────────┐
   │ Archive full round to IPFS:              │
   │ - Agent thinking                         │
   │ - Synapses                               │
   │ - Final consensus                        │
   │ - All proofs                             │
   └──────┬───────────────────────────────────┘
          │
          ▼
   ┌──────────────────────────────────────────┐
   │ Return Result to API:                    │
   │ {                                        │
   │   round_id, consensus_score, agents,     │
   │   on_chain_proof (tx hash),              │
   │   ipfs_proofs {agents, consensus},       │
   │   synapses,                              │
   │   timestamp                              │
   │ }                                        │
   └──────┬───────────────────────────────────┘
          │
          ▼
   ┌──────────────────────────────────────────┐
   │ Display in UI with blockchain links      │
   └──────────────────────────────────────────┘
```

## Data Structure: Synapse Formation

```
Agent A (confidence: 0.85)
└─► Reasoning: "Climate policy should focus on..."
    └─► Embedding: [0.2, 0.5, 0.1, ...]

                    ↓ Similarity: 0.78

Agent B (confidence: 0.72)
└─► Reasoning: "International cooperation is key..."
    └─► Embedding: [0.18, 0.52, 0.09, ...]

                    ↓

Synapse Weight = 0.85 × 0.72 × 0.78 = 0.4762

                    ↓

Record on Blockchain:
formSynapse(
  from: agentA_id,
  to: agentB_id,
  messageHash: keccak256(exchange),
  weight: 4762  // stored as 4762/10000
)
```

## Smart Contract State Model

```
┌─────────────────────────────────────────────────┐
│         Blockchain State (NeuralBrain)          │
└─────────────────────────────────────────────────┘

neurons: mapping(bytes32 => NeuronState)
  ├─ "logical_analyzer"
  │  └─ {
  │     agentId: 0xabc123...,
  │     currentThought: "QmXxxx...",  // IPFS
  │     confidence: 85e16,             // 0.85 in wei
  │     timestamp: 1700000000,
  │     active: true
  │   }
  ├─ "pragmatist"
  │  └─ {...}
  └─ "devils_advocate"
     └─ {...}

synapses: mapping(bytes32 => Synapse[])
  ├─ "logical_analyzer" → [
  │   {
  │     toAgent: "pragmatist",
  │     messageHash: "QmYyyy...",
  │     weight: 4762,  // 0.4762
  │     timestamp: 1700000005
  │   },
  │   {
  │     toAgent: "devils_advocate",
  │     weight: 3500,  // 0.3500
  │     timestamp: 1700000005
  │   }
  │ ]
  └─ ...

consensusRounds: mapping(uint256 => ConsensusRound)
  ├─ 1 → {
  │   roundId: 1,
  │   topic: 0xabc123...,  // hash
  │   agentVotes: ["QmVote1...", "QmVote2...", "QmVote3..."],
  │   consensusScore: 75e16,  // 0.75
  │   finalized: true,
  │   createdAt: 1700000000,
  │   finalizedAt: 1700000010
  │ }
  └─ ...

agents: mapping(bytes32 => Agent)
  ├─ "logical_analyzer" → {
  │   controller: 0x1234...,
  │   modelHash: "QmModel...",
  │   reputation: 105e16,  // 1.05 (upgraded)
  │   participationCount: 12,
  │   lastActive: 1700000010,
  │   active: true
  │ }
  └─ ...
```

## IPFS Archive Structure

```
/ipfs/
  /agents/
    /logical_analyzer/
      /thoughts/
        /round_1.json
        /round_2.json
        /round_3.json
      /model_weights.bin
    /pragmatist/
      /thoughts/
        /round_1.json
        /round_2.json
      /model_weights.bin
    /devils_advocate/
      /thoughts/
      /model_weights.bin
  
  /consensus_records/
    /round_1.json    ← Contains all agent votes + final decision
    /round_2.json
    /round_3.json
  
  /synapses/
    /round_1_network.json
    /round_2_network.json
  
  /session_archive.json    ← Master index of all deliberations
```

## Synapse Visualization Example

After deliberation on "Should we regulate AI?":

```
                    ┌─────────────────┐
                    │ TOPIC: Should we│
                    │ regulate AI?    │
                    └────────┬────────┘
                             │
        ┌────────────────────┼────────────────────┐
        │                    │                    │
        ▼                    ▼                    ▼
    ┌────────┐          ┌────────┐          ┌────────┐
    │ Logic  │          │Pragmatist          │ Devil's│
    │Analyzer│          │(0.72)              │Advocate│
    │(0.85)  │          │                    │(0.65)  │
    └───┬────┘          └───┬────┘          └───┬────┘
        │                   │                   │
        │◄─────0.56─────────┤                   │
        │                   │                   │
        ├─────────0.48─────────────────────────►│
        │                   │                   │
        │◄──────────0.35────────────────────────┤
        │                   │                   │
        └────────────────┬──┴───────────────────┘
                         │
                    Consensus: 74%
                    Reached: YES
```

## API Response Example

```json
{
  "round_id": 5,
  "topic": "Should we regulate AI?",
  "consensus_score": 0.74,
  "consensus_reached": true,
  "agent_states": {
    "logical_analyzer": {
      "agent_id": "logical_analyzer",
      "reasoning": "From a logical perspective...",
      "reasoning_hash": "abc123def456...",
      "confidence": 0.85,
      "ipfs_hash": "QmXxxx..."
    },
    "pragmatist": {
      "agent_id": "pragmatist",
      "reasoning": "From a practical standpoint...",
      "reasoning_hash": "xyz789uvw012...",
      "confidence": 0.72,
      "ipfs_hash": "QmYyyy..."
    },
    "devils_advocate": {
      "agent_id": "devils_advocate",
      "reasoning": "However, consider these risks...",
      "reasoning_hash": "pqr345stu678...",
      "confidence": 0.65,
      "ipfs_hash": "QmZzzz..."
    }
  },
  "on_chain_proof": "0x4a5b6c7d8e9f...",
  "ipfs_proofs": {
    "agents": {
      "logical_analyzer": "QmXxxx...",
      "pragmatist": "QmYyyy...",
      "devils_advocate": "QmZzzz..."
    },
    "consensus": "QmConsensus..."
  },
  "synapses": {
    "logical_analyzer->pragmatist": 0.56,
    "logical_analyzer->devils_advocate": 0.48,
    "pragmatist->devils_advocate": 0.35
  },
  "timestamp": "2024-01-15T10:30:45Z"
}
```

---

## Key Metrics Tracked

| Metric | Purpose | Range |
|--------|---------|-------|
| **Confidence Score** | Agent's certainty in their reasoning | 0.0 - 1.0 |
| **Consensus Score** | Overall agreement across agents | 0.0 - 1.0 |
| **Synapse Weight** | Influence between agents | 0.0 - 1.0 |
| **Agent Reputation** | Historical accuracy score | 0.0 - 1.0+ |
| **Participation Count** | Number of consensus rounds | 0 - ∞ |

