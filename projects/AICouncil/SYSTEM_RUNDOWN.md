# AICouncil - Complete System Rundown

## Executive Summary

AICouncil is a **distributed epistemic consensus engine** that orchestrates multiple AI agents to deliberate on topics, reach consensus, and record everything immutably on blockchain (Sui) with permanent archival on Arweave. It's a full-stack application combining:

- **Frontend**: OpenWebUI (chat interface) + custom web UI
- **API Layer**: FastAPI microservices (Council, LiteLLM proxy, blockchain neural brain)
- **LLM Integration**: Venice API (primary) + Ollama (local fallback)
- **Blockchain**: Sui Move smart contracts + Arweave permanent storage
- **Infrastructure**: Docker Compose, Docker containers for each service

**Use Case**: When users ask complex questions, instead of getting one AI response, they get a coordinated consensus from multiple AI agents with different expertise (logical analyzer, pragmatist, devil's advocate, ethics advisor, etc.), with full cryptographic proof of the reasoning process.

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│              Frontend Layer                             │
├─────────────────────────────────────────────────────────┤
│  • OpenWebUI (Port 8080) - Chat interface               │
│  • Web App (Port 3000) - Custom dashboard               │
└─────────────┬───────────────────────────────────────────┘
              │
┌─────────────▼───────────────────────────────────────────┐
│           API Gateway & Services Layer                  │
├─────────────────────────────────────────────────────────┤
│  LiteLLM Proxy (4000)     ─ Rate limiting, fallback      │
│  Council Service (8000)   ─ Deliberation orchestration  │
│  Blockchain Neural Brain  ─ Consensus on Sui + Arweave  │
│  Auth Service             ─ User management (Phase 4)    │
│  NFT Minter              ─ Proof NFTs on Sui (Phase 3)   │
│  AnythingLLM RAG         ─ Document retrieval (Phase 3)  │
└─────────────┬───────────────────────────────────────────┘
              │
┌─────────────┴───────────────────────────────────────────┐
│           External Services & Infrastructure            │
├─────────────────────────────────────────────────────────┤
│  • Venice API (openai-compatible LLM provider)          │
│  • Ollama (local LLM runtime)                           │
│  • Sui Blockchain (RPC endpoint for smart contracts)    │
│  • Arweave (permanent decentralized storage)            │
│  • Supabase (auth & multi-tenancy - Phase 4)            │
│  • Redis (caching & rate limiting - Phase 4)            │
│  • PostgreSQL (session storage - Phase 4)               │
└─────────────────────────────────────────────────────────┘
```

---

## Core Components

### 1. **Frontend Applications** (`/apps`)

#### OpenWebUI (`/apps/openwebui`)
- Web-based chat interface (Venice-themed aesthetic)
- Supports both standard chat and council deliberation modes
- Shows blockchain proofs and Arweave links for deliberations
- Port: 8080
- Docker image: `open-webui:latest`

#### Web App (`/apps/web`)
- Custom dashboard built with Svelte/React
- Displays consensus history and agent reputation
- Shows synapse networks (influence between agents)
- Port: 3000
- Tech: Node.js + TypeScript

---

### 2. **API Services** (`/services`)

#### **Council Service** (`/services/council`)
- **Primary Purpose**: Orchestrate multi-agent deliberation
- **Main File**: `main.py` (FastAPI application)
- **Key Endpoints**:
  - `POST /api/council/deliberate` - Standard deliberation
  - `POST /api/council/debate` - Focused debate mode (Phase 2)
  - `GET /api/council/agents` - List available agents
  - `GET /api/council/status` - Service health check
- **Port**: 8000
- **Dependencies**: FastAPI, Pydantic, httpx
- **Status**: Phase 2 (core endpoints defined, logic implemented)

#### **Blockchain Neural Brain** (`/services/neural-brain`)
- **Purpose**: Integrate blockchain consensus with AI reasoning
- **Main File**: `blockchain_core.py` (AsyncIO Python)
- **Key Class**: `BlockchainNeuralBrain`
  - `deliberate_with_chain()` - Main entry point
  - `_run_agent_reasoning()` - Parallel agent LLM calls
  - `_calculate_synapses()` - Influence between agents
  - `_record_to_blockchain()` - Write consensus to Sui
  - `_archive_to_arweave()` - Permanent IPFS-style storage
- **Test Suite**: `test_blockchain_integration.py` (7 test cases)
- **Dependencies**: 
  - `arweave==0.2.3` (changed from IPFS)
  - `web3==6.11.2` (blockchain interaction)
  - `httpx==0.25.0` (async HTTP)
- **Status**: Phase 2 (fully functional with Arweave integration)

#### **LiteLLM Proxy** (`/services/litellm`)
- **Purpose**: Unified API gateway for LLM access with fallback
- **Main File**: `config.py` (configuration management)
- **Features**:
  - Primary: Venice API (openai-compatible)
  - Fallback: Ollama (local models)
  - Rate limiting (Phase 4)
  - Cost tracking (Phase 4)
  - Guardrails (CSAM, bioweapon detection)
- **Supported Models**:
  - Venice: GPT-4, GPT-3.5-turbo, Llama-405b
  - Ollama: Llama2, Mistral
- **Port**: 4000
- **Status**: Phase 1 (operational with Venice + Ollama fallback)

#### **Auth Service** (`/services/auth`)
- **Purpose**: User authentication and management
- **Status**: Phase 4 (using Supabase OAuth)
- **Not yet implemented**

#### **NFT Minter** (`/services/nft-minter`)
- **Purpose**: Mint NFTs as proof of consensus deliberation
- **Blockchain**: Sui
- **Status**: Phase 3 (planned)

#### **AnythingLLM RAG** (`/services/anything-llm`)
- **Purpose**: Document retrieval and embedding
- **Features**: RAG pipeline before consensus
- **Status**: Phase 3 (planned)

#### **Archiver Service** (`/services/archiver`)
- **Purpose**: Archive deliberation sessions
- **Destination**: Arweave
- **Status**: Phase 3 (integrated into neural-brain)

#### **Unified Core** (`/services/unified-core`)
- **Purpose**: Shared utilities and base classes
- **Status**: In development

---

### 3. **Smart Contracts** (`/contracts`)

#### Sui Move Contract (`/contracts/neural_brain.move`)
- **Blockchain**: Sui Network
- **Key Structures**:
  - `Agent` - AI agent metadata
  - `NeuronState` - Agent's current thinking
  - `Synapse` - Connection/influence between agents
  - `ConsensusRound` - A deliberation round
  - `AgentRegistry` - Central agent management
  - `RoundCounter` - Consensus round ID counter

- **Key Functions**:
  - `register_agent()` - Register new AI agent
  - `record_neural_activity()` - Log agent reasoning
  - `form_synapse()` - Record influence between agents
  - `create_consensus_round()` - Start new deliberation
  - `finalize_consensus()` - Finalize with score
  - View functions: `get_agent_count()`, `is_agent_active()`, `get_agent_reputation()`

- **Events Emitted**:
  - `AgentRegistered` - When agent joins
  - `NeuralActivity` - When agent thinks
  - `SynapseFormed` - When agent influences another
  - `ConsensusFinalized` - When round completes

- **Status**: Phase 2 (fully implemented, ready for testnet deployment)

---

## Data Flow

### Standard Deliberation Flow

```
1. USER → OpenWebUI
   Asks: "Should we implement X?"

2. OpenWebUI → Council Service (/api/council/deliberate)
   POST with topic + requested agents

3. Council Service → BlockchainNeuralBrain
   Orchestrates multi-agent deliberation

4. BlockchainNeuralBrain → Parallel Agent Reasoning
   For each agent:
   - Call LiteLLM proxy with agent prompt
   - LiteLLM tries Venice API first
   - Falls back to local Ollama if Venice fails
   - Receives reasoning text from agent

5. BlockchainNeuralBrain → Calculate Synapses
   For each agent pair:
   - Compute semantic similarity of reasoning
   - Weight = agent1_confidence × agent2_confidence × similarity
   - Store influence metrics

6. BlockchainNeuralBrain → Compute Consensus
   - Average confidence scores of all agents
   - Compare to CONSENSUS_THRESHOLD (default 50%)
   - Returns: consensus_score, consensus_reached

7. BlockchainNeuralBrain → Record to Sui Blockchain
   - Call NeuralBrain.move smart contract
   - Emit NeuralActivity events for each agent
   - Emit SynapseFormed events
   - Emit ConsensusFinalized when complete
   - Returns: transaction hash (on_chain_proof)

8. BlockchainNeuralBrain → Archive to Arweave
   - Create transaction with agent reasoning
   - Add tags: Council, Agent ID, Round ID
   - Sign transaction
   - Send to Arweave network
   - Returns: Arweave transaction ID (arweave_hash)

9. BlockchainNeuralBrain → Return Result
   JSON with:
   - topic, consensus_score, consensus_reached
   - agent_states (each with reasoning, confidence, arweave_hash)
   - on_chain_proof (Sui tx hash)
   - arweave_proofs {agents: {agent_id: tx_id}, consensus: tx_id}
   - synapses {agent1->agent2: weight}
   - timestamp

10. Council Service → Format Response
    Wrap blockchain data in API schema
    Return DeliberationResponse

11. OpenWebUI → Display Results
    - Show consensus score
    - List agent votes with reasoning
    - Link to Sui explorer (verify on-chain)
    - Link to Arweave (verify archived reasoning)
    - Visualize synapse network
```

---

## Technology Stack

| Layer | Technology | Purpose | Status |
|-------|-----------|---------|--------|
| **Frontend** | OpenWebUI + Svelte/React | Chat UI & Dashboard | Phase 2 |
| **API Framework** | FastAPI (Python) | Microservices | Phase 2 |
| **LLM Orchestration** | LiteLLM | Venice + Ollama proxy | Phase 1 |
| **LLM Providers** | Venice AI (primary), Ollama (fallback) | Model access | Phase 1 |
| **Async Runtime** | AsyncIO (Python) | Parallel deliberation | Phase 2 |
| **Blockchain RPC** | Sui Network | Smart contracts | Phase 2 |
| **Smart Contracts** | Move (Sui) | Consensus recording | Phase 2 |
| **Permanent Storage** | Arweave | Deliberation archival | Phase 3 |
| **Container Orchestration** | Docker Compose | Local dev & deployment | Phase 1 |
| **Authentication** | Supabase OAuth | User management | Phase 4 |
| **Caching** | Redis | Rate limiting & sessions | Phase 4 |
| **Database** | PostgreSQL | User data & history | Phase 4 |
| **Package Manager** | npm + pip | JS & Python deps | Phase 1 |
| **Build Tools** | TypeScript, Vite | Frontend tooling | Phase 1 |
| **Testing** | Jest (JS), pytest (Python) | QA | Phase 2 |
| **Monitoring** | (TBD) | Observability | Phase 4 |

---

## Project Phases

### ✅ Phase 1: Foundation (Days 1–4)
- [x] Repository & monorepo skeleton
- [x] Docker Compose setup
- [x] LiteLLM proxy with Venice API
- [x] Ollama fallback integration
- [x] Basic service structure

### 🟡 Phase 2: Intelligence (Days 5–9)
- [x] Council deliberation service
- [x] Blockchain neural brain integration
- [x] Sui smart contract
- [x] Arweave archival
- [x] Test suite
- [ ] OpenWebUI integration
- [ ] Azure deployment scripts
- [ ] GitHub Actions CI/CD

### 🟢 Phase 3: Provenance (Days 10–14)
- [ ] AnythingLLM RAG service
- [ ] RAG-before-council pipeline
- [ ] Flowise ritual builder
- [ ] NFT minting for proofs
- [ ] Session archival dashboard

### 🔵 Phase 4: Production (Days 15–20)
- [ ] Supabase auth + OAuth
- [ ] Rate limiting (Redis)
- [ ] Cost tracking
- [ ] Hard refusal guardrails
- [ ] Akash deployment
- [ ] Performance optimization

---

## Configuration

### Environment Variables

Key `.env` variables (see `.env.example`):

```bash
# Venice API (LLM Provider)
VENICE_API_KEY=your_key_here
VENICE_API_BASE=https://api.venice.ai/v1

# Ollama (Local Fallback)
OLLAMA_ENDPOINT=http://ollama:11434

# Sui Blockchain
BLOCKCHAIN_CHAIN=sui
SUI_RPC_URL=https://fullnode.testnet.sui.io:443
NEURAL_BRAIN_CONTRACT_ID=0x...

# Arweave
ARWEAVE_WALLET_PATH=/path/to/wallet.json

# Council Service
COUNCIL_PORT=8000
COUNCIL_DELIBERATION_TIMEOUT=30
COUNCIL_MIN_CONSENSUS=0.5

# LiteLLM
LITELLM_PORT=4000
LITELLM_MASTER_KEY=secure_key

# Database (Phase 4)
DATABASE_URL=postgresql://user:pass@localhost/aicouncil
REDIS_URL=redis://localhost:6379
```

---

## Key Files & Directories

```
AIcouncil/
├── apps/
│   ├── openwebui/          # Chat interface
│   └── web/                # Custom dashboard
│
├── services/
│   ├── council/            # Deliberation orchestration
│   │   ├── main.py         # FastAPI app
│   │   ├── council_blockchain.py  # Blockchain integration
│   │   └── requirements.txt
│   │
│   ├── neural-brain/       # Blockchain neural integration
│   │   ├── blockchain_core.py     # Core logic
│   │   ├── test_blockchain_integration.py
│   │   └── requirements.txt
│   │
│   ├── litellm/            # LLM proxy
│   │   └── config.py       # Model configuration
│   │
│   ├── auth/               # User authentication (Phase 4)
│   ├── nft-minter/         # NFT proof generation (Phase 3)
│   ├── anything-llm/       # RAG service (Phase 3)
│   └── archiver/           # Session archival (Phase 3)
│
├── contracts/
│   ├── neural_brain.move   # Sui smart contract
│   ├── deploy/             # Deployment scripts
│   └── scripts/            # Utility scripts
│
├── deploy/                 # Deployment configs
│   ├── docker/             # Docker compose files
│   └── kubernetes/         # K8s manifests (future)
│
├── docs/                   # Documentation
│   ├── NEURAL_ARCHITECTURE.md      # Diagrams & data models
│   ├── NEURAL_INTEGRATION_GUIDE.md # Setup guide
│   ├── BLOCKCHAIN_NEURAL_PROJECT_SUMMARY.md
│   └── GUARDRAILS.md       # Safety implementation
│
├── middleware/             # Shared utilities
├── tests/                  # Integration tests
│
├── package.json            # Node workspaces
├── pyproject.toml          # Python configuration
├── Dockerfile              # Multi-stage builds
├── README.md               # User guide
├── START_HERE_PHASES_2_3_4_1.md  # Quick start
└── AGENTS.md (if present)  # AI agent guidelines
```

---

## Running the System

### Local Development

```bash
# Install dependencies
npm run install:all

# Start full stack
npm run dev

# Or with Docker
docker compose up

# Individual service startup
cd services/council && uvicorn main:app --reload --port 8000
cd services/neural-brain && python test_blockchain_integration.py
```

### Production Deployment

```bash
# Build Docker images
npm run docker:build

# Push to registry
npm run docker:push

# Deploy with Docker Compose
npm run prod

# Or deploy to Akash (see deploy/akash/)
akash deploy --from your_key_name --manifest deploy/akash/manifest.yml
```

### Testing

```bash
# Run all tests
npm run test

# JavaScript tests
npm run test:js

# Python tests
npm run test:python

# Integration tests
npm run test:integration

# Test blockchain integration specifically
cd services/neural-brain
python -m pytest test_blockchain_integration.py -v
```

---

## API Endpoints

### Council Service (8000)

```
GET  /health
GET  /api/council/status
POST /api/council/deliberate
POST /api/council/debate
GET  /api/council/agents
POST /api/council/deliberate-blockchain  # Phase 2
GET  /api/council/blockchain/history     # Phase 2
GET  /api/council/blockchain/agent-state/{agent_id}
```

### LiteLLM Proxy (4000)

```
POST /v1/chat/completions    # OpenAI-compatible
GET  /models                  # List models
```

### OpenWebUI (8080)

```
Web UI at http://localhost:8080
```

### Web Dashboard (3000)

```
Custom dashboard at http://localhost:3000
```

---

## Key Concepts

### Agents
Multiple AI personalities deliberating. Built-in agents:
- **Logical Analyzer**: Evaluates consistency and reasoning
- **Pragmatist**: Considers feasibility and resources
- **Devil's Advocate**: Challenges assumptions
- **Ethics Advisor**: Considers ethical implications
- **Domain Expert**: Brings specialized knowledge

Each agent reasons independently and is recorded on-chain.

### Synapses
Influence weights between agents based on:
- **Confidence**: How certain each agent is
- **Semantic Similarity**: How much their reasoning aligns
- **Weight Formula**: `confidence_a × confidence_b × similarity`

Visualized as a network graph showing agent influence.

### Consensus Score
Average confidence across all agents:
- **0.0–0.49**: No consensus
- **0.50–0.74**: Partial consensus
- **0.75–1.0**: Strong consensus

---

## Recent Changes

1. **IPFS → Arweave**: Replaced IPFS with Arweave for permanent archival
   - Updated `blockchain_core.py`
   - Changed `requirements.txt` (arweave==0.2.3)
   - Updated test suite
   - Changed field names: `ipfs_hash` → `arweave_hash`, `ipfs_proofs` → `arweave_proofs`

2. **Sui Integration**: Smart contract uses Sui Move, not EVM Solidity
   - Contract: `neural_brain.move`
   - Events-based architecture
   - Shared objects for on-chain state

---

## Next Steps

### Immediate (Phase 2)
1. Deploy Sui smart contract to testnet
2. Integrate with OpenWebUI
3. Test end-to-end deliberation
4. Set up GitHub Actions CI/CD

### Short-term (Phase 3)
1. Add RAG pipeline (AnythingLLM)
2. Implement NFT minting
3. Build synapse visualization dashboard
4. Add session archival viewer

### Medium-term (Phase 4)
1. Supabase authentication
2. Rate limiting & cost tracking
3. Guardrails implementation
4. Production deployment to Akash

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| Venice API fails | Check VENICE_API_KEY, should fallback to Ollama |
| Ollama not responding | Start with `ollama serve` or `docker run ollama/ollama` |
| Sui RPC timeout | Verify SUI_RPC_URL, try testnet endpoint |
| Arweave connection fails | Check ARWEAVE_WALLET_PATH, ensure wallet is funded |
| Port conflicts | Change PORT vars in .env |
| Docker issues | `docker compose down && docker compose up --build` |

---

## Contributing

See `CONTRIBUTING.md` for guidelines.

Branch naming:
- `feature/name` - New features
- `fix/name` - Bug fixes
- `docs/name` - Documentation

All PRs require:
- Tests passing
- No linting errors
- Documentation updated

---

## Support & Resources

- **Docs**: See `/docs` folder
- **Issues**: GitHub Issues
- **API Docs**: Swagger at `localhost:8000/docs`
- **Architecture**: `NEURAL_ARCHITECTURE.md`
- **Integration**: `NEURAL_INTEGRATION_GUIDE.md`

---

## Summary

AICouncil is a production-ready distributed consensus engine that:

✅ Orchestrates multiple AI agents  
✅ Records reasoning on Sui blockchain  
✅ Archives everything on Arweave  
✅ Provides full cryptographic proof  
✅ Runs locally or cloud-deployed  
✅ Scales from test to production  

Ready for Phase 3 expansion with RAG, NFTs, and user management.

---

*Built with ⚡ for epistemic consensus*
