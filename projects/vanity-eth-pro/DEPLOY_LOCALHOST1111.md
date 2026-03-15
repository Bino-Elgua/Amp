# 🔮 Deploy ÀṣẹMirror on localhost:1111

All configurations updated to use port 1111.

## Quick Deploy (3 steps)

```bash
# Step 1: Install dependencies
cd /data/data/com.termux/files/home/aśẹmirror
npm install

# Step 2: Configure (choose your LLM)
cp .env.example .env
# Edit .env with your API key
# LLM_PROVIDER=openai
# OPENAI_API_KEY=sk-...

# Step 3: Run
npm run index    # First time only (5-10 minutes)
npm run dev      # Starts on http://localhost:1111
```

## Access

**Local**: `http://localhost:1111`

**From other machines on network**: `http://YOUR_IP:1111`

To find your IP:
```bash
hostname -I    # Linux/Mac
ipconfig       # Windows
```

## Docker Deployment (Port 1111)

```bash
# Build image
docker build -t asemirror:latest .

# Run on port 1111
docker run -d \
  -p 1111:1111 \
  -e LLM_PROVIDER=openai \
  -e OPENAI_API_KEY=sk-... \
  -e QDRANT_URL=http://qdrant:6333 \
  --name asemirror \
  asemirror:latest
```

Or with Docker Compose:

```yaml
version: '3.8'

services:
  asemirror:
    build: .
    ports:
      - "1111:1111"
    environment:
      LLM_PROVIDER: openai
      OPENAI_API_KEY: ${OPENAI_API_KEY}
      QDRANT_URL: http://qdrant:6333
      PORT: 1111
    depends_on:
      - qdrant

  qdrant:
    image: qdrant/qdrant:latest
    ports:
      - "6333:6333"
    volumes:
      - ./qdrant_storage:/qdrant/storage
```

Run: `docker-compose up -d`

## Port Configuration

Port 1111 is configured in:
- ✅ `vite.config.ts` (dev server)
- ✅ `.env.example` (configuration)
- ✅ `.env.production` (production config)

## Verify It's Running

```bash
# Check if port 1111 is listening
lsof -i :1111

# Or in browser
curl http://localhost:1111
```

## Environment Variables

All can be set in `.env`:

```
PORT=1111
LLM_PROVIDER=openai
OPENAI_API_KEY=sk-...
QDRANT_URL=http://localhost:6333
GITHUB_REPOS=jbino85/council,jbino85/oso-lang,jbino85/ifascript,jbino85/techgnosis
PHONE_KEY=your-secret
```

## Troubleshooting

### Port already in use
```bash
# Find what's using port 1111
lsof -i :1111

# Kill it
kill -9 <PID>

# Or use different port (edit vite.config.ts)
```

### Can't connect from other machine
```bash
# Check firewall
sudo ufw allow 1111

# Or disable temporarily
sudo ufw disable
```

### App loads but search doesn't work
```bash
# Run indexer
npm run index

# Check .env has LLM_PROVIDER and API key
cat .env
```

## Accessing from Phone

If server is on computer:

1. Get computer IP: `hostname -I`
2. On phone browser: `http://COMPUTER_IP:1111`
3. Or install as PWA: Menu → Install app

## Next Steps

1. ✅ Running on localhost:1111
2. Test all 5 tabs
3. Try some searches
4. Share with team (give them `http://YOUR_IP:1111`)
5. Deploy to Vercel for internet access

---

🤍⚡🍶

App is now listening on **localhost:1111**
