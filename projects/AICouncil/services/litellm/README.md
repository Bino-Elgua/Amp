# LiteLLM Proxy Service

Unified API proxy that routes requests to Venice API with automatic fallback to local Ollama models.

## Features

- **Primary Provider:** Venice AI (high-performance, cloud-based)
- **Fallback Provider:** Ollama (local, always available)
- **Automatic Failover:** Seamless fallback if Venice is unavailable
- **Rate Limiting:** Per-user request quotas (Phase 4)
- **Cost Tracking:** Monitor spending on Venice API (Phase 4)
- **Guardrails:** Content moderation & jailbreak detection (Phase 4)

## Architecture

```
OpenWebUI/Client
       │
       ▼
LiteLLM Proxy (Port 4000)
       │
    ┌──┴──┐
    │     │
Venice  Ollama
(Primary)(Fallback)
```

## Configuration

### Environment Variables

```bash
VENICE_API_KEY=your-api-key
VENICE_API_BASE=https://api.venice.ai/v1
OLLAMA_ENDPOINT=http://ollama:11434
LITELLM_LOG_LEVEL=info
LITELLM_MASTER_KEY=your-master-key
RATE_LIMIT_REQUESTS=100
RATE_LIMIT_WINDOW=3600
REDIS_URL=redis://redis:6379
```

### Config File

`deploy/docker/litellm/config.yaml` defines:
- Model routes (gpt-4, gpt-3.5-turbo, llama-405b)
- Fallback mappings
- Rate limits
- Logging level

## Usage

### Start Service

```bash
# Via Docker Compose
docker compose up litellm

# Or manually
python -m litellm.main --config config.yaml --port 4000
```

### API Endpoints

All endpoints are OpenAI-compatible.

#### Chat Completions

```bash
curl http://localhost:4000/v1/chat/completions \
  -H "Authorization: Bearer $LITELLM_MASTER_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gpt-4",
    "messages": [
      {
        "role": "user",
        "content": "What is consensus in epistemic systems?"
      }
    ]
  }'
```

Response:
```json
{
  "id": "chatcmpl-...",
  "object": "chat.completion",
  "created": 1234567890,
  "model": "gpt-4",
  "choices": [
    {
      "index": 0,
      "message": {
        "role": "assistant",
        "content": "Consensus in epistemic systems refers..."
      },
      "finish_reason": "stop"
    }
  ],
  "usage": {
    "prompt_tokens": 10,
    "completion_tokens": 50,
    "total_tokens": 60
  }
}
```

#### Health Check

```bash
curl http://localhost:4000/health
```

Response:
```json
{
  "status": "healthy",
  "timestamp": "2025-12-03T00:00:00Z"
}
```

## Model Routing

### Primary Routes (Venice)
- `gpt-4` → OpenAI's GPT-4 via Venice
- `gpt-3.5-turbo` → OpenAI's GPT-3.5 Turbo via Venice
- `llama-405b` → Meta's Llama 405B via Venice

### Fallback Routes (Ollama)
If Venice is unavailable:
- `gpt-4` → `ollama/llama2`
- `gpt-3.5-turbo` → `ollama/mistral`
- `llama-405b` → `ollama/llama2`

## Failover Behavior

1. Request arrives at LiteLLM
2. First attempt: Venice API
3. If Venice timeout/failure after 30s:
   - Retry logic (2 attempts)
   - Fall back to mapped Ollama model
4. Response sent to client (transparently)

## Rate Limiting (Phase 4)

Per-user quotas via Redis:

```python
# Example: Limit user to 100 requests/hour
RATE_LIMIT_REQUESTS = 100
RATE_LIMIT_WINDOW = 3600  # seconds
```

When limit exceeded:
```json
{
  "error": {
    "message": "Rate limit exceeded",
    "code": "rate_limit_exceeded"
  }
}
```

## Cost Tracking (Phase 4)

All Venice API calls are tracked:

```bash
# View cost for user
GET /v1/cost/user/{user_id}

# View cost by model
GET /v1/cost/model/{model_name}

# View total cost
GET /v1/cost/total
```

## Guardrails (Phase 4)

Requests are checked for:
- Known harmful keywords (CSAM, bioweapons, etc.)
- Jailbreak patterns via embedding similarity
- Rate limit abuse

Refusal example:
```json
{
  "error": {
    "message": "Request violates content policy",
    "code": "content_policy_violation"
  }
}
```

## Debugging

Enable debug logging:

```bash
LITELLM_LOG_LEVEL=debug docker compose up litellm
```

View logs:
```bash
docker logs aicouncil-litellm
```

## Performance

- **Venice latency:** ~500ms avg
- **Ollama latency:** ~1-5s (depends on model)
- **Failover time:** ~30s
- **Throughput:** 100+ concurrent requests

## Troubleshooting

### Venice API Key Invalid

```
Error: Invalid API key
```

**Solution:** Set `VENICE_API_KEY` in `.env`

### Ollama Not Responding

```
Error: Connection refused (Ollama)
```

**Solution:** 
1. Ensure Ollama is running: `docker compose up ollama`
2. Check network: `docker network ls`
3. Verify endpoint: `curl http://ollama:11434/api/tags`

### Rate Limit Hit

```
Error: Rate limit exceeded
```

**Solution:** Wait for the time window to reset, or contact admin to increase quota.

## Development

Run tests:
```bash
pytest tests/litellm/ -v
```

Check code quality:
```bash
flake8 services/litellm/
black services/litellm/ --check
```

## Security

- Master key required for all requests
- Secrets stored in `.env`, never in code
- All traffic logged (sanitized) for audit
- No API keys exposed in responses

## See Also

- [Architecture](../../docs/ARCHITECTURE.md)
- [Venice API Docs](https://docs.venice.ai)
- [LiteLLM Docs](https://litellm.ai)
- [Ollama Docs](https://ollama.ai)
