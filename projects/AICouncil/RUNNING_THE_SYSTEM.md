# Running the Complete AICouncil System

**Status**: ✅ Everything Ready (except Phase 2 smart contract)

---

## System Architecture

```
┌─────────────────────────────────────────────────┐
│           OpenWebUI (Port 5173)                 │
│     - Chat interface                            │
│     - Consensus visualization                   │
│     - Blockchain proof display                  │
└──────────────────────┬──────────────────────────┘
                       │ HTTP/JSON
                       ▼
┌─────────────────────────────────────────────────┐
│        Council Service (Port 8000)              │
│     - API endpoints                             │
│     - Deliberation engine                       │
│     - Blockchain integration                    │
└──────────────────────┬──────────────────────────┘
                       │
        ┌──────────────┼──────────────┐
        ▼              ▼              ▼
    ┌────────┐   ┌────────┐   ┌──────────┐
    │  Sui   │   │ Agents │   │ Arweave  │
    │Blockchain  │Reasoning   │ Archive  │
    └────────┘   └────────┘   └──────────┘
```

---

## Prerequisites

### Required

- **Python 3.9+**
  ```bash
  python3 --version
  ```

- **Node.js 16+**
  ```bash
  node --version
  npm --version
  ```

- **Git**
  ```bash
  git --version
  ```

### Optional

- **Ollama** (for local LLM fallback)
  - Download: https://ollama.ai
  - Run: `ollama serve`

- **Venice API Key** (for high-quality reasoning)
  - Sign up: https://venice.ai
  - Get key from dashboard

---

## Step-by-Step Setup

### Step 1: Clone Repository

```bash
git clone https://github.com/jbino85/AIcouncil.git
cd AIcouncil
```

### Step 2: Environment Setup

Copy and configure `.env`:

```bash
cp .env.example .env
```

Edit `.env` with your settings:

```bash
# Council Service (required)
COUNCIL_PORT=8000
COUNCIL_DEBUG=true

# Optional: Venice API for better reasoning
VENICE_API_KEY=your-key-here
VENICE_API_BASE=https://api.venice.ai/v1

# Optional: Ollama fallback
OLLAMA_ENDPOINT=http://localhost:11434

# Optional: Arweave permanent storage
ARWEAVE_WALLET_PATH=/path/to/wallet.json

# Blockchain (Phase 2 required)
SUI_RPC_URL=https://fullnode.testnet.sui.io:443
NEURAL_BRAIN_PACKAGE_ID=0x...  # After Phase 2
AGENT_REGISTRY_ID=0x...        # After Phase 2
ROUND_COUNTER_ID=0x...         # After Phase 2
```

### Step 3: Install Dependencies

#### Council Service

```bash
cd services/council
pip install -r requirements.txt
cd ../..
```

#### Neural Brain

```bash
cd services/neural-brain
pip install -r requirements.txt
cd ../..
```

#### OpenWebUI

```bash
cd apps/openwebui
npm install
cd ../..
```

---

## Running the System

### Option A: Terminal-Based (Simple)

**Terminal 1 - Council Service**
```bash
cd services/council
python3 main.py
```

Expected output:
```
🏛️  AICouncil Service starting...
✅ Blockchain integration loaded
Listening on: http://0.0.0.0:8000
API Docs: http://localhost:8000/docs
```

**Terminal 2 - OpenWebUI**
```bash
cd apps/openwebui
npm run dev
```

Expected output:
```
  VITE v5.0.0  ready in 1234 ms

  ➜  Local:   http://localhost:5173/
```

**Terminal 3 (Optional) - Tests**
```bash
cd services/neural-brain
python3 test_blockchain_integration.py
```

---

### Option B: Docker (Advanced)

```bash
# Build all services
docker-compose build

# Run all services
docker-compose up

# Or specific service
docker-compose up council-service
```

---

## Testing the System

### Quick Health Check

```bash
# Check Council Service
curl http://localhost:8000/health

# Expected response:
# {"status":"healthy","service":"council","debug":true}

# Check API status
curl http://localhost:8000/api/council/status

# Check blockchain integration
curl http://localhost:8000/api/council/blockchain/status
```

### Test Regular Deliberation

```bash
curl -X POST http://localhost:8000/api/council/deliberate \
  -H "Content-Type: application/json" \
  -d '{
    "topic": "Should we use blockchain for AI consensus?",
    "num_agents": 3
  }'
```

### Test Blockchain Deliberation

```bash
curl -X POST http://localhost:8000/api/council/deliberate-blockchain \
  -H "Content-Type: application/json" \
  -d '{
    "topic": "Should we implement distributed AI governance?",
    "num_agents": 3,
    "timeout": 30
  }'
```

### Run Automated Tests

```bash
cd AIcouncil
chmod +x run-tests.sh
./run-tests.sh
```

---

## Accessing the System

### OpenWebUI

Open browser to: **http://localhost:5173**

Features:
- Chat interface
- Regular deliberation mode
- Blockchain mode
- Agent selection (1-5)
- Consensus visualization
- Blockchain proof display

### API Documentation

Swagger UI: **http://localhost:8000/docs**

Features:
- All endpoints documented
- Try-it-out feature
- Request/response examples

### Direct API

Base URL: `http://localhost:8000`

Endpoints:
```
POST   /api/council/deliberate
POST   /api/council/deliberate-blockchain
GET    /api/council/status
GET    /api/council/blockchain/status
GET    /api/council/blockchain/history
GET    /api/council/blockchain/agent-state/{agent_id}
GET    /api/council/agents
```

---

## Usage Workflows

### Workflow 1: Regular Deliberation

```
1. Open http://localhost:5173
2. Ensure "Blockchain Mode" is OFF (💬 icon)
3. Type your question/topic
4. Click "💬 Send"
5. Wait for response (~5-20 seconds)
6. View agent votes and consensus score
```

### Workflow 2: Blockchain Deliberation

```
1. Open http://localhost:5173
2. Toggle "Blockchain Mode" ON (⛓️ icon)
3. Type your question/topic
4. Select number of agents (1-5)
5. Click "⛓️ Send"
6. Wait for blockchain recording (~5-20 seconds)
7. View full blockchain proofs:
   - On-chain transaction links
   - Arweave archives
   - Agent influence networks
   - Consensus summary
8. Click links to explore on blockchain explorers
```

### Workflow 3: API Testing

```
# Test with curl
curl -X POST http://localhost:8000/api/council/deliberate-blockchain \
  -H "Content-Type: application/json" \
  -d '{
    "topic": "Test proposal",
    "num_agents": 3,
    "timeout": 30
  }'

# Or use Swagger UI at http://localhost:8000/docs
```

---

## Troubleshooting

### Council Service Won't Start

**Error**: `Address already in use`
- Solution: Change COUNCIL_PORT in .env or kill existing process
  ```bash
  lsof -i :8000
  kill -9 <PID>
  ```

**Error**: `ModuleNotFoundError: No module named 'fastapi'`
- Solution: Install dependencies
  ```bash
  cd services/council
  pip install -r requirements.txt
  ```

### OpenWebUI Won't Load

**Error**: `ERR_CONNECTION_REFUSED` to localhost:5173
- Solution: Start the dev server
  ```bash
  cd apps/openwebui
  npm run dev
  ```

**Error**: `Cannot find module 'svelte'`
- Solution: Install dependencies
  ```bash
  cd apps/openwebui
  npm install
  ```

### API Connection Issues

**Error**: Cannot reach http://localhost:8000
- Solution: Start Council Service first
  ```bash
  cd services/council
  python3 main.py
  ```

**Error**: CORS errors in browser
- Solution: Ensure proxy is configured in `vite.config.js`

### Blockchain Features Not Working

**Error**: "Blockchain integration not available"
- Solution: This is normal for Phase 2. Blockchain features gracefully degrade.

**Error**: "Contract not configured"
- Solution: Update NEURAL_BRAIN_PACKAGE_ID in .env (requires Phase 2)

### Slow Responses

**Issue**: Deliberation takes >30 seconds
- Solution: 
  - Reduce num_agents (use 1-2 for faster testing)
  - Reduce timeout to 10-15 seconds
  - Check system resources (CPU, RAM)

---

## Performance Optimization

### For Better Performance

```bash
# Use production build for UI
cd apps/openwebui
npm run build
npm run preview  # Instead of dev server
```

### Scaling

```bash
# Run multiple Council Service instances
# Instance 1
COUNCIL_PORT=8000 python3 services/council/main.py

# Instance 2
COUNCIL_PORT=8001 python3 services/council/main.py

# Use load balancer or reverse proxy in front
```

---

## Advanced Configuration

### Custom Agents

Edit `services/council/council_blockchain.py` function `get_available_agents()`:

```python
default_agents = [
    {
        'id': 'my_agent',
        'name': 'My Custom Agent',
        'expertise': ['domain1', 'domain2'],
        'model': 'llama2'
    },
    # ... more agents
]
```

### Custom LLM Integration

Edit `services/neural-brain/blockchain_core.py` method `_call_agent_llm()`:

```python
async def _call_agent_llm(self, agent: Dict, topic: str) -> str:
    # Replace mock implementation with real LLM call
    response = await your_llm_api.call(agent, topic)
    return response
```

### Arweave Integration

Set ARWEAVE_WALLET_PATH in .env:

```bash
ARWEAVE_WALLET_PATH=/path/to/arweave-wallet.json
```

Arweave archives will be enabled automatically.

---

## Monitoring & Debugging

### Enable Debug Logging

```bash
# In .env
COUNCIL_DEBUG=true
```

### View Service Logs

```bash
# Council Service logs
tail -f services/council/council.log

# Browser Console
F12 -> Console tab
```

### Test Specific Endpoints

```bash
# Health check
curl http://localhost:8000/health

# Get deliberation history
curl http://localhost:8000/api/council/blockchain/history

# Get specific agent state
curl http://localhost:8000/api/council/blockchain/agent-state/logical_analyzer
```

---

## Deployment

### Development

```bash
npm run dev
python3 services/council/main.py
```

### Production

```bash
# Build frontend
cd apps/openwebui
npm run build

# Run with production server
npm run preview

# Or use Docker
docker-compose -f docker-compose.prod.yml up
```

### Cloud Deployment

See `PHASE_4_UI.md` and deployment documentation for:
- Heroku
- AWS
- Google Cloud
- Akash (decentralized)

---

## System Status

| Component | Status | Port | URL |
|-----------|--------|------|-----|
| OpenWebUI | ✅ | 5173 | http://localhost:5173 |
| Council Service | ✅ | 8000 | http://localhost:8000 |
| API Docs | ✅ | 8000 | http://localhost:8000/docs |
| Tests | ✅ | - | `./run-tests.sh` |
| Smart Contract | ⏳ | - | See PHASE_2_SUI_DEPLOYMENT.md |

---

## Quick Reference

```bash
# Install everything
cd services/council && pip install -r requirements.txt
cd ../neural-brain && pip install -r requirements.txt
cd ../../apps/openwebui && npm install

# Run everything (3 terminals)
# Terminal 1
cd services/council && python3 main.py

# Terminal 2
cd apps/openwebui && npm run dev

# Terminal 3
curl http://localhost:5173

# Test everything
./run-tests.sh

# View API docs
open http://localhost:8000/docs
```

---

## Next Steps

1. ✅ Start the system (above)
2. ✅ Test in browser (http://localhost:5173)
3. ⏳ Deploy smart contract (Phase 2)
4. ⏳ Test blockchain features
5. ⏳ Prepare for mainnet

---

**Status**: Ready to Run  
**Last Updated**: December 16, 2024
