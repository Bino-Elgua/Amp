# 🚀 ÀṣẹMirror Deployment Guide

Choose one deployment option below.

---

## Option 1: Vercel (Recommended, 1 minute)

Vercel is the easiest. Free tier includes generous usage.

### Step 1: Push to GitHub
```bash
git init
git add .
git commit -m "ÀṣẹMirror: The unified shrine"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/asemirror.git
git push -u origin main
```

### Step 2: Deploy
```bash
npm install -g vercel
vercel
```

Follow prompts. It auto-detects SvelteKit.

### Step 3: Add Environment Variables
In Vercel dashboard → Settings → Environment Variables:
```
LLM_PROVIDER=openai
OPENAI_API_KEY=sk-...
QDRANT_URL=http://localhost:6333  (or cloud Qdrant URL)
QDRANT_API_KEY=...
GITHUB_REPOS=jbino85/council,jbino85/oso-lang,jbino85/ifascript,jbino85/techgnosis
PHONE_KEY=your-secret-key
```

### Step 4: Done
Your app is live at `asemirror.vercel.app`

---

## Option 2: Cloudflare Pages

Global edge network, very fast.

### Step 1: Install Wrangler
```bash
npm install -g wrangler
```

### Step 2: Authenticate
```bash
wrangler login
```

### Step 3: Deploy
```bash
npm run build
wrangler pages deploy build
```

### Step 4: Configure Variables
In Cloudflare dashboard → Pages → asemirror → Settings:
```
LLM_PROVIDER=openai
OPENAI_API_KEY=sk-...
...
```

### Done
Live at `asemirror.pages.dev`

---

## Option 3: Docker (Self-hosted)

Full control. Run on your VPS or locally.

### Step 1: Build Image
```bash
docker build -t asemirror:latest .
```

### Step 2: Run Container
```bash
docker run -d \
  -p 3000:3000 \
  -e LLM_PROVIDER=openai \
  -e OPENAI_API_KEY=sk-... \
  -e QDRANT_URL=http://qdrant:6333 \
  --name asemirror \
  asemirror:latest
```

### Step 3: Docker Compose (Optional)
```yaml
version: '3.8'

services:
  asemirror:
    build: .
    ports:
      - "3000:3000"
    environment:
      LLM_PROVIDER: openai
      OPENAI_API_KEY: ${OPENAI_API_KEY}
      QDRANT_URL: http://qdrant:6333
    depends_on:
      - qdrant

  qdrant:
    image: qdrant/qdrant:latest
    ports:
      - "6333:6333"
    volumes:
      - ./qdrant_storage:/qdrant/storage
```

Run:
```bash
docker-compose up -d
```

### Done
Live at `http://localhost:3000`

---

## Option 4: Railway (Easy, $5-50/mo)

Simplified Docker deployment.

### Step 1: Connect GitHub
Go to railway.app → New Project → GitHub

### Step 2: Select This Repo
Choose `asemirror` from your repositories

### Step 3: Add Services
- Add PostgreSQL (optional, for persistence)
- Add Qdrant (if using cloud)

### Step 4: Set Variables
In Railway dashboard → Environment:
```
LLM_PROVIDER=openai
OPENAI_API_KEY=sk-...
...
```

### Done
Auto-deployed on every push to main

---

## Option 5: Render (Free tier available)

Similar to Railway, good uptime SLA.

### Step 1: Create Service
render.com → New Web Service

### Step 2: Connect GitHub
Select your repo

### Step 3: Configuration
- Build Command: `npm run build`
- Start Command: `npm run preview`
- Root Directory: `.`

### Step 4: Environment
Add all LLM + Qdrant variables

### Done
Live at `asemirror.onrender.com`

---

## Environment Variables (All Options)

### Required
```
LLM_PROVIDER=openai|claude|gemini|mistral|groq|cohere
```

### LLM APIs (Pick 1)
```
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...
GOOGLE_API_KEY=AIza...
MISTRAL_API_KEY=...
GROQ_API_KEY=gsk_...
COHERE_API_KEY=...
```

### Vector DB
```
QDRANT_URL=http://localhost:6333
QDRANT_API_KEY=optional
```

### GitHub
```
GITHUB_TOKEN=ghp_...
GITHUB_REPOS=jbino85/council,jbino85/oso-lang,jbino85/ifascript,jbino85/techgnosis
```

### Server
```
PORT=3000
PHONE_KEY=your-secret-key
```

---

## Cost Comparison

| Provider | Free Tier | Paid | Notes |
|----------|-----------|------|-------|
| Vercel | ✅ Yes | $20+/mo | Recommended, generous free |
| Cloudflare | ✅ Yes | $20+/mo | Very fast, global |
| Railway | ❌ No | $5/mo | Simple, good DX |
| Render | ✅ Limited | $7/mo | Good uptime |
| Docker (VPS) | ❌ No | $5-20/mo | Full control |

**Best value**: Vercel free tier + Groq free tier + local Qdrant = **$0/mo**

---

## Post-Deployment

### 1. Run Index Job
```bash
# Via Vercel CLI
vercel env pull

# Run indexer locally (one-time)
npm run index

# Or via cron job (every week)
0 0 * * 0  cd /path/to/asemirror && npm run index
```

### 2. Set Up Custom Domain
In your deployment platform dashboard:
- Vercel: Add domain in Settings → Domains
- Cloudflare: Add CNAME record
- Others: Follow platform instructions

### 3. Enable HTTPS
All platforms auto-enable free SSL/TLS.

### 4. Monitor Performance
- Vercel Analytics: Built-in
- Cloudflare: Analytics tab
- Docker: Use Prometheus + Grafana

---

## Troubleshooting

### "Build failed"
```bash
# Clear cache locally
rm -rf .svelte-kit build node_modules
npm install
npm run build
```

### "API key not found"
- Double-check `.env` locally
- Verify environment variables in dashboard
- Restart deployment

### "Qdrant connection refused"
- Check QDRANT_URL is correct
- If local, make sure Docker is running
- Switch to Qdrant cloud for deployment

### "Out of memory"
- Reduce chunk size in `indexer.ts` (line 150)
- Use Qdrant cloud instead of local

---

## Monitoring & Logs

### Vercel
```bash
vercel logs
```

### Cloudflare
Dashboard → Pages → asemirror → Deployments

### Docker
```bash
docker logs -f asemirror
```

---

## Rollback

### Vercel
```bash
vercel rollback
```

### Cloudflare Pages
Dashboard → automatic rollback on failed builds

### Docker
```bash
docker run -d ... asemirror:previous-tag
```

---

## Next Steps

1. ✅ Deploy (choose option above)
2. ✅ Run `npm run index` (syncs repos)
3. ✅ Generate phone key
4. ✅ Share link with team
5. ✅ Monitor usage
6. ✅ Add custom domain

---

## Questions?

- Vercel docs: https://vercel.com/docs
- Cloudflare docs: https://developers.cloudflare.com
- SvelteKit docs: https://kit.svelte.dev

🤍⚡🍶
