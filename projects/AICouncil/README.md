# AICouncil – Distributed Epistemic Consensus Engine

A production-ready system for orchestrating multiple AI agents to deliberate on complex topics, reach consensus, and record everything immutably on Sui blockchain with permanent archival on Arweave.

**Status**: Phase 3 Integration ✅ | Phase 4 UI ✅ | Phase 1 Testing ✅ | Phase 2 Smart Contract ⏳

> **Latest**: Blockchain integration complete. Ready for testing. Phase 2 smart contract deployment needed (external machine with Rust).

---

## What It Does

1. **User Asks Question** via OpenWebUI chat interface
2. **Multiple AI Agents Deliberate** in parallel (Logical Analyzer, Pragmatist, Devil's Advocate, Ethics Advisor, etc.)
3. **Consensus Score Calculated** from agent confidence levels
4. **Everything Recorded Immutably**:
   - Agent reasoning hashed on Sui blockchain
   - Full reasoning archived on Arweave
   - Agent influence metrics recorded
   - Cryptographic proofs returned to user

5. **User Gets**:
   - Consensus decision with confidence score
   - Breakdown of each agent's position
   - Synapse network (influence between agents)
   - Links to blockchain explorer & Arweave gateway for verification

---

## Quick Start (5 minutes)

### Prerequisites
- Docker & Docker Compose
- Node.js 18+ & npm 9+
- Python 3.11+
- (Optional) Venice API key

### 1. Clone & Navigate
```bash
git clone https://github.com/jbino85/AIcouncil.git
cd AIcouncil
```

### 2. Set Environment
```bash
cp .env.example .env

# Add your keys to .env
echo "VENICE_API_KEY=your_key_here" >> .env
# Optional: Add Arweave wallet path for permanent storage
echo "ARWEAVE_WALLET_PATH=/path/to/wallet.json" >> .env
```

### 3. Start Services
```bash
# Full stack with Docker
docker compose up

# Or individual services
npm run install:all
npm run dev
```

### 4. Access UI
```
OpenWebUI Chat: http://localhost:8080
Web Dashboard:  http://localhost:3000
API Docs:       http://localhost:8000/docs
Health Check:   http://localhost:8000/health
```

### 5. Test Deliberation
```bash
curl -X POST http://localhost:8000/api/council/deliberate \
  -H "Content-Type: application/json" \
  -d '{
    "topic": "Should we implement this AI safety proposal?",
    "num_agents": 3
  }'
```

---

## Architecture

```
┌──────────────────────────────────┐
│   OpenWebUI (8080) + Web (3000)  │
│    Venice-themed Chat Interface  │
└────────────────┬─────────────────┘
                 │
    ┌────────────┴────────────┐
    │                         │
┌───▼──────────────┐  ┌──────▼──────────────┐
│ Council Service  │  │ Blockchain Neural   │
│ (8000)           │  │ Brain               │
│ Deliberation     │  │ (Consensus Mgmt)    │
│ Orchestration    │  └─────┬──────────────┘
└───────┬──────────┘         │
        │          ┌─────────┴─────────┬────────────┐
    ┌───▼──────────▼──────┐   │                    │
    │  LiteLLM Proxy (4000)│   │                    │
    │  Venice + Ollama     │   │                    │
    └──────────┬───────────┘   │                    │
               │        ┌──────▼───┐    ┌──────────▼────────┐
         ┌─────┴──────┐ │ Sui      │    │  Arweave         │
         │            │ │ RPC      │    │  (Permanent      │
      Venice API    Ollama  Contract    Storage)
      (Primary)    (Fallback)│          │
                             │         │
                    ┌────────┴───┬─────┴─────┐
                    │            │           │
                On-Chain Records │    Archival
                Synapses        Hashes      Reasoning
                Agents         Consensus    Metadata
```

---

## Project Structure

```
AIcouncil/
│
├── apps/
│   ├── openwebui/               # Venice-themed chat UI
│   └── web/                     # Custom dashboard (Svelte/React)
│
├── services/
│   ├── council/                 # Deliberation orchestration service
│   │   └── main.py             # FastAPI endpoints
│   ├── neural-brain/           # Blockchain consensus engine
│   │   └── blockchain_core.py  # Core integration logic
│   ├── litellm/                # LLM proxy (Venice → Ollama)
│   ├── auth/                   # Authentication (Phase 4)
│   ├── nft-minter/             # NFT proofs (Phase 3)
│   ├── anything-llm/           # RAG service (Phase 3)
│   └── archiver/               # Session archival (Phase 3)
│
├── contracts/
│   └── neural_brain.move       # Sui Move smart contract
│
├── deploy/
│   ├── docker/                 # Docker Compose configs
│   └── akash/                  # Akash deployment (future)
│
├── middleware/                 # Shared utilities
├── tests/                      # Integration tests
│
├── docs/
│   ├── NEURAL_ARCHITECTURE.md          # Visual diagrams
│   ├── NEURAL_INTEGRATION_GUIDE.md     # Setup instructions
│   ├── BLOCKCHAIN_NEURAL_PROJECT_SUMMARY.md
│   └── GUARDRAILS.md                   # Safety measures
│
├── SYSTEM_RUNDOWN.md           # Complete technical overview
├── README.md                   # This file
├── .env.example                # Configuration template
├── docker-compose.yml          # Local development
└── package.json                # Node.js workspaces
```

---

## Components & Status

| Service | Purpose | Status | Port |
|---------|---------|--------|------|
| **OpenWebUI** | Chat interface | Phase 2 | 8080 |
| **Web Dashboard** | Stats & history | Phase 2 | 3000 |
| **Council Service** | Deliberation engine | Phase 2 | 8000 |
| **Blockchain Neural Brain** | Consensus recording | Phase 2 | N/A |
| **LiteLLM Proxy** | LLM gateway | Phase 1 ✅ | 4000 |
| **Auth Service** | User management | Phase 4 | TBD |
| **NFT Minter** | Proof generation | Phase 3 | TBD |
| **RAG Service** | Document retrieval | Phase 3 | TBD |

---

## Features

### ✅ Currently Implemented (Phase 1–2)

- [x] Multi-agent deliberation orchestration
- [x] Parallel agent reasoning via async API calls
- [x] Confidence scoring and consensus calculation
- [x] Synapse formation (agent influence metrics)
- [x] Sui blockchain recording (Move smart contract)
- [x] Arweave permanent archival (decentralized storage)
- [x] Venice API integration (primary LLM provider)
- [x] Ollama fallback (local model support)
- [x] LiteLLM proxy with rate limiting ready
- [x] FastAPI microservices architecture
- [x] Docker Compose local development
- [x] Comprehensive test suite
- [x] API documentation (Swagger)

### 🟡 In Progress (Phase 2–3)

- [ ] OpenWebUI integration & styling
- [ ] Custom web dashboard
- [ ] AnythingLLM RAG pipeline
- [ ] NFT minting for proofs
- [ ] Advanced visualizations (synapse network)
- [ ] Session archival viewer

### 🔵 Planned (Phase 3–4)

- [ ] Supabase authentication
- [ ] Cost tracking & analytics
- [ ] Rate limiting enforcement
- [ ] Hard refusal guardrails
- [ ] Akash cloud deployment
- [ ] Performance monitoring

---

## Configuration

### Environment Variables

Key settings in `.env`:

```bash
# LLM Provider (Venice API)
VENICE_API_KEY=your_api_key_here
VENICE_API_BASE=https://api.venice.ai/v1

# Local Fallback
OLLAMA_ENDPOINT=http://ollama:11434

# Blockchain (Sui)
BLOCKCHAIN_CHAIN=sui
SUI_RPC_URL=https://fullnode.testnet.sui.io:443
NEURAL_BRAIN_CONTRACT_ID=0x...        # Deployed contract address

# Decentralized Storage (Arweave)
ARWEAVE_WALLET_PATH=/path/to/wallet.json

# Council Service
COUNCIL_PORT=8000
COUNCIL_DELIBERATION_TIMEOUT=30        # seconds
COUNCIL_MIN_CONSENSUS=0.5              # 50% threshold

# LiteLLM Proxy
LITELLM_PORT=4000
LITELLM_MASTER_KEY=your_secure_key

# Future (Phase 4)
DATABASE_URL=postgresql://user:pass@localhost/aicouncil
REDIS_URL=redis://localhost:6379
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your_anon_key
```

See `.env.example` for complete list.

---

## Development

### Install Dependencies
```bash
npm run install:all
```

### Start Development Stack
```bash
npm run dev
```

### Run Tests
```bash
npm run test              # All tests
npm run test:js           # Frontend tests
npm run test:python       # Backend tests
npm run test:integration  # Full stack tests
```

### Linting & Formatting
```bash
npm run lint              # Check code style
npm run format            # Auto-format code
npm run typecheck         # TypeScript & Python type checking
```

### Build for Production
```bash
npm run build             # Build all services
npm run docker:build      # Build Docker images
npm run docker:push       # Push to registry
npm run prod              # Deploy prod stack
```

---

## API Endpoints

### Council Service (8000)

```
GET  /
     Root endpoint

GET  /health
     Health check

GET  /api/council/status
     Service status & configuration

POST /api/council/deliberate
     Standard multi-agent deliberation
     Request: {topic, context?, agents?, num_agents}
     Response: {topic, consensus_score, votes[], chairman_summary, recommendation}

POST /api/council/debate
     Focused debate mode (Phase 2)

GET  /api/council/agents
     List available deliberation agents

POST /api/council/deliberate-blockchain
     Blockchain-backed deliberation with Sui recording & Arweave archival
     Response includes: on_chain_proof, arweave_proofs, synapses

GET  /api/council/blockchain/status
     Blockchain integration status

GET  /api/council/blockchain/history
     Deliberation history with blockchain links

GET  /api/council/blockchain/agent-state/{agent_id}
     Individual agent's neural state
```

### LiteLLM Proxy (4000)

```
POST /v1/chat/completions
     OpenAI-compatible chat endpoint

GET  /models
     List available models
```

---

## Deliberation Flow

```
1. User submits topic via UI
2. Council Service receives request
3. BlockchainNeuralBrain orchestrates:
   a. Create consensus round on Sui
   b. Broadcast topic to N agents in parallel
   c. Agents reason using Venice API or Ollama
   d. Calculate synapse weights (influence)
   e. Compute consensus score
   f. Record all data on Sui blockchain
   g. Archive full reasoning to Arweave
4. Return result with proofs
5. User can verify:
   - Sui explorer (on-chain records)
   - Arweave gateway (archived reasoning)
```

**Timeline**: Typical deliberation takes 5–15 seconds depending on model and network latency.

---

## Key Concepts

### Agents
Diverse AI personalities with different expertise:
- **Logical Analyzer**: Evaluates logical consistency
- **Pragmatist**: Considers practical constraints
- **Devil's Advocate**: Challenges assumptions
- **Ethics Advisor**: Considers ethical implications
- **Domain Expert**: Brings specialized knowledge

### Consensus Score
Average confidence of all agents:
- **0.0–0.49**: No consensus ❌
- **0.50–0.74**: Partial consensus ⚠️
- **0.75–1.0**: Strong consensus ✅

### Synapses
Influence network between agents:
- **Weight** = Agent A's confidence × Agent B's confidence × Semantic similarity
- Visualized as a network graph
- Recorded on-chain

### Blockchain Recording
- **On-chain**: Sui Move contract stores hashes & metadata
- **Off-chain**: Full reasoning archived on Arweave
- **Proof**: Transaction hash linking to both

---

## Technology Stack

- **Frontend**: OpenWebUI (MIT), Svelte/React, TypeScript
- **Backend**: FastAPI (Python), AsyncIO
- **LLM Provider**: Venice AI (primary), Ollama (fallback)
- **API Gateway**: LiteLLM
- **Blockchain**: Sui Network (Move contracts)
- **Storage**: Arweave (permanent), Redis (cache, future)
- **Database**: PostgreSQL (sessions, future)
- **Auth**: Supabase OAuth (Phase 4)
- **Container**: Docker, Docker Compose
- **Testing**: Jest (JS), pytest (Python)

---

## Roadmap

### ✅ Phase 1: Foundation
- [x] Monorepo setup
- [x] Docker Compose
- [x] Venice API integration
- [x] Ollama fallback
- [x] LiteLLM proxy

### 🟡 Phase 2: Intelligence (Current)
- [x] Council service with deliberation
- [x] Sui smart contracts
- [x] Arweave archival
- [x] Full blockchain integration
- [ ] OpenWebUI integration
- [ ] GitHub Actions CI/CD

### 🔵 Phase 3: Provenance
- [ ] AnythingLLM RAG
- [ ] Flowise ritual builder
- [ ] NFT proof minting
- [ ] Advanced dashboards
- [ ] Synapse visualization

### 🟣 Phase 4: Production
- [ ] Supabase auth
- [ ] Rate limiting
- [ ] Cost tracking
- [ ] Guardrails
- [ ] Akash deployment
- [ ] Performance scaling

---

## Deployment

### Local Development
```bash
docker compose up
```

### Docker Compose Production
```bash
npm run prod
```

### Akash (Decentralized Cloud)
```bash
akash deploy --from mykey --manifest deploy/akash/manifest.yml
```

See `deploy/` for detailed deployment configs.

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Venice API fails | Fallback to Ollama automatic, check API key |
| Ollama not running | `docker run -d ollama/ollama` or `ollama serve` |
| Sui RPC error | Verify contract deployed, check RPC URL |
| Arweave fails | Ensure wallet has AR tokens, check wallet path |
| Port already in use | Change PORT vars in .env |
| Docker issues | `docker compose down && docker compose up --build` |

---

## Testing

Run the blockchain integration test:

```bash
cd services/neural-brain
python -m pytest test_blockchain_integration.py -v
```

Or run directly:

```bash
python blockchain_core.py
```

Expected output:
```
🧠  BLOCKCHAIN NEURAL INTEGRATION TEST SUITE
✓ Consensus score: 75.3%
✓ Agents participated: 3
✓ Arweave archive: True
✓ Blockchain proof: True
✅ ALL TESTS PASSED
```

---

## Documentation

- **[SYSTEM_RUNDOWN.md](./SYSTEM_RUNDOWN.md)** - Complete technical overview
- **[NEURAL_ARCHITECTURE.md](./NEURAL_ARCHITECTURE.md)** - Visual diagrams & data models
- **[NEURAL_INTEGRATION_GUIDE.md](./NEURAL_INTEGRATION_GUIDE.md)** - Setup & integration steps
- **[BLOCKCHAIN_NEURAL_PROJECT_SUMMARY.md](./BLOCKCHAIN_NEURAL_PROJECT_SUMMARY.md)** - Project overview
- **API Docs** - Swagger at `/docs` (when running)

---

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

```bash
# Create feature branch
git checkout -b feature/your-feature

# Make changes, commit, push
git push origin feature/your-feature

# Open pull request
# Ensure: tests pass, no linting errors, docs updated
```

---

## Licensing & Attribution

Built on excellent open-source foundations:

- **OpenWebUI** (MIT) – Chat interface
- **LiteLLM** (MIT) – API proxy
- **Ollama** (MIT) – Local models
- **Fastapi** (MIT) – Web framework
- **Sui SDK** (Apache 2.0) – Blockchain
- **Arweave** (Apache 2.0) – Permanent storage
- **shadcn/ui** (MIT) – UI components
- **Supabase** (Apache 2.0) – Auth infrastructure

See [ATTRIBUTION.md](./ATTRIBUTION.md) for full details.

---

## Support

- **Issues**: [GitHub Issues](https://github.com/jbino85/AIcouncil/issues)
- **Docs**: See `/docs` folder
- **API**: Swagger at `http://localhost:8000/docs`

---

## License

MIT License – see [LICENSE](./LICENSE)

---

**Built with ⚡ for distributed epistemic consensus**

*Orchestrating AI agents for better decisions, with cryptographic proof.*
