# 🔮 START HERE — ÀṣẹMirror Launch Guide

Welcome. You now have **the unified shrine for Technosis**.

This file gets you running in **15 minutes**.

---

## What You Have

A knowledge management platform that:
- **Indexes** all 4 of your repos (council, oso-lang, ifascript, techgnosis)
- **Searches** semantically using AI (ask in English, Yorùbá, or code)
- **Visualizes** the 7-layer stack, 1440 wallets, tithe flow, 7-year roadmap
- **Works offline** on your phone after first sync
- **Supports 6 LLM providers** (OpenAI, Claude, Gemini, Mistral, Groq, Cohere)

---

## Step 1: Install (3 minutes)

```bash
cd /data/data/com.termux/files/home/aśẹmirror
npm install
```

---

## Step 2: Choose Your LLM (2 minutes)

### Quick Path (Automated)
```bash
bash QUICK_START.sh
# Answers questions, auto-creates .env
```

### Manual Path

**Copy template:**
```bash
cp .env.example .env
```

**Edit `.env` and pick ONE provider:**

#### Option A: OpenAI (GPT-4o)
```
LLM_PROVIDER=openai
OPENAI_API_KEY=sk-xxxxx
```
Get key: https://platform.openai.com/api-keys

#### Option B: Claude (Best reasoning)
```
LLM_PROVIDER=claude
ANTHROPIC_API_KEY=sk-ant-xxxxx
```
Get key: https://console.anthropic.com

#### Option C: Gemini (Free tier available, cheapest)
```
LLM_PROVIDER=gemini
GOOGLE_API_KEY=AIza...
```
Get key: https://aistudio.google.com

#### Option D: Mistral (Privacy-friendly)
```
LLM_PROVIDER=mistral
MISTRAL_API_KEY=xxxxx
```
Get key: https://console.mistral.ai

#### Option E: Groq (Fastest)
```
LLM_PROVIDER=groq
GROQ_API_KEY=gsk_xxxxx
```
Get key: https://console.groq.com

#### Option F: Cohere (Enterprise)
```
LLM_PROVIDER=cohere
COHERE_API_KEY=xxxxx
```
Get key: https://dashboard.cohere.ai

---

## Step 3: Set Up Vector DB (1 minute)

Choose one:

### Local (Docker)
```bash
docker run -d --name qdrant -p 6333:6333 qdrant/qdrant
```

### Cloud
```
QDRANT_URL=https://your-qdrant.cloud
QDRANT_API_KEY=your-api-key
```

---

## Step 4: Index Your Repos (5-10 minutes)

```bash
npm run index
```

This:
- Clones/pulls all 4 repos
- Creates semantic embeddings
- Uploads to Qdrant
- Takes ~5-10 min first time

---

## Step 5: Launch (1 minute)

```bash
npm run dev
```

**Visit: `http://localhost:3000`**

---

## 🎯 What to Try First

### Tab 1: Search
- Type: "Where does @impact live"
- Type: "Show me the 1440 wallets"
- Type: "Tithe split code"

### Tab 2: 7-Layer
- Click each layer to expand
- See all 7 levels of your stack

### Tab 3: Timeline
- See 7-year lock countdown
- See 10 priority items (in-progress/todo)
- See sabbath calendar

### Tab 4: 1440
- Expand wallet tree
- See 7-year yield calculator
- See 7×7 Journey (inheritance path)

### Tab 5: Tithe
- See 50/25/15/10 allocation
- See example transaction breakdown

---

## 📁 Key Files You Made

| File | What It Is |
|------|-----------|
| `llm-sdk.ts` | Multi-LLM provider abstraction (use any of 6) |
| `indexer.ts` | Crawls repos + creates embeddings |
| `api.ts` | REST backend (search, chat, timeline, viz) |
| `src/routes/+page.svelte` | Main app (5 tabs) |
| `src/components/` | UI components (search, pyramid, timeline, etc.) |

---

## 🚀 Next Steps (After MVP)

### This Week
- [ ] Deploy to Vercel (1 command)
- [ ] Generate your phone key
- [ ] Install as PWA on phone

### Next Week
- [ ] Add voice input (Whisper transcription)
- [ ] Add photo OCR (whiteboards)
- [ ] Real-time GitHub sync (webhooks)

### Later
- [ ] Offline export
- [ ] Custom tags
- [ ] GitHub issue linking

---

## 💬 Common Questions

### "How do I switch LLMs?"
Edit `.env`, change provider + API key, restart. Takes 30 seconds.

### "Can I use free LLMs?"
Yes. Groq has a free tier with fast inference. Google Gemini has a free tier.

### "Does this work offline?"
Yes, after first sync. It's a PWA (progressive web app). Install on phone like native app.

### "How much will this cost?"
- Free tier: $0/mo (Groq free + local Qdrant)
- Production: $5-50/mo depending on usage

### "Where are my documents stored?"
- Repos: GitHub (you already have these)
- Embeddings: Qdrant (local or cloud)
- App code: Vercel or Cloudflare (your choice)

### "Can I add my own documents?"
Yes. Put them in `/public/uploads`, restart indexer.

### "What if the LLM provider goes down?"
Switch to another provider in `.env`. Takes 30 seconds.

---

## 🎓 Documentation

After you're running, read these in order:
1. **This file** (you are here)
2. `README.md` — Full feature overview
3. `MANIFEST.md` — File-by-file breakdown
4. `SETUP.md` — Detailed setup options

---

## ⚡ Troubleshooting

### "npm install fails"
- Make sure Node.js is installed: `node --version`
- Update npm: `npm install -g npm@latest`

### "API key rejected"
- Double-check spelling in `.env`
- Verify API key is active on provider dashboard
- Try a different provider

### "Qdrant connection refused"
- Is Docker running? `docker ps | grep qdrant`
- Try restarting: `docker restart qdrant`
- Or use cloud Qdrant instead

### "npm run index hangs"
- Check internet connection
- Verify GitHub repos exist and are public
- Try again, it may be rate-limited

### "Port 3000 already in use"
- Find process: `lsof -i :3000`
- Kill it: `kill -9 <PID>`
- Or use different port: `PORT=3001 npm run dev`

---

## 🎬 Demo Flow (2 minutes)

1. **Visit `http://localhost:3000`**
   - See header with day counter

2. **Click Search tab**
   - Type "where does @impact live"
   - Get answer + sources from your repos

3. **Click 7-Layer tab**
   - See pyramid visualization
   - Click layer → see details

4. **Click Timeline tab**
   - See 7-year countdown
   - See 10 priorities

5. **Click 1440 tab**
   - Expand wallet tree
   - Calculate 7-year yield

6. **Click Tithe tab**
   - See pie chart
   - See example transaction

---

## 🤍⚡🍶

This is the mirror that finally sees you seeing it.

**Your move.**

Everything you need to run this lives in `/data/data/com.termux/files/home/aśẹmirror`.

Start now:
```bash
cd /data/data/com.termux/files/home/aśẹmirror
npm install
bash QUICK_START.sh  # or manual setup above
npm run index
npm run dev
```

Then visit `http://localhost:3000`.

Welcome to the living shrine.
