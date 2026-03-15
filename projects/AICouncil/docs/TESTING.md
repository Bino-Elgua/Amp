# Testing Guide – Task 5

Complete testing strategy for AICouncil from local development to Akash testnet.

## Test Levels

### 1. Unit Tests

Test individual components in isolation.

```bash
# Run all unit tests
npm test

# JavaScript only
npm run test:js

# Python only
pytest services/ middleware/ -v
```

**Coverage targets:**
- Council service: ≥80%
- LiteLLM integration: ≥75%
- Guardrails: ≥85%

### 2. Integration Tests

Test services communicating together.

```bash
# Start test stack
docker compose -f deploy/docker/docker-compose.test.yml up

# In another terminal, run integration tests
pytest tests/integration/ -v -s

# Full stack test
npm run test:integration
```

**What's tested:**
- OpenWebUI → LiteLLM → Venice/Ollama flow
- LiteLLM → Council Service API
- Council → Agent consensus calculations
- Error handling & timeouts
- Concurrent requests

### 3. E2E Tests

Full user journey from UI to deliberation.

```bash
# Install test tools
npm install -D @playwright/test

# Run E2E tests
npx playwright test

# Watch mode
npx playwright test --debug
```

**Scenarios:**
- User sends chat message
- Message routes through LiteLLM
- Council Mode activated
- Deliberation completes & displays
- Results exportable

## Local Testing Checklist

### Prerequisites

```bash
# Verify Docker running
docker ps

# Verify services accessible
curl http://localhost:8080  # OpenWebUI
curl http://localhost:4000/health  # LiteLLM
curl http://localhost:8000/health  # Council
curl http://localhost:11434/api/tags  # Ollama
```

### Phase 1: Service Health

```bash
# Start services
docker compose -f deploy/docker/docker-compose.dev.yml up

# Wait 30-60 seconds for services to initialize
sleep 60

# Check all are healthy
docker compose ps

# Expected output:
# council       Up (healthy)
# litellm       Up (healthy)
# ollama        Up (healthy)
# openwebui     Up
```

### Phase 2: API Validation

```bash
# Test LiteLLM
curl http://localhost:4000/health

# Test Council
curl http://localhost:8000/health

# Test Deliberation
curl -X POST http://localhost:8000/api/council/deliberate \
  -H "Content-Type: application/json" \
  -d '{"topic": "Should we test?", "num_agents": 3}'

# Expected: 200 OK with consensus score
```

### Phase 3: OpenWebUI Integration

1. Navigate to http://localhost:8080
2. Send a test message: "Hello, what is consensus?"
3. Should receive response from Ollama (fallback to local model)
4. Check logs:
   ```bash
   docker logs aicouncil-litellm-dev
   ```

### Phase 4: Council Mode (Phase 2)

1. In OpenWebUI, click ⚡ icon
2. Topic: "Should we use AI for testing?"
3. Agents: 3
4. Should see:
   - Consensus gauge
   - Agent votes
   - Chairman summary
   - Disagreement radar

## Performance Testing

### Load Testing

```bash
# Install K6
# https://k6.io/docs/getting-started/installation/

# Run load test
k6 run deploy/load-tests/council-api.js

# Metrics:
# - p95 latency < 5s
# - Error rate < 1%
# - Throughput > 10 req/s
```

### Memory Profiling

```bash
# Monitor resource usage
docker stats

# Should see:
# Council: <500MB
# LiteLLM: <1GB
# Ollama: <2GB (varies by model)
```

### Latency Benchmarks

| Operation | Target | Actual |
|-----------|--------|--------|
| Health check | <100ms | - |
| LiteLLM → Ollama | <2s | - |
| Council deliberation (3 agents) | <30s | - |
| OpenWebUI response | <5s | - |

## Troubleshooting Tests

### Services won't start

```bash
# Check logs
docker compose logs

# Restart with clean state
docker compose down -v
docker compose up --build
```

### Port conflicts

```bash
# Find what's using port 8000
lsof -i :8000

# Kill the process
kill -9 <PID>

# Or use different port
COUNCIL_PORT=8001 docker compose up
```

### Memory issues

```bash
# Increase Docker memory limit
# Docker Desktop → Preferences → Resources → Memory: 8GB

# Or reduce model size
# Edit .env: OLLAMA_MODELS=mistral (smaller than llama2)
```

### LiteLLM timeout

```bash
# Increase timeout in litellm/config.yaml
timeout: 120

# Restart LiteLLM
docker compose restart litellm
```

## Akash Testnet Validation

### Prerequisites

```bash
# Install Akash CLI
# https://docs.akash.network/guides/cli

# Set environment
export AKASH_NET="https://testnet.akash.network:443"
export AKASH_CHAIN_ID="testnet-02"

# Verify connection
akash query bank balances $(akash keys show mykey -a)
```

### Validate SDL

```bash
# Check deploy.foundation.yaml syntax
akash validate deploy/akash/deploy.foundation.yaml

# Should output: SDL is valid
```

### Test Deployment

```bash
# Create test deployment
akash tx deployment create \
  deploy/akash/deploy.foundation.yaml \
  --from my-wallet \
  --node $AKASH_NET:26657 \
  --chain-id $AKASH_CHAIN_ID

# Monitor deployment
DEPLOYMENT_ID=$(akash query deployment list --output json | jq -r '.deployments[0].deployment_id.dseq')
akash query deployment list --owner $(akash keys show mykey -a)

# Get provider lease
PROVIDER_ADDRESS=$(akash query market lease list | jq -r '.leases[0].lease_id.provider')
akash provider lease-status $DEPLOYMENT_ID $PROVIDER_ADDRESS

# Access deployed services
# OpenWebUI: http://<provider-hostname>:8080
# Council: http://<provider-hostname>:8000
```

## CI/CD Integration

### GitHub Actions Example

```yaml
name: Test

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    services:
      docker:
        image: docker:latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Set up Node
        uses: actions/setup-node@v3
        with:
          node-version: 18
      
      - name: Install dependencies
        run: npm install
      
      - name: Run unit tests
        run: npm test -- --coverage
      
      - name: Run linting
        run: npm run lint
      
      - name: Build Docker images
        run: docker compose -f deploy/docker/docker-compose.yml build
      
      - name: Start services
        run: docker compose -f deploy/docker/docker-compose.test.yml up -d
      
      - name: Wait for services
        run: sleep 60
      
      - name: Run integration tests
        run: pytest tests/integration/ -v
      
      - name: Upload coverage
        uses: codecov/codecov-action@v3
```

## Manual Regression Testing

Before each release, verify:

- [ ] Chat messages send & receive
- [ ] Council Mode deliberates correctly
- [ ] Disagreement NFT option appears (when applicable)
- [ ] Fallback to Ollama works (unplug internet)
- [ ] Rate limiting blocks excessive requests
- [ ] Guardrails refuse harmful content
- [ ] Session archives to Arweave (Phase 3)
- [ ] Cost tracking accurate (Phase 4)
- [ ] Auth required (Phase 4)

## See Also

- [Deployment Guide](./DEPLOYMENT.md)
- [Architecture](./ARCHITECTURE.md)
- [Contributing](../CONTRIBUTING.md)
