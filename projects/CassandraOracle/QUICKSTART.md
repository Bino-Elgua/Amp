# ⚡ CASSANDRA QUICKSTART

Get Cassandra Oracle running in 5 minutes.

---

## 🚀 One Command Deploy

```bash
docker-compose up -d
```

That's it. The entire system is now running.

---

## ✅ Verify Everything Works

```bash
npm run health:check
```

You should see:
```
✅ CASSANDRA ORACLE HEALTH CHECK
═══════════════════════════════════════════
Status: HEALTHY
Timestamp: 2024-01-22T10:30:00Z

Metrics:
  Total Checks: 6
  Passed: 6
  Warned: 0
  Failed: 0

Detailed Results:
  ✓ Oracle State: Oracle healthy: 0 predictions, 0% accuracy
  ✓ Vector Database: Connected to Qdrant
  ✓ Blockchain: Blockchain connection verified
  ✓ Prediction Engine: Prediction engine operational
  ✓ Code Generation: Code refactoring system ready
  ✓ Deployment System: Deployment orchestration ready

═══════════════════════════════════════════
```

---

## 🔍 Accessing Services

### Oracle API
```
http://localhost:4000
```

**Key endpoints:**
```bash
# Get oracle status
curl http://localhost:4000/api/oracle/status

# Get all predictions
curl http://localhost:4000/api/predictions

# Get system metrics
curl http://localhost:4000/api/metrics

# Get system health
curl http://localhost:4000/api/health/detailed
```

### Dashboard
```
http://localhost:3000
```

Real-time monitoring and metrics.

### Qdrant Vector Database
```
http://localhost:6333/dashboard
```

Vector DB management interface.

### Redis
```
localhost:6379
```

Use Redis CLI or GUI tools to inspect cache.

---

## 🎯 Running Your First Prediction Cycle

### Manual Prediction Generation
```bash
npm run oracle:predict
```

### Watch Real-Time Logs
```bash
docker-compose logs -f cassandra-api
```

### Monitor Metrics
```bash
watch -n 5 'curl -s http://localhost:4000/api/metrics | jq .'
```

---

## 📊 Example API Calls

### Get Oracle Status
```bash
curl http://localhost:4000/api/oracle/status | jq
```

### Trigger Prediction
```bash
curl -X POST http://localhost:4000/api/oracle/predict | jq
```

### Search for Patterns
```bash
curl -X POST http://localhost:4000/api/search \
  -H "Content-Type: application/json" \
  -d '{"query":"agentic ai", "limit": 5}' | jq
```

### Get Predictions by Status
```bash
curl http://localhost:4000/api/predictions?filter=pending | jq
```

---

## 🛠️ Development Mode

```bash
# Start in dev mode (no continuous loop)
npm run dev

# Run specific operations
npm run oracle:predict
npm run oracle:refactor
npm run oracle:deploy
npm run oracle:monitor
```

---

## 📝 Configuration

Edit `.env` file to customize:

```bash
# Change prediction interval
CYCLE_INTERVAL=3600000  # 1 hour

# Change log level
DEBUG=true  # Enable debug logs

# Change API port
API_PORT=4000

# Change oracle mode
ORACLE_MODE=development  # or production
```

---

## 🔗 Next Steps

1. **Connect your GitHub**: Set `GITHUB_TOKEN` in `.env`
2. **Add blockchain**: Set `ETHEREUM_RPC_URL` and key
3. **Setup monitoring**: Configure `LANGFUSE_PUBLIC_KEY`
4. **Create webhooks**: Set `SLACK_WEBHOOK_URL` or `DISCORD_WEBHOOK_URL`

---

## 🐛 Troubleshooting

### Services Not Starting?
```bash
# Check Docker
docker-compose ps

# View logs
docker-compose logs

# Restart
docker-compose restart
```

### API not responding?
```bash
# Check if service is running
curl http://localhost:4000/health

# Check logs
npm run health:check
```

### Memory or CPU issues?
```bash
# Reduce resource usage in docker-compose.yml
# Restart with fresh data
docker-compose down -v
docker-compose up -d
```

---

## 📚 Full Documentation

- **Architecture**: See [README.md](README.md)
- **Deployment**: See [DEPLOYMENT.md](DEPLOYMENT.md)
- **API Docs**: See [API.md](API.md)

---

## 🎬 What Happens Now?

1. **Oracle initializes** (reads state)
2. **Continuous monitoring** begins (default: every hour)
3. **Predictions generated** (from multiple sources)
4. **Vector embeddings stored** (in Qdrant)
5. **Refactoring starts** (for emerged paradigms)
6. **Blockchain commits** (immutable proof)
7. **Deployment staged** (when paradigm emerges)

Watch it happen in real-time:
```bash
docker-compose logs -f cassandra-api | grep -E "PREDICTION|REFACTORING|DEPLOYING|✓"
```

---

## 💡 Pro Tips

### Monitor Everything
```bash
# Terminal 1: Logs
docker-compose logs -f

# Terminal 2: Dashboard
open http://localhost:3000

# Terminal 3: API Status
watch -n 5 'curl -s http://localhost:4000/api/health'
```

### Run Predictions Manually
```bash
# Immediate prediction
npm run oracle:predict

# Then check results
curl http://localhost:4000/api/predictions | jq
```

### Check Metrics
```bash
curl http://localhost:4000/api/metrics | jq '.'
```

### View Blockchain Proofs
```bash
# For a specific prediction ID
curl http://localhost:4000/api/blockchain/proof/{prediction-id}
```

---

## 🎓 Understanding the Flow

1. **Prediction Phase** (continuous)
   - Analyzes trends
   - Scores paradigm likelihood
   - Stores in vector DB

2. **Detection Phase** (real-time)
   - Monitors emergence signals
   - When probability > threshold
   - Triggers refactoring

3. **Refactoring Phase** (automatic)
   - Generates new architecture
   - Tests thoroughly
   - Commits to shadow branch

4. **Deployment Phase** (staged)
   - Canary (5%)
   - Progressive (25%)
   - Majority (75%)
   - Complete (100%)

5. **Learning Phase** (always)
   - Measures accuracy
   - Improves model
   - Next prediction better

---

## ✨ That's It!

You're now running Cassandra Oracle. Watch it predict the future, architect the solutions, and deploy them automatically.

🔮⚡

For full details: See [README.md](README.md)
