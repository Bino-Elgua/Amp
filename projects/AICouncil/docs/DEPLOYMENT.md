# Deployment Guide

## Overview

AICouncil is designed to deploy seamlessly from local development to production. This guide covers all deployment scenarios.

## Phase 1: Local Development

### Prerequisites

- Docker & Docker Compose
- Git
- At least 8GB RAM, 10GB disk space

### Quick Start

```bash
# Clone repository
git clone https://github.com/jbino85/AIcouncil.git
cd AIcouncil

# Copy environment template
cp .env.example .env

# Edit .env with your configuration
nano .env
# Set: VENICE_API_KEY, LITELLM_MASTER_KEY, etc.

# Start services
docker compose up

# Wait for services to initialize (2-3 minutes)
# Then visit: http://localhost:8080
```

### Verify Services

```bash
# Check all containers are running
docker compose ps

# OpenWebUI: http://localhost:8080
# Council API: http://localhost:8000/docs
# LiteLLM: curl http://localhost:4000/health
# Ollama: curl http://localhost:11434/api/tags
```

### First Run

1. **OpenWebUI** will be empty - add your Venice API key in settings
2. **Chat**: Type a message, it will route through LiteLLM to Venice
3. **Council Mode**: Click ⚡ icon to run deliberation (Phase 2)
4. **Test Ollama**: If Venice offline, messages auto-fallback to local models

## Phase 2: Local Testing with Akash Preparation

### Test Complete Stack

```bash
# Run all tests
npm test

# Run integration tests
npm run test:integration

# Build Docker images
npm run docker:build

# Check image size
docker images | grep aicouncil
```

### Generate Akash SDL (Phase 2 Task 5)

```bash
# Create deploy.foundation.yaml for testnet
python deploy/scripts/generate_akash_sdl.py \
  --target testnet \
  --output deploy/akash/deploy.foundation.yaml

# Verify SDL
akash tx deployment create deploy/akash/deploy.foundation.yaml
```

## Phase 3: Testnet Deployment (Akash)

### Prerequisites

- Akash CLI installed
- Akash wallet with AKT tokens
- Docker Hub account

### Push Images to Registry

```bash
# Login to Docker Hub
docker login

# Tag and push
docker tag aicouncil-council:latest YOUR_REGISTRY/aicouncil-council:latest
docker tag aicouncil-openwebui:latest YOUR_REGISTRY/aicouncil-openwebui:latest
docker tag aicouncil-litellm:latest YOUR_REGISTRY/aicouncil-litellm:latest

docker push YOUR_REGISTRY/aicouncil-council:latest
docker push YOUR_REGISTRY/aicouncil-openwebui:latest
docker push YOUR_REGISTRY/aicouncil-litellm:latest
```

### Deploy to Akash Testnet

```bash
# Set environment
export AKASH_NET="https://testnet.akash.network:443"
export AKASH_CHAIN_ID="testnet-02"

# Create deployment
akash tx deployment create \
  deploy/akash/deploy.foundation.yaml \
  --from your-wallet-name \
  --node $AKASH_NET:26657 \
  --chain-id $AKASH_CHAIN_ID

# Monitor deployment
akash query deployment list --owner $(akash keys show your-wallet-name -a)

# Get provider lease
akash provider lease-status $DEPLOYMENT_ID $PROVIDER_ADDRESS

# Access services
# OpenWebUI: http://<provider-ip>:8080
# Council: http://<provider-ip>:8000/docs
```

## Phase 4: Mainnet Production

### Prerequisites

- Production Akash configuration
- Monitoring & alerting (Prometheus, Grafana)
- SSL/TLS certificates
- Database backups
- API key management system

### Pre-Production Checklist

```bash
# Security audit
npm audit
pip-audit

# Performance test
npm run test:performance

# Load test
k6 run deploy/load-tests/council-api.js

# Security scan
docker scan aicouncil-council:latest
trivy image aicouncil-council:latest
```

### Generate Production SDL

```bash
python deploy/scripts/generate_akash_sdl.py \
  --target mainnet \
  --high-availability \
  --multi-region \
  --output deploy/akash/deploy.production.yaml
```

### Deploy to Mainnet

```bash
# Set production environment
export AKASH_NET="https://akash.c29r3.xyz:443"
export AKASH_CHAIN_ID="akashnet-2"

# Create deployment
akash tx deployment create \
  deploy/akash/deploy.production.yaml \
  --from mainnet-wallet \
  --node $AKASH_NET:26657 \
  --chain-id $AKASH_CHAIN_ID \
  --gas auto \
  --gas-adjustment 1.5

# Monitor lease status
watch -n 5 "akash provider lease-status $DEPLOYMENT_ID $PROVIDER_ADDRESS"

# Setup reverse proxy (nginx)
cp deploy/nginx/aicouncil.conf /etc/nginx/sites-available/
ln -s /etc/nginx/sites-available/aicouncil.conf /etc/nginx/sites-enabled/
systemctl reload nginx

# Enable SSL
certbot --nginx -d aicouncil.example.com
```

## Monitoring & Observability

### Enable Prometheus

```bash
# Enable in .env
APM_ENABLED=true
PROMETHEUS_PORT=9090

# Restart services
docker compose restart

# View metrics
open http://localhost:9090
```

### Logs

```bash
# View all logs
docker compose logs -f

# View specific service
docker compose logs -f council

# Export logs
docker compose logs > logs.txt
```

### Alerts

```bash
# Setup Sentry for error tracking
SENTRY_DSN=https://key@sentry.io/project-id

# Then restart
docker compose down
docker compose up
```

## Backup & Recovery

### Database Backup

```bash
# Backup Postgres
docker compose exec postgres pg_dump -U aicouncil aicouncil > backup.sql

# Restore
docker compose exec -T postgres psql -U aicouncil aicouncil < backup.sql
```

### Redis Backup

```bash
# Backup cache
docker compose exec redis redis-cli BGSAVE

# Restore
docker cp redis_backup.rdb <container_id>:/data/
```

## Scaling

### Horizontal Scaling (Kubernetes)

```bash
# Convert docker-compose to K8s
kompose convert -f docker-compose.yml -o deploy/k8s/

# Deploy to K8s
kubectl apply -f deploy/k8s/

# Scale council service
kubectl scale deployment aicouncil-council --replicas=3

# View status
kubectl get pods -l app=aicouncil
```

### Vertical Scaling

Edit `docker-compose.yml`:
```yaml
services:
  council:
    deploy:
      resources:
        limits:
          cpus: '2'
          memory: 4G
        reservations:
          cpus: '1'
          memory: 2G
```

## Troubleshooting

### Services Won't Start

```bash
# Check Docker daemon
docker ps

# Check logs
docker compose logs

# Rebuild images
docker compose down
docker compose build --no-cache
docker compose up
```

### Out of Memory

```bash
# Monitor resource usage
docker stats

# Increase swap
docker run --memory-swap=8g ...

# Or reduce model size in Ollama
```

### Venice API Timeout

```bash
# Check connectivity
curl -H "Authorization: Bearer $VENICE_API_KEY" \
  https://api.venice.ai/v1/models

# Increase timeout in litellm/config.yaml
timeout: 120

# Restart litellm
docker compose restart litellm
```

## Cost Optimization

- Use Ollama for non-critical tasks (saves Venice API calls)
- Monitor spending via LiteLLM dashboard (Phase 4)
- Set rate limits per user (Phase 4)
- Archive old sessions to Arweave (Phase 3)

## See Also

- [Architecture](./ARCHITECTURE.md)
- [API Documentation](./API.md)
- [Configuration Guide](./CONFIGURATION.md)
