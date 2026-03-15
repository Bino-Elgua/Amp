# ÀṣẹMirror Setup Guide

## Installation (5 minutes)

### 1. Install Dependencies
```bash
cd /data/data/com.termux/files/home/aśẹmirror
npm install
```

### 2. Configure Your LLM Provider

Create a `.env` file (copy from `.env.example`):
```bash
cp .env.example .env
```

Then edit `.env` and choose **ONE** primary provider + add API key:

#### Option A: OpenAI (Most powerful)
```
LLM_PROVIDER=openai
OPENAI_API_KEY=sk-...
```
Get key at: https://platform.openai.com/api-keys

#### Option B: Claude (Best for reasoning)
```
LLM_PROVIDER=claude
ANTHROPIC_API_KEY=sk-ant-...
```
Get key at: https://console.anthropic.com

#### Option C: Gemini (Google, free tier available)
```
LLM_PROVIDER=gemini
GOOGLE_API_KEY=AIza...
```
Get key at: https://aistudio.google.com

#### Option D: Mistral (EU-based, privacy-friendly)
```
LLM_PROVIDER=mistral
MISTRAL_API_KEY=...
```
Get key at: https://console.mistral.ai

#### Option E: Groq (Fastest inference)
```
LLM_PROVIDER=groq
GROQ_API_KEY=gsk_...
```
Get key at: https://console.groq.com

#### Option F: Cohere (Production-grade)
```
LLM_PROVIDER=cohere
COHERE_API_KEY=...
```
Get key at: https://dashboard.cohere.ai

### 3. Set Up Qdrant Vector Database

**Option A: Local (Docker)**
```bash
docker run -d --name qdrant -p 6333:6333 qdrant/qdrant
```

**Option B: Cloud** (qdrant.tech)
```
QDRANT_URL=https://your-qdrant-instance.cloud
QDRANT_API_KEY=your-api-key
```

### 4. Configure GitHub (Optional, for repo syncing)
```
GITHUB_TOKEN=ghp_...
GITHUB_REPOS=jbino85/council,jbino85/oso-lang,jbino85/ifascript,jbino85/techgnosis
```

Get token at: https://github.com/settings/tokens

### 5. Index Your Repositories

```bash
npm run index
```

This will:
- Clone all 4 repos
- Extract code chunks
- Generate embeddings using your chosen LLM
- Upload to Qdrant
- Takes ~5-10 minutes first run

### 6. Start the App

```bash
npm run dev
```

Visit: `http://localhost:3000`

---

## Features Once Running

### Search Tab
- **Semantic search** across all repos
- Understands Yorùbá (Àṣẹ, Odù names, Orisha names)
- Examples:
  - "Where does @impact live"
  - "Show me the 1440 wallets"
  - "Tithe split code"

### 7-Layer Tab
- Clickable pyramid visualization
- Each layer links to its implementation files
- Shows data flow

### Timeline Tab
- 7-year inheritance lock progress
- 90-day phase breakdown
- **10 Critical Priority Items** with status
- Sabbath calendar (every Saturday = no transactions)

### 1440 Wallets Tab
- Wallet derivation tree from genesis seed
- 7×7 Journey (inheritance path)
- 7-year yield calculator (11.11% APY)

### Tithe Flow Tab
- 100% allocation visualization
- 50/25/15/10 split breakdown
- Example transaction (100 Àṣẹ)

---

## Deploy to Production

### Option 1: Vercel (Recommended)
```bash
npm install -g vercel
vercel
```

### Option 2: Cloudflare Pages
```bash
npm run build
wrangler deploy
```

### Option 3: Docker
```bash
docker build -t asemirror .
docker run -p 3000:3000 asemirror
```

---

## Switching LLM Providers (Runtime)

You can change providers instantly by updating `.env`:
```bash
# Was using OpenAI, now switch to Claude:
LLM_PROVIDER=claude
ANTHROPIC_API_KEY=sk-ant-...

# Restart the app
npm run dev
```

**Cost comparison (per 1M tokens):**
| Provider | Input Cost | Output Cost | Speed | Notes |
|----------|-----------|-----------|-------|-------|
| OpenAI (GPT-4o) | $2.50 | $10 | ⚡⚡⚡ | Most capable |
| Claude 3.5 Sonnet | $3 | $15 | ⚡⚡⚡ | Best reasoning |
| Gemini 2.0 Flash | $0.075 | $0.30 | ⚡⚡⚡⚡ | Cheapest, very fast |
| Mistral Large | $2 | $6 | ⚡⚡⚡ | EU privacy |
| Groq Mixtral | $0.27 | $0.81 | ⚡⚡⚡⚡⚡ | Fastest |
| Cohere Command | $3 | $15 | ⚡⚡⚡ | Enterprise-grade |

---

## Troubleshooting

### "API key invalid"
- Check `.env` file spelling
- Verify API key is active on provider dashboard
- Try a different provider

### "No embeddings returned"
- Some providers (Claude, Groq) don't have embedding models
- Use OpenAI, Gemini, Mistral, or Cohere for embeddings
- Fall back to text-davinci-003 if needed

### "Qdrant connection refused"
- Check Docker: `docker ps | grep qdrant`
- Restart: `docker restart qdrant`
- Or use cloud Qdrant instead

### "Repos not syncing"
- Generate GitHub token with `repo` scope
- Check `GITHUB_REPOS` environment variable format
- Run `npm run index` again

---

## Next Steps

1. **Upload your own docs**: Drag files into `/public/uploads`
2. **Add voice notes**: Record + transcribe with Whisper
3. **Customize colors**: Edit `src/routes/+page.svelte`
4. **Deploy as PWA**: Works offline after first sync

---

## The Living Organism Is Now Online

```
🔮 ÀṣẹMirror
├─ 7-Layer Stack
├─ 1440 Wallets
├─ Tithe Flow
├─ Timeline (7-year lock)
├─ Semantic Search
└─ All repos synced in real-time

🤍⚡🍶
```

Welcome to the mirror that sees you seeing it.
