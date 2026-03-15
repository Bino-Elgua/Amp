# AICouncil Architecture

## System Overview

AICouncil is a distributed epistemic consensus engine that orchestrates multiple AI agents to deliberate, reach consensus, and maintain cryptographic proof of discourse.

```
┌─────────────────────────────────────────────────────────────┐
│                    OpenWebUI (Port 8080)                   │
│              Venice-themed chat interface                   │
└────────────────────────────┬────────────────────────────────┘
                             │
        ┌────────────────────▼──────────────────┐
        │      LiteLLM Proxy (Port 4000)        │
        │   Venice API ◄──fallback──► Ollama    │
        │  Rate limiting • Guardrails            │
        └────────────────────┬──────────────────┘
                             │
        ┌────────────────────▼──────────────────┐
        │    Council Service (Port 8000)        │
        │  Deliberation • Consensus • NFT        │
        └────────────────────┬──────────────────┘
                             │
        ┌────┬──────────┬────┴─────┬────────────┐
        │    │          │          │            │
    ┌───▼─┐ │      ┌───▼───┐  ┌──▼──┐     ┌──▼────┐
    │ RAG │ │      │Flowise│  │Arweave  │   │Sui NFT│
    └─────┘ │      └───────┘  └──────┘     └───────┘
            │
        ┌───▼────────────────┐
        │  Data Persistence  │
        │  • Postgres        │
        │  • Redis (cache)   │
        │  • Arweave (perm)  │
        └────────────────────┘
```

## Components

### 1. OpenWebUI (Frontend)
- **Role:** User-facing chat interface
- **Port:** 8080
- **Language:** TypeScript/React
- **Phase:** 1 (Foundation) → 2 (Theming)
- **Connection:** OpenAI-compatible API to LiteLLM

### 2. LiteLLM (API Proxy)
- **Role:** Unified API proxy with provider abstraction
- **Port:** 4000
- **Language:** Python
- **Features:**
  - Route Venice API as primary
  - Fallback to Ollama for local models
  - Rate limiting & cost tracking (Phase 4)
  - Hard refusal guardrails (Phase 4)
- **Config:** `deploy/docker/litellm/config.yaml`

### 3. Ollama (Local Models)
- **Role:** Local LLM runtime
- **Port:** 11434
- **Models:** Llama 2, Mistral, Neural Chat
- **Use:** Fallback when Venice unavailable

### 4. Council Service (Core Logic)
- **Role:** Deliberation engine
- **Port:** 8000
- **Language:** Python/FastAPI
- **Key Endpoints:**
  - `POST /api/council/deliberate` – Run deliberation
  - `GET /api/council/agents` – List available agents
  - `GET /health` – Health check
- **Phase:** 2 (Intelligence)

### 5. AnythingLLM (RAG)
- **Role:** Document ingestion & retrieval
- **Port:** 3001
- **Phase:** 3 (Provenance)

### 6. Flowise (Ritual Builder)
- **Role:** Drag-and-drop agent creation
- **Port:** 3000
- **Phase:** 3 (Provenance)

### 7. Data Layer
- **Postgres:** User data, session history
- **Redis:** Caching, rate limit counters
- **Arweave:** Permanent session archives (Phase 3)

## Data Flow

### Standard Query Flow
```
1. User sends message in OpenWebUI
2. Message sent to LiteLLM proxy
3. LiteLLM checks rate limits (Phase 4)
4. Request routed to Venice API (or fallback to Ollama)
5. Response returned to OpenWebUI
```

### Council Deliberation Flow
```
1. User triggers "Council Mode" in OpenWebUI
2. Query forwarded to Council service
3. Council service:
   - Generates N agent personas
   - Sends query to each via LiteLLM
   - Collects votes & reasoning
   - Calculates consensus score
   - Generates chairman summary
4. Results returned to UI with visualization
5. If disagreement > threshold, propose NFT minting (Phase 3)
```

### Provenance Flow (Phase 3)
```
1. Council deliberation completes
2. Session auto-archived to Arweave
3. Arweave TX ID stored in Postgres
4. High disagreement → propose NFT mint to Sui
5. User can view immutable proof of discourse
```

## Network Architecture

All services communicate via internal Docker network `aicouncil`:
- No services expose credentials to external network
- All secrets loaded from `.env`
- Database credentials not exposed to frontend

## Deployment Targets

### Local Development
- `docker-compose.dev.yml` - Single machine, hot reload

### Testnet
- `deploy.foundation.yaml` - Akash testnet (Phase 2)

### Production
- `deploy.production.yaml` - Multi-region, auto-scaling (Phase 4)

## API Contracts

See `/docs/API.md` for full OpenAPI specifications.

## Security Model

- **Authentication:** Supabase (Phase 4)
- **Rate Limiting:** Redis middleware (Phase 4)
- **Content Moderation:** Embedding-based jailbreak detection (Phase 4)
- **Audit Trail:** Arweave permanent storage (Phase 3)

## Scaling Considerations

- Stateless services (Council, OpenWebUI)
- Shared data layer (Postgres, Redis, Arweave)
- Container orchestration via Docker Compose → Kubernetes
- Load balancing via reverse proxy (nginx)

---

See `/docs` for detailed guides on each component.
