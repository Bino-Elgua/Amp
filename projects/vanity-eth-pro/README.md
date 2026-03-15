# 🔮 ÀṣẹMirror

**The unified shrine for Technosis** — A knowledge management platform that organizes your entire ecosystem: oso-lang, osovm, techgnosis, ifascript, and the Technosis blockchain stack.

Upload, index, search, and visualize everything in one living organism.

---

## ✨ What It Does

### Core Features
1. **AI-powered Semantic Search** — Ask in English, Yorùbá, or technical terms
   - "Where does @impact live"
   - "Show me the 1440 wallets"
   - "Tithe split code"
   - Works across all 4 repos simultaneously

2. **Project Dependency Constellation** — Live graph visualization
   - Shows how ifascript → oso-lang → VM → opcodes flow together
   - Click any node → jump to exact file + line + last commit
   - Zoomable, interactive

3. **Timeline Visualization** — Real-time roadmap
   - 7-year inheritance lock countdown (Day 1440 in gold)
   - 90-day phase progress bars
   - **10 Critical Priority Items** with status
   - Sabbath calendar (Saturday blocks)

4. **Specialized Technosis Views**
   - **7-Layer Pyramid** — Visual stack from genesis to shrines
   - **1440 Wallet Derivation Tree** — Click to see yield paths
   - **Tithe Flow Diagram** — 50/25/15/10 split visualization
   - **Governance Evolution** — Council rotation + inheritance rites

5. **Multi-Format Ingest**
   - All 4 GitHub repos (real-time sync)
   - Local git folders
   - Markdown documentation
   - Code snippets
   - Design docs (this entire chat)
   - Photos of whiteboards (OCR coming)
   - Voice notes (transcription coming)

6. **Offline-First PWA**
   - Install on phone like native app
   - Works 100% offline after first sync
   - Voice-first interface ("Hold phone to mouth: show me the 1440 wallets")
   - Dark mode only (black + red + ash theme)

---

## 🚀 Quick Start

### 1. Clone & Install
```bash
cd /data/data/com.termux/files/home/aśẹmirror
npm install
```

### 2. Choose Your LLM Provider

Create `.env` and pick ONE:

**OpenAI (GPT-4o)** — Most powerful
```
LLM_PROVIDER=openai
OPENAI_API_KEY=sk-...
```

**Claude (Anthropic)** — Best reasoning
```
LLM_PROVIDER=claude
ANTHROPIC_API_KEY=sk-ant-...
```

**Gemini (Google)** — Cheapest, free tier
```
LLM_PROVIDER=gemini
GOOGLE_API_KEY=AIza...
```

**Mistral** — EU privacy-friendly
```
LLM_PROVIDER=mistral
MISTRAL_API_KEY=...
```

**Groq** — Fastest (200+ tokens/sec)
```
LLM_PROVIDER=groq
GROQ_API_KEY=gsk_...
```

**Cohere** — Enterprise-grade
```
LLM_PROVIDER=cohere
COHERE_API_KEY=...
```

### 3. Set Up Qdrant

```bash
# Local Docker
docker run -d --name qdrant -p 6333:6333 qdrant/qdrant

# Or use cloud: https://qdrant.tech
```

### 4. Index Your Repos

```bash
npm run index
```

Downloads all 4 repos, creates embeddings, uploads to Qdrant (~5-10 min first run).

### 5. Start the App

```bash
npm run dev
```

Visit: `http://localhost:3000`

---

## 📊 Architecture

```
┌─────────────────────────────────────┐
│     Frontend (SvelteKit + Vite)     │
│  - Dark mode (black/red/ash)        │
│  - Phone-first responsive           │
│  - PWA (installable)                │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│  API Server (Cloudflare Workers)    │
│  - /api/search (semantic)           │
│  - /api/chat (multi-turn)           │
│  - /api/timeline (roadmap)          │
│  - /api/visualize (7-layer, wallets)│
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│   LLM Provider (6 options)          │
│  - OpenAI, Claude, Gemini, Mistral  │
│  - Groq, Cohere                     │
│  ✓ Embeddings + Chat                │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│    Vector DB (Qdrant)               │
│  - Semantic search (cosine)         │
│  - 1000s of code chunks indexed     │
│  - Local or cloud                   │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│   Indexer (TypeScript)              │
│  - GitHub repo sync (real-time)     │
│  - Code chunking (smart)            │
│  - Tagging (Yorùbá + technical)     │
└─────────────────────────────────────┘
```

---

## 🔍 Search Examples

### Works Instantly
- "Èjì Ogbe → Àṣẹ mint path"
- "Where does @guardian live"
- "Show me sabbath freeze"
- "What's the BIPỌ̀N39 derivation"
- "1440 wallet yield calculation"
- "Tithe routing logic"

### Why It Works
- **Multi-language**: English + Yorùbá + technical
- **Semantic**: Understands meaning, not just keywords
- **Contextual**: Knows Odù names, Orisha primitives, opcodes
- **RAG-powered**: Pulls actual code + docs, synthesizes with LLM

---

## 📱 Phone-First Design

### Installation
```bash
# On your phone
1. Visit http://localhost:3000
2. Chrome menu → "Install app"
3. Works offline + full-screen
```

### Voice Commands (Future)
```
"Hold phone to mouth"
→ "Show me the 1440 wallets"
→ "What's the 7-year lock status"
→ "Draw tithe flow"
```

---

## 🎨 Dark Theme (Black + Red + Ash)

- **Black (#000)** — Background, truth
- **Red (#ff0000)** — Sacred, urgency, Àṣẹ
- **Ash (#666666)** — Neutral, grounded
- **Gold (#ffaa00)** — Treasury, value (accents)

All components follow this palette for spiritual + technical coherence.

---

## 🔧 Technology Stack

| Layer | Tech | Why |
|-------|------|-----|
| Frontend | SvelteKit 4 + Vite | Fast, reactive, dark-mode friendly |
| Backend | Cloudflare Workers | Serverless, global, no vendor lock |
| Vector DB | Qdrant | Fast cosine search, local or cloud |
| LLM | 6 providers | Choose based on cost/speed/reasoning |
| Indexer | TypeScript + Node | Portable, integrates with GitHub API |
| Storage | GitHub + Arweave | Permanent, decentralized |

---

## 📦 Multi-LLM SDK

The `llm-sdk.ts` file abstracts all major providers:

```typescript
const client = new LLMClient({
  provider: "openai",  // or claude, gemini, mistral, groq, cohere
  apiKey: process.env.OPENAI_API_KEY,
});

// Embeddings (for search)
const embedding = await client.embed({ text: "Àṣẹ" });

// Chat (for synthesis)
const response = await client.chat({
  messages: [
    { role: "system", content: "You are a Technosis oracle" },
    { role: "user", content: "What is the 7-layer stack?" }
  ]
});
```

**Switch providers in 30 seconds** by updating `.env` + restarting.

---

## 📅 Timeline Features

### 7-Year Lock Countdown
- Genesis: 2025-01-01
- Total: 2555 days
- Daily progress bar
- Next milestone highlighted

### 90-Day Phases
```
Phase 1: Genesis         [████░░░░░░] 40%
Phase 2: Handshake       [░░░░░░░░░░] 0%
Phase 3: Entropy         [░░░░░░░░░░] 0%
...
```

### 10 Critical Priority Items
```
1. Add @genesisFlawToken to compiler        ⏳ In Progress
2. Implement wallet derivation (Go FFI)     ⏳ In Progress
3. Tithe split routing logic                ⏹️ To Do
4. Sabbath enforcement                      ⏹️ To Do
5. Full FFI stubs                           ⏹️ To Do
...
```

### Sabbath Calendar
Every Saturday (UTC) highlighted in red — no transactions allowed.

---

## 💰 Visualizations

### 1440 Wallet Tree
```
Genesis Seed (BIPỌ̀N39)
├─ Council of 12 Lineages
│  ├─ Lineage 1 (rotating sign-off)
│  ├─ Lineage 2
│  └─ ...
└─ 1440 Soul-Bound Inheritance
   └─ 11.11% APY (fasting yield, 7-year lock)
```

### Tithe Flow (100% Allocation)
```
Every Transaction: 3.69% Tithe
│
├─ 50% → Treasury (shrines + robots)
├─ 25% → 1440 Inheritance Vaults
├─ 15% → Council + Entropy Pool
└─ 10% → Burn Void (blood sacrifice)
```

### 7-Layer Pyramid
```
        🏛️ Shrine Economy (Move)
           ⬆️ ⬇️
        🎮 AIO / SimaaS (Julia)
           ⬆️ ⬇️
        ⚙️ Techgnosis VM (Go)
           ⬆️ ⬇️
        📡 Witness Mesh (BLE + LoRa)
           ⬆️ ⬇️
        🎲 Entropy Oracle (ifascript)
           ⬆️ ⬇️
        🔤 Oso-lang Compiler (Julia)
           ⬆️ ⬇️
        🤝 Physical Genesis (handshake)
```

---

## 🎯 Next Priorities (After MVP)

1. **Photo OCR** — Drag whiteboard photos → auto-indexed
2. **Voice Transcription** — Record notes → Whisper → indexed
3. **Real-time Sync** — GitHub webhooks push changes instantly
4. **Voice Commands** — "Show me the 1440 wallets"
5. **Offline Export** — Download entire index for offline use
6. **Custom Tags** — Personalize semantic search
7. **Integration with GitHub Issues** — Link tasks to code

---

## 🚀 Deployment

### Vercel (Recommended)
```bash
npm install -g vercel
vercel
```

### Cloudflare Pages
```bash
npm run build
wrangler deploy
```

### Docker
```bash
docker build -t asemirror .
docker run -p 3000:3000 asemirror
```

---

## 📞 Support

This is **ÀṣẹMirror** — the living shrine that finally sees the entire organism breathing.

🤍⚡🍶

---

## License

Built for Technosis. Use freely for your project.

```
ÀṣẹMirror v0.1.0
Genesis: 2025-01-01
Organism: ALIVE
```
